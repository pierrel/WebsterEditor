//
//  WEPageCell.m
//  WebsterEditor
//
//  Created by pierre larochelle on 5/7/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEPageCell.h"

@interface WEPageCell()
@property UITextField *pageNameField;
@end

@implementation WEPageCell
@synthesize pageNameField;

int const TEXT_HEIGHT = 20;

- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        UIView *something = [[UIView alloc] initWithFrame:frame];
        something.backgroundColor = [UIColor blackColor];
        something.autoresizingMask = UIViewAutoresizingFlexibleHeight | UIViewAutoresizingFlexibleWidth;
        [self addSubview:something];
        
        pageNameField = [[UITextField alloc] initWithFrame:CGRectMake(0,
                                                                     frame.size.height - TEXT_HEIGHT,
                                                                     frame.size.width,
                                                                     TEXT_HEIGHT)];
        [pageNameField setBackgroundColor:[UIColor clearColor]];
        [pageNameField setTextColor:[UIColor whiteColor]];
        [pageNameField setTextAlignment:NSTextAlignmentCenter];
        
        [self addSubview:pageNameField];
    }
    return self;
}

-(void)setName:(NSString *)name {
    [pageNameField setText:name];
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
