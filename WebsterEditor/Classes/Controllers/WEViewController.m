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

@interface WEViewController ()
-(void)openSettings:(UIGestureRecognizer*)openGesture;
@end

@implementation WEViewController
@synthesize contentView, settingsView, bgRemove, bgSelect, exportButton;

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
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
        
    self.settingsView.backgroundColor = [UIColor colorWithPatternImage:[UIImage imageNamed:@"dark_exa.png"]];
    
    contentView.layer.masksToBounds = NO;
    contentView.layer.shadowOffset = CGSizeMake(-15, 0);
    contentView.layer.shadowRadius = 5;
    contentView.layer.shadowOpacity = 0.5;
    
    self.contentController = [[WEWebViewController alloc] initWithNibName:@"WEWebViewController_iPad" bundle:nil];
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

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
Export
 */
-(void)exportProject {
    NSError *error;
    NSString *filePath = [[NSBundle mainBundle] pathForResource:@"config"
                                                         ofType:@"json"];
    NSString *configString = [NSString stringWithContentsOfFile:filePath encoding:NSStringEncodingConversionAllowLossy error:&error];
    NSData *configData = [NSData dataWithContentsOfFile:filePath];
    NSDictionary *json  = [NSJSONSerialization JSONObjectWithData:configData
                                                          options:kNilOptions
                                                            error:&error];

    // Initial the S3 Client.
    AmazonS3Client *s3 = [[AmazonS3Client alloc] initWithAccessKey:[json objectForKey:@"AWS_KEY"] withSecretKey:[json objectForKey:@"AWS_SECRET"]];
    s3.endpoint = [AmazonEndpoints s3Endpoint:US_WEST_2];
    
    // Create the picture bucket.
    S3CreateBucketRequest *createBucketRequest = [[S3CreateBucketRequest alloc] initWithName:[json objectForKey:@"bucket"] andRegion:[S3Region USWest2]];
    S3CreateBucketResponse *createBucketResponse = [s3 createBucket:createBucketRequest];
    if(createBucketResponse.error != nil)
    {
        NSLog(@"Error: %@", createBucketResponse.error);
    }
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

@end
