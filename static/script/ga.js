define(function(require, exports, module) {
	var name = "ga";
	window["GoogleAnalyticsObject"] = window["GoogleAnalyticsObject"] || name;
	window[name] = window[name] || function () {
		(window[name].q = window[name].q || []).push(arguments);
		return true;
	};
	window[name].l = (new Date()).getTime();

	require(["//www.google-analytics.com/analytics.js"]);

	return window[name];
});
