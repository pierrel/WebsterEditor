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
    [bridge callHandler:@"removeElementHandler" data:[NSDictionary dictionary]];
}

-(void)editSelectedElement {
    [bridge callHandler:@"editElementHandler" data:[NSDictionary dictionary]];
}

-(void)addRowUnderSelectedElement {
    [bridge callHandler:@"addRowUnderSelectedElement" data:[NSDictionary dictionary]];
}

-(void)incrementSpanAtColumnIndex:(NSInteger)columnIndex withCallback:(WEResponseCallback)responseCallback {
    [bridge callHandler:@"incrementColumn"
                   data:[NSDictionary dictionaryWithObject:[NSString stringWithFormat:@"%i", columnIndex]
                                                    forKey:@"index"]
       responseCallback:^(id responseData) {
           return responseCallback(responseData);
       }];
}


+(WEPageManager*)sharedManager {
    if (gSharedManager == nil) {
        gSharedManager = [[WEPageManager alloc] init];
    }
    
    return gSharedManager;
}
@end
