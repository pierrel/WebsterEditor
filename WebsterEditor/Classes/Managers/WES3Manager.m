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
                                                    authRoleArn:[json objectForKey:@"authRoleArn"]
                                                  unauthRoleArn:[json objectForKey:@"unauthRoleArn"]];
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
            authRoleArn:(NSString*)authRoleArn
          unauthRoleArn:(NSString*)unauthRoleArn {
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
                                                          accountId:@""
                                                          identityPoolId:@""
                                                          unauthRoleArn:@""
                                                          authRoleArn:@""];
    
    // Store and sync?
//    AWSCognito *syncClient = [AWSCognito defaultCognito];
//    AWSCognitoDataset *dataset = [syncClient openOrCreateDataset:@"myDataset"];
//    [dataset setString:@"myValue" forKey:@"myKey"];
//    [dataset synchronize];
    
//    AWSServiceConfiguration *configuration = [AWSServiceConfiguration configurationWithRegion:AWSRegionUSEast1
//                                                                          credentialsProvider:credentialsProvider];
//    
//    [AWSServiceManager defaultServiceManager].defaultServiceConfiguration = configuration;    // Initialize the S3 Client
//    AWSServiceConfiguration *config  = [AWSServiceConfiguration configurationWithRegion:AWSRegionUSEast1
//                                                                    credentialsProvider:creds];
//    NSString *identityId = creds.identityId;
//    NSLog(@"\n\nidentity is %@\n\n", identityId);
//    
//    AWSSTS *sts = [[AWSSTS alloc] initWithConfiguration:config];
//    AWSSTSGetSessionTokenRequest *getToken = [[AWSSTSGetSessionTokenRequest alloc] init];
//    BFTask *task = [sts getSessionToken:getToken];
//    [task continueWithBlock:^id(BFTask *task) {
//        return [self doTheContinueThing:task];
//    }];
    
    
    // do something with the id
//    return [[AWSS3 alloc] initWithConfiguration:config];
    return [[AWSS3 alloc] init];
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

