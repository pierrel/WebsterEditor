//
//  WEProjectSettings.m
//  WebsterEditor
//
//  Created by pierre larochelle on 4/1/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEProjectSettings.h"

@implementation WEProjectSettings
@synthesize bucket, title, lastExportURL;

-(id)init {
    if (self = [super init]) {
        self.bucket = @"";
        self.title = @"";
        self.lastExportURL = @"";
    }
    
    return self;
}

-(id)initWithCoder:(NSCoder *)decoder {
    if (self = [super init]) {
        self.bucket = [decoder decodeObjectForKey:@"bucket"];
        self.title = [decoder decodeObjectForKey:@"title"];
        self.lastExportURL = [decoder decodeObjectForKey:@"lastExportURL"];
    }
    
    return self;
}

-(void)encodeWithCoder:(NSCoder *)encoder {
    [encoder encodeObject:bucket forKey:@"bucket"];
    [encoder encodeObject:title forKey:@"title"];
    [encoder encodeObject:lastExportURL forKey:@"lastExportURL"];
}
@end
