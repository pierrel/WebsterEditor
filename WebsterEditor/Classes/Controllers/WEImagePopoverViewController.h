//
//  WEImagePopoverViewController.h
//  WebsterEditor
//
//  Created by pierre larochelle on 3/19/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "WEImagePopoverViewController.h"
#import "GradientButton.h"

@class WEImagePopoverViewController;
@protocol WEImagePopoverControllerDelegate <NSObject>
-(void)imagePopoverController:(WEImagePopoverViewController *)picker didFinishPickingMediaWithInfo:(NSDictionary *)info;
-(void)imagePopoverControllerDidDeleteImage:(WEImagePopoverViewController*)picker;
@end

typedef enum imagePopoverTypes
{
    EMPTY_IMAGE,
    OCCUPIED_IMAGE
} WEImagePopoverType;

@interface WEImagePopoverViewController : UIViewController<UIPopoverControllerDelegate, UIImagePickerControllerDelegate>
@property (nonatomic, strong) UIImagePickerController *imagePicker;
@property (nonatomic, strong) UIPopoverController *popover;
@property (nonatomic, strong) GradientButton *deleteButton;
@property (nonatomic, assign) WEImagePopoverType type;
@property (assign, nonatomic) id<WEImagePopoverControllerDelegate>delegate;

-(void)popOverView:(UIView*)view withFrame:(CGRect)frame;
-(void)dismiss;
@end
