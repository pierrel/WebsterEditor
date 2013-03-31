//
//  WEUtils.h
//  WebsterEditor
//
//  Created by pierre larochelle on 3/12/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface WEUtils : NSObject
+ (NSString*)html;
+ (CGRect)frameFromData:(id)data;
+ (NSString *)pathInDocumentDirectory:(NSString *)filename;
+ (NSURL *)applicationDocumentsDirectory;
+ (NSString*)newId;
+ (NSString*)pathInDocumentDirectory:(NSString *)filename withProjectId:(NSString*)projectId;
@end
