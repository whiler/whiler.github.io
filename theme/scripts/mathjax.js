(function(win, doc) {
    if (0 < doc.querySelectorAll('script[type^="math/tex"]').length) {
        win.taskQueue.enqueue('create', 'script', {src: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.3/latest.js?config=TeX-MML-AM_CHTML'});
    }
    return true;
})(window, document);
