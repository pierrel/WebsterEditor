//
//  WEGlobalSettingsViewController.m
//  WebsterEditor
//
//  Created by pierre larochelle on 3/21/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEViewController.h"
#import "WEWebViewController.h"
#import "WEPageManager.h"

@interface WEViewController ()
-(void)openSettings:(UIGestureRecognizer*)openGesture;
@end

@implementation WEViewController
@synthesize contentView, settingsView, bgRemove, bgSelect;

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
    CGFloat buffer = 10;
    CGSize buttonSize = CGSizeMake(settingsView.frame.size.width - (buffer*2), 40);
    
    self.bgSelect = [[GradientButton alloc] init];
    [self.bgSelect useSimpleOrangeStyle];
    [self.bgSelect setTitle:@"Set Background" forState:UIControlStateNormal];
    [self.bgSelect addTarget:self action:@selector(selectingBackgroundImage) forControlEvents:UIControlEventTouchUpInside];
    [self.settingsView addSubview:self.bgSelect];
    self.bgSelect.frame = CGRectMake(buffer, 50, buttonSize.width, buttonSize.height);
    
    self.bgRemove = [[GradientButton alloc] init];
    [bgRemove useRedDeleteStyle];
    [bgRemove setTitle:@"Remove Background" forState:UIControlStateNormal];
    [bgRemove addTarget:self action:@selector(removeBackgroundImage) forControlEvents:UIControlEventTouchUpInside];
    [settingsView addSubview:self.bgRemove];
    bgRemove.frame = CGRectMake(buffer,
                                bgSelect.frame.origin.y + buttonSize.height + buffer,
                                buttonSize.width,
                                buttonSize.height);
    [bgRemove setHidden:YES];
    
    
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
    [self closeSettingsWithTiming:0.3];
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
