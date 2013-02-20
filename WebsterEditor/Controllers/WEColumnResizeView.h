//
//  WEColumnResizeView.h
//  WebsterEditor
//
//  Created by pierre larochelle on 2/11/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "WEDialogViewController.h"

@class WEColumnResizeView;
@protocol WEResizeColumnDelegate <NSObject>
-(void)resizeView:(WEColumnResizeView*)resizeView incrementSpanAtColumnIndex:(NSInteger)columnIndex;
@end

@interface WEColumnResizeView : UIView
@property (assign, nonatomic) NSInteger elementIndex;
@property (assign, nonatomic) id<WEResizeColumnDelegate>delegate;
@property (strong, nonatomic) UIButton *rightResize;
@property (strong, nonatomic) UIButton *leftResize;

- (id)initWithFrame:(CGRect)frame withElementIndex:(NSInteger)elementIndex;
- (void)position;
- (void)resetFrame:(CGRect)newFrame;
@end


