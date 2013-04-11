//
//  WEGlobalSettingsViewController.m
//  WebsterEditor
//
//  Created by pierre larochelle on 3/21/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import <AWSiOSSDK/S3/AmazonS3Client.h>
#import <AWSiOSSDK/AmazonEndpoints.h>
#import "WEViewController.h"
#import "WEWebViewController.h"
#import "WEPageManager.h"
#import "WEUtils.h"
#import "NSThread+BlockAdditions.h"

@interface WEViewController ()
-(void)openSettings:(UIGestureRecognizer*)openGesture;
@end

@implementation WEViewController
@synthesize contentView, settingsView, bgRemove, bgSelect, exportButton, exportActivity, backButton, goButton;

-(id)initWithProjectId:(NSString*)projectId withSettings:(WEProjectSettings*)settings {
    self = [self init];
    if (self) {
        self.projectId = projectId;
        self.settings = settings;        
    }
    
    return self;
}

- (id)init
{
    self = [super init];
    if (self) {
        UIImagePickerController *picker = [[UIImagePickerController alloc] init];
        picker.delegate = self;
        picker.sourceType = UIImagePickerControllerSourceTypePhotoLibrary;

        self.popover = [[UIPopoverController alloc] initWithContentViewController:picker];
        self.popover.delegate = self;
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    [exportActivity setHidesWhenStopped:YES];
    [exportActivity stopAnimating];
    
    [self.bgSelect useSimpleOrangeStyle];
    [self.bgSelect addTarget:self
                      action:@selector(selectingBackgroundImage)
            forControlEvents:UIControlEventTouchUpInside];
    
    [bgRemove useRedDeleteStyle];
    [bgRemove addTarget:self
                 action:@selector(removeBackgroundImage)
       forControlEvents:UIControlEventTouchUpInside];
    [bgRemove setHidden:YES];
    
    [exportButton useGreenConfirmStyle];
    [exportButton addTarget:self
                     action:@selector(exportProject)
           forControlEvents:UIControlEventTouchUpInside];
        
    [backButton useBlackStyle];
    [backButton addTarget:self
                   action:@selector(backToProjects)
         forControlEvents:UIControlEventTouchUpInside];
    
    self.titleText.text = self.settings.title;
    self.bucketText.text = self.settings.bucket;
    
    [goButton useGreenConfirmStyle];
    [goButton addTarget:self
                 action:@selector(gotoExportURL)
       forControlEvents:UIControlEventTouchUpInside];
    if ([self.settings.lastExportURL isEqualToString:@""]) {
        [goButton setHidden:YES];
    }
    
    self.settingsView.backgroundColor = [UIColor colorWithPatternImage:[UIImage imageNamed:@"dark_exa.png"]];
    
    contentView.layer.masksToBounds = NO;
    contentView.layer.shadowOffset = CGSizeMake(-15, 0);
    contentView.layer.shadowRadius = 5;
    contentView.layer.shadowOpacity = 0.5;
    
    self.contentController = [[WEWebViewController alloc] initWithNibName:@"WEWebViewController_iPad" bundle:nil];
    self.contentController.projectId = self.projectId;
    [self.contentView addSubview:self.contentController.view];
    
    UISwipeGestureRecognizer *openGesture = [[UISwipeGestureRecognizer alloc] init];
    openGesture.direction = UISwipeGestureRecognizerDirectionRight;
    [openGesture addTarget:self action:@selector(openSettings:)];
    [contentView addGestureRecognizer:openGesture];
    
    UISwipeGestureRecognizer *closeGesture = [[UISwipeGestureRecognizer alloc] init];
    closeGesture.direction = UISwipeGestureRecognizerDirectionLeft;
    [closeGesture addTarget:self action:@selector(closeSettings:)];
    [contentView addGestureRecognizer:closeGesture];
    

}

-(void)viewDidAppear:(BOOL)animated {
    // subscribe to the closing notification
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(appClosingNotification:) name:@"appClosing" object:nil];
}

