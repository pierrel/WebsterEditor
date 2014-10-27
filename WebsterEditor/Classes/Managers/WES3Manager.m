//
//  WES3Manager.m
//  WebsterEditor
//
//  Created by pierre larochelle on 10/2/14.
//  Copyright (c) 2014 pierre larochelle. All rights reserved.
//

#import "WES3Manager.h"
#import <AWSiOSSDKv2/S3.h>

static WES3Manager *gSharedManager;

@interface WES3Manager()
@property (nonatomic, strong) NSString *accountId;
@property (nonatomic, strong) NSString *identityPoolId;
@property (nonatomic, strong) NSString *unauthRoleArn;
@property (nonatomic, strong) NSString *authRoleArn;
@property (nonatomic, strong, getter=getS3) AWSS3 *s3;
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

-(BFTask*)prepareBucketNamed:(NSString *)bucketName
               withPagesKeys:(NSDictionary *)pages
                withLibsKeys:(NSDictionary *)libs
               withMediaKeys:(NSDictionary *)media {
    return [[[[[self bucketExists:bucketName] continueWithSuccessBlock:^id(BFTask *task) {
        if (task.result) { // has a bucket
            // TODO: check region before deleting to see if we can access it
            return [self deleteEverythingInBucket:task.result];
        } else {
            return [self createBucketNamed:bucketName];
        }
    }] continueWithSuccessBlock:^id(BFTask *task) {
        return [self fixBucketCredentials:task.result];
    }] continueWithSuccessBlock:^id(BFTask *task) {
        BFTask *pagesTask = [self sendPages:pages toBucket:bucketName];
        BFTask *mediaTask = [self sendPages:media toBucket:bucketName];
        BFTask *libsTask = [self sendPages:libs toBucket:bucketName];
        
        return [BFTask taskForCompletionOfAllTasks:@[pagesTask, mediaTask, libsTask]];
    }] continueWithSuccessBlock:^id(BFTask *task) {
        return [NSString stringWithFormat:@"http://%@.s3-website-us-east-1.amazonaws.com", bucketName];
    }];
}

-(BFTask*)sendPages:(NSDictionary*)pages toBucket:(NSString*)bucketName {
    NSMutableArray *tasks = [NSMutableArray new];
    AWSS3TransferManager *transferManager = [AWSS3TransferManager defaultS3TransferManager];
    AWSS3TransferManagerUploadRequest *transfer = [AWSS3TransferManagerUploadRequest new];
    transfer.bucket = bucketName;
    transfer.ACL = AWSS3BucketCannedACLPublicRead;
    for (NSString *pageKey in [pages allKeys]) {
        NSString *pageFilePath = [pages objectForKey:pageKey];
        NSURL *pageFileURL = [NSURL fileURLWithPath:pageFilePath];
        transfer.key = pageKey;
        transfer.body = pageFileURL;
        transfer.contentType = [self contentTypeOf:pageKey];
        [tasks addObject:[transferManager upload:transfer]];
    }
    
    return [BFTask taskForCompletionOfAllTasks:tasks];
}

-(NSString*)contentTypeOf:(NSString*)fileKey {
    NSString *ext = [fileKey pathExtension];
    if ([ext isEqualToString:@"css"] || [ext isEqualToString:@"html"] || [ext isEqualToString:@"js"]) {
        return [NSString stringWithFormat:@"text/%@", ext];
    } else {
        return @"binary/octet-stream";
    }
}

-(BFTask*)bucketExists:(NSString*)bucketName {
    AWSRequest *req = [[AWSRequest alloc] init];
    return [[self.s3 listBuckets:req] continueWithSuccessBlock:^id(BFTask *task) {
        AWSS3ListBucketsOutput *output = task.result;
        
        for (AWSS3Bucket *bucket in output.buckets) {
            if ([bucket.name isEqualToString:bucketName]) {
                return bucketName;
            }
        }

        return nil;
    }];
}

-(BFTask*)deleteEverythingInBucket:(NSString*)bucketName {
    AWSS3ListObjectsRequest *listObjectsRequest = [[AWSS3ListObjectsRequest alloc] init];
    listObjectsRequest.bucket = bucketName;
    return [[self.s3 listObjects:listObjectsRequest] continueWithSuccessBlock:^id(BFTask *task) {
        AWSS3ListObjectsOutput *output = task.result;

        for (AWSS3Object *s3Object in output.contents) {
            AWSS3DeleteObjectRequest *deleteRequest = [[AWSS3DeleteObjectRequest alloc] init];
            deleteRequest.bucket = bucketName;
            deleteRequest.key = s3Object.key;
            [[self.s3 deleteObject:deleteRequest] waitUntilFinished];
        }
        
        return bucketName;
    }];
}

-(BFTask*)createBucketNamed:(NSString*)bucketName {
    AWSS3CreateBucketRequest *createRequest = [AWSS3CreateBucketRequest new];
    createRequest.ACL = AWSS3BucketCannedACLPublicRead;
    createRequest.bucket = bucketName;
    
    return [[self.s3 createBucket:createRequest] continueWithSuccessBlock:^id(BFTask *task) {
        return bucketName;
    }];
}

-(BFTask*)fixBucketCredentials:(NSString*)bucketName {
    // make it a website
    AWSS3IndexDocument *indexDoc = [[AWSS3IndexDocument alloc] init];
    indexDoc.suffix = @"index.html";
    AWSS3WebsiteConfiguration *bucketConfig = [[AWSS3WebsiteConfiguration alloc] init];
    bucketConfig.indexDocument= indexDoc;
    AWSS3PutBucketWebsiteRequest *req = [[AWSS3PutBucketWebsiteRequest alloc] init];
    req.bucket = bucketName;
    req.websiteConfiguration = bucketConfig;
    
    return [[[self.s3 putBucketWebsite:req] continueWithSuccessBlock:^id(BFTask *task) {
        AWSS3PutBucketAclRequest *aclRequest = [[AWSS3PutBucketAclRequest alloc] init];
        aclRequest.ACL = AWSS3ObjectCannedACLPublicRead;
        aclRequest.bucket = bucketName;
        
        return [self.s3 putBucketAcl:aclRequest];
    }] continueWithSuccessBlock:^id(BFTask *task) {
        return bucketName;
    }];
}

-(AWSS3*)getS3 {
    if (!_s3) {
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
        self.s3 = [[AWSS3 alloc] initWithConfiguration:configuration];
    }
    
    return _s3;
}

@end

