(function(win, doc) {
	function create(args) {
	}

	function handleTask(args) {
		var action = args[0];
		if ('create' == action) {
			var element = doc.createElement(args[1]), attrs = args[2];
			for (var name in attrs) {
				element.setAttribute(name, attrs[name]);
			}
			(doc.head || doc.body).appendChild(element);
		} else if ('wait' == action) {
			if (args[1]()) {
				args[2]();
			} else {
				taskQueue.enqueue('wait', args[1], args[2]);
			}
		}
		return console.info(args);
	}

	if ('undefined' != typeof(win.Worker) && 'undefined' != typeof(doc.querySelectorAll)) {
		var times = 0, max = 200, sleep = 300;
		var consumer = function() {
			times++;
			console.debug('consumer checking');
			var taskLength = taskQueue.getLength();
			if (doc.readyState === 'complete' && 0 < taskLength) {
				console.debug(taskQueue.getLength() + ' task(s) in taskQueue');
				for (var i = 0; i < taskLength; i++) {
					handleTask(taskQueue.dequeue());
				}
			}
			if (times < max) {
				setTimeout(consumer, sleep);
			}
			return true;
		};
		setTimeout(consumer, sleep);
	}
    return true;
})(window, document);
