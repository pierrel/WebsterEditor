//
//  WEProjectSettings.m
//  WebsterEditor
//
//  Created by pierre larochelle on 4/1/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEProjectSettings.h"

@implementation WEProjectSettings
@synthesize bucket, title, lastExportURL, name;

NSString *const DEFAULT_NAME = @"New Project";

-(id)init {
    if (self = [super init]) {
        self.bucket = @"";
        self.title = @"";
        self.lastExportURL = @"";
        self.name = DEFAULT_NAME;
    }
    
    return self;
}

-(id)initWithCoder:(NSCoder *)decoder {
    if (self = [super init]) {
        self.bucket = [decoder decodeObjectForKey:@"bucket"];
        self.title = [decoder decodeObjectForKey:@"title"];
        self.lastExportURL = [decoder decodeObjectForKey:@"lastExportURL"];
        
        NSString *decodedName = [decoder decodeObjectForKey:@"name"];
        if (decodedName) self.name = decodedName;
        else self.name = DEFAULT_NAME;
    }
    
    return self;
}

-(void)encodeWithCoder:(NSCoder *)encoder {
    [encoder encodeObject:bucket forKey:@"bucket"];
    [encoder encodeObject:title forKey:@"title"];
    [encoder encodeObject:lastExportURL forKey:@"lastExportURL"];
    [encoder encodeObject:name forKey:@"name"];
}
@end
