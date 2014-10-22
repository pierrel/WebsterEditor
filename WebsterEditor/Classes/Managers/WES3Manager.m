//
//  WES3Manager.m
//  WebsterEditor
//
//  Created by pierre larochelle on 10/2/14.
//  Copyright (c) 2014 pierre larochelle. All rights reserved.
//

#import "WES3Manager.h"

static WES3Manager *gSharedManager;

@interface WES3Manager()
@property (nonatomic, strong) NSString *accountId;
@property (nonatomic, strong) NSString *identityPoolId;
@property (nonatomic, strong) NSString *unauthRoleArn;
@property (nonatomic, strong) NSString *authRoleArn;
@end


@implementation WES3Manager


+(WES3Manager*)sharedManager {
    if (gSharedManager == nil) {
        // set up the creds
        NSDictionary *json = [WES3Manager readConfig];

        gSharedManager = [[WES3Manager alloc] initWithAccountId:[json objectForKey:@"accountId"]
                                                 identityPoolId:[json objectForKey:@"identityPoolId"]
                                                  unauthRoleArn:[json objectForKey:@"unauthRoleArn"]
                                                    authRoleArn:[json objectForKey:@"authRoleArn"]];
    }
    
    return gSharedManager;
}

+(NSDictionary*)readConfig {
    NSString *filePath = [[NSBundle mainBundle] pathForResource:@"config" ofType:@"json"];
    NSData *data = [NSData dataWithContentsOfFile:filePath];
    NSError *error;
    NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data options:kNilOptions error:&error];
    
    return json;
}

-(id) initWithAccountId:(NSString*)accountId
         identityPoolId:(NSString*)identityPoolId
          unauthRoleArn:(NSString*)unauthRoleArn
            authRoleArn:(NSString*)authRoleArn {
    if (self = [super init]) {
        self.accountId = accountId;
        self.identityPoolId = identityPoolId;
        self.authRoleArn = authRoleArn;
        self.unauthRoleArn = unauthRoleArn;
    }
    
    return self;
}

-(AWSS3*)getS3 {
    // region info
    AWSCognitoCredentialsProvider *credentialsProvider = [AWSCognitoCredentialsProvider
                                                          credentialsWithRegionType:AWSRegionUSEast1
                                                          accountId:self.accountId
                                                          identityPoolId:self.identityPoolId
                                                          unauthRoleArn:self.unauthRoleArn
                                                          authRoleArn:self.authRoleArn];
    
    AWSServiceConfiguration *configuration = [AWSServiceConfiguration configurationWithRegion:AWSRegionUSEast1
                                                                          credentialsProvider:credentialsProvider];

    [AWSServiceManager defaultServiceManager].defaultServiceConfiguration = configuration;
    
    // do something with the id
    AWSS3 *s3 = [[AWSS3 alloc] initWithConfiguration:configuration];
    return s3;
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

