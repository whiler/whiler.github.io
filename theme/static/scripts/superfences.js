(function() {
	var flowchartSelector = 'pre[class=uml-flowchart] code',
	    sequenceSelector = 'pre[class=uml-sequence-diagram] code',
		whitespace = /^\s*$/,
		classReg = /pre\[class=(.+)\] code/;
	
	function getParentPre(node) {
		var parentNode = node.parentNode;
		while (parentNode && parentNode.nodeName != 'PRE') {
			parentNode = parentNode.parentNode;
		}
		return parentNode;
	}
	
	function uml(converter, selector, settings) {
		var codes = document.querySelectorAll(selector),
			match = classReg.exec(selector),
			className = match != null ? match[1] : null;
		for (var i = 0; i < codes.length; i++) {
			var code = codes[i];
			for (var j = 0; j < code.childNodes.length; j++) {
				var child = code.childNodes[j];
				if (child.nodeName == '#text' && !whitespace.test(child.nodeValue)) {
					var div = document.createElement('div'),
						pre = getParentPre(code),
						parentNode = pre.parentNode;
					if (className) {
						div.className = className;
					}
					parentNode.insertBefore(div, pre);
					converter.parse(child.nodeValue).drawSVG(div, settings);
					parentNode.removeChild(pre);
					delete div, pre, parentNode;
				}
			}
		}
		delete codes;
		return true;
	}

	if (0 < document.querySelectorAll(flowchartSelector).length) {
		taskQueue.enqueue('create', 'script', {src: '//cdnjs.cloudflare.com/ajax/libs/raphael/2.2.7/raphael.min.js'});
		taskQueue.enqueue('wait',
						  function() { return typeof(Raphael) != 'undefined'; },
						  function() {
						      return taskQueue.enqueue('create', 'script', {src: '//cdnjs.cloudflare.com/ajax/libs/flowchart/1.6.5/flowchart.min.js'});
						  });
		taskQueue.enqueue('wait',
						  function() { return typeof(flowchart) != 'undefined'; },
						  function() {
						      return uml(flowchart, flowchartSelector, {});
						  })
	} else {
		console.debug('no flowchart');
	}

	if (0 < document.querySelectorAll(sequenceSelector).length) {
		taskQueue.enqueue('create', 'script', {src: '//cdnjs.cloudflare.com/ajax/libs/snap.svg/0.5.1/snap.svg-min.js'});
		taskQueue.enqueue('create', 'script', {src: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js'});
		taskQueue.enqueue('wait',
						  function() { return typeof(_) != 'undefined'; },
						  function() {
						      return taskQueue.enqueue('create', 'script', {src: '//cdnjs.cloudflare.com/ajax/libs/js-sequence-diagrams/1.0.6/sequence-diagram-min.js'});
						  });
		taskQueue.enqueue('wait',
						  function() { return typeof(Diagram) != 'undefined'; },
						  function() {
						      return uml(Diagram, sequenceSelector, {theme: 'hand'});
						  })
	} else {
		console.debug('no sequence diagram');
	}

	return true;
})();
