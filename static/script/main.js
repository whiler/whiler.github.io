require(["common/domReady", "ga"], function(domReady, ga) {
	var TrackerID = "UA-74531835-1";

	function ready() {
		var prefix = "common/",
			index = "/articles/articles.json",
			container = document.querySelector("article"),
			anchor = document.createElement("a"),
			last = null;

		function disqus(path) {
			var div = document.createElement("div");
			div.setAttribute("id", "disqus_thread");
			container.appendChild(div);
			require(["//traced.disqus.com/embed.js"], function(_) {
				DISQUS.reset({
					"reload": true,
					"config": function() {
						this.page.url = location.href;
						this.page.identifier = path;
					}
				});
				return true;
			});
			return true;
		}

		function switcher(e) {
			var url = e ? e.newURL : location.href, path = null;
			anchor.href = url;
			path = anchor.hash.startsWith("#!") ? anchor.hash.substring(2) : index;
			if (path != last) {
				last = path;
				render(path);
				ga("send", "pageview");
			}
			return true;
		}

		function render(path) {
			var list = "list", detail = "markdown-body";
			if (path == index) {
				require([prefix + "mustache.min", prefix + "text!/articles/articles.mustache", prefix + "text!" + path], function(Mustache, template, raw) {
					var articles = JSON.parse(raw),
						articles = articles.map(function(article) {
							var time = article.time * 1000;
							article.time = new Date(time).toLocaleDateString();
							return article;
						}),
						html = Mustache.render(template, {"articles": articles});
					container.classList.remove(detail);
					container.classList.add(list);
					container.innerHTML = html;
					return true;
				});
			} else {
				require([prefix + "marked.min", prefix + "highlight.min", prefix + "text!" + path], function(marked, highlight, raw) {
					marked.setOptions({
						"highlight": function(code, lang) {return highlight.highlightAuto(code, [lang]).value;}
					});
					var html = marked(raw);
					container.classList.remove(list);
					container.classList.add(detail);
					container.innerHTML = html;
					return disqus(path);
				});
			}
			return true;
		}

		window.addEventListener("hashchange", switcher);

		switcher();

		return true;
	}

	ga("create", TrackerID, "auto");

	domReady(ready);

	return true;
});
