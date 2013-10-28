//
//  WEPageTemplateManager.h
//  WebsterEditor
//
//  Created by pierre larochelle on 10/28/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface WEPageTemplateManager : NSObject
+(WEPageTemplateManager*)sharedManager;
-(NSArray*)templates;
@end
