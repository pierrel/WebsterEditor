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
@property (nonatomic, strong) AWSS3 *s3;
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

-(BFTask*)prepareBucketNamed:(NSString*)bucketName {
    return [[self listAndDeleteOrCreateBucketNamed:bucketName] continueWithBlock:^id(BFTask *task) {
        NSLog(@"done list with the thing");
        return nil;
    }];
    
//    BucketWebsiteConfiguration *bucketConfig = [[BucketWebsiteConfiguration alloc] initWithIndexDocumentSuffix:@"index.html"];
//    S3SetBucketWebsiteConfigurationRequest *configReq = [[S3SetBucketWebsiteConfigurationRequest alloc] initWithBucketName:bucket withConfiguration:bucketConfig];
//    S3SetBucketWebsiteConfigurationResponse *bucketWebResp = [s3 setBucketWebsiteConfiguration:configReq];
//    if (bucketWebResp.error != nil) NSLog(@"Error setting website config: %@", bucketWebResp.error);
//    
//    S3CannedACL *acl = [S3CannedACL publicRead];
//    S3PutObjectRequest *put;
//    
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
//    
//    
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
//    
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
//    
//    // save the bucket url
//    self.settings.lastExportURL = [NSString stringWithFormat:@"http://%@.%@", bucket, webSuffix];
//    
//    return [[BFTask alloc] init];
}

-(BFTask*)listAndDeleteOrCreateBucketNamed:(NSString*)bucketName {
    AWSS3 *s3 = [self getS3];
    AWSRequest *req = [[AWSRequest alloc] init];
    // see if we have the bucket
    return [[s3 listBuckets:req] continueWithBlock:^id(BFTask *task) {
        if (task.error) {
            NSLog(@"Error listing buckets: %@", task.error);
        } else if (task.completed) {
            AWSS3ListBucketsOutput *output = task.result;
            
            for (AWSS3Bucket *bucket in output.buckets) {
                if ([bucket.name isEqualToString:bucketName]) {
                    return [self deleteEverythingInBucket:bucket];
                }
            }
            return [self createBucketNamed:bucketName];
        } else {
            NSLog(@"Problem listing buckets");
        }
        
        return nil;
    }];
}

-(BFTask*)deleteEverythingInBucket:(AWSS3Bucket*)bucket {
    AWSS3 *s3 = [self getS3];
    AWSS3ListObjectsRequest *listObjectsRequest = [[AWSS3ListObjectsRequest alloc] init];
    listObjectsRequest.bucket = bucket.name;
    return [[s3 listObjects:listObjectsRequest] continueWithBlock:^id(BFTask *task) {
        if (task.error) {
            NSLog(@"Error listing object in %@: %@", bucket.name, task.error);
        } else if (task.completed) {
            
            AWSS3ListObjectsOutput *output = task.result;
            for (AWSS3Object *s3Object in output.contents) {
                NSLog(@"did it!");
                AWSS3DeleteObjectRequest *deleteRequest = [[AWSS3DeleteObjectRequest alloc] init];
                deleteRequest.bucket = bucket.name;
                deleteRequest.key = s3Object.key;
                [[s3 deleteObject:deleteRequest] waitUntilFinished];
            }
            
            return [self fixBucketCredentials:bucket];
        } else {
            NSLog(@"Problem listing objects in %@", bucket.name);
        }
        
        return nil;
    }];
}

-(BFTask*)fixBucketCredentials:(AWSS3Bucket*)bucket {
    NSLog(@"fixing creds");
    return nil;
}

-(BFTask*)createBucketNamed:(NSString*)bucketName {
    //    if (hasBucket) {
    //    } else {
    //        S3CreateBucketRequest *createBucket = [[S3CreateBucketRequest alloc] initWithName:bucket
    //                                                                                andRegion:region];
    //        S3CreateBucketResponse *createBucketResp = [s3 createBucket:createBucket];
    //        if (createBucketResp.error != nil) NSLog(@"ERROR: %@", createBucketResp.error);
    //
    //    }
    NSLog(@"creating bucket everything");
    return nil;
}

-(BFTask*)transferInitialAssetsToBucket:(AWSS3Bucket*)bucket {
    NSLog(@"filling bucket!");
    return nil;
}

-(AWSS3*)getS3 {
    if (!self.s3) {
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
    
    return self.s3;
}

@end

