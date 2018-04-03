(function(win, doc) {
    var uuid = win.page.get('uuid'), disqus = win.page.get('disqus');
    if (doc.querySelectorAll('#disqus_thread').length && uuid && disqus) {
        win.disqus_config = function () {
            this.page.url = win.location.protocol + '//' + win.location.host + win.location.pathname;
            this.page.identifier = uuid;
            return true;
        };
        win.taskQueue.enqueue('create', 'script', {'src': 'https://'+disqus+'.disqus.com/embed.js', 'data-timestamp': +new Date()});
    }
    return true;
})(window, document);
