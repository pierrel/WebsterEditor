//
//  WEGlobalSettingsViewController.m
//  WebsterEditor
//
//  Created by pierre larochelle on 3/21/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEEditorViewController.h"
#import "WEWebViewController.h"
#import "WEPageManager.h"
#import "WEUtils.h"
#import "NSArray+WEExtras.h"
#import "NSThread+BlockAdditions.h"
#import "WEPageCollectionViewLayout.h"
#import "WEPageThumbGenerator.h"
#import "WEPageTemplateManager.h"
#import "WES3Manager.h"
#import "WebsterEditor-Swift.h"

#define DELETE_ALERT_CANCEL 0
#define DELETE_ALERT_OK 1

@interface WEEditorViewController ()
@property (nonatomic, assign) BOOL webPageLoaded;
@property (nonatomic, strong) UIImagePickerController *picker;
@property (nonatomic, strong) WEPageThumbGenerator *thumbGenerator;
@property (nonatomic, strong) UIBarButtonItem *deselectButton;
@property (nonatomic, strong) UIPopoverController *pageTemplatePopover;
@property (nonatomic, strong) WEPageTempaltesTableViewController *pageTemplateController;
@property (nonatomic, strong) UINavigationController *pageTemplateNav;
@end

@implementation WEEditorViewController
@synthesize contentView, settingsView, bgRemove, bgSelect, exportButton, exportActivity, goButton, refreshButton, modeSwitch, picker;

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
        self.webPageLoaded = NO;
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    if (!self.thumbGenerator) self.thumbGenerator = [[WEPageThumbGenerator alloc] init];
    
    self.deselectButton = [[UIBarButtonItem alloc] initWithTitle:@"Deselect" style:UIBarButtonItemStylePlain target:self action:@selector(closeDialog)];
    
    picker = [[UIImagePickerController alloc] init];
    picker.delegate = self;
    picker.sourceType = UIImagePickerControllerSourceTypePhotoLibrary;

    self.pageTemplateController = [[WEPageTempaltesTableViewController alloc] init];
    self.pageTemplateController.delegate = self;
    
    self.pageTemplateNav = [[UINavigationController alloc] initWithRootViewController:self.pageTemplateController];
    
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        self.popover = [[UIPopoverController alloc] initWithContentViewController:picker];
        self.popover.delegate = self;
        
        self.pageTemplatePopover = [[UIPopoverController alloc] initWithContentViewController:self.pageTemplateNav];
        self.pageTemplatePopover.delegate = self;
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
    
    self.titleText.text = self.settings.title;
    self.bucketText.text = self.settings.bucket;
    self.awsKeyText.text = self.settings.awsKey;
    self.awsSecretText.text = self.settings.awsSecret;
    
    [goButton addTarget:self
                 action:@selector(gotoExportURL)
       forControlEvents:UIControlEventTouchUpInside];
    if ([self.settings.lastExportURL isEqualToString:@""]) {
        [goButton setHidden:YES];
    }
    
    [refreshButton setHidden:YES];
    
#ifdef DEBUG
    [refreshButton addTarget:self action:@selector(refresh) forControlEvents:UIControlEventTouchUpInside];
    [refreshButton setHidden:NO];
#endif
    
    contentView.layer.masksToBounds = NO;
    contentView.layer.shadowOffset = CGSizeMake(0, -15);
    contentView.layer.shadowRadius = 20;
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
    
    // setup back button
    if (self.navigationController) {
        UIBarButtonItem *back = [[UIBarButtonItem alloc] initWithImage:[UIImage imageNamed:@"arrow-left.png"] style:UIBarButtonItemStylePlain target:self action:@selector(backToProjects)];
        [self.navigationItem setLeftBarButtonItem:back];
    }
    
    // make sure it's below the nav
    self.edgesForExtendedLayout = UIRectEdgeNone;
    self.automaticallyAdjustsScrollViewInsets = NO;
    
    // load first page
    NSString *newPageName = [[self.pageCollectionController pages] objectAtIndex:0];
    if (self.loadingNewProject) {
        [self switchToPageInNewProject:newPageName];
    } else {
        [self switchToPage:newPageName];
    }
}

