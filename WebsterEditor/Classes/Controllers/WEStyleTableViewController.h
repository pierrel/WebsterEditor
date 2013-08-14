//
//  WEStyleTableViewController.h
//  WebsterEditor
//
//  Created by pierre larochelle on 6/15/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "WEBodyBackgroundCell.h"

@protocol WEStyleTableViewControllerDelegate <NSObject, WEBodyBackgroundDelegate, UIImagePickerControllerDelegate>

-(void)styleResetWithData:(id)data;

// background stuff
-(void)setBackgroundWithInfo:(NSDictionary*)info;
-(void)removeBackground;
@end

@interface WEStyleTableViewController : UITableViewController<UITextFieldDelegate>
@property (nonatomic, strong) NSString *type;
@property (nonatomic, strong) NSString *tag;
@property (nonatomic, assign) id<WEStyleTableViewControllerDelegate>delegate;
@property (nonatomic, assign) UIPopoverController *parentPopover;
-(void)setNewStyleData:(NSDictionary*)newStyleData;
@end
