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
               withProjectId:(NSString *)projectId
                   withPages:(NSArray *)pages
                    withLibs:(NSArray *)libs
                   withMedia:(NSArray *)media {
    return [[[[self bucketExists:bucketName] continueWithSuccessBlock:^id(BFTask *task) {
        if (task.result) { // has a bucket
            // TODO: check region before deleting to see if we can access it
            return [self deleteEverythingInBucket:task.result];
        } else {
            return [self createBucketNamed:bucketName];
        }
    }] continueWithSuccessBlock:^id(BFTask *task) {
        return [self fixBucketCredentials:task.result];
    }] continueWithSuccessBlock:^id(BFTask *task) {
        return [self sendPages:pages withProjectId:projectId];
    }];
    
//    // save the bucket url
//    self.settings.lastExportURL = [NSString stringWithFormat:@"http://%@.%@", bucket, webSuffix];
//    
//    return [[BFTask alloc] init];
}

-(BFTask*)sendPages:(NSArray*)pages toBucket:(AWSS3Bucket*)bucket withProjectId:(NSString*)projectId {
    //    //html
    //    for (NSString *pagePath in [self.pageCollectionController pages]) {
    //        NSString *prodPage = [pagePath stringByReplacingOccurrencesOfString:@".html" withString:@"_prod.html"];
    //        NSString *fullPagePath = [WEUtils pathInDocumentDirectory:prodPage withProjectId:self.projectId];
    //        NSString *html = [NSString stringWithContentsOfFile:fullPagePath
    //                                                   encoding:NSUTF8StringEncoding
    //                                                      error:&error];
    //        NSData *htmlData = [html dataUsingEncoding:NSUTF8StringEncoding];
    //        put = [[S3PutObjectRequest alloc] initWithKey:pagePath inBucket:bucket];
    //        put.contentType = @"text/html";
    //        put.data = htmlData;
    //        put.cannedACL = acl;
    //        S3PutObjectResponse *resp = [s3 putObject:put];
    //        if (resp.error != nil) NSLog(@"Error writing html: %@", resp.error);
    //    }

    NSError *error;
    AWSS3TransferManagerUploadRequest *transfer = [AWSS3TransferManagerUploadRequest new];
    transfer.bucket = bucket.name;
    for (NSString *pagePath in pages) {
        NSString *prodPage = [pagePath stringByReplacingOccurrencesOfString:@".html" withString:@"_prod.html"];
        NSString *fullPagePath = [WEUtils pathInDocumentDirectory:prodPage withProjectId:projectId];
        NSURL *fileUrl = [NSURL fileURLWithPath:fullPagePath];
        AWSS3TransferManager *transferManager = [AWSS3TransferManager new];
        NSString *html = [NSString stringWithContentsOfFile:filePath encoding:NSUTF8StringEncoding error:&error];
        NSData *htmlData = [html dataUsingEncoding:NSUTF8StringEncoding];
        AWSS3PutObjectRequest *put = [AWSS3PutObjectRequest new];
//        put.bo
    }
}

-(BFTask*)sendLibs:(NSArray*)libs withProjectId:(NSString*)projectId {
    //    // js/css
    //    NSArray *filePaths = [NSArray arrayWithObjects:
    //                          @"js/jquery-1.9.0.min.js",
    //                          @"js/bootstrap.min.js",
    //                          @"js/bootstrap-lightbox.js",
    //                          @"css/override.css",
    //                          @"css/bootstrap.min.css",
    //                          @"css/bootstrap-responsive.min.css",
    //                          nil];
    //    for (NSString *filePath in filePaths) {
    //        NSString *fullPath = [WEUtils pathInDocumentDirectory:filePath withProjectId:self.projectId];
    //        NSData *fileData = [NSData dataWithContentsOfFile:fullPath];
    //        NSLog(@"adding %@", filePath);
    //        put = [[S3PutObjectRequest alloc] initWithKey:filePath inBucket:bucket];
    //        if ([filePath hasSuffix:@".css"]) put.contentType = @"text/css";
    //        else put.contentType = @"text/javascript";
    //        put.data = fileData;
    //        put.cannedACL = acl;
    //        S3PutObjectResponse *resp = [s3 putObject:put];
    //        if (resp.error != nil) NSLog(@"ERROR in JS or CSS: %@", resp.error);
    //    }

    return nil;
}

