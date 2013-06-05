//
//  WEPageBackgroundView.m
//  WebsterEditor
//
//  Created by pierre larochelle on 6/4/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//
#import <QuartzCore/QuartzCore.h>
#import "WEPageBackgroundView.h"

@interface WEPageBackgroundView() {
    UIColor *color;
}

@end

@implementation WEPageBackgroundView

- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        color = [UIColor whiteColor];
    }
    return self;
}

-(void)layoutSubviews {
    self.layer.shadowColor = [color CGColor];
    self.layer.shadowRadius = 20.0f;
    self.layer.shadowOpacity = 0.9;
    self.layer.shadowOffset = CGSizeZero;
    self.layer.masksToBounds = NO;
    self.backgroundColor = [UIColor whiteColor];
}

-(void)setColor:(UIColor*)newColor {
    color = newColor;
    [self setNeedsLayout];
}

/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect
{
    // Drawing code
}
*/

@end
