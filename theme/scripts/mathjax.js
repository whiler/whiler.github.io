(function(win, doc) {
    var nodes = doc.querySelectorAll('.arithmatex');
    if (0 < nodes.length) {
        win.taskQueue.enqueue('create', 'script', {src: '//polyfill.io/v3/polyfill.min.js?features=es6'});
        win.taskQueue.enqueue('create', 'script', {src: '//cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js', id: 'MathJax-script', async: true});
    }
    delete nodes;
    return true;
})(window, document);
