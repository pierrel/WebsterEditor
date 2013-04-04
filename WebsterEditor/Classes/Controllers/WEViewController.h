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

@class WEViewController;
@protocol WEViewControllerDelegate <NSObject>
-(void)didSaveViewController:(WEViewController*)controller;
@end

@interface WEViewController : UIViewController<UIImagePickerControllerDelegate, UIPopoverControllerDelegate>
@property (nonatomic, assign) id delegate;

@property (nonatomic, strong) NSString *projectId;
@property (nonatomic, strong) WEProjectSettings *settings;

@property (nonatomic, strong) UIPopoverController *popover;
@property (nonatomic, strong) WEWebViewController *contentController;

@property (nonatomic, strong) IBOutlet UIView *contentView;
@property (nonatomic, strong) IBOutlet UIView *settingsView;
@property (nonatomic, strong) IBOutlet GradientButton *bgSelect;
@property (nonatomic, strong) IBOutlet GradientButton *bgRemove;
@property (nonatomic, strong) IBOutlet GradientButton *exportButton;
@property (nonatomic, strong) IBOutlet GradientButton *saveButton;
@property (nonatomic, strong) IBOutlet GradientButton *backButton;
@property (nonatomic, strong) IBOutlet GradientButton *goButton;
@property (nonatomic, strong) IBOutlet UITextField *titleText;
@property (nonatomic, strong) IBOutlet UITextField *bucketText;

@property (nonatomic, strong) IBOutlet UIActivityIndicatorView *exportActivity;

-(id)initWithProjectId:(NSString*)projectId withSettings:(WEProjectSettings*)settings;
@end