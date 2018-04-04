(function(win, doc) {
    var ga = win.page.get('ga');
    if (ga) {
        var dataLayer = win.dataLayer = win.dataLayer || [],
            gtag = win.gtag = win.gtag || function() { return dataLayer.push(arguments); };
        gtag('js', new Date());
        gtag('config', ga);
        win.taskQueue.enqueue('create', 'script', {'src': 'https://www.googletagmanager.com/gtag/js?id=' + ga});
    }
    return true;
})(window, document);