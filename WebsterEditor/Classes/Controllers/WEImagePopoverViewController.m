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
        
        self.deleteButton = [[UIButton alloc] init];
        
        self.type = OCCUPIED_IMAGE;
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    [self.view addSubview:imagePicker.view];
    [imagePicker.view setFrame:CGRectMake(0,
                                          40,
                                          self.view.frame.size.width,
                                          self.view.frame.size.height - 40)];
    
    [self.view addSubview:deleteButton];
    [deleteButton setFrame:CGRectMake(0, 0, self.view.frame.size.width, 40)];
    [deleteButton setTitle:@"Delete" forState:UIControlStateNormal];

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

@end
