//
//  WEPageCollectionViewController.m
//  WebsterEditor
//
//  Created by pierre larochelle on 5/7/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEPageCollectionViewController.h"
#import "WEPageCell.h"
#import "WEUtils.h"

@interface WEPageCollectionViewController ()
-(NSArray*)pages;
@end

@implementation WEPageCollectionViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    [self.collectionView registerClass:[WEPageCell class]
            forCellWithReuseIdentifier:@"PageCell"];
    
    self.collectionView.backgroundColor = [UIColor clearColor];
}

-(NSInteger)numberOfSectionsInCollectionView:(UICollectionView *)collectionView {
    return 1;
}

-(NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
    return [self pages].count;
}

-(UICollectionViewCell*)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath
{
    WEPageCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:@"PageCell" forIndexPath:indexPath];
    return cell;
}

-(void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath {
    NSLog(@"YAY");
}

-(NSArray*)pages {
    NSError *error;
    NSFileManager *fileManager = [NSFileManager defaultManager];
    NSArray *projectFiles = [fileManager contentsOfDirectoryAtPath:[WEUtils pathInDocumentDirectory:@""
                                                                                            withProjectId:self.projectId]
                                                                   error:&error];
    NSPredicate *htmlPred = [NSPredicate predicateWithFormat:@"SELF ENDSWITH '.html'"];
    NSArray *filteredFiles = [projectFiles filteredArrayUsingPredicate:htmlPred];

    NSArray *sortedFiles = [filteredFiles sortedArrayUsingComparator:^NSComparisonResult(id obj1, id obj2) {
        NSError *attrError;
        NSString *path1 = [WEUtils pathInDocumentDirectory:obj1 withProjectId:self.projectId];
        NSDictionary *attrs1 = [fileManager attributesOfItemAtPath:path1
                                                             error:&attrError];
        NSDate *date1 = [attrs1 objectForKey:NSFileCreationDate];
        
        NSString *path2 = [WEUtils pathInDocumentDirectory:obj2 withProjectId:self.projectId];
        NSDictionary *attrs2 = [fileManager attributesOfItemAtPath:path2
                                                             error:&attrError];
        NSDate *date2 = [attrs2 objectForKey:NSFileCreationDate];
        
        return date2.timeIntervalSince1970 - date1.timeIntervalSince1970;
    }];
        
    return sortedFiles;
}


- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
