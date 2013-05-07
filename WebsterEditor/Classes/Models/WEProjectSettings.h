//
//  WEProjectSettings.h
//  WebsterEditor
//
//  Created by pierre larochelle on 4/1/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import <Foundation/Foundation.h>

FOUNDATION_EXPORT NSString *const DEFAULT_NAME;

@interface WEProjectSettings : NSObject<NSCoding>
@property (nonatomic, strong) NSString *name;
@property (nonatomic, strong) NSString *bucket;
@property (nonatomic, strong) NSString *title;
@property (nonatomic, strong) NSString *lastExportURL;
@end