-(void)viewDidAppear:(BOOL)animated {
    // subscribe to the closing notification
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(appClosingNotification:) name:@"appClosing" object:nil];
}

-(void)viewDidDisappear:(BOOL)animated {
    [[NSNotificationCenter defaultCenter] removeObserver:self name:@"appClosing" object:nil];
}

-(void)didRotateFromInterfaceOrientation:(UIInterfaceOrientation)fromInterfaceOrientation {
    [self.contentController resetSelectedButtons];
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
        [self.exportButton setEnabled:NO];
        [exportActivity startAnimating];
        [goButton setHidden:YES];
        [self saveProjectWithCompletion:^(NSError *err) {
            dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT,
                                                     (unsigned long)NULL), ^(void) {
                [self doExportWorkWithCompletion:^(NSError *error) {
                    dispatch_async(dispatch_get_main_queue(), ^{
                        [self.exportButton setEnabled:YES];
                        [exportActivity stopAnimating];
                        if (error) {
                            UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Error Exporting Website" message:@"There was an error exporting your website. Please check that your AWS credentials are correct and that you're connected to an internet connection" delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil];
                            [alert show];
                            alert = nil;
                        } else {
                            [goButton setHidden:NO];
                        }
                    });
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
    WEProjectFileManager *projectFileManager = [[WEProjectFileManager alloc] init];
    projectFileManager.projectId = self.projectId;
    NSString *bucketName = self.bucketText.text;
    WES3Manager *s3 = [WES3Manager sharedManager];
    BFTask *task = [[s3 prepareBucketNamed:bucketName
                             withPagesKeys:[projectFileManager pagePathsAndKeys]
                              withLibsKeys:[projectFileManager libPathsAndKeys]
                             withMediaKeys:[projectFileManager mediaPathsAndKeys]] continueWithBlock:^id(BFTask *task) {
        if (task.error) {
            NSLog(@"Problem preparing bucket %@: %@", bucketName, task.error);
        } else if (task.completed) {
            NSLog(@"successfully prepared bucket");
        } else {
            NSLog(@"Problem preparing bucket %@", bucketName);
        }
        
        return nil;
    }];
     
    [task waitUntilFinished];
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
    self.settings.awsKey = self.awsKeyText.text;
    self.settings.awsSecret = self.awsSecretText.text;
    [NSKeyedArchiver archiveRootObject:self.settings
                                toFile:[WEUtils pathInDocumentDirectory:@"settings"
                                                          withProjectId:self.projectId]];
    
    if (currentPage) {
        // save the thumbnail
        NSString *thumbName = [currentPage stringByReplacingOccurrencesOfString:@".html" withString:@".jpeg"];
        NSString *pageThumbPath = [WEUtils pathInDocumentDirectory:thumbName
                                                 withProjectId:self.projectId];
        NSString *mainThumbPath = [WEUtils pathInDocumentDirectory:@"thumb.jpeg" withProjectId:self.projectId];
        NSString *indexPath = [WEUtils pathInDocumentDirectory:currentPage withProjectId:self.projectId];
        [self.thumbGenerator generateThumbForPage:indexPath atLocations:@[pageThumbPath, mainThumbPath]];
        NSLog(@"generating thumbs at %@ and /thumb.jpeg", pageThumbPath);
    }
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

-(BOOL)validateBucket {
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

-(BOOL)validateSettings {
    if ([self validateBucket]) {
        return YES;
    }
    return NO;
}

-(void)page:(NSString *)pageName renamedTo:(NSString *)newName {
    if ([[self.contentController getCurrentPage] isEqualToString:pageName]) {
        [self.contentController currentPageRenamedTo:newName];
    }
}

-(void)pageDeleted:(NSString *)pageName {
    NSArray *pages = [self.pageCollectionController pages];

    if (pages.count == 0) {
        [self addAndSwitchToNewPageWithSaving:NO];
    } else if ([[self.contentController getCurrentPage] isEqualToString:pageName]) {
        [self switchToPage:[pages objectAtIndex:0] andSave:NO];
    }
}

-(void)backToProjects {
    [self closeSettingsWithTiming:0.1];
    [self.activityView startAnimating];
    [self saveProjectWithCompletion:^(NSError *err) {
        [self.activityView startAnimating];
        [self dismissViewControllerAnimated:YES
                                 completion:^{
                                     NSLog(@"dismissed");
                                 }];
    }];
}

-(IBAction)deleteProjectButtonTapped:(id)sender {
    UIAlertView *deleteAlert = [[UIAlertView alloc] initWithTitle:@"Delete project?" message:@"Are you sure you want to delete this project? This is not undoable." delegate:self cancelButtonTitle:@"Don't Delete" otherButtonTitles:@"Delete it", nil];
    [deleteAlert show];
}

-(void)deleteProject {
    [self closeSettingsWithTiming:0.1];
    [self.activityView startAnimating];
    NSError *err;
    NSFileManager *fs = [NSFileManager defaultManager];
    [fs removeItemAtPath:[WEUtils pathInDocumentDirectory:@"" withProjectId:self.projectId] error:&err];
    [self dismissViewControllerAnimated:YES completion:^{
        NSLog(@"project deleted and removed");
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
        CGPoint origin = self.contentView.frame.origin;
        CGSize size = self.contentView.frame.size;
        self.contentView.frame = CGRectMake(0, origin.y, size.width, size.height);
    }];
}

-(void)openSettingsWithTiming:(NSTimeInterval)timing {
    [UIView animateWithDuration:timing animations:^{
        CGPoint origin = self.contentView.frame.origin;
        CGSize size = self.contentView.frame.size;
        CGFloat openSize = self.settingsView.frame.size.width;
        self.contentView.frame = CGRectMake(openSize, origin.y, size.width, size.height);
    }];
}

-(BOOL)isSettingsOpen {
    return self.contentView.frame.origin.x > 0;
}

-(void)closePagesWithTiming:(NSTimeInterval)timing {
    [UIView animateWithDuration:timing animations:^{
        CGPoint origin = self.contentView.frame.origin;
        CGSize size = self.contentView.frame.size;
        self.contentView.frame = CGRectMake(0, origin.y, size.width, size.height);
    }];
}

-(void)openPagesWithTiming:(NSTimeInterval)timing {
    [UIView animateWithDuration:timing animations:^{
        CGPoint origin = self.contentView.frame.origin;
        CGSize size = self.contentView.frame.size;
        CGFloat openSize = -1 * self.pagesView.frame.size.width;
        self.contentView.frame = CGRectMake(openSize, origin.y, size.width, size.height);
    }];
}


-(BOOL)isPagesOpen {
    return self.contentView.frame.origin.x < 0;
}

-(IBAction)modeButtonTapped:(id)sender {
    [modeSwitch setOn:![modeSwitch isOn] animated:YES];
}

-(void)modeSwitched:(UISwitch*)switcher {
    NSString *newMode = ([modeSwitch isOn] ? @"blueprint" : @"content");
    [[WEPageManager sharedManager] setMode:newMode];
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

-(void)addAndSwitchToNewPageFromController:(WEPageCollectionViewController*)controller fromFrame:(CGRect)frame {
    if (self.pageTemplatePopover) {
        [self.pageTemplatePopover presentPopoverFromRect:frame
                                                  inView:self.view
                                permittedArrowDirections:UIPopoverArrowDirectionAny
                                                animated:YES];
    } else {
        [self presentViewController:self.pageTemplateNav animated:YES completion:nil];
    }
}

-(void)templateViewController:(WEPageTempaltesTableViewController*)controller
didSelectTemplateWithContents:(NSString*)pageTemplateContents {
    if (self.pageTemplatePopover) {
        [self.pageTemplatePopover dismissPopoverAnimated:YES];
        [self addAndSwitchToNewPageWithContents:pageTemplateContents];
    } else {
        [controller dismissViewControllerAnimated:YES completion:^{
            [self addAndSwitchToNewPageWithContents:pageTemplateContents];
        }];
    }
}

-(void)addAndSwitchToNewPageWithContents:(NSString*)contents {
    [self addAndSwitchToPage:[self newPageName]
                withContents:contents
                     andSave:YES];
}

-(void)addAndSwitchToNewPageWithSaving:(BOOL)save {
    NSString *newName = [self newPageName];
    [self addAndSwitchToPage:newName andSave:save];
}

-(void)addAndSwitchToPage:(NSString*)pageName {
    [self addAndSwitchToPage:pageName andSave:YES];
}

-(void)addAndSwitchToPage:(NSString*)pageName andSave:(BOOL)save {
    // write the html template
    NSError *error;
    NSString *contents = [NSString stringWithContentsOfFile:[[NSBundle mainBundle] pathForResource:@"development"
                                                                                            ofType:@"html"]
                                                   encoding:NSUTF8StringEncoding
                                                      error:&error];
    [self addAndSwitchToPage:pageName withContents:contents andSave:save];
}

-(void)addAndSwitchToPage:(NSString*)pageName withContents:(NSString*)contents andSave:(BOOL)save {
    NSError *error;
    NSString *fullPath = [WEUtils pathInDocumentDirectory:pageName
                                            withProjectId:self.projectId];
    [contents writeToFile:fullPath
               atomically:NO
                 encoding:NSStringEncodingConversionAllowLossy
                    error:&error];
    [self switchToPage:pageName andSave:save];
    [self.pageCollectionController refreshAfterAddingPage];
}

-(void)switchToPageInNewProject:(NSString*)pageName {
    [self.activityView startAnimating];
    self.webPageLoaded = NO;
    [self.contentController loadPage:pageName]; // loading page before save
}

-(void)switchToPage:(NSString *)pageName andSave:(BOOL)save {
    [self.activityView startAnimating];
    [self.contentController closeDialog];
    
    void (^switchWork)(NSError *) = ^(NSError *err){
        [self closePagesWithTiming:0.1];
        self.webPageLoaded = NO;
        [self.contentController loadPage:pageName];
    };
    
    if (save) {
        [self saveProjectWithCompletion:switchWork];
    } else {
        switchWork(nil);
    }
}

-(void)switchToPage:(NSString *)pageName {
    [self switchToPage:pageName andSave:YES];
}

-(void)webViewDidLoad {
    self.webPageLoaded = YES;
    [self.activityView stopAnimating];
    
    // if this is a new project then save it right away
    if (self.loadingNewProject) {
        self.loadingNewProject = NO;
        [self saveProjectWithCompletion:^(NSError *err) {
            [self.pageCollectionController.collectionView reloadData];
        }];
    }
}

-(NSArray*)getPages {
    return [self.pageCollectionController pages];
}

-(void)dialogOpened {
    [self.navigationItem setRightBarButtonItem:self.deselectButton animated:YES];
}

-(void)dialogClosed {
    [self.navigationItem setRightBarButtonItem:nil animated:YES];
}

-(void)closeDialog {
    [self.contentController closeDialog];
}

-(void)webViewControllerPresentViewController:(UIViewController *)controller {
    [self presentViewController:controller animated:YES completion:nil];
}

-(void)refresh {
    [modeSwitch setOn:NO animated:YES];
    [self.contentController refresh];
}

#pragma mark UIAlertView delegate
-(void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex {
    switch (buttonIndex) {
        case DELETE_ALERT_OK:
            [self deleteProject];
            break;
        default:
            break;
    }
}
@end
