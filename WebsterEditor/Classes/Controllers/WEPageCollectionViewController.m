//
//  WEPageCollectionViewController.m
//  WebsterEditor
//
//  Created by pierre larochelle on 5/7/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEPageCollectionViewController.h"
#import "WEAddPageCell.h"
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
    [self.collectionView registerClass:[WEAddPageCell class]
            forCellWithReuseIdentifier:@"AddPageCell"];
    
    self.collectionView.backgroundColor = [UIColor clearColor];
}

-(NSInteger)numberOfSectionsInCollectionView:(UICollectionView *)collectionView {
    return 1;
}

-(NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
    return [self pages].count + 1;
}

-(UICollectionViewCell*)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath
{
    if ([self isIndexPathAddPage:indexPath]) {
        WEAddPageCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:@"AddPageCell" forIndexPath:indexPath];
        return cell;
    } else {
        NSArray *pages = [self pages];
        NSString *filename = [pages objectAtIndex:indexPath.row];
        NSString *pageName = [filename stringByReplacingOccurrencesOfString:@".html" withString:@""];
        WEPageCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:@"PageCell" forIndexPath:indexPath];
        [cell setName:pageName];
        [cell setDelegate:self];
        
        return cell;
    }
}

-(void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath {
    if ([self isIndexPathAddPage:indexPath]) {
        if (self.delegate) [self.delegate addAndSwitchToNewPage];
        [self.collectionView reloadData];
    } else {
        NSString *pageName = [[self pages] objectAtIndex:indexPath.row];
        if (self.delegate) [self.delegate switchToPage:pageName];
    }
}

-(NSArray*)pages {
    NSError *error;
    NSFileManager *fileManager = [NSFileManager defaultManager];
    NSArray *projectFiles = [fileManager contentsOfDirectoryAtPath:[WEUtils pathInDocumentDirectory:@""
                                                                                            withProjectId:self.projectId]
                                                                   error:&error];
    NSPredicate *htmlPred = [NSPredicate predicateWithFormat:@"SELF ENDSWITH '.html' AND NOT SELF ENDSWITH '_prod.html'"];
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

-(BOOL)isIndexPathAddPage:(NSIndexPath*)indexPath {
    return indexPath.row == [self collectionView:self.collectionView
                          numberOfItemsInSection:indexPath.section] - 1;
}

-(BOOL)page:(NSString *)pageName renamedTo:(NSString *)newName {
    NSError *err;
    NSFileManager *fileManager = [NSFileManager defaultManager];
    
    // thumb
    NSString *oldThumb = [NSString stringWithFormat:@"%@.jpeg", pageName];
    NSString *oldThumbFile = [WEUtils pathInDocumentDirectory:oldThumb withProjectId:self.projectId];
    if ([fileManager fileExistsAtPath:oldThumbFile]) {
        NSString *newThumbFile = [WEUtils pathInDocumentDirectory:[NSString stringWithFormat:@"%@.jpeg", newName]
                                                    withProjectId:self.projectId];
        [fileManager moveItemAtPath:oldThumbFile toPath:newThumbFile error:&err];
        if (err) NSLog(@"problem updating thumb for %@ to %@", pageName, newName);
    } // else don't worry about it
    
    // HTML
    NSString *oldFileName = [NSString stringWithFormat:@"%@.html", pageName];
    NSString *newFileName = [NSString stringWithFormat:@"%@.html", newName];
    NSString *oldFile = [WEUtils pathInDocumentDirectory:oldFileName
                                           withProjectId:self.projectId];
    NSString *newFile = [WEUtils pathInDocumentDirectory:newFileName
                                          withProjectId:self.projectId];
    
    if ([fileManager fileExistsAtPath:oldFile]) {
        [fileManager moveItemAtPath:oldFile toPath:newFile error:&err];
        if (err) {
            NSLog(@"Error! copying %@ to %@: %@", oldFile, newFile, err);
            return NO;
        } else {
            [self.delegate page:oldFileName renamedTo:newFileName];
            return YES;
        }
        
    } else {
        NSLog(@"Error! %@ (renamed to %@) should exist", oldFile, newFile);
        return NO;
    }
}



- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
