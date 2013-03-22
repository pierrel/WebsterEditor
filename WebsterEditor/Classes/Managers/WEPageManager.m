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

-(void)addGalleryUnderSelectedElement {
    [bridge callHandler:@"addGalleryUnderSelectedElement" data:[NSDictionary dictionary]];
}

-(void)incrementSpanAtColumnIndex:(NSInteger)columnIndex withCallback:(WEResponseCallback)responseCallback {
    [bridge callHandler:@"incrementColumn"
                   data:[NSDictionary dictionaryWithObject:[NSString stringWithFormat:@"%i", columnIndex]
                                                    forKey:@"index"]
       responseCallback:^(id responseData) {
           return responseCallback(responseData);
       }];
}

-(void)decrementSpanAtColumnIndex:(NSInteger)columnIndex withCallback:(WEResponseCallback)responseCallback {
    [bridge callHandler:@"decrementColumn"
                   data:[NSDictionary dictionaryWithObject:[NSString stringWithFormat:@"%i", columnIndex]
                                                    forKey:@"index"]
       responseCallback:^(id responseData) {
           return responseCallback(responseData);
       }];
}


-(void)incrementOffsetAtColumnIndex:(NSInteger)columnIndex withCallback:(WEResponseCallback)responseCallback {
    [bridge callHandler:@"incrementColumnOffset"
                   data:[NSDictionary dictionaryWithObject:[NSString stringWithFormat:@"%i", columnIndex]
                                                    forKey:@"index"]
       responseCallback:^(id responseData) {
           return responseCallback(responseData);
       }];
}

-(void)decrementOffsetAtColumnIndex:(NSInteger)columnIndex withCallback:(WEResponseCallback)responseCallback {
    [bridge callHandler:@"decrementColumnOffset"
                   data:[NSDictionary dictionaryWithObject:[NSString stringWithFormat:@"%i", columnIndex]
                                                    forKey:@"index"]
       responseCallback:^(id responseData) {
           return responseCallback(responseData);
       }];
}

-(void)setBackgroundImageToPath:(NSString *)path {
    [bridge callHandler:@"setBackgroundImage"
                   data:[NSDictionary dictionaryWithObject:path forKey:@"path"]];
}

-(void)removeBackgroundImage {
    [bridge callHandler:@"removeBackgroundImage"
                   data:[NSDictionary dictionary]];
}

-(void)hasBackgroundWithCallback:(WEResponseCallback)callback {
    [bridge callHandler:@"hasBackgroundImage"
                   data:[NSDictionary dictionary]
       responseCallback:^(id responseData) {
           return callback(responseData);
    }];
}

+(WEPageManager*)sharedManager {
    if (gSharedManager == nil) {
        gSharedManager = [[WEPageManager alloc] init];
    }
    
    return gSharedManager;
}
@end
