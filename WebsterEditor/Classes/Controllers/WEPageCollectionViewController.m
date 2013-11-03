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
@property (nonatomic, assign) NSInteger selectedRow;
@property (nonatomic, strong) NSString *deletingPageName;
-(NSArray*)pages;
@end

@implementation WEPageCollectionViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        self.selectedRow = 0;
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
        
        dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_BACKGROUND, 0),^ {
            NSString *thumbName = [NSString stringWithFormat:@"%@.jpeg", pageName];
            NSString *thumbPath = [WEUtils pathInDocumentDirectory:thumbName withProjectId:self.projectId];
            NSFileManager *fs = [NSFileManager defaultManager];
            if ([fs fileExistsAtPath:thumbPath]) {
                UIImage *image = [UIImage imageWithContentsOfFile:thumbPath];
                dispatch_sync(dispatch_get_main_queue(), ^{
                    [cell setImage:image];
                });
            }
        });
        
        [cell setHighlighted:indexPath.row == self.selectedRow];
                
        return cell;
    }
}

-(void)refreshAfterAddingPage {
    // prepare the new one to be highlighted
    self.selectedRow = 0;
    
    // refresh the collection
    [self.collectionView reloadData];
}

-(void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath {
    // deselect the old row
    NSIndexPath *oldPath = [NSIndexPath indexPathForItem:self.selectedRow inSection:0];
    UICollectionViewCell *cell = [collectionView cellForItemAtIndexPath:oldPath];
    [cell setHighlighted:NO];
    
    if ([self isIndexPathAddPage:indexPath]) {
        // let the content know
        if (self.delegate) [self.delegate addAndSwitchToNewPageFromController:self];
                
        // prepare the new one to be highlighted
        self.selectedRow = 0;
        
        // refresh the collection
        [self.collectionView reloadData];
    } else {        
        // let the content know
        NSString *pageName = [[self pages] objectAtIndex:indexPath.row];
        if (self.delegate) [self.delegate switchToPage:pageName];
        
        // highlight the current one
        cell = [collectionView cellForItemAtIndexPath:indexPath];
        [cell setHighlighted:YES];
        self.selectedRow = indexPath.row;
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

-(void)deletePage:(NSString *)pageName {
    self.deletingPageName = pageName;
    NSString *message = [NSString stringWithFormat:@"Are you sure you want to delete the page named \"%@\"? This cannot be undone.", pageName];
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Delete page?" message:message delegate:self cancelButtonTitle:@"Don't delete" otherButtonTitles:@"Delete", nil];
    [alert show];
    
}

-(void)actuallyDeletePage:(NSString*)pageName {
    NSError *err;
    NSString *pageFile = [NSString stringWithFormat:@"%@.html", pageName];
    NSString *pageProdFile = [NSString stringWithFormat:@"%@_prod.html", pageName];
    NSString *pageThumb = [NSString stringWithFormat:@"%@.jpeg", pageName];
    NSLog(@"removing: %@", [WEUtils pathInDocumentDirectory:pageFile withProjectId:self.projectId]);
    [[NSFileManager defaultManager] removeItemAtPath:[WEUtils pathInDocumentDirectory:pageFile
                                                                        withProjectId:self.projectId] error:&err];
    [[NSFileManager defaultManager] removeItemAtPath:[WEUtils pathInDocumentDirectory:pageProdFile
                                                                        withProjectId:self.projectId] error:&err];
    [[NSFileManager defaultManager] removeItemAtPath:[WEUtils pathInDocumentDirectory:pageThumb
                                                                        withProjectId:self.projectId] error:&err];
    if (self.delegate) [self.delegate pageDeleted:pageFile];
    [self.collectionView reloadData];
}

-(void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex {
    if (buttonIndex == 1) {
        [self actuallyDeletePage:self.deletingPageName];
    }
    self.deletingPageName = nil;
}


- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
