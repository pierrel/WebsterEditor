# Features!
* Out of the box grid-based responsiveness
* Quick deployment to S3
* In-line text editing

## No Bullshit Version
* Thin wrapper over the amazingly easy-to-use bootstrap 2.0 (http://getbootstrap.com)
* Basic DOM manipulation
* Wrote it to practice my clojure

# Running the thing

## Prereq(s)
* install lein (https://github.com/technomancy/leiningen)

## Set up AWS

You must have a Cognito identity pool (http://docs.aws.amazon.com/mobile/sdkforios/developerguide/cognito-auth.html, make sure to "Enable Access to Unauthenticated Identities") with IAM default roles. Once they're created make sure the add the following rules to the unathenticated role:

For any access at all

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Action": [
        "sts:*"
      ],
      "Resource": [
        "[Your unauthed identity arn, looks like "arn:aws:iam::some numbers:role/Cognito_ProjectNameUnauth_DefaultRole"]"
      ]
    }
  ]
}
```

And for full S3 access:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:*",
      "Resource": "*"
    }
  ]
}
```

You can do this from the Roles > Permissions > Role Policies section of the [IAM console](https://console.aws.amazon.com/iam/home).

## Quick start
* `$ cd WebsterEditor/WebsterEditor`
* create config.json and put in your AWS credentials as below:

    ```json
    {
      "accountId": "[account id]",
      "identityPoolId": "[identity pool id]",
      "unauthRoleArn": "[unauth role arn]",
      "authRoleArn": "[auth role arn]"
    }
    ```

    You can get this information by following the instructions [here](http://docs.aws.amazon.com/mobile/sdkforios/developerguide/cognito-auth.html#providing-creds).

* `$ ./scripts/lesscss`
* `$ ./scripts/watchcljs`
* Open WebsterEditor.xcodeproj
* Press “build and then run”

## Dev Mode

1. Eval the elisp in .emacs-config.el (or use the AMAZING [auto-project.el](https://github.com/pierrel/auto-project.el))
2. Run webster-repl (`M-x webster-repl`)
3. Open a browser to localhost:3000
4. Do things in the \*inferior-lisp\* (`ClojureScript:cljs.user> (js/alert "hello from clojurescript!")`)
5. Load a namespace (`ClojureScript:cljs.user> (in-ns 'webster.main)`)

If you have the server running when the Obj-C is run in a simulator it will automatically load from localhost:3000 instead of a flat html file. In this way you'll be able to run arbitrary clojurescript right in the app. Just replace step 3 with "Build and Run WebsterEditor and open any project/page." Note that the actual project html structure will not load -- instead it'll load the default development html.

# Application Structure

## javascript
* src lives in `WebsterEditor/WebsterEditor/client/src/webster`
* compiled from clojurescript to `WebsterEditor/WebsterEditor/client/resources/public/js/development.js`
* handles all page-related interactions (DOM element level)

## html
* templates for new pages (on prod) and a dev template for repl
* lives in `WebsterEditor/WebsterEditor/client/resources/public/html/`

## styling
* compiled LESS to `WebsterEditor/WebsterEditor/client/resources/development.css`
* src lives in `WebsterEditor/WebsterEditor/less/development.less`
* Extra style rules for when a user is editing the page (as in blueprint mode)

## iOS interaction
All js interaction handled by WebViewJavascriptBridge (https://github.com/marcuswestin/WebViewJavascriptBridge). Look at WEPageManager for all messages you want to send TO the page. Look in WEWebViewController-viewDidLoad for all messages FROM the page.

## JS interaction
All messages FROM the client are received using the `defhandler` function (defined in main.cljs, I know it’s ugly I didn’t have time to figure out macros for cljs). Messages to the client have to use the `bridge` object (returned as a callback to hander methods and originating from the on-bridge-ready function).

## S3
All S3 stuff is handled in WEEditorViewController-doExportWorkWithCompletion
