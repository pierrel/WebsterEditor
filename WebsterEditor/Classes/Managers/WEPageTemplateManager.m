//
//  WEPageTemplateManager.m
//  WebsterEditor
//
//  Created by pierre larochelle on 10/28/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEPageTemplateManager.h"

static WEPageTemplateManager *gSharedManager;

@interface WEPageTemplateManager()
@property (nonatomic, strong) NSArray *fileTemplates;
@end

@implementation WEPageTemplateManager
+(WEPageTemplateManager*)sharedManager {
    if (gSharedManager == nil) {
        gSharedManager = [[WEPageTemplateManager alloc] init];
    }
    
    return gSharedManager;
}

-(id)init {
    if (self = [super init]) {
        NSString* plistPath = [[NSBundle mainBundle] pathForResource:@"PageTemplates" ofType:@"plist"];
        self.fileTemplates = [NSArray arrayWithContentsOfFile:plistPath];
    }
    
    return self;
}

-(NSArray*)templates {
    return self.fileTemplates;
}
@end
