//
//  WEColumnResizeView.m
//  WebsterEditor
//
//  Created by pierre larochelle on 2/11/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

static const int ICON_DIM = 13;

@implementation WEColumnResizeView
@synthesize rightResize, leftResize;

- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        rightResize = [[UIButton alloc] init];
        [rightResize setBackgroundImage:[UIImage imageNamed:@"icon_blue.png"] forState:UIControlStateNormal];
        leftResize = [[UIButton alloc] init];
        [leftResize setBackgroundImage:[UIImage imageNamed:@"icon_blue.png"] forState:UIControlStateNormal];
        
        [self addSubview:rightResize];
        [self addSubview:leftResize];
    }
    return self;
}

- (id)initWithFrame:(CGRect)frame withElementIndex:(NSInteger)elementIndex {
    self = [self initWithFrame:frame];
    if (self) {
        self.elementIndex = elementIndex;
}
    return self;
}

-(void)position {
    CGFloat y = (self.frame.size.height/2) - (ICON_DIM/2);
    [rightResize setFrame:CGRectMake(self.frame.size.width - ICON_DIM,
                                     y,
                                     ICON_DIM,
                                     ICON_DIM)];
    [leftResize setFrame:CGRectMake(0,
                                    y,
                                    ICON_DIM,
                                    ICON_DIM)];
    [self setNeedsDisplay];
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
