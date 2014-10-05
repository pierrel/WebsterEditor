//
//  WEOperation.m
//  WebsterEditor
//
//  Created by pierre larochelle on 11/6/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEOperation.h"

@interface WEOperation()
@property (nonatomic, assign) BOOL executing;
@property (nonatomic, assign) BOOL canceled;
@property (nonatomic, assign) BOOL finished;
@end

@implementation WEOperation
-(id)init {
    if (self = [super init]) {
        self.executing = NO;
        self.canceled = NO;
        self.finished = NO;
    }
    
    return self;
}

-(BOOL)isConcurrent {
    return YES;
}

-(BOOL)isExecuting {
    return self.executing;
}

-(BOOL)isCancelled {
    return self.canceled;
}

-(BOOL)isFinished {
    return self.finished;
}
@end
