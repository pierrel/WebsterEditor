//
//  WEImagePopoverViewController.m
//  WebsterEditor
//
//  Created by pierre larochelle on 3/19/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEImagePopoverViewController.h"

@interface WEImagePopoverViewController ()
-(CGSize)popoverSize;
@end

@implementation WEImagePopoverViewController
@synthesize imagePicker, popover, deleteButton;

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        self.imagePicker = [[UIImagePickerController alloc] init];
        self.imagePicker.delegate = self;
        [self.imagePicker setSourceType:UIImagePickerControllerSourceTypePhotoLibrary];
        [self.imagePicker setNavigationBarHidden:YES];
        
        self.popover = [[UIPopoverController alloc] initWithContentViewController:self];
        self.popover.delegate = self;
        [self.popover setPopoverContentSize:[self popoverSize]];
        
        self.type = OCCUPIED_IMAGE;
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    CGFloat buffer = 5;
    CGSize size = [self popoverSize];
    
    CGFloat bHeight = 40;
    CGRect bFrame = CGRectMake(0,
                               buffer,
                               size.width,
                               bHeight);
    [imagePicker.view setFrame:CGRectMake(0,
                                          bHeight + (buffer*2),
                                          self.view.frame.size.width,
                                          self.view.frame.size.height - bHeight - (buffer*2))];
    [self.view addSubview:imagePicker.view];
    
    if (!deleteButton)
        self.deleteButton = [[GradientButton alloc] initWithFrame:bFrame];
    [deleteButton useRedDeleteStyle];
    [deleteButton setTitle:@"Delete" forState:UIControlStateNormal];
    [deleteButton setHidden:NO];
    [deleteButton setEnabled:YES];
    [self.view addSubview:deleteButton];

}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

-(void)popOverView:(UIView *)view withFrame:(CGRect)frame {
    [popover presentPopoverFromRect:frame
                             inView:view
           permittedArrowDirections:UIPopoverArrowDirectionAny
                           animated:YES];
}
-(void)dismiss {
    [popover dismissPopoverAnimated:YES];
}
-(CGSize)popoverSize {
    return CGSizeMake(300, 500);
}

-(void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary *)info {
    UILayoutContainerView *view;
}

@end