-(void)viewDidDisappear:(BOOL)animated {
    [[NSNotificationCenter defaultCenter] removeObserver:self name:@"appClosing" object:nil];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
Export
 */
-(void)exportProject {
    if ([self validateSettings]) {
        [exportActivity startAnimating];
        [goButton setHidden:YES];
        [self saveProject];
        
        dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT,
                                                 (unsigned long)NULL), ^(void) {
            [self doExportWorkWithCompletion:^(NSError *error) {
                [goButton setHidden:NO];
                [exportActivity stopAnimating];
            }];
        });
    }
}

-(void)gotoExportURL {
    NSURL *url = [NSURL URLWithString:self.settings.lastExportURL];
    [[UIApplication sharedApplication] openURL:url];
}

-(void)doExportWorkWithCompletion:(void (^)(NSError*))block {
    [[WEPageManager sharedManager] exportMarkup:^(id responseData) {
        NSError *error;
        NSBundle *mainBundle = [NSBundle mainBundle];
        
        // region info
        S3Region *region = [S3Region USWest];
        AmazonRegion endpoint = US_WEST_1;
        NSString *webSuffix = @"s3-website-us-west-1.amazonaws.com";
        
        
        // s3 config
        NSString *filePath = [mainBundle pathForResource:@"config"
                                                  ofType:@"json"];
        NSData *configData = [NSData dataWithContentsOfFile:filePath];
        NSDictionary *json  = [NSJSONSerialization JSONObjectWithData:configData
                                                              options:kNilOptions
                                                                error:&error];
        NSString *bucket = self.settings.bucket;
        
        // Initialize the S3 Client
        AmazonS3Client *s3 = [[AmazonS3Client alloc] initWithAccessKey:[json objectForKey:@"AWS_KEY"] withSecretKey:[json objectForKey:@"AWS_SECRET"]];
        s3.endpoint = [AmazonEndpoints s3Endpoint:endpoint];
        
        // see if we have the bucket
        BOOL hasBucket = NO;
        for (S3Bucket *liveBucket in [s3 listBuckets]) {
            if ([liveBucket.name isEqualToString:bucket]) {
                hasBucket = YES;
                break;
            }
        }
        
        if (hasBucket) {
            // delete all the old stuff
            for (S3ObjectSummary *objectSummary in [s3 listObjectsInBucket:bucket]) {
                S3DeleteObjectRequest *delReq = [[S3DeleteObjectRequest alloc] init];
                [delReq setBucket:bucket];
                [delReq setKey:objectSummary.key];
                NSLog(@"deleting %@", objectSummary.key);
                S3DeleteObjectResponse *resp = [s3 deleteObject:delReq];
                if (resp.error != nil) NSLog(@"error: %@", resp.error);
            }
        } else {
            S3CreateBucketRequest *createBucket = [[S3CreateBucketRequest alloc] initWithName:bucket
                                                                                    andRegion:region];
            S3CreateBucketResponse *createBucketResp = [s3 createBucket:createBucket];
            if (createBucketResp.error != nil) NSLog(@"ERROR: %@", createBucketResp.error);
            
        }
        BucketWebsiteConfiguration *bucketConfig = [[BucketWebsiteConfiguration alloc] initWithIndexDocumentSuffix:@"index.html"];
        S3SetBucketWebsiteConfigurationRequest *configReq = [[S3SetBucketWebsiteConfigurationRequest alloc] initWithBucketName:bucket withConfiguration:bucketConfig];
        S3SetBucketWebsiteConfigurationResponse *bucketWebResp = [s3 setBucketWebsiteConfiguration:configReq];
        if (bucketWebResp.error != nil) NSLog(@"Error setting website config: %@", bucketWebResp.error);
        
        S3CannedACL *acl = [S3CannedACL publicRead];
        
        //html
        NSString *htmlTemplateFile = [mainBundle pathForResource:@"production" ofType:@"html"];
        NSString *htmlTemplate = [NSString stringWithContentsOfFile:htmlTemplateFile
                                                           encoding:NSStringEncodingConversionAllowLossy
                                                              error:&error];
        NSString *markup = [responseData objectForKey:@"markup"];
        NSString *html = [htmlTemplate stringByReplacingOccurrencesOfString:@"[[TITLE]]" withString:self.settings.title];
        html = [html stringByReplacingOccurrencesOfString:@"[[BODY]]" withString:markup];
        
        NSData *htmlData = [html dataUsingEncoding:NSStringEncodingConversionAllowLossy];
        S3PutObjectRequest *put = [[S3PutObjectRequest alloc] initWithKey:@"index.html" inBucket:bucket];
        put.contentType = @"text/html";
        put.data = htmlData;
        put.cannedACL = acl;
        S3PutObjectResponse *resp = [s3 putObject:put];
        if (resp.error != nil) NSLog(@"Error writing html: %@", resp.error);
        
        // media
        NSString *pathPrefix = @"media";
        NSFileManager *fileManager = [NSFileManager defaultManager];
        NSString *mediaPath = [WEUtils pathInDocumentDirectory:pathPrefix
                                                 withProjectId:self.projectId];
        for (NSString *file in [fileManager contentsOfDirectoryAtPath:mediaPath error:&error]) {
            NSString *s3FileKey = [NSString stringWithFormat:@"%@/%@", pathPrefix, file];
            NSString *fullPath = [WEUtils pathInDocumentDirectory:s3FileKey withProjectId:self.projectId];
            NSLog(@"file: %@", fullPath);
            NSData *fileData = [NSData dataWithContentsOfFile:fullPath];
            put = [[S3PutObjectRequest alloc] initWithKey:s3FileKey inBucket:bucket];
            put.contentType = @"image/jpeg";
            put.data = fileData;
            put.cannedACL = acl;
            S3PutObjectResponse *resp = [s3 putObject:put];
            if (resp.error != nil) NSLog(@"ERROR: %@", resp.error);
        }
        
        // js/css
        NSArray *filePaths = [NSArray arrayWithObjects:
                              @"js/jquery-1.9.0.min.js",
                              @"js/bootstrap.min.js",
                              @"js/bootstrap-lightbox.js",
                              @"css/override.css",
                              @"css/bootstrap.min.css",
                              @"css/bootstrap-responsive.min.css",
                              nil];
        for (NSString *filePath in filePaths) {
            NSString *fullPath = [WEUtils pathInDocumentDirectory:filePath withProjectId:self.projectId];
            NSData *fileData = [NSData dataWithContentsOfFile:fullPath];
            NSLog(@"adding %@", filePath);
            put = [[S3PutObjectRequest alloc] initWithKey:filePath inBucket:bucket];
            if ([filePath hasSuffix:@".css"]) put.contentType = @"text/css";
            else put.contentType = @"text/javascript";
            put.data = fileData;
            put.cannedACL = acl;
            S3PutObjectResponse *resp = [s3 putObject:put];
            if (resp.error != nil) NSLog(@"ERROR in JS or CSS: %@", resp.error);
        }
        
        // save the bucket url
        self.settings.lastExportURL = [NSString stringWithFormat:@"http://%@.%@", bucket, webSuffix];
        
        block(nil);
    }];
}

-(void)saveProject {
    NSError *error;
    NSString *devFile = [WEUtils pathInDocumentDirectory:@"development.html" withProjectId:self.projectId];
    NSString *html = [self.contentController.webView stringByEvaluatingJavaScriptFromString:@"document.documentElement.outerHTML"];
    NSString *document = [NSString stringWithFormat:@"<!DOCTYPE html>%@", html];
    [document writeToFile:devFile atomically:NO encoding:NSUTF8StringEncoding error:&error];
    
    // save the settings
    self.settings.title = self.titleText.text;
    self.settings.bucket = self.bucketText.text;
    [NSKeyedArchiver archiveRootObject:self.settings
                                toFile:[WEUtils pathInDocumentDirectory:@"settings"
                                                          withProjectId:self.projectId]];
    
    // save the thumbnail
    NSString *thumbPath = [WEUtils pathInDocumentDirectory:@"thumb.jpeg"
                                             withProjectId:self.projectId];
    UIView *webView = self.contentController.view;
    UIGraphicsBeginImageContext(webView.frame.size);
    [webView.layer renderInContext:UIGraphicsGetCurrentContext()];
    UIImage *img = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    NSData *thumbData = UIImageJPEGRepresentation(img, 0.8);
    [thumbData writeToFile:thumbPath atomically:NO];
    
    if (self.delegate) [self.delegate didSaveViewController:self];
}
    
-(BOOL)validateSettings {
    NSString *bucket = self.bucketText.text;
    NSRange emptyRange = [bucket rangeOfString:@" "];
    NSRange periodRange = [bucket rangeOfString:@"."];
    if (emptyRange.location != NSNotFound) {
        UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Bad bucket name"
                                                        message:@"No spaces are allowed in the bucket name"
                                                       delegate:nil
                                              cancelButtonTitle:@"OK"
                                              otherButtonTitles:nil];
        [alert show];
        return NO;
    } else if ([bucket isEqualToString:@""]){
        UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Bad bucket name"
                                                        message:@"Bucket must have a name"
                                                       delegate:nil
                                              cancelButtonTitle:@"OK"
                                              otherButtonTitles:nil];
        [alert show];
        return NO;
    } else if (periodRange.location != NSNotFound) {
        UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Bad bucket name"
                                                        message:@"No periods are allowed in the bucket name"
                                                       delegate:nil
                                              cancelButtonTitle:@"OK"
                                              otherButtonTitles:nil];
        [alert show];
        return NO;
    } else {
        return YES;
    }
}

-(void)backToProjects {
    [self saveProject];
    [self dismissViewControllerAnimated:YES
                             completion:^{
                                 NSLog(@"dismissed");
                             }];
}

/*
 Background Selection
 */
-(void)selectingBackgroundImage {    
    [self.popover presentPopoverFromRect:self.bgSelect.frame inView:self.view permittedArrowDirections:UIPopoverArrowDirectionAny animated:YES];
}

-(void)removeBackgroundImage {
    [self.contentController removeBackground];
    [self.bgRemove setHidden:YES];
}

-(void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary *)info {
    // get the thing
    [self.popover dismissPopoverAnimated:YES];
    [bgRemove setHidden:NO];
    [self.contentController setBackgroundWithInfo:info];
}

/*
 Setting stuff
 */

-(void)openSettings:(UIGestureRecognizer *)openGesture {
    if (openGesture.state == UIGestureRecognizerStateEnded && ![self isOpen]) {
        [[WEPageManager sharedManager] hasBackgroundWithCallback:^(id responseData) {
            NSString *hasBG = [responseData objectForKey:@"hasBackground"];
            if ([hasBG isEqualToString:@"true"]) {
                [bgRemove setHidden:NO];
            } else {
                [bgRemove setHidden:YES];
            }
        }];
        [self openSettingsWithTiming:0.1];
    }
}

-(void)closeSettings:(UIGestureRecognizer *)closeGesture {
    if (closeGesture.state == UIGestureRecognizerStateEnded && [self isOpen]) {
        [self closeSettingsWithTiming:0.1];
    }
}

-(void)closeSettingsWithTiming:(NSTimeInterval)timing {
    [UIView animateWithDuration:timing animations:^{
        CGSize size = self.contentView.frame.size;
        self.contentView.frame = CGRectMake(0, 0, size.width, size.height);
    }];
}

-(void)openSettingsWithTiming:(NSTimeInterval)timing {
    [UIView animateWithDuration:timing animations:^{
        CGSize size = self.contentView.frame.size;
        self.contentView.frame = CGRectMake(self.settingsView.frame.size.width, 0, size.width, size.height);
    }];
}

-(BOOL)isOpen {
    return self.contentView.frame.origin.x > 0;
}

-(void)appClosingNotification:(NSNotification*)notification {
    [self saveProject];
}
@end
