//
//  WEColumnResizeView.m
//  WebsterEditor
//
//  Created by pierre larochelle on 2/11/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

static const int ICON_DIM = 13;

#import "WEColumnResizeView.h"

@interface WEColumnResizeView ()
@property (assign, nonatomic) CGFloat touchOriginX;
@property (assign, nonatomic) CGFloat handleOriginX;
@property (assign, nonatomic) BOOL changeRequestSent;
@property (strong, nonatomic) UIButton *movingHandle;

-(void)longPressed:(UILongPressGestureRecognizer*)recognizer;
@end


@implementation WEColumnResizeView
@synthesize rightResize, leftResize, movingHandle;
@synthesize delegate;

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
        
        UILongPressGestureRecognizer *rightLongPress = [[UILongPressGestureRecognizer alloc] initWithTarget:self action:@selector(longPressed:)];
        UILongPressGestureRecognizer *leftLongPress = [[UILongPressGestureRecognizer alloc] initWithTarget:self action:@selector(longPressed:)];
        [rightLongPress setMinimumPressDuration:0.2];
        [leftLongPress setMinimumPressDuration:0.2];
        [rightResize addGestureRecognizer:rightLongPress];
        [leftResize addGestureRecognizer:leftLongPress];

        self.changeRequestSent = NO;
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

- (void)resetFrame:(CGRect)newFrame {
    self.frame = newFrame;
    if (movingHandle) {
        if (movingHandle == rightResize) {
            self.touchOriginX = newFrame.size.width - ICON_DIM;
        } else {
            self.touchOriginX = 0;
        }
        self.handleOriginX = self.touchOriginX;
    } else {
        [self position];
    }
    self.changeRequestSent = NO;
}

-(void)longPressed:(UILongPressGestureRecognizer *)recognizer {
    if (recognizer.state == UIGestureRecognizerStateBegan) {
        if (recognizer.view == rightResize) {
            movingHandle = rightResize;
        } else {
            movingHandle = leftResize;
        }
                
        // record where the touch is
        self.touchOriginX = [recognizer locationInView:self].x;
        self.handleOriginX = movingHandle.frame.origin.x;
    } else if (recognizer.state == UIGestureRecognizerStateChanged && movingHandle) {
        CGPoint currentLocation = [recognizer locationInView:self];
        CGFloat delta = currentLocation.x - self.touchOriginX;
        
        movingHandle.frame = CGRectMake(self.handleOriginX + delta,
                                        movingHandle.frame.origin.y,
                                        movingHandle.frame.size.width,
                                        movingHandle.frame.size.height);
        
        if (delta > 60 && delegate && !self.changeRequestSent) {
            self.changeRequestSent = YES;
            [delegate resizeView:self incrementSpanAtColumnIndex:self.elementIndex];
        }
    } else if (recognizer.state == UIGestureRecognizerStateEnded) {
        [UIView animateWithDuration:0.3 animations:^{
            movingHandle.frame = CGRectMake(self.handleOriginX,
                                            movingHandle.frame.origin.y,
                                            movingHandle.frame.size.width,
                                            movingHandle.frame.size.height);
        } completion:^(BOOL finished) {
            movingHandle = nil;
        }];
    } else {
        movingHandle = nil;
        NSLog(@"whatttt?");
    }
}
@end
