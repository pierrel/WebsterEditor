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

@interface WEViewController : UIViewController<UIImagePickerControllerDelegate, UIPopoverControllerDelegate>

@property (nonatomic, strong) UIPopoverController *popover;
@property (nonatomic, strong) WEWebViewController *contentController;

@property (nonatomic, strong) IBOutlet UIView *contentView;
@property (nonatomic, strong) IBOutlet UIView *settingsView;
@property (nonatomic, strong) IBOutlet GradientButton *bgSelect;
@property (nonatomic, strong) IBOutlet GradientButton *bgRemove;
@property (nonatomic, strong) IBOutlet GradientButton *exportButton;
@property (nonatomic, strong) IBOutlet UIActivityIndicatorView *exportActivity;
@end