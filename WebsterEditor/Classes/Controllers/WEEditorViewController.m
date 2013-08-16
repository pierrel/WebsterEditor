//
//  WEGlobalSettingsViewController.m
//  WebsterEditor
//
//  Created by pierre larochelle on 3/21/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import <AWSiOSSDK/S3/AmazonS3Client.h>
#import <AWSiOSSDK/AmazonEndpoints.h>
#import "WEEditorViewController.h"
#import "WEWebViewController.h"
#import "WEPageManager.h"
#import "WEUtils.h"
#import "NSArray+WEExtras.h"
#import "NSThread+BlockAdditions.h"
#import "WEPageCollectionViewLayout.h"

@interface WEEditorViewController ()
@property (nonatomic, assign) BOOL animateBack;
@property (nonatomic, assign) BOOL webPageLoaded;
@property (nonatomic, strong) UIImagePickerController *picker;
@end

@implementation WEEditorViewController
@synthesize contentView, settingsView, bgRemove, bgSelect, exportButton, exportActivity, backButton, goButton, refreshButton, modeSwitch, picker;

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
        self.animateBack = NO;
        self.webPageLoaded = NO;
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    picker = [[UIImagePickerController alloc] init];
    picker.delegate = self;
    picker.sourceType = UIImagePickerControllerSourceTypePhotoLibrary;
    
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        self.popover = [[UIPopoverController alloc] initWithContentViewController:picker];
        self.popover.delegate = self;
    }
    
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
    
    [exportButton addTarget:self
                     action:@selector(exportProject)
           forControlEvents:UIControlEventTouchUpInside];
        
    [backButton addTarget:self
                   action:@selector(backToProjects)
         forControlEvents:UIControlEventTouchUpInside];
    
    self.titleText.text = self.settings.title;
    self.bucketText.text = self.settings.bucket;
    
    [goButton addTarget:self
                 action:@selector(gotoExportURL)
       forControlEvents:UIControlEventTouchUpInside];
    if ([self.settings.lastExportURL isEqualToString:@""]) {
        [goButton setHidden:YES];
    }
    
    [refreshButton addTarget:self action:@selector(refresh) forControlEvents:UIControlEventTouchUpInside];
        
    contentView.layer.masksToBounds = NO;
    contentView.layer.shadowOffset = CGSizeMake(-15, 0);
    contentView.layer.shadowRadius = 5;
    contentView.layer.shadowOpacity = 0.5;
    
    self.contentController = [[WEWebViewController alloc] initWithNibName:@"WEWebViewController_iPad" bundle:nil];
    self.contentController.projectId = self.projectId;
    self.contentController.delegate = self;
    [self.contentView addSubview:self.contentController.view];
    
    UISwipeGestureRecognizer *openGesture = [[UISwipeGestureRecognizer alloc] init];
    openGesture.direction = UISwipeGestureRecognizerDirectionRight;
    [openGesture addTarget:self action:@selector(swipeRight:)];
    [contentView addGestureRecognizer:openGesture];
    
    UISwipeGestureRecognizer *closeGesture = [[UISwipeGestureRecognizer alloc] init];
    closeGesture.direction = UISwipeGestureRecognizerDirectionLeft;
    [closeGesture addTarget:self action:@selector(swipeLeft:)];
    [contentView addGestureRecognizer:closeGesture];
    
    
    [modeSwitch addTarget:self action:@selector(modeSwitched:) forControlEvents:UIControlEventValueChanged];
    
    WEPageCollectionViewLayout *layout = [[WEPageCollectionViewLayout alloc] init];
    self.pageCollectionController = [[WEPageCollectionViewController alloc] initWithCollectionViewLayout:layout];
    self.pageCollectionController.projectId = self.projectId;
    self.pageCollectionController.view.frame = CGRectMake(0,
                                                          0,
                                                          self.pagesView.frame.size.width,
                                                          self.pagesView.frame.size.height);
    self.pageCollectionController.delegate = self;
    [self.pagesView addSubview:self.pageCollectionController.view];
    self.pagesView.backgroundColor = [UIColor clearColor];
    
    [self.activityView setHidesWhenStopped:YES];
    [self.activityView stopAnimating];
    
    // after-load stuff
    [self switchToPage:[[self.pageCollectionController pages] objectAtIndex:0]
              animated:NO]; // load first page
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
    [self.exportButton setEnabled:NO];
    if ([self validateSettings]) {
        [exportActivity startAnimating];
        [goButton setHidden:YES];
        [self saveProjectWithCompletion:^(NSError *err) {
            dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT,
                                                     (unsigned long)NULL), ^(void) {
                [self doExportWorkWithCompletion:^(NSError *error) {
                    [self.exportButton setEnabled:YES];
                    [goButton setHidden:NO];
                    [exportActivity stopAnimating];
                }];
            });
        }];
    }
}

-(void)gotoExportURL {
    NSURL *url = [NSURL URLWithString:self.settings.lastExportURL];
    [[UIApplication sharedApplication] openURL:url];
}

