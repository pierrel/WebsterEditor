//
//  WEImagePopoverViewController.m
//  WebsterEditor
//
//  Created by pierre larochelle on 3/19/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEImagePopoverViewController.h"
#import "WEUtils.h"

@class WEImagePopoverControllerDelegate;

@interface WEImagePopoverViewController ()
-(CGSize)popoverSize;
@end

@implementation WEImagePopoverViewController
@synthesize imagePicker, popover, deleteButton;

-(id)initWithDeleteButtonVisible:(BOOL)deleteVisible {
    self = [super initWithNibName:nil bundle:nil];
    if (self) {
        self.deleteVisible = deleteVisible;
        
        self.imagePicker = [[UIImagePickerController alloc] init];
        self.imagePicker.delegate = self;
        [self.imagePicker setSourceType:UIImagePickerControllerSourceTypePhotoLibrary];
        [self.imagePicker setNavigationBarHidden:YES];
        
        self.popover = [[UIPopoverController alloc] initWithContentViewController:self];
        self.popover.delegate = self;
        [self.popover setPopoverContentSize:[self popoverSize]];        
    }
    return self;
}

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    CGSize size = [self popoverSize];
    
    CGFloat buffer = 5;
    CGFloat bHeight = 40;
    
    if (!self.deleteVisible) {
        buffer = 0;
        bHeight = 0;
    }
    [imagePicker.view setFrame:CGRectMake(0,
                                          bHeight + (buffer*2),
                                          self.view.frame.size.width,
                                          self.view.frame.size.height - bHeight - (buffer*2))];
    [self.view addSubview:imagePicker.view];
    
    if (self.deleteVisible) {
        CGRect bFrame = CGRectMake(0,
                                   buffer,
                                   size.width,
                                   bHeight);
        if (!deleteButton) {
            self.deleteButton = [[GradientButton alloc] initWithFrame:bFrame];
            [deleteButton addTarget:self action:@selector(deleteButtonTapped:) forControlEvents:UIControlEventTouchUpInside];
        }
        [deleteButton useRedDeleteStyle];
        [deleteButton setTitle:@"Delete" forState:UIControlStateNormal];
        [deleteButton setHidden:NO];
        [deleteButton setEnabled:YES];
        [self.view addSubview:deleteButton];
    }

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
    return CGSizeMake(325, 500);
}

-(void)deleteButtonTapped:(UIButton *)delete {
    [popover dismissPopoverAnimated:YES];
    if (self.delegate) [self.delegate imagePopoverControllerDidDeleteImage:self];
}

-(void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary *)info {
    [popover dismissPopoverAnimated:YES];
    if (self.delegate) [self.delegate imagePopoverController:self didFinishPickingMediaWithInfo:info];
}

-(void)imagePickerControllerDidCancel:(UIImagePickerController *)picker {
    [popover dismissPopoverAnimated:YES];
    if (self.delegate) [self.delegate imagePopoverControllerDidGetDismissed:self];
}

-(void)popoverControllerDidDismissPopover:(UIPopoverController *)popoverController {
    if (self.delegate) [self.delegate imagePopoverControllerDidGetDismissed:self];
}

@end
