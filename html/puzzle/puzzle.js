(function(win, doc) {
	function getQueryVariable(name) {
		var query = win.location.search.substring(1),
			vars = query.split("&");
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=");
			if (decodeURIComponent(pair[0]) == name) {
				return decodeURIComponent(pair[1]);
			}
		}
		return null;
	}

	var size = getQueryVariable("size") || "5x4",
		reg = /(\d+)x(\d+)/, size = reg.test(size) ? size : "5x4", match = reg.exec(size), cols = parseInt(match[1]), rows = parseInt(match[2]),
		rows = rows > 1 ? rows : 2, cols = cols > 1 ? cols : 2,
		vwidth = doc.documentElement.clientWidth, vheight = doc.documentElement.clientHeight,
		width = vwidth / cols, height = vheight / rows,
		table = doc.createElement("table"),
		current = rows * cols - 1, path = [], delay = parseInt(getQueryVariable("delay")) || 0, flash = 6, interval = null, cache = null;

	function swapable(rows, cols, current, target) {
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
		return false
	}

	function move(e) {
		return handler(e.target);
	}

	function handler(dst) {
		var pos = null, className = null,  empty = null,
			block = null, target = null;
		if ("number" == typeof(dst)) {
			target = dst;
		} else {
			block = dst;
			target = parseInt(block.id);
		}
		if (swapable(rows, cols, current, target)) {
			block = block || doc.getElementById(target);
			empty = doc.getElementById(current);
			pos = block.style.backgroundPosition;
			block.style.backgroundPosition = empty.style.backgroundPosition;
			empty.style.backgroundPosition = pos;
			className = block.className;
			block.className = empty.className;
			empty.className = className;
			current = target;
			delete empty;
		}
		if ("number" == typeof(dst)) {
			delete block;
		}
		return true;
	}

	function shuffle () {
		var target = path.shift();
		if (undefined != target) {
			handler(target);
			setTimeout(shuffle, delay);
		}
		return true;
	}

	function start() {
		var empty = doc.getElementById(current),
			n = 0, steps = Math.pow(Math.max(rows, cols), 2),
			target = 0, block = 0, r = 0.0, cur = current, row = 0, col = 0;
		empty.style.backgroundPositionX = width + "px";
		empty.style.backgroundPositionY = height + "px";
		empty.className = "empty";
		delete empty;

		while (n < steps) {
			i++;
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
			if (swapable(rows, cols, cur, target) && target != block) {
				path.push(target);
				block = cur;
				cur = target;
				n++;
			}
		}
		delay = delay || 1000 / path.length;
		setTimeout(shuffle, delay);

		return true;
	}

	function flasher() {
		if (0 < flash) {
			var empty = doc.getElementById(current);
			if (0 == flash % 2) {
				cache = {'X': empty.style.backgroundPositionX, 'Y': empty.style.backgroundPositionY};
				empty.style.backgroundPositionX = width + "px";
				empty.style.backgroundPositionY = height + "px";
			} else {
				empty.style.backgroundPositionX = cache.X;
				empty.style.backgroundPositionY = cache.Y;
			}
			flash--;
		} else {
			clearInterval(interval);
		}
		return true;
	}

	win.onresize = function(e) {
		var vwidth = doc.documentElement.clientWidth, vheight = doc.documentElement.clientHeight,
			width = vwidth / cols, height = vheight / rows,
			cells = table.getElementsByTagName("td");
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.width = (width - 2).toFixed(2) + "px";
			cells[i].style.height = (height - 2).toFixed(2) + "px";
		}
		delete cells;
		return true;
	};

	for (var i = 0; i < rows; i ++) {
		var row = doc.createElement("tr");
		for (var j = 0; j < cols; j++) {
			var cell = doc.createElement("td"), id = i * cols + j;
			cell.style.backgroundPositionX = (-j * width) + "px";
			cell.style.backgroundPositionY = (-i * height) + "px";
			cell.style.width = (width - 2).toFixed(2) + "px";
			cell.style.height = (height - 2).toFixed(2) + "px";
			cell.id = id;
			cell.onclick = move;
			row.appendChild(cell);
			delete cell;
		}
		table.appendChild(row);
		delete row;
	}
	doc.getElementById("container").appendChild(table);

	interval = setInterval(flasher, 1000 / flash);
	setTimeout(start, 1500);

	return true;
})(window, document);