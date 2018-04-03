(function() {
    var highlightReady = true, selector = 'pre:not([class^=uml-]) code';
    if (0 < document.querySelectorAll(selector).length) {
        taskQueue.enqueue('create', 'link', {rel: 'stylesheet', href: '//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/default.min.css'});
        taskQueue.enqueue('create', 'script', {src: '//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js'});
        taskQueue.enqueue('wait',
                          function() { return 'undefined' != typeof(hljs); },
                          function() {
                              var codes = document.querySelectorAll(selector);
                              for (var i = 0; i < codes.length; i++) {
                                  hljs.highlightBlock(codes[i]);
                              }
                              delete codes;
                              return true;
                          });
    } else {
        console.debug('no code tag');
    }
})();
