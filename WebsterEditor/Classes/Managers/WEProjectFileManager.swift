//
//  WEProjectFileManager.swift
//  WebsterEditor
//
//  Created by pierre larochelle on 10/26/14.
//  Copyright (c) 2014 pierre larochelle. All rights reserved.
//

import UIKit

class WEProjectFileManager: NSObject {
    var projectId : String = ""
    
    var pagePathsAndKeys: Dictionary<String, String> {
        var pathsAndKeys = [String:String]()
        var maybeError:NSError?
        let topPath = WEUtils.pathInDocumentDirectory("", withProjectId:projectId)
        let fileManager = NSFileManager.defaultManager()

        if let contents = fileManager.contentsOfDirectoryAtPath(topPath, error:&maybeError) {
            for file in contents {
                let fileString = file as NSString
                if fileString.hasSuffix("_prod.html") {
                    let pageKey = fileString.stringByReplacingOccurrencesOfString("_prod.html", withString:".html")
                    let pagePath = WEUtils.pathInDocumentDirectory(fileString, withProjectId:projectId)
                    
                    pathsAndKeys[pageKey] = pagePath
                }
            }
        } else if let error = maybeError {
            NSLog("Could not list contents of /")
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