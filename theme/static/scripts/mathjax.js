(function(win, doc) {
    var nodes = doc.querySelectorAll('script[type^="math/tex"]'),
        reg = /\s*\\ce{/,
        cfg = "MathJax.Ajax.config.path['mhchem'] = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax-mhchem/3.3.0';" +
              "MathJax.Hub.Config({TeX: {extensions: ['[mhchem]/mhchem.js']}});";
    if (0 < nodes.length) {
        for (var i = 0; i < nodes.length; i++) {
            if (reg.test(nodes[i].textContent)) {
                win.taskQueue.enqueue('create', 'script', {'type': 'text/x-mathjax-config', 'innerHTML': cfg, 'text': cfg});
                break;
            }
        }
        win.taskQueue.enqueue('create', 'script', {src: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.3/latest.js?config=TeX-MML-AM_CHTML'});
    }
    delete nodes, reg;
    return true;
})(window, document);