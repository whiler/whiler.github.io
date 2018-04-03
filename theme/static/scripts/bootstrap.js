(function(win, doc) {
    function getQueryVariable(name) {
		var query = win.location.search.substring(1),
		    vars = query.split('&');
    	for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split('=');
			if (decodeURIComponent(pair[0]) == name) {
				return decodeURIComponent(pair[1]);
			}
    	}
		return null;
    }

	function handleTask(args) {
		var action = args[0];
		if ('create' == action) {
			var element = doc.createElement(args[1]), attrs = args[2];
			for (var name in attrs) {
				element.setAttribute(name, attrs[name]);
			}
			(doc.head || doc.body).appendChild(element);
			delete element;
		} else if ('wait' == action) {
			if (args[1]()) {
				args[2]();
			} else {
				taskQueue.enqueue('wait', args[1], args[2]);
			}
		} else {
			console.warn(args);
			return false;
		}
		return true;
	}

	if ('undefined' != typeof(win.Worker) && 'undefined' != typeof(doc.querySelectorAll) && !getQueryVariable('noscript')) {
		var times = 0, max = 200, sleep = 300, domReady = false;
		var consumer = function() {
			times++;
			var taskLength = taskQueue.getLength();
			domReady = domReady || doc.readyState === 'complete';
			if (domReady && 0 < taskLength) {
				console.info(taskQueue.getLength() + ' task(s) in taskQueue');
				for (var i = 0; i < taskLength; i++) {
					handleTask(taskQueue.dequeue());
				}
			}
			if (times < max) {
				setTimeout(consumer, sleep);
			} else {
				console.warn('ignore any task');
			}
			return true;
		};
		setTimeout(consumer, sleep);
	}
    return true;
})(window, document);
