//
//  WEProjectsViewController.m
//  WebsterEditor
//
//  Created by pierre larochelle on 3/31/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEProjectsViewController.h"
#import "WEUtils.h"
#import "WEAddProjectCell.h"
#import "WEEditorViewController.h"

@interface WEProjectsViewController ()
@property (nonatomic, assign) BOOL transitioningToNewProject;
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
    
    self.collectionView.backgroundColor = [UIColor colorWithPatternImage:[UIImage imageNamed:@"grey_wash_wall.png"]];
}

-(void)viewWillAppear:(BOOL)animated {
    [self.collectionView reloadData];
    [super viewWillAppear:animated];
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
        NSString *projectId = [[self projects] objectAtIndex:indexPath.row];
        WEProjectSettings *settings = [self settingsForId:projectId];
        WEProjectCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:@"ProjectCell" forIndexPath:indexPath];
        cell.projectId = projectId;
        cell.delegate = self;
        NSString *thumbPath = [WEUtils pathInDocumentDirectory:@"thumb.jpeg" withProjectId:projectId];
        UIImage *thumb = [UIImage imageWithContentsOfFile:thumbPath];
        [cell setName:settings.name];
        if (thumb) [cell setImage:thumb];
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
    NSFileManager *fileManager = [NSFileManager defaultManager];
    NSError *error;
    
    // Setup project dir
    NSArray *topDirs = [NSArray arrayWithObjects:
                        [WEUtils pathInDocumentDirectory:@"media" withProjectId:projectId],
                        [WEUtils pathInDocumentDirectory:@"assets" withProjectId:projectId],
                        [WEUtils pathInDocumentDirectory:@"css" withProjectId:projectId],
                        [WEUtils pathInDocumentDirectory:@"js" withProjectId:projectId],
                        [WEUtils pathInDocumentDirectory:@"" withProjectId:projectId], nil];
    for (NSString *path in topDirs) {
        if (![fileManager fileExistsAtPath:path])
            [fileManager createDirectoryAtPath:path
                   withIntermediateDirectories:NO
                                    attributes:nil
                                         error:&error];

    }
    
    // copy latest css/js
    NSArray *resources = [NSArray arrayWithObjects:
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
    
    for (int i = 0, len = [resources count]; i < len; i++) {
        NSDictionary *fileInfo = [resources objectAtIndex:i];
        NSString *ext = [fileInfo objectForKey:@"ext"];
        NSString *name = [fileInfo objectForKey:@"name"];
        NSString *topLevelPath = [NSString stringWithFormat:@"%@/", ext];
        NSString *fullPath = [WEUtils pathInDocumentDirectory:[NSString stringWithFormat:@"%@%@.%@", topLevelPath, name, ext] withProjectId:projectId];
        
        NSString *contents = [NSString stringWithContentsOfFile:[[NSBundle mainBundle] pathForResource:name
                                                                                                ofType:ext]
                                                       encoding:NSUTF8StringEncoding
                                                          error:&error];
        [contents writeToFile:fullPath
                   atomically:NO
                     encoding:NSUTF8StringEncoding
                        error:&error];
    }
    
    WEProjectSettings *settings = [self settingsForId:projectId];
    NSLog(@"%@", [WEUtils pathInDocumentDirectory:@"settings" withProjectId:projectId]);
    NSString *nibName = @"WEEditorViewController";
    WEEditorViewController *mainController = [[WEEditorViewController alloc] initWithNibName:nibName bundle:nil];
    mainController.projectId = projectId;
    mainController.settings = settings;
    mainController.delegate = self;
    mainController.loadingNewProject = self.transitioningToNewProject;
    UINavigationController *nav = [[UINavigationController alloc] initWithRootViewController:mainController];
    [self presentViewController:nav animated:YES completion:^{
        NSLog(@"showing new project");
    }];
    self.transitioningToNewProject = NO;
}

-(WEProjectSettings*)settingsForId:(NSString*)projectId {
    NSString *path = [WEUtils pathInDocumentDirectory:@"settings"
                                        withProjectId:projectId];
    return [NSKeyedUnarchiver unarchiveObjectWithFile:path];
}

-(void)didSaveViewController:(WEEditorViewController *)controller {
    [self.collectionView reloadData];
}

-(void)transitionToNewProject {
    self.transitioningToNewProject = YES;
    NSFileManager *fileManager = [NSFileManager defaultManager];
    NSError *error;
    NSString *projectId = [WEUtils newId];
    
    // create project directory
    [fileManager createDirectoryAtPath:[WEUtils pathInDocumentDirectory:nil withProjectId:projectId] withIntermediateDirectories:YES attributes:[NSDictionary dictionary] error:&error];
    
    // Setup settings
    WEProjectSettings *settings = [[WEProjectSettings alloc] init];
    NSString *settingsPath = [WEUtils pathInDocumentDirectory:@"settings"
                                                withProjectId:projectId];
    [NSKeyedArchiver archiveRootObject:settings
                                toFile:settingsPath];
    
    // Setup index file
    NSString *htmlBundle = [[NSBundle mainBundle] pathForResource:@"development"
                                                           ofType:@"html"];
    NSString *contents = [NSString stringWithContentsOfFile:htmlBundle
                                                   encoding:NSUTF8StringEncoding
                                                      error:&error];
    [contents writeToFile:[WEUtils pathInDocumentDirectory:@"index.html" withProjectId:projectId]
               atomically:NO
                 encoding:NSUTF8StringEncoding
                    error:&error];
    
    [self transitionToProject:projectId];
}

-(BOOL)isIndexPathAddProject:(NSIndexPath*)indexPath {
    return indexPath.row == [self collectionView:self.collectionView
                          numberOfItemsInSection:indexPath.section] - 1;
}

-(NSArray*)projects {
    NSError *error;
    NSFileManager *fileManager = [NSFileManager defaultManager];
    NSArray *projectDirectories = [fileManager contentsOfDirectoryAtPath:[WEUtils pathInDocumentDirectory:@"projects"] error:&error];
    NSMutableArray *filenames = [[NSMutableArray alloc] init];
    NSArray *sortedPaths = [projectDirectories sortedArrayUsingComparator:^NSComparisonResult(id obj1, id obj2) {
        NSError *attrError;
        NSString *path1 = [WEUtils pathInDocumentDirectory:[NSString stringWithFormat:@"projects/%@", obj1]];
        NSDictionary *attrs1 = [fileManager attributesOfItemAtPath:path1
                                                            error:&attrError];
        NSDate *date1 = [attrs1 objectForKey:NSFileCreationDate];

        NSString *path2 = [WEUtils pathInDocumentDirectory:[NSString stringWithFormat:@"projects/%@", obj2]];
        NSDictionary *attrs2 = [fileManager attributesOfItemAtPath:path2
                                                             error:&attrError];
        NSDate *date2 = [attrs2 objectForKey:NSFileCreationDate];
        
        return date2.timeIntervalSince1970 - date1.timeIntervalSince1970;
    }];
    
    for (NSString *fullPath in sortedPaths) {
        [filenames addObject:[fullPath lastPathComponent]];
    }

    return [NSArray arrayWithArray:filenames];
}

-(void)project:(NSString *)projectId renamedTo:(NSString *)newName {
    WEProjectSettings *settings = [self settingsForId:projectId];
    settings.name = newName;
    [NSKeyedArchiver archiveRootObject:settings toFile:[WEUtils pathInDocumentDirectory:@"settings"
                                                                          withProjectId:projectId]];
}

@end
