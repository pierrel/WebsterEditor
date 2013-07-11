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
    self.pickerData = data;
    
    NSArray *classes = [data objectForKey:@"classes"];
    BOOL deleteVisible = classes && [classes containsString:@"image-thumb"] && ![classes containsString:@"empty"];
    WEImagePopoverViewController *popover = [[WEImagePopoverViewController alloc] initWithDeleteButtonVisible:deleteVisible];
    popover.delegate = self;

    [popover popOverView:self.view withFrame:[WEUtils frameFromData:data]];
}

- (void)imagePopoverController:(WEImagePopoverViewController *)picker
 didFinishPickingMediaWithInfo:(NSDictionary *)info {
    NSString *uuidStr = [WEUtils newId];
    NSArray *classes = [self.pickerData objectForKey:@"classes"];
    UIImage *originalImage = [info objectForKey:UIImagePickerControllerOriginalImage];
    
    if ([classes containsString:@"image-thumb"]) {
        CGSize max = CGSizeMake(980, 1208);
        CGFloat thumbMax = 250;
        NSString *mediaPath = [WEUtils pathInDocumentDirectory:[NSString stringWithFormat:@"/media/%@.jpg", uuidStr] withProjectId:self.projectId];
        NSString *thumbPath = [WEUtils pathInDocumentDirectory:[NSString stringWithFormat:@"/media/%@_THUMB.jpg", uuidStr] withProjectId:self.projectId];

        // resize the image
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
    } else if ([classes containsString:@"image"]) {
        NSString *assetPath = [WEUtils pathInDocumentDirectory:[NSString stringWithFormat:@"/assets/%@.jpg", uuidStr] withProjectId:self.projectId];
        NSData *data = UIImageJPEGRepresentation(originalImage, 1);
        [data writeToFile:assetPath atomically:NO];
        
        if (self.imagePickerCallback)
            self.imagePickerCallback([NSDictionary dictionaryWithObjectsAndKeys:
                                      assetPath, @"resource-path",
                                      assetPath, @"thumb-path", nil]);

    }
    self.imagePickerCallback = nil;
}

-(void)imagePopoverControllerDidDeleteImage:(WEImagePopoverViewController*)picker {
    if (self.imagePickerCallback)
        self.imagePickerCallback([NSDictionary dictionaryWithObject:@"selected" forKey:@"delete"]);
    self.pickerData = nil;
}

-(void)imagePopoverControllerDidGetDismissed:(WEImagePopoverViewController*)picker {
    self.imagePickerCallback = nil;
    [[WEPageManager sharedManager] deselectSelectedElement];
    self.pickerData = nil;
}


-(void)imagePickerControllerDidCancel:(UIImagePickerController *)picker {
    [[WEPageManager sharedManager] deselectSelectedElement];
    self.pickerData = nil;
}


@end
