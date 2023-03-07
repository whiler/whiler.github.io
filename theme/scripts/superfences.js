(function(win, doc) {
    var flowchartSelector = 'pre code[class=language-flow]',
        sequenceSelector = 'pre code[class=language-sequence]',
        dotSelector = 'pre code[class=language-dot]',
        whitespace = /^\s*$/;

    function getParentPre(node) {
        var parentNode = node.parentNode;
        while (parentNode && parentNode.nodeName.toUpperCase() != 'PRE') {
            parentNode = parentNode.parentNode;
        }
        return parentNode;
    }

    function uml(converter, selector, settings) {
        var codes = doc.querySelectorAll(selector);
        for (var i = 0; i < codes.length; i++) {
            var code = codes[i];
            for (var j = 0; j < code.childNodes.length; j++) {
                var child = code.childNodes[j];
                if (child.nodeName == '#text' && !whitespace.test(child.nodeValue)) {
                    var div = doc.createElement('div'),
                        pre = getParentPre(code),
                        parentNode = pre.parentNode;
                    div.className = 'center';
                    parentNode.replaceChild(div, pre);
                    converter.parse(child.nodeValue).drawSVG(div, settings);
                    delete div, pre, parentNode;
                }
            }
        }
        delete codes;
        return true;
    }

    function dot(selector, settings) {
        doc.querySelectorAll(selector).forEach(function(code, i) {
            if (!whitespace.test(code.textContent)) {
               try {
                   (new Viz()).renderSVGElement(code.textContent).then(function(svg) {
                       var div = doc.createElement('div'),
                           pre = getParentPre(code),
                           parentNode = pre.parentNode;
                       div.className = 'center';
                       div.appendChild(svg);
                       parentNode.replaceChild(div, pre);
                   });
               } catch(e) { console.error(err); };
            }
            return false;
        });
        return true;
    }

    if (0 < doc.querySelectorAll(flowchartSelector).length) {
        win.taskQueue.enqueue('create', 'script', {src: '//cdnjs.cloudflare.com/ajax/libs/raphael/2.3.0/raphael.min.js'});
        win.taskQueue.enqueue('wait',
                              function() { return typeof(Raphael) != 'undefined'; },
                              function() {
                                  return win.taskQueue.enqueue('create', 'script', {src: '//cdnjs.cloudflare.com/ajax/libs/flowchart/1.17.1/flowchart.min.js'});
                              });
        win.taskQueue.enqueue('wait',
                              function() { return typeof(flowchart) != 'undefined'; },
                              function() {
                                  return uml(flowchart, flowchartSelector, {});
                              })
    }

    if (0 < doc.querySelectorAll(sequenceSelector).length) {
        win.taskQueue.enqueue('create', 'script', {src: '//cdnjs.cloudflare.com/ajax/libs/webfont/1.6.28/webfontloader.js'});
        win.taskQueue.enqueue('create', 'script', {src: '//cdnjs.cloudflare.com/ajax/libs/snap.svg/0.5.1/snap.svg-min.js'});
        win.taskQueue.enqueue('create', 'script', {src: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.13.6/underscore-min.js'});
        win.taskQueue.enqueue('create', 'link', {rel: 'stylesheet', href: '//cdn.jsdelivr.net/npm/js-sequence-diagram@2.0.1/dist/sequence-diagram-min.min.css'});
        win.taskQueue.enqueue('wait',
                              function() { return typeof(_) != 'undefined' && typeof(Snap) != 'undefined' && typeof(WebFont) != 'undefined'; },
                              function() {
                                  return win.taskQueue.enqueue('create', 'script', {src: '//cdn.jsdelivr.net/npm/js-sequence-diagram@2.0.1/dist/sequence-diagram.min.js'});
                              });
        win.taskQueue.enqueue('wait',
                              function() { return typeof(Diagram) != 'undefined'; },
                              function() {
                                  return uml(Diagram, sequenceSelector, {theme: 'hand'});
                              })
    }

    if (0 < doc.querySelectorAll(dotSelector).length) {
        win.taskQueue.enqueue('create', 'script', {src: '//cdnjs.cloudflare.com/ajax/libs/viz.js/2.1.2/viz.js'});
        win.taskQueue.enqueue('create', 'script', {src: '//cdnjs.cloudflare.com/ajax/libs/viz.js/2.1.2/full.render.js'});
        win.taskQueue.enqueue('wait',
                              function() { return typeof(Viz) != 'undefined' && typeof(Viz.render) != 'undefined'; },
                              function() {
                                  return dot(dotSelector, {});
                              });
    }

    return true;
})(window, document);
