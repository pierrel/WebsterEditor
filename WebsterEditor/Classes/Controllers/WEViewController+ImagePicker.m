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
#import "UIImage+WEExtras.h"



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
    CGSize max = CGSizeMake(980, 1208);
    CGFloat thumbMax = 250;
    NSString *uuidStr = [WEUtils newId];
    NSString *mediaPath = [WEUtils pathInDocumentDirectory:[NSString stringWithFormat:@"/media/%@.jpg", uuidStr] withProjectId:self.projectId];
    NSString *thumbPath = [WEUtils pathInDocumentDirectory:[NSString stringWithFormat:@"/media/%@_THUMB.jpg", uuidStr] withProjectId:self.projectId];

    // resize the image
    UIImage *originalImage = [info objectForKey:UIImagePickerControllerOriginalImage];
    CGSize imageSize = originalImage.size;
    UIImage *thumbImage;
    UIImage *image;
    CGFloat resizeRatio = 1, resizeX = 1, resizeY = 1;
    if (imageSize.height > max.height) resizeY = max.height / imageSize.height;
    if (imageSize.width > max.width) resizeX = max.width / imageSize.width;
    resizeRatio = MAX(resizeX, resizeY);
    if (resizeRatio != 1) image = [originalImage scaledBy:resizeRatio];
    else image = originalImage;
    thumbImage = [image scaledBy:thumbMax / MAX(image.size.height, image.size.width)];
    
    NSData *data = UIImageJPEGRepresentation(image, 1);
    NSData *thumbData = UIImageJPEGRepresentation(thumbImage, 1);
    [data writeToFile:mediaPath atomically:NO];
    [thumbData writeToFile:thumbPath atomically:NO];

    if (self.imagePickerCallback)
        self.imagePickerCallback([NSDictionary dictionaryWithObjectsAndKeys:
                                  mediaPath, @"resource-path",
                                  thumbPath, @"thumb-path", nil]);
    self.imagePickerCallback = nil;
    [[WEPageManager sharedManager] deselectSelectedElement];
}

-(void)imagePopoverControllerDidDeleteImage:(WEImagePopoverViewController*)picker {
    if (self.imagePickerCallback)
        self.imagePickerCallback([NSDictionary dictionaryWithObject:@"selected" forKey:@"delete"]);
}

-(void)imagePopoverControllerDidGetDismissed:(WEImagePopoverViewController*)picker {
    self.imagePickerCallback = nil;
    [[WEPageManager sharedManager] deselectSelectedElement];
}


-(void)imagePickerControllerDidCancel:(UIImagePickerController *)picker {
    [[WEPageManager sharedManager] deselectSelectedElement];
}


@end
