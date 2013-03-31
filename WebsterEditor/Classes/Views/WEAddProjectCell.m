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
        UILabel *label = [[UILabel alloc] initWithFrame:CGRectMake(0.0, 0.0, frame.size.width, frame.size.height)];
        label.textAlignment = NSTextAlignmentCenter;
        label.textColor = [UIColor whiteColor];
        label.font = [UIFont boldSystemFontOfSize:20.0];
        label.backgroundColor = [UIColor grayColor];
        label.text = @"Add Project";
        
        [self.contentView addSubview:label];;
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
