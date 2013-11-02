//
//  WEGlobalSettingsViewController.h
//  WebsterEditor
//
//  Created by pierre larochelle on 3/21/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "GradientButton.h"
#import "WEWebViewController.h"
#import "WEProjectSettings.h"
#import "WEPageCollectionViewController.h"
#import "WEPageTempaltesTableViewController.h"

@class WEEditorViewController;
@protocol WEViewControllerDelegate <NSObject>
-(void)didSaveViewController:(WEEditorViewController*)controller;
@end

@interface WEEditorViewController : UIViewController<UINavigationControllerDelegate, UIImagePickerControllerDelegate, UIPopoverControllerDelegate, PageCollectionDelegate, WEWebViewDelegate, UIAlertViewDelegate,WEPageTempaltesTableViewControllerDelegate>
@property (nonatomic, assign) id delegate;

@property (nonatomic, strong) NSString *projectId;
@property (nonatomic, strong) WEProjectSettings *settings;
@property (nonatomic, assign) BOOL loadingNewProject;

@property (nonatomic, strong) UIPopoverController *popover;
@property (nonatomic, strong) WEWebViewController *contentController;
@property (nonatomic, strong) WEPageCollectionViewController *pageCollectionController;

@property (nonatomic, strong) IBOutlet UIView *contentView;
@property (nonatomic, strong) IBOutlet UIScrollView *settingsView;
@property (nonatomic, strong) IBOutlet UIView *pagesView;
@property (nonatomic, strong) IBOutlet GradientButton *bgSelect;
@property (nonatomic, strong) IBOutlet GradientButton *bgRemove;
@property (nonatomic, strong) IBOutlet UIButton *exportButton;
@property (nonatomic, strong) IBOutlet UIButton *goButton;
@property (nonatomic, strong) IBOutlet UIButton *refreshButton;
@property (nonatomic, strong) IBOutlet UITextField *titleText;
@property (nonatomic, strong) IBOutlet UITextField *bucketText;
@property (nonatomic, strong) IBOutlet UITextField *awsKeyText;
@property (nonatomic, strong) IBOutlet UITextField *awsSecretText;
@property (nonatomic, strong) IBOutlet UISwitch *modeSwitch;
@property (nonatomic, strong) IBOutlet UIActivityIndicatorView *activityView;

@property (nonatomic, strong) IBOutlet UIActivityIndicatorView *exportActivity;

-(id)initWithProjectId:(NSString*)projectId withSettings:(WEProjectSettings*)settings;

-(IBAction)modeButtonTapped:(id)sender;
-(IBAction)deleteProjectButtonTapped:(id)sender;
@end