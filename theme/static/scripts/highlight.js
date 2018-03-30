(function() {
    var highlightReady = true;
    if (0 < document.querySelectorAll('pre code').length) {
        taskQueue.enqueue('create', 'link', {rel: 'stylesheet', href: '//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/default.min.css'});
        taskQueue.enqueue('create', 'script', {async: true, src: '//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js'});
        taskQueue.enqueue('wait',
                          function() { return 'undefined' != typeof(hljs); },
                          function() {
                              var codes = document.querySelectorAll('pre code');
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
