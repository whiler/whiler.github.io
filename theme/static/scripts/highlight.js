(function(win, doc) {
    var highlightReady = true, selector = 'pre:not([class^=uml-]) code';
    if (0 < doc.querySelectorAll(selector).length) {
        win.taskQueue.enqueue('create', 'link', {rel: 'stylesheet', href: '//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/default.min.css'});
        win.taskQueue.enqueue('create', 'script', {src: '//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js'});
        win.taskQueue.enqueue('wait',
                              function() { return 'undefined' != typeof(hljs); },
                              function() {
                                  var codes = doc.querySelectorAll(selector);
                                  for (var i = 0; i < codes.length; i++) {
                                      hljs.highlightBlock(codes[i]);
                                  }
                                  delete codes;
                                  return true;
                              });
    }
    return true;
})(window, document);
