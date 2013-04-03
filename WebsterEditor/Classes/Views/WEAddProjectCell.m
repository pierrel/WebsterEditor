//
//  WEAddProjectCell.m
//  WebsterEditor
//
//  Created by pierre larochelle on 3/31/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEAddProjectCell.h"

@implementation WEAddProjectCell

- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        CGRect innerFrame = CGRectMake(0.0, 0.0, frame.size.width, frame.size.height);
        UIView *topView = [[UIView alloc] initWithFrame:innerFrame];
        CGFloat red, green, blue, alpha;
        UIColor *backColor = [UIColor darkGrayColor];
        [backColor getRed:&red green:&green blue:&blue alpha:&alpha];
        topView.backgroundColor = [UIColor colorWithRed:red green:green blue:blue alpha:0.5];
        
        UILabel *label = [[UILabel alloc] initWithFrame:innerFrame];
        label.textAlignment = NSTextAlignmentCenter;
        label.textColor = [UIColor whiteColor];
        label.font = [UIFont boldSystemFontOfSize:20.0];
        label.backgroundColor = [UIColor clearColor];
        label.text = @"Add Project";
        
        [self.contentView setBackgroundColor:[UIColor clearColor]];
        [self.contentView addSubview:label];
        [self.contentView addSubview:topView];
    }
    return self;
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
