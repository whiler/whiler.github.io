(function(win, doc) {
	function getQueryVariable(name) {
		var query = win.location.search.substring(1),
			vars = query.split('&');
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split('=');
			if (decodeURIComponent(pair[0]) == name) {
				return decodeURIComponent(pair[1]);
			}
		}
		return null;
	}

	function template(tpl, ctx) {
		return tpl.replace(/{(\w+)}/g, function(m, key) {
			return key in ctx ? ctx[key] : key;
		});
	}

	function puzzle(win, doc, ID, settings) {
		var container = doc.getElementById(ID),
			table = doc.createElement('table'),
			grid = settings.grid || '4x3',
			cols = 0, rows = 0, width = 0, height = 0,
			path = [], gopath = [], comepath = [],
			startat = null, resolved = null,
			current = -1, className = 'empty',
			mode = settings.mode || 'normal',
			img = settings.img;

		// {{{ init
		function init() {
			var match = /(\d+)x(\d+)/.exec(grid);
			// adjust cols and rows base on clientWidth/clientHeight
			if (container.clientWidth >= container.clientHeight) {
				cols = Math.max.apply(Math, match.slice(1));
				rows = Math.min.apply(Math, match.slice(1));
			} else {
				cols = Math.min.apply(Math, match.slice(1));
				rows = Math.max.apply(Math, match.slice(1));
			}
			rows = Math.max(rows, 2);
			cols = Math.max(cols, 2);
			width = container.clientWidth / cols;
			height = container.clientHeight / rows;

			for (var i = 0; i < rows; i++) {
				var tr = doc.createElement('tr');
				for (var j = 0; j < cols; j++) {
					var td = doc.createElement('td'), idx = i * cols + j;
					td.id = idx;
					td.addEventListener('click', clicker);
					td.style.backgroundPositionX = (-j * width) + 'px';
					td.style.backgroundPositionY = (-i * height) + 'px';
					td.style.width = (width - 2).toFixed(2) + 'px';
					td.style.height = (height - 2).toFixed(2) + 'px';
					if (img) {
						td.style.backgroundImage = 'url(' + img + ')';
					}
					tr.appendChild(td);
					delete td;
				}
				table.appendChild(tr);
				delete tr;
			}

			container.appendChild(table);
			win.addEventListener('resize', resizer);

			// current
			current = rows * cols - 1;
			return true;
		}
		// }}}
		// {{{ flash
		function flash(duration, callback) {
			var duration = duration || 1000, elapsed = 0,
				block = doc.getElementById(current),
				origin = block.className.trim();
			setTimeout(function() {
				var cur = block.className.trim();
				if (elapsed < duration) {
					block.className = (cur.indexOf(className) != -1 ? cur.replace(className, '') : cur + ' ' + className).trim();
					elapsed += 1000 / 6;
					setTimeout(arguments.callee, 1000 / 6);
				} else {
					block.className = origin;
					delete block;
					callback();
				}
				return true;
			}, 1000 / 6);
			return true;
		}
		// }}}
		// {{{ shuffle
		function shuffle() {
			flash(1000, doshuffle);
			return true;
		}
		// }}}
		// {{{ doshuffle
		function doshuffle() {
			var end = 0, delay = 0,
				cur = current, target = -1, block = -1,
				row = 0, col = 0;
			if (mode == 'simple') {
				end = rows + cols;
			} else if (mode == 'hard') {
				end = Math.pow(Math.max(rows, cols), 3);
			} else {
				end = Math.pow(Math.max(rows, cols), 2);
			}
			while (path.length < end) {
				row = Math.floor(cur / cols), col = cur % cols;
				if (Math.random() < 0.5) {
					if (Math.random() < (row + 1) / rows) {
						target = cur - cols;
					} else {
						target = cur + cols;
					}
				} else {
					if (Math.random() < (col + 1) / cols) {
						target = cur - 1;
					} else {
						target = cur + 1;
					}
				}
				if (moveable(rows, cols, cur, target) && target != block) {
					path.push(target);
					block = cur;
					cur = target;
				}
			}
			delay = 1000 / end;
			setTimeout(function() {
				var target = path.shift();
				if (target != undefined) {
					gopath.push(target);
					walk(target);
					setTimeout(arguments.callee, delay);
				} else {
					startat = new Date();
				}
				return true;
			}, delay);
			doc.getElementById(current).className = className;
			return true;
		}
		// }}}
		// {{{ clicker
		function clicker(e) {
			var target = parseInt(e.target.id);
			if (startat && !resolved && moveable(rows, cols, current, target)) {
				comepath.push(target);
				walk(target);
				if (checkresolved()) {
					resolved = new Date();
					congratulation();
				}
			}
			return true;
		}
		// }}}
		// {{{ resizer
		function resizer(e) {
			var newwidth = container.clientWidth / cols,
				newheight = container.clientHeight / rows;
			var tds = container.getElementsByTagName('td'), idx = 0;
			for (var i = 0; i < rows; i++) {
				for (var j = 0; j < cols; j++) {
					idx = i * cols + j;
					tds[idx].style.backgroundPositionX = (parseFloat(tds[idx].style.backgroundPositionX) / width * newwidth) + 'px';
					tds[idx].style.backgroundPositionY = (parseFloat(tds[idx].style.backgroundPositionY) / height * newheight) + 'px';
					tds[idx].style.width = (newwidth - 2).toFixed(2) + 'px';
					tds[idx].style.height = (newheight - 2).toFixed(2) + 'px';
				}
			}
			width = newwidth;
			height = newheight;
			delete tds;
			return true;
		}
		// }}}
		// {{{ moveable
		function moveable(rows, cols, current, target) {
			var row = Math.floor(current / cols), col = current % cols;
			if (target != current) {
				if (target == current + cols && target < rows * cols) {
					return true;
				} else if (target == current - cols && target >= 0) {
					return true;
				} else if (target == current - 1 && col != 0) {
					return true;
				} else if (target == current + 1 && col != cols - 1) {
					return true;
				}
			}
			return false;
		}
		// }}}
		// {{{ walk
		function walk(dest) {
			var cur = doc.getElementById(current),
				block = doc.getElementById(dest),
				className = cur.className,
				backgroundPosition = cur.style.backgroundPosition;
			cur.className = block.className;
			block.className = className;
			cur.style.backgroundPosition = block.style.backgroundPosition;
			block.style.backgroundPosition = backgroundPosition;
			current = dest;
			delete block;
			delete cur;
			return true;
		}
		// }}}
		// {{{ checkresolved
		function checkresolved() {
			var tds = table.getElementsByTagName('td'), idx = 0, stop = false;
			for (var i = 0; i < rows; i++) {
				for (var j = 0; j < cols; j++) {
					idx = i * cols + j;
					if (parseInt(tds[idx].style.backgroundPositionX) != parseInt(-j * width)) {
						stop = true;
						break;
					} else if (parseInt(tds[idx].style.backgroundPositionY) != parseInt(-i * height)) {
						stop = true;
						break;
					}
				}
				if (stop) {
					break;
				}
			}
			delete tds;
			return !stop;
		}
		// }}}
		// {{{ congratulation
		function congratulation() {
			console.info('resolved in ' + ((resolved - startat) / 1000).toFixed(2) + 's/' + comepath.length + '.');
			flash(1000, function() {return replay(docongratulation);});
			return true;
		}
		// }}}
		// {{{ replay
		function replay(callback) {
			var path = gopath.concat(comepath), delay = 2000 / path.length;
			setTimeout(function() {
				var target = path.shift();
				if (target != undefined) {
					walk(target);
					setTimeout(arguments.callee, delay);
				} else {
					callback();
				}
				return true;
			}, delay);
			return true;
		}
		// }}}
		// {{{ docongratulation
		function docongratulation() {
			var cur = doc.getElementById(current),
				sections = container.querySelectorAll('.congratulation'),
				ems = container.querySelectorAll('.congratulation em'),
				ctx = {
					'time': ((resolved - startat) / 1000).toFixed(1),
					'steps': comepath.length.toLocaleString(),
				};
			cur.className = cur.className.replace(className, '').trim();
			for (var i = 0; i < ems.length; i++) {
				ems[i].innerHTML = template(ems[i].innerHTML, ctx);
			}
			for (var i = 0; i < sections.length; i++) {
				sections[i].style.display = 'block';
			}
			delete sections
			delete ems;
			delete cur;
			return true;
		}
		// }}}

		init();
		shuffle();

		return true;
	}

	function entry(win, doc) {
		return puzzle(win, doc, 'container', {
			'grid': getQueryVariable('grid'),
			'mode': getQueryVariable('mode'),
			'img': getQueryVariable('img'),
		});
	}

	setTimeout(function() {
		return doc.readyState == 'complete' ? entry(win, doc) : setTimeout(arguments.callee, 200);
	}, 200);

	return true;
})(window, document);
