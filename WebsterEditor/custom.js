document.addEventListener('WebViewJavascriptBridgeReady', onBridgeReady, false);
function onBridgeReady(event) {
    var bridge = event.bridge;
    var uniqueId = 1;
    function log(message, data) {
        var log = document.getElementById('log');
        var el = document.createElement('div');
        el.className = 'logLine';
        el.innerHTML = uniqueId++ + '. ' + message + (data ? ':<br/>' + JSON.stringify(data) : '');
        if (log.children.length) { log.insertBefore(el, log.children[0]); }
        else { log.appendChild(el); }
    }
    bridge.init(function(message, responseCallback) {
        log('JS got a message', message);
        var data = { 'Javascript Responds':'Wee!' };
        log('JS responding with', data);
        responseCallback(data);
    });
    
    bridge.registerHandler('testJavascriptHandler', function(data, responseCallback) {
        log('ObjC called testJavascriptHandler with', data);
        var responseData = { 'Javascript Says':'Right back atcha!' };
        log('JS responding with', responseData);
        responseCallback(responseData);
    });
    document.body.appendChild(document.createElement('br'));

    var els = document.getElementsByClassName('container-fluid');
    for (var i = 0, len = els.length; i < len; i++) {
	var element = els[i];
	element.addEventListener("click", containerListener, false);
    }
    function containerListener(event) {
	var sel = 'selected';
	var el = $(event.target);
	console.log(el);
	
	if (el.hasClass(sel)) {
	    el.removeClass(sel);
	} else {
	    el.addClass(sel);
	}
    }   
}