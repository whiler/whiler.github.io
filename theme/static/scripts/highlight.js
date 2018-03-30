(function() {
	var domReady = false, highlightReady = true;
	function importHighlight() {
		var script = document.createElement('script');
		script.async = true;
		script.src = '//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js';
		document.head.appendChild(script);
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = '//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/default.min.css';
		document.head.appendChild(link);
	}
	function initHighlight() {
		var codes = document.getElementsByTagName('code');
		for (var i = 0; i < codes.length; i++) {
			hljs.highlightBlock(codes[i]);
		}
		delete codes;
		return true;
	}

	var interval = setInterval(function() {
			console.debug('interval checking');
			if (!domReady) {
				if (document.readyState === 'complete') {
					console.debug('document ready');
					domReady = true;
					if (0 < document.getElementsByTagName('code').length) {
						console.debug('importHighlight');
						highlightReady = false;
						importHighlight();
					} else {
						console.debug('no code tag');
					}
				}
			} else if (!highlightReady) {
				highlightReady = 'undefined' != typeof(hljs);
				if (highlightReady) {
					console.debug('initHighlight');
					initHighlight();
				}
			} else {
				console.debug('destory interval');
				clearInterval(interval);
			}
			return true;
		},
		200);
})();
