//
//  WEUtils.h
//  WebsterEditor
//
//  Created by pierre larochelle on 3/12/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface WEUtils : NSObject
+ (NSString*)html;
+ (CGRect)frameFromData:(id)data;
+ (NSString *)pathInDocumentDirectory:(NSString *)filename;
+ (NSURL *)applicationDocumentsDirectory;
+ (NSString*)newId;
+ (NSString*)pathInDocumentDirectory:(NSString *)filename withProjectId:(NSString*)projectId;
+ (id)getObjectInDictionary:(NSDictionary*)dict withPath:(NSString *)firstString, ...
NS_REQUIRES_NIL_TERMINATION;
+(UIImage*)tintedImageNamed:(NSString*)filename;
@end
