//
//  WEPageThumbGenerator.h
//  WebsterEditor
//
//  Created by pierre larochelle on 10/23/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface WEPageThumbGenerator : NSObject<UIWebViewDelegate>
-(void)generateThumbForPage:(NSString *)pagePath atLocations:(NSArray *)thumbLocations;
@end
