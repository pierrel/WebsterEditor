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

    bridge.registerHandler('removeElementHandler', function(data, responseCallback) {
	// remove selected
	$('.selected').remove();
    });

    // add container events
    var els = document.getElementsByClassName('container-fluid');
    for (var i = 0, len = els.length; i < len; i++) {
	var element = els[i];
	element.addEventListener("click", containerListener, false);
    }

    // add default event
    document.addEventListener("click", defaultListener, false);


    var sel = 'selected';
    function containerListener(event) {
	var el = $(event.currentTarget);
	
	if (!el.hasClass(sel)) {
	    el.addClass(sel);
	    // get dimensions
	    var pos = el.offset();
	    var width = el.width();
	    var height = el.height();
	    bridge.callHandler('containerSelectedHandler', {
		top: pos.top, 
		left: pos.left, 
		width: width, 
		height: height, 
		classes: el.attr('class').split(' ')
	    });
	    event.stopPropagation();
	    event.preventDefault();
	}
    }

    function defaultListener(event) {
	$('.' + sel).removeClass(sel);
	bridge.callHandler('defaultSelectedHandler', {});
    }
}