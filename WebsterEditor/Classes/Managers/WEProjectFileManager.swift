//
//  WEProjectFileManager.swift
//  WebsterEditor
//
//  Created by pierre larochelle on 10/26/14.
//  Copyright (c) 2014 pierre larochelle. All rights reserved.
//

import UIKit

class WEProjectFileManager: NSObject {
    var pageKeys: [String] = ["index.html"] // TODO: make it dynamic
    var projectId : String = ""
    
    var pagePathsAndKeys: Dictionary<String, String> {
        var pathsAndKeys = [String:String]()
        
        for pageKey : String in pageKeys {
            let prodPagePath : String = pageKey.stringByReplacingOccurrencesOfString(".html", withString:"_prod.html")
            pathsAndKeys[pageKey] = WEUtils.pathInDocumentDirectory(prodPagePath, withProjectId:projectId)
        }
        
        return pathsAndKeys
    }
    
    var libPathsAndKeys: Dictionary<String,String> {
        var libs = [String:String]()
        let filePaths = [
            "js/jquery-1.9.0.min.js",
            "js/bootstrap.min.js",
            "js/bootstrap-lightbox.js",
            "css/override.css",
            "css/bootstrap.min.css",
            "css/bootstrap-responsive.min.css"
        ]
        
        for filePath: String in filePaths {
            libs[filePath] = WEUtils.pathInDocumentDirectory(filePath, withProjectId:projectId)
        }

        return libs;
    }
    
    var mediaPathsAndKeys: Dictionary<String,String> {
        var media = [String:String]()
        let pathPrefix : String = "media"
        let fileManager = NSFileManager.defaultManager()
        let mediaPath = WEUtils.pathInDocumentDirectory(pathPrefix, withProjectId:projectId)
        var maybeError: NSError?
        
        if let contents = fileManager.contentsOfDirectoryAtPath(mediaPath, error:&maybeError) {
            for file in contents {
                let s3FileKey = "\(pathPrefix)/\(file)"
                let fullPath = WEUtils.pathInDocumentDirectory(s3FileKey, withProjectId:projectId)
                media[s3FileKey] = fullPath
            }
        } else if let error = maybeError {
            NSLog("Could not list contents of %@", mediaPath)
        }
        
        return media
    }
}