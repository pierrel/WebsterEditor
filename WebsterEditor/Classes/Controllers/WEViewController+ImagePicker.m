//
//  WEViewController+ImagePicker.m
//  WebsterEditor
//
//  Created by pierre larochelle on 3/12/13.
//  Copyright (c) 2013 pierre larochelle. All rights reserved.
//

#import "WEViewController+ImagePicker.h"
#import "WEUtils.h"
#import "WEPageManager.h"
#import "NSArray+WEExtras.h"

@implementation WEWebViewController (ImagePicker)

- (void)openImagePickerWithData:(id)data withCallback:(WVJBResponseCallback)callback {
    if (callback) self.imagePickerCallback = callback;
    
    WEImagePopoverType type = WEImagePopoverOccupied;
    NSArray *classes = [data objectForKey:@"classes"];
    if (classes && [classes containsString:@"empty"]) type = WEImagePopoverEmpty;
    WEImagePopoverViewController *popover = [[WEImagePopoverViewController alloc] initWithType:type];
    popover.delegate = self;

    [popover popOverView:self.view withFrame:[WEUtils frameFromData:data]];
}

- (void)imagePopoverController:(WEImagePopoverViewController *)picker
 didFinishPickingMediaWithInfo:(NSDictionary *)info {
    CFUUIDRef uuid = CFUUIDCreate(NULL);
    NSString* uuidStr = (NSString *)CFBridgingRelease(CFUUIDCreateString(NULL, uuid));
    NSString *mediaPath = [WEUtils pathInDocumentDirectory:[NSString stringWithFormat:@"/media/%@.jpg", uuidStr]];
    
    UIImage* image = [info objectForKey:UIImagePickerControllerOriginalImage];
    NSData* data = UIImageJPEGRepresentation(image, 1);
    [data writeToFile:mediaPath atomically:NO];

    if (self.imagePickerCallback)
        self.imagePickerCallback([NSDictionary dictionaryWithObject:mediaPath
                                                             forKey:@"resource-path"]);
    self.imagePickerCallback = nil;
}

-(void)imagePopoverControllerDidDeleteImage:(WEImagePopoverViewController*)picker {
    if (self.imagePickerCallback)
        self.imagePickerCallback([NSDictionary dictionaryWithObject:@"selected" forKey:@"delete"]);
}

-(void)imagePopoverControllerDidGetDismissed:(WEImagePopoverViewController*)picker {
    self.imagePickerCallback = nil;
}


-(void)imagePickerControllerDidCancel:(UIImagePickerController *)picker {
}


@end
