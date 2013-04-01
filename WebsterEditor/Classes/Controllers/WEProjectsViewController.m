//
//  WEProjectsViewController.m
//  WebsterEditor
//
//  Created by pierre larochelle on 3/31/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEProjectsViewController.h"
#import "WEUtils.h"
#import "WEProjectCell.h"
#import "WEAddProjectCell.h"
#import "WEViewController.h"

@interface WEProjectsViewController ()

@end

@implementation WEProjectsViewController

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
    
    [self.collectionView registerClass:[WEProjectCell class]
            forCellWithReuseIdentifier:@"ProjectCell"];
    [self.collectionView registerClass:[WEAddProjectCell class]
            forCellWithReuseIdentifier:@"AddProjectCell"];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

-(NSInteger)numberOfSectionsInCollectionView:(UICollectionView *)collectionView {
    return 1;
}

-(NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
    return [self projects].count + 1;
}

-(UICollectionViewCell*)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath
{
    if ([self isIndexPathAddProject:indexPath]) {
        WEAddProjectCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:@"AddProjectCell" forIndexPath:indexPath];
        return cell;
        
    } else {
        WEProjectCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:@"ProjectCell" forIndexPath:indexPath];
        NSString *projectId = [[self projects] objectAtIndex:indexPath.row];
        NSString *thumbPath = [WEUtils pathInDocumentDirectory:@"thumb.jpeg" withProjectId:projectId];
        UIImage *thumb = [UIImage imageWithContentsOfFile:thumbPath];
        [cell setImage:thumb];
        return cell;
    }
}

-(void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath {
    if ([self isIndexPathAddProject:indexPath]) {
        [self transitionToNewProject];
    } else {
        NSArray *projects = [self projects];
        NSString *projectId = [projects objectAtIndex:indexPath.row];
        [self transitionToProject:projectId];
    }
    [self.collectionView deselectItemAtIndexPath:indexPath animated:YES];
}

-(void)transitionToProject:(NSString*)projectId {
    // setup the view controller
    [UIView animateWithDuration:0.2 animations:^{
        CGFloat diff = 20;
        CGRect current = self.view.frame;
        [self.view setFrame:CGRectMake(current.origin.x+diff, current.origin.y+diff, current.size.width-(diff*2), current.size.height-(diff*2))];
    }];
    WEViewController *mainController = [[WEViewController alloc] initWithProjectId:projectId];
    [self presentViewController:mainController
                       animated:YES
                     completion:^{
                         NSLog(@"done");
                     }];
}

-(void)transitionToNewProject {
    NSFileManager *fileManager = [NSFileManager defaultManager];
    NSError *error;
    NSString *projectId = [WEUtils newId];
    
    // Setup project dir
    NSString *media = [WEUtils pathInDocumentDirectory:@"media" withProjectId:projectId];
    NSString *css = [WEUtils pathInDocumentDirectory:@"css" withProjectId:projectId];
    NSString *js = [WEUtils pathInDocumentDirectory:@"js" withProjectId:projectId];
    NSString *projectDir = [WEUtils pathInDocumentDirectory:@"" withProjectId:projectId];
    
    [fileManager createDirectoryAtPath:projectDir
           withIntermediateDirectories:NO
                            attributes:nil
                                 error:&error];
    [fileManager createDirectoryAtPath:media
           withIntermediateDirectories:NO
                            attributes:nil
                                 error:&error];
    [fileManager createDirectoryAtPath:css
           withIntermediateDirectories:NO
                            attributes:nil
                                 error:&error];
    [fileManager createDirectoryAtPath:js
           withIntermediateDirectories:NO
                            attributes:nil
                                 error:&error];
    
    // setup project files
    NSArray *resources = [NSArray arrayWithObjects:
                          [NSDictionary dictionaryWithObjectsAndKeys:
                           @"development", @"name",
                           @"html", @"ext", nil],
                          [NSDictionary dictionaryWithObjectsAndKeys:
                           @"development", @"name",
                           @"css", @"ext", nil],
                          [NSDictionary dictionaryWithObjectsAndKeys:
                           @"override", @"name",
                           @"css", @"ext", nil],
                          [NSDictionary dictionaryWithObjectsAndKeys:
                           @"bootstrap.min", @"name",
                           @"css", @"ext", nil],
                          [NSDictionary dictionaryWithObjectsAndKeys:
                           @"bootstrap-responsive.min", @"name",
                           @"css", @"ext", nil],
                          [NSDictionary dictionaryWithObjectsAndKeys:
                           @"jquery-1.9.0.min", @"name",
                           @"js", @"ext", nil],
                          [NSDictionary dictionaryWithObjectsAndKeys:
                           @"bootstrap.min", @"name",
                           @"js", @"ext", nil],
                          [NSDictionary dictionaryWithObjectsAndKeys:
                           @"rangy", @"name",
                           @"js", @"ext", nil],
                          [NSDictionary dictionaryWithObjectsAndKeys:
                           @"development", @"name",
                           @"js", @"ext", nil],
                          [NSDictionary dictionaryWithObjectsAndKeys:
                           @"bootstrap-lightbox", @"name",
                           @"js", @"ext", nil], nil];
    NSString *indexPath = nil;
    
    for (int i = 0, len = [resources count]; i < len; i++) {
        NSDictionary *fileInfo = [resources objectAtIndex:i];
        NSString *ext = [fileInfo objectForKey:@"ext"];
        NSString *name = [fileInfo objectForKey:@"name"];
        NSString *topLevelPath = ([ext isEqualToString:@"html"] ? @"" : [NSString stringWithFormat:@"%@/", ext]);
        NSString *fullPath = [WEUtils pathInDocumentDirectory:[NSString stringWithFormat:@"%@%@.%@", topLevelPath, name, ext] withProjectId:projectId];
        
        NSString *contents = [NSString stringWithContentsOfFile:[[NSBundle mainBundle] pathForResource:name
                                                                                                ofType:ext]
                                                       encoding:NSUTF8StringEncoding
                                                          error:&error];
        [contents writeToFile:fullPath
                   atomically:NO
                     encoding:NSStringEncodingConversionAllowLossy
                        error:&error];
        
        if (i == 0) indexPath = fullPath;
    }
    
    [self transitionToProject:projectId];
}

-(BOOL)isIndexPathAddProject:(NSIndexPath*)indexPath {
    return indexPath.row == [self collectionView:self.collectionView
                          numberOfItemsInSection:indexPath.section] - 1;
}

-(NSArray*)projects {
    NSError *error;
    NSArray *projectDirectories = [[NSFileManager defaultManager] contentsOfDirectoryAtPath:[WEUtils pathInDocumentDirectory:@"projects"] error:&error];
    NSMutableArray *filenames = [[NSMutableArray alloc] init];
    
    for (NSString *fullPath in projectDirectories) {
        [filenames addObject:[fullPath lastPathComponent]];
    }

    return [NSArray arrayWithArray:filenames];
}

@end