-(BFTask*)sendMedia:(NSArray*)media withProjectId:(NSString*)projectId {
    //    // media
    //    NSString *pathPrefix = @"media";
    //    NSFileManager *fileManager = [NSFileManager defaultManager];
    //    NSString *mediaPath = [WEUtils pathInDocumentDirectory:pathPrefix
    //                                             withProjectId:self.projectId];
    //    for (NSString *file in [fileManager contentsOfDirectoryAtPath:mediaPath error:&error]) {
    //        NSString *s3FileKey = [NSString stringWithFormat:@"%@/%@", pathPrefix, file];
    //        NSString *fullPath = [WEUtils pathInDocumentDirectory:s3FileKey withProjectId:self.projectId];
    //        NSLog(@"file: %@", fullPath);
    //        NSData *fileData = [NSData dataWithContentsOfFile:fullPath];
    //        put = [[S3PutObjectRequest alloc] initWithKey:s3FileKey inBucket:bucket];
    //        put.contentType = @"image/jpeg";
    //        put.data = fileData;
    //        put.cannedACL = acl;
    //        S3PutObjectResponse *resp = [s3 putObject:put];
    //        if (resp.error != nil) NSLog(@"ERROR: %@", resp.error);
    //    }

    return nil;
}

-(BFTask*)bucketExists:(NSString*)bucketName {
    AWSRequest *req = [[AWSRequest alloc] init];
    return [[self.s3 listBuckets:req] continueWithSuccessBlock:^id(BFTask *task) {
        AWSS3ListBucketsOutput *output = task.result;
        
        for (AWSS3Bucket *bucket in output.buckets) {
            if ([bucket.name isEqualToString:bucketName]) {
                return bucket;
            }
        }

        return nil;
    }];
}

-(BFTask*)deleteEverythingInBucket:(AWSS3Bucket*)bucket {
    AWSS3ListObjectsRequest *listObjectsRequest = [[AWSS3ListObjectsRequest alloc] init];
    listObjectsRequest.bucket = bucket.name;
    return [[self.s3 listObjects:listObjectsRequest] continueWithSuccessBlock:^id(BFTask *task) {
        AWSS3ListObjectsOutput *output = task.result;

        for (AWSS3Object *s3Object in output.contents) {
            AWSS3DeleteObjectRequest *deleteRequest = [[AWSS3DeleteObjectRequest alloc] init];
            deleteRequest.bucket = bucket.name;
            deleteRequest.key = s3Object.key;
            [[self.s3 deleteObject:deleteRequest] waitUntilFinished];
        }
        
        return bucket;
    }];
}

-(BFTask*)createBucketNamed:(NSString*)bucketName {
    AWSS3CreateBucketRequest *createRequest = [AWSS3CreateBucketRequest new];
    createRequest.ACL = AWSS3BucketCannedACLPublicRead;
    createRequest.bucket = bucketName;
    
    return [[self.s3 createBucket:createRequest] continueWithSuccessBlock:^id(BFTask *task) {
        AWSS3Bucket *bucket = [AWSS3Bucket new];
        bucket.name = bucketName;
        bucket.creationDate = [NSDate dateWithTimeIntervalSinceNow:0];
        
        return bucket;
    }];
}

-(BFTask*)fixBucketCredentials:(AWSS3Bucket*)bucket {
    // make it a website
    AWSS3IndexDocument *indexDoc = [[AWSS3IndexDocument alloc] init];
    indexDoc.suffix = @"index.html";
    AWSS3WebsiteConfiguration *bucketConfig = [[AWSS3WebsiteConfiguration alloc] init];
    bucketConfig.indexDocument= indexDoc;
    AWSS3PutBucketWebsiteRequest *req = [[AWSS3PutBucketWebsiteRequest alloc] init];
    req.bucket = bucket.name;
    req.websiteConfiguration = bucketConfig;
    
    return [[[self.s3 putBucketWebsite:req] continueWithSuccessBlock:^id(BFTask *task) {
        AWSS3PutBucketAclRequest *aclRequest = [[AWSS3PutBucketAclRequest alloc] init];
        aclRequest.ACL = AWSS3ObjectCannedACLPublicRead;
        aclRequest.bucket = bucket.name;
        
        return [self.s3 putBucketAcl:aclRequest];
    }] continueWithSuccessBlock:^id(BFTask *task) {
        return bucket;
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

