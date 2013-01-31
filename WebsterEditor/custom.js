window.onerror = function(err) {
    log('window.onerror: ' + err)
}
document.addEventListener('WebViewJavascriptBridgeReady', onBridgeReady, false)
function onBridgeReady(event) {
    var bridge = event.bridge
    var uniqueId = 1
    function log(message, data) {
        var log = document.getElementById('log')
        var el = document.createElement('div')
        el.className = 'logLine'
        el.innerHTML = uniqueId++ + '. ' + message + (data ? ':<br/>' + JSON.stringify(data) : '')
        if (log.children.length) { log.insertBefore(el, log.children[0]) }
        else { log.appendChild(el) }
    }
    bridge.init(function(message, responseCallback) {
                log('JS got a message', message)
                var data = { 'Javascript Responds':'Wee!' }
                log('JS responding with', data)
                responseCallback(data)
                })
    
    bridge.registerHandler('testJavascriptHandler', function(data, responseCallback) {
                           log('ObjC called testJavascriptHandler with', data)
                           var responseData = { 'Javascript Says':'Right back atcha!' }
                           log('JS responding with', responseData)
                           responseCallback(responseData)
                           })
            
    var callbackContainer = document.getElementsByClassName('container-fluid')[0];
    log("the container!");
    log(callbackContainer);
    callbackContainer.ontouchstart = function(e) {
        e.preventDefault();
        log("clicked the container");
        bridge.callHandler('elementHandler', {'element': 'container'}, function(response) {
                           log('Container got response', response);
                           });
    }
}
