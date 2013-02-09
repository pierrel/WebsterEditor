//
//  WEPageController.h
//  WebsterEditor
//
//  Created by pierre larochelle on 2/5/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "WebViewJavascriptBridge.h"

@interface WEPageManager : NSObject
@property (strong, nonatomic) WebViewJavascriptBridge *bridge;

-(void)removeSelectedElement;
-(void)editSelectedElement;

+(WEPageManager *)sharedManager;
@end
