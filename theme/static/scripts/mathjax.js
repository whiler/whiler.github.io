(function(){
	if (0 < document.querySelectorAll('script[type="math/tex; mode=display"]').length) {
		taskQueue.enqueue('create', 'script', {src: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.3/latest.js?config=TeX-MML-AM_CHTML', async: true});
	} else {
		console.debug('no math/tex');
	}
	return true;
})();
