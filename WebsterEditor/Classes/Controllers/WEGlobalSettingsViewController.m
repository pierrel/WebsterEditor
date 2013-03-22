//
//  WEGlobalSettingsViewController.m
//  WebsterEditor
//
//  Created by pierre larochelle on 3/21/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEGlobalSettingsViewController.h"
#import "WEViewController.h"

@interface WEGlobalSettingsViewController ()

@end

@implementation WEGlobalSettingsViewController
@synthesize contentView, settingsView;

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    WEViewController *contentController = [[WEViewController alloc] initWithNibName:@"WEViewController_iPad" bundle:nil];
    [self.contentView addSubview:contentController.view];

}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
