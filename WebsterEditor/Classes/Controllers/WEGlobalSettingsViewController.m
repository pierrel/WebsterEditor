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
-(void)openSettings:(UIGestureRecognizer*)openGesture;
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
    self.settingsView.backgroundColor = [UIColor colorWithPatternImage:[UIImage imageNamed:@"dark_exa.png"]];
    
    WEViewController *contentController = [[WEViewController alloc] initWithNibName:@"WEViewController_iPad" bundle:nil];
    [self.contentView addSubview:contentController.view];
    
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

-(void)openSettings:(UIGestureRecognizer *)openGesture {
    if (openGesture.state == UIGestureRecognizerStateEnded && ![self isOpen]) {
        [UIView animateWithDuration:0.1 animations:^{
            CGSize size = self.contentView.frame.size;
            self.contentView.frame = CGRectMake(self.settingsView.frame.size.width, 0, size.width, size.height);
        }];
    }
}

-(void)closeSettings:(UIGestureRecognizer *)openGesture {
    if (openGesture.state == UIGestureRecognizerStateEnded && [self isOpen]) {
        [UIView animateWithDuration:0.1 animations:^{
            CGSize size = self.contentView.frame.size;
            self.contentView.frame = CGRectMake(0, 0, size.width, size.height);
        }];
    }
}


-(BOOL)isOpen {
    return self.contentView.frame.origin.x > 0;
}

@end
