//
//  WEPageController.m
//  WebsterEditor
//
//  Created by pierre larochelle on 2/5/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEPageManager.h"

static WEPageManager *gSharedManager;

@implementation WEPageManager
@synthesize bridge;

-(void)removeSelectedElement {
    NSLog(@"calling handler removeElementHandler");
    [bridge callHandler:@"removeElementHandler" data:[NSDictionary dictionaryWithObjectsAndKeys:@"hey", @"you", nil]];
}

+(WEPageManager*)sharedManager {
    if (gSharedManager == nil) {
        gSharedManager = [[WEPageManager alloc] init];
    }
    
    return gSharedManager;
}
@end
