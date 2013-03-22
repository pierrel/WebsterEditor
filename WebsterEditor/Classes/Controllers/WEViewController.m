//
//  WEGlobalSettingsViewController.m
//  WebsterEditor
//
//  Created by pierre larochelle on 3/21/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEViewController.h"
#import "WEWebViewController.h"

@interface WEViewController ()
-(void)openSettings:(UIGestureRecognizer*)openGesture;
@end

@implementation WEViewController
@synthesize contentView, settingsView;

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
    self.bgSelect = [[GradientButton alloc] init];
    [self.bgSelect useSimpleOrangeStyle];
    [self.bgSelect setTitle:@"Set Background" forState:UIControlStateNormal];
    [self.bgSelect addTarget:self action:@selector(selectingBackgroundImage) forControlEvents:UIControlEventTouchUpInside];
    [self.settingsView addSubview:self.bgSelect];
    self.bgSelect.frame = CGRectMake(10, 50, settingsView.frame.size.width - 20, 40);
    
    self.settingsView.backgroundColor = [UIColor colorWithPatternImage:[UIImage imageNamed:@"dark_exa.png"]];
    
    contentView.layer.masksToBounds = NO;
    contentView.layer.shadowOffset = CGSizeMake(-15, 0);
    contentView.layer.shadowRadius = 5;
    contentView.layer.shadowOpacity = 0.5;
    
    self.contentController = [[WEWebViewController alloc] initWithNibName:@"WEViewController_iPad" bundle:nil];
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
 Background Selection
 */
-(void)selectingBackgroundImage {    
    [self.popover presentPopoverFromRect:self.bgSelect.frame inView:self.view permittedArrowDirections:UIPopoverArrowDirectionAny animated:YES];
    
}

-(void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary *)info {
    // get the thing
    [self.popover dismissPopoverAnimated:YES];
    [self closeSettingsSlowly];
    [self.contentController setBackgroundWithInfo:info];
}

/*
 Setting stuff
 */

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
        [self closeSettings];
    }
}

-(void)closeSettings {
    [UIView animateWithDuration:0.1 animations:^{
        CGSize size = self.contentView.frame.size;
        self.contentView.frame = CGRectMake(0, 0, size.width, size.height);
    }];
}

-(void)closeSettingsSlowly {
    [UIView animateWithDuration:0.3 animations:^{
        CGSize size = self.contentView.frame.size;
        self.contentView.frame = CGRectMake(0, 0, size.width, size.height);
    }];
}


-(BOOL)isOpen {
    return self.contentView.frame.origin.x > 0;
}

@end
