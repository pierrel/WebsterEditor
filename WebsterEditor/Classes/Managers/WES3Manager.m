//
//  WES3Manager.m
//  WebsterEditor
//
//  Created by pierre larochelle on 10/2/14.
//  Copyright (c) 2014 pierre larochelle. All rights reserved.
//

#import "WES3Manager.h"

static WES3Manager *gSharedManager;

@implementation WES3Manager

+(WES3Manager*)sharedManager {
    if (gSharedManager == nil) {
        gSharedManager = [[WES3Manager alloc] init];
    }
    
    return gSharedManager;
}

-(AWSS3*)getS3 {
    // region info
    AWSCognitoCredentialsProvider *creds = [AWSCognitoCredentialsProvider
                                            credentialsWithRegionType:AWSRegionUSEast1
                                            accountId:@"accountId"
                                            identityPoolId:@"pool"
                                            unauthRoleArn:@"auth"
                                            authRoleArn:@"unauth"];
    // Initialize the S3 Client
    AWSServiceConfiguration *config  = [AWSServiceConfiguration configurationWithRegion:AWSRegionUSEast1
                                                                    credentialsProvider:creds];
    NSString *identityId = creds.identityId;
    NSLog(@"\n\nidentity is %@\n\n", identityId);
    
    AWSSTS *sts = [[AWSSTS alloc] initWithConfiguration:config];
    AWSSTSGetSessionTokenRequest *getToken = [[AWSSTSGetSessionTokenRequest alloc] init];
    BFTask *task = [sts getSessionToken:getToken];
    [task continueWithBlock:^id(BFTask *task) {
        return [self doTheContinueThing:task];
    }];
    
    
    // do something with the id
    return [[AWSS3 alloc] initWithConfiguration:config];
}

-(id)doTheContinueThing:(BFTask*)task {
    if (task.isCancelled) {
        NSLog(@"CANCELLED?");
    } else if (task.error) {
        NSLog(@"ERROR?");
    } else {
        NSLog(@"All good?");
    }
    return nil;
}

@end

