//
//  WEAddPageCell.m
//  WebsterEditor
//
//  Created by pierre larochelle on 5/8/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEAddPageCell.h"

@implementation WEAddPageCell

- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        UIImageView *plusButton = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"add.png"]];
        [plusButton setContentMode:UIViewContentModeCenter];
        [plusButton setFrame:CGRectMake(0, 0, frame.size.width, frame.size.height)];
        
        [self.contentView addSubview:plusButton];
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