-(void)doExportWorkWithCompletion:(void (^)(NSError*))block {
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
    S3PutObjectRequest *put;
    
    //html
    for (NSString *pagePath in [self.pageCollectionController pages]) {
        NSString *prodPage = [pagePath stringByReplacingOccurrencesOfString:@".html" withString:@"_prod.html"];
        NSString *fullPagePath = [WEUtils pathInDocumentDirectory:prodPage withProjectId:self.projectId];
        NSString *html = [NSString stringWithContentsOfFile:fullPagePath
                                                   encoding:NSUTF8StringEncoding
                                                      error:&error];
        NSData *htmlData = [html dataUsingEncoding:NSUTF8StringEncoding];
        put = [[S3PutObjectRequest alloc] initWithKey:pagePath inBucket:bucket];
        put.contentType = @"text/html";
        put.data = htmlData;
        put.cannedACL = acl;
        S3PutObjectResponse *resp = [s3 putObject:put];
        if (resp.error != nil) NSLog(@"Error writing html: %@", resp.error);
    }
    

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
}

-(void)saveProjectWithCompletion:(void (^)(NSError*))block {
    NSError *error;
    NSString *currentPage = [self.contentController getCurrentPage];
    NSString *devFile = [WEUtils pathInDocumentDirectory:currentPage
                                           withProjectId:self.projectId];
    [[self.contentController stringFromCurrentPage] writeToFile:devFile
                                                     atomically:NO
                                                       encoding:NSUTF8StringEncoding
                                                          error:&error];    
    // save the settings
    self.settings.title = self.titleText.text;
    self.settings.bucket = self.bucketText.text;
    [NSKeyedArchiver archiveRootObject:self.settings
                                toFile:[WEUtils pathInDocumentDirectory:@"settings"
                                                          withProjectId:self.projectId]];
    
    // save the thumbnail
    NSString *thumbName = [currentPage stringByReplacingOccurrencesOfString:@".html" withString:@".jpeg"];
    NSString *thumbPath = [WEUtils pathInDocumentDirectory:thumbName
                                             withProjectId:self.projectId];
    UIView *webView = self.contentController.view;
    webView.frame = CGRectMake(webView.frame.origin.x, webView.frame.origin.y, 768, 1004);
    UIGraphicsBeginImageContext(webView.frame.size);
    [webView.layer renderInContext:UIGraphicsGetCurrentContext()];
    UIImage *img = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    NSData *thumbData = UIImageJPEGRepresentation(img, 0.8);
    [thumbData writeToFile:thumbPath atomically:NO];
    [thumbData writeToFile:[WEUtils pathInDocumentDirectory:@"thumb.jpeg"
                                              withProjectId:self.projectId]
                atomically:NO];
    
    NSLog(@"done dev");
    
    if (self.webPageLoaded) {
        NSString *htmlTemplateFile = [[NSBundle mainBundle] pathForResource:@"production" ofType:@"html"];
        NSString *htmlTemplate = [NSString stringWithContentsOfFile:htmlTemplateFile
                                                           encoding:NSUTF8StringEncoding
                                                              error:&error];
        [[WEPageManager sharedManager] exportMarkup:^(id responseData) {
            NSError *innerError;
            NSString *markup = [responseData objectForKey:@"markup"];
            NSString *prodPage = [currentPage stringByReplacingOccurrencesOfString:@"." withString:@"_prod."];
            NSString *prodFile = [WEUtils pathInDocumentDirectory:prodPage withProjectId:self.projectId];
            NSString *withBody = [htmlTemplate stringByReplacingOccurrencesOfString:@"[[BODY]]" withString:markup];
            NSString *withTitle = [withBody stringByReplacingOccurrencesOfString:@"[[TITLE]]" withString:self.settings.title];
            
            [withTitle writeToFile:prodFile atomically:NO encoding:NSUTF8StringEncoding error:&innerError];
            NSLog(@"done prod");
            if (self.delegate) [self.delegate didSaveViewController:self];
            block(nil);
        }];
    } else {
        block(nil);
    }
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

-(void)page:(NSString *)pageName renamedTo:(NSString *)newName {
    if ([[self.contentController getCurrentPage] isEqualToString:pageName]) {
        [self.contentController currentPageRenamedTo:newName];
    }
}

-(void)backToProjects {
    [self saveProjectWithCompletion:^(NSError *err) {
        [self dismissViewControllerAnimated:YES
                                 completion:^{
                                     NSLog(@"dismissed");
                                 }];
    }];
}

/*
 Background Selection
 */
-(void)selectingBackgroundImage {
    if (self.popover) {
        [self.popover presentPopoverFromRect:self.bgSelect.frame
                                      inView:self.view
                    permittedArrowDirections:UIPopoverArrowDirectionAny
                                    animated:YES];
    } else {
        [self presentViewController:self.picker animated:YES completion:^{
            NSLog(@"showing picker modally");
        }];
    }
}

-(void)removeBackgroundImage {
    [self.contentController removeBackground];
    [self.bgRemove setHidden:YES];
}

-(void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary *)info {
    // get the thing
    if (self.popover) {
        [self.popover dismissPopoverAnimated:YES];
    } else {
        [self.picker dismissViewControllerAnimated:YES completion:^{
            NSLog(@"back to editor");
        }];
    }
    [bgRemove setHidden:NO];
    [self.contentController setBackgroundWithInfo:info];
}

/*
 Setting stuff
 */

-(void)swipeRight:(UIGestureRecognizer *)openGesture {
    if (openGesture.state == UIGestureRecognizerStateEnded) {
        if ([self isPagesOpen]) {
            [self closePagesWithTiming:0.1];
        } else {
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
}

-(void)swipeLeft:(UIGestureRecognizer *)closeGesture {
    if (closeGesture.state == UIGestureRecognizerStateEnded) {
        if ([self isSettingsOpen]){
            [self closeSettingsWithTiming:0.1];
        } else {
            [self openPagesWithTiming:0.1];
        }
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
        CGFloat openSize = self.settingsView.frame.size.width;
        self.contentView.frame = CGRectMake(openSize, 0, size.width, size.height);
    }];
}

-(BOOL)isSettingsOpen {
    return self.contentView.frame.origin.x > 0;
}

-(void)closePagesWithTiming:(NSTimeInterval)timing {
    [UIView animateWithDuration:timing animations:^{
        CGSize size = self.contentView.frame.size;
        self.contentView.frame = CGRectMake(0, 0, size.width, size.height);
    }];
}

-(void)openPagesWithTiming:(NSTimeInterval)timing {
    [UIView animateWithDuration:timing animations:^{
        CGSize size = self.contentView.frame.size;
        CGFloat openSize = -1 * self.pagesView.frame.size.width;
        self.contentView.frame = CGRectMake(openSize, 0, size.width, size.height);
    }];
}


-(BOOL)isPagesOpen {
    return self.contentView.frame.origin.x < 0;
}

-(void)modeSwitched:(UISwitch*)switcher {
    if ([switcher isOn]) {
        [[WEPageManager sharedManager] setMode:@"blueprint"];
    } else {
        [[WEPageManager sharedManager] setMode:@"content"];
    }
}

-(void)appClosingNotification:(NSNotification*)notification {
    [self saveProjectWithCompletion:^(NSError *err) {
        NSLog(@"saved and exiting");
    }];
}

// Page duties
-(NSString*)newPageName {
    NSString *prefix = @"new";
    NSString *suffix = @".html";
    int num = 0;
    NSArray *pages = [self.pageCollectionController pages];

    while (YES) {
        NSString *infix = (num == 0 ? @"" : [NSString stringWithFormat:@"%i", num]);
        NSString *match = [NSString stringWithFormat:@"%@%@%@", prefix, infix, suffix];
        
        if (![pages containsString:match]) {
            return match;
        }
        
        num++;
    }
}

-(NSArray*)pages {
    return [self.pageCollectionController pages];
}

-(void)addAndSwitchToNewPage {
    NSString *newName = [self newPageName];
    [self addAndSwitchToPage:newName];
}

-(void)addAndSwitchToPage:(NSString*)pageName {
    // write the html template
    NSError *error;
    NSString *fullPath = [WEUtils pathInDocumentDirectory:pageName
                                            withProjectId:self.projectId];
    NSString *contents = [NSString stringWithContentsOfFile:[[NSBundle mainBundle] pathForResource:@"development"
                                                                                            ofType:@"html"]
                                                   encoding:NSUTF8StringEncoding
                                                      error:&error];
    [contents writeToFile:fullPath
               atomically:NO
                 encoding:NSStringEncodingConversionAllowLossy
                    error:&error];
    
    [self switchToPage:pageName animated:YES];
}

-(void)switchToPage:(NSString *)pageName {
    [self switchToPage:pageName animated:YES];
}
-(void)switchToPage:(NSString*)pageName animated:(BOOL)animate {
    [self.activityView startAnimating];
    [self saveProjectWithCompletion:^(NSError *err) {
        if (animate) {
            self.animateBack = YES;
            [UIView animateWithDuration:0.2 animations:^{
                CGSize size = self.contentView.frame.size;
                [self.contentView setFrame:CGRectMake(self.view.frame.size.width,
                                                      0,
                                                      size.width,
                                                      size.height)];
            }];
        }
        self.webPageLoaded = NO;
        [self.contentController loadPage:pageName];
    }];
}

-(void)webViewDidLoad {
    self.webPageLoaded = YES;
    if (self.animateBack) {
        [UIView animateWithDuration:0.3 animations:^{
            CGSize size = self.contentView.frame.size;
            [self.contentView setFrame:CGRectMake(0, 0, size.width, size.height)];
        }];
    }
    [self.activityView stopAnimating];
    self.animateBack = NO;
}

-(NSArray*)getPages {
    return [self.pageCollectionController pages];
}

-(void)refresh {
    [modeSwitch setOn:NO animated:YES];
    [self.contentController refresh];
}
@end
