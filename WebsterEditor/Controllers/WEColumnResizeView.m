//
//  WEColumnResizeView.m
//  WebsterEditor
//
//  Created by pierre larochelle on 2/11/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEColumnResizeView.h"

static const int ICON_DIM = 13;

@implementation WEColumnResizeView
@synthesize rightResize, leftResize;

- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        rightResize = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"icon_blue.png"]];
        leftResize = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"icon_blue.png"]];
        
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

-(void)positionAndSetElementFrame:(CGRect)elementFrame {
    self.elementFrame = elementFrame;
    [self position];
}

-(void)position {
    CGFloat halfDim = ICON_DIM/2;
    CGFloat leftX = self.elementFrame.origin.x - halfDim;
    CGFloat leftY = self.elementFrame.origin.y + (self.elementFrame.size.height/2) - halfDim;
    CGFloat rightX = leftX + self.elementFrame.size.width;
    CGFloat rightY = leftY;
    
    [rightResize setFrame:CGRectMake(rightX,
                                     rightY,
                                     ICON_DIM,
                                      ICON_DIM)];
    [leftResize setFrame:CGRectMake(leftX,
                                    leftY,
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
