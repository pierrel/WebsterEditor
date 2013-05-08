//
//  WEPageCollectionViewController.m
//  WebsterEditor
//
//  Created by pierre larochelle on 5/7/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEPageCollectionViewController.h"
#import "WEPageCell.h"

@interface WEPageCollectionViewController ()

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
    
    self.collectionView.backgroundColor = [UIColor whiteColor];
}

-(NSInteger)numberOfSectionsInCollectionView:(UICollectionView *)collectionView {
    return 1;
}

-(NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
    return 3;
}

-(UICollectionViewCell*)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath
{
    WEPageCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:@"PageCell" forIndexPath:indexPath];
    return cell;
}

-(void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath {
    NSLog(@"YAY");
}


- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
