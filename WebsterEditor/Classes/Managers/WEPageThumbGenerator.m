//
//  WEPageThumbGenerator.m
//  WebsterEditor
//
//  Created by pierre larochelle on 10/23/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEPageThumbGenerator.h"
#import "WEUtils.h"

@interface WEPageThumbGenerator()
@property (nonatomic, strong) UIWebView *webView;
@property (nonatomic, strong) NSArray *saveLocations;
@end

@implementation WEPageThumbGenerator
@synthesize saveLocations;
-(id)init {
    if (self = [super init]) {
        self.webView = [[UIWebView alloc] initWithFrame:CGRectMake(0, 0, 768, 1004)];
        self.webView.delegate = self;
    }
    
    return self;
}

-(void)generateThumbForPage:(NSString *)pagePath atLocations:(NSArray *)thumbLocations {
    self.saveLocations = thumbLocations;
    [self.webView loadRequest:[NSURLRequest requestWithURL:[NSURL fileURLWithPath:pagePath]]];
}

-(void)webViewDidFinishLoad:(UIWebView *)webView {
    if (webView == self.webView && ![webView isLoading]) {
        UIGraphicsBeginImageContext(webView.frame.size);
        [webView.layer renderInContext:UIGraphicsGetCurrentContext()];
        UIImage *img = UIGraphicsGetImageFromCurrentImageContext();
        UIGraphicsEndImageContext();
        NSData *thumbData = UIImageJPEGRepresentation(img, 0.8);
        for (NSString *thumbPath in saveLocations) {
            [thumbData writeToFile:thumbPath atomically:NO];
        }
    }
}

-(void)webView:(UIWebView *)webView didFailLoadWithError:(NSError *)error {
    NSLog(@"failed rendering page with error: %@", error);
}


@end
