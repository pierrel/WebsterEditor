//
//  WEColumnResizeView.h
//  WebsterEditor
//
//  Created by pierre larochelle on 2/11/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "WEDialogViewController.h"

@interface WEColumnResizeView : UIView
@property (assign, nonatomic) NSInteger elementIndex;
@property (assign, nonatomic) CGRect elementFrame;
@property (strong, nonatomic) UIImageView *rightResize;
@property (strong, nonatomic) UIImageView *leftResize;

- (id)initWithFrame:(CGRect)frame withElementIndex:(NSInteger)elementIndex;
- (void)position;
@end
