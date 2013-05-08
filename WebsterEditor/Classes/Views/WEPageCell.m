//
//  WEPageCell.m
//  WebsterEditor
//
//  Created by pierre larochelle on 5/7/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEPageCell.h"

@implementation WEPageCell

- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        UIView *something = [[UIView alloc] initWithFrame:frame];
        something.backgroundColor = [UIColor blackColor];
        something.autoresizingMask = UIViewAutoresizingFlexibleHeight | UIViewAutoresizingFlexibleWidth;
        [self addSubview:something];
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
