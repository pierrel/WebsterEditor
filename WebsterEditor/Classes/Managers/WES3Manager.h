//
//  WES3Manager.h
//  WebsterEditor
//
//  Created by pierre larochelle on 10/2/14.
//  Copyright (c) 2014 pierre larochelle. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <AWSiOSSDKv2/AWSCore.h>
#import <AWSiOSSDKv2/CognitoIdentity.h>
#import <AWSiOSSDKv2/STS.h>
#import <AWSiOSSDKv2/AWSS3.h>

@interface WES3Manager : NSObject
+(WES3Manager*)sharedManager;
-(AWSS3*)getS3;
@end
