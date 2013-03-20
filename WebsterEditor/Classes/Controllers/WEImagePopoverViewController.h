//
//  WEImagePopoverViewController.h
//  WebsterEditor
//
//  Created by pierre larochelle on 3/19/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "WEImagePopoverViewController.h"

typedef enum imagePopoverTypes
{
    EMPTY_IMAGE,
    OCCUPIED_IMAGE
} WEImagePopoverType;

@interface WEImagePopoverViewController : UIViewController<UIPopoverControllerDelegate, UIImagePickerControllerDelegate>
@property (nonatomic, strong) UIImagePickerController *imagePicker;
@property (nonatomic, strong) UIPopoverController *popover;
@property (nonatomic, strong) UIButton *deleteButton;
@property (nonatomic, assign) WEImagePopoverType type;

-(void)popOverView:(UIView*)view withFrame:(CGRect)frame;
-(void)dismiss;
@end
