(function(win, doc) {
    if (0 < doc.querySelectorAll('.arithmatex').length) {
        win.MathJax = {
            options: {
                ignoreHtmlClass: 'tex2jax_ignore',
                processHtmlClass: 'tex2jax_process',
                renderActions: {
                    find: [10, function (page) {
                        var nodes = doc.querySelectorAll('script[type^="math/tex"]');
                        for (var i = 0; i < nodes.length; i++) {
                            var node = nodes[i];
                            var display = !!node.type.match(/; *mode=display/);
                            var math = new page.options.MathItem(node.textContent, page.inputJax[0], display);
                            var text = doc.createTextNode('');
                            var sibling = node.previousElementSibling;
                            node.parentNode.replaceChild(text, node);
                            math.start = {node: text, delim: '', n: 0};
                            math.end = {node: text, delim: '', n: 0};
                            page.math.push(math);
                            if (sibling && sibling.matches('.MathJax_Preview')) {
                                sibling.parentNode.removeChild(sibling);
                            }
                        }
                        delete nodes;
                    }, '']
                }
            }
        };
        win.taskQueue.enqueue('create', 'script', {src: '//cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js', id: 'MathJax-script', async: true});
    }
    return true;
})(window, document);
