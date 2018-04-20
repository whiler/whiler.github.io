(function(win, doc) {
    function template(tpl, ctx) {
        return tpl.replace(/\{(\w+)\}/g, function(m, key) {
            return key in ctx ? ctx[key] : key;
        });
    }

    // {{{ puzzle
    function puzzle(win, doc, container, table) {
        var mode = null, img = null,
            grids = {"simple": "2x3", "normal": "3x5", "hard": "5x7"},
            width = 0, height = 0, cols = 0, rows = 0, reg = /(\d+)x(\d+)/,
            current = -1, startat = null, resolved = null, playing = false,
            className = "empty", gopath = [], comepath = [],
            docongratulation = null, dotip = null, onmove = null;

        // {{{ update
        function update(cfg, callback) {
            img = cfg.img || img;
            if (cfg.mode in grids && cfg.mode != mode) {
                mode = cfg.mode;
                setGrid(container, table, reg.exec(grids[mode]));
                setBackgroundImage(table, img);
            } else if (!mode) {
                mode = "normal";
                setGrid(container, table, reg.exec(grids[mode]));
                setBackgroundImage(table, img);
            }
            return this;
        }
        // }}}
        // {{{ onCongratulation
        function onCongratulation(callback) {
            docongratulation = callback;
            return this;
        }
        // }}}
        // {{{ onTip
        function onTip(callback) {
            dotip = callback;
            return this;
        }
        // }}}
        // {{{ onTip
        function onMove(callback) {
            onmove = callback;
            return this;
        }
        // }}}
        // {{{ setBackgroundImage
        function setBackgroundImage(table, src) {
            var tds = table.querySelectorAll("td");
            for (var i = 0; i < tds.length; i++) {
                tds[i].style.backgroundImage = "url(" + src + ")";
            }
            delete tds;
            return true;
        }
        // }}}
        // {{{ setGrid
        function setGrid(container, table, match) {
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

            while (table.children.length) {
                table.removeChild(table.children[0]);
            }

            for (var i = 0; i < rows; i++) {
                var tr = doc.createElement("tr");
                for (var j = 0; j < cols; j++) {
                    var td = doc.createElement("td"), idx = i * cols + j;
                    td.id = idx;
                    td.style.backgroundPositionX = (-j * width) + "px";
                    td.style.backgroundPositionY = (-i * height) + "px";
                    td.style.width = (width - 2).toFixed(2) + "px";
                    td.style.height = (height - 2).toFixed(2) + "px";
                    td.addEventListener("click", clicker, false);
                    tr.appendChild(td);
                    delete td;
                }
                table.appendChild(tr);
                delete tr;
            }
            return true;
        }
        // }}}
        // {{{ start
        function start() {
            current = -1, startat = null, resolved = null, gopath = [], comepath = [], playing = true;
            return true;
        }
        // }}}
        // {{{ reset
        function reset() {
            var tds = table.querySelectorAll("td"),
                cur = doc.getElementById(current);
            start();
            cur.className = cur.className.replace(className, "").trim();
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < cols; j++) {
                    var idx = i * cols + j;
                    tds[idx].style.backgroundPositionX = (-j * width) + "px";
                    tds[idx].style.backgroundPositionY = (-i * height) + "px";
                }
            }
            delete tds;
            delete cur;
            return true;
        }
        // }}}
        // {{{ clicker
        function clicker(e) {
            var target = parseInt(e.target.id);
            if (playing && -1 == current) {
                current = target;
                flash(1000, doshuffle);
            } else if (startat && !resolved && moveable(rows, cols, current, target)) {
                comepath.push(target);
                walk(target);
                onmove(e);
                if (checkresolved()) {
                    resolved = new Date();
                    playing = false;
                    congratulation();
                }
            } else if (playing && startat && target == current) {
                dotip(e);
            }
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
                    block.className = (cur.indexOf(className) != -1 ? cur.replace(className, "") : cur + " " + className).trim();
                    elapsed += 1000 / 6;
                    setTimeout(arguments.callee, 1000 / 6);
                } else {
                    block.className = origin;
                    delete block;
                    callback && callback();
                }
                return true;
            }, 1000 / 6);
            return true;
        }
        // }}}
        // {{{ doshuffle
        function doshuffle() {
            var end = Math.pow(Math.max(rows, cols), 2), delay = 0,
                cur = current, target = -1, block = -1,
                row = 0, col = 0,
                path = [];
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
            var tds = table.querySelectorAll("td"), idx = 0, stop = false;
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
            var elapsed = resolved - startat, steps = comepath.length;
            console.info("resolved in " + (elapsed / 1000).toFixed(2) + "s/" + steps + ".");
            flash(1000, function() {return replay(function() {
                    var cur = doc.getElementById(current);
                    cur.className = cur.className.replace(className, "").trim();
                    delete cur;
                    return docongratulation({"elapsed": elapsed, "steps": steps});
            });});
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
        // {{{ resizer
        function resizer(e) {
            var newwidth = container.clientWidth / cols,
                newheight = container.clientHeight / rows,
                tds = table.querySelectorAll("td"), idx = 0;
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < cols; j++) {
                    idx = i * cols + j;
                    tds[idx].style.backgroundPositionX = (parseFloat(tds[idx].style.backgroundPositionX) / width * newwidth) + "px";
                    tds[idx].style.backgroundPositionY = (parseFloat(tds[idx].style.backgroundPositionY) / height * newheight) + "px";
                    tds[idx].style.width = (newwidth - 2).toFixed(2) + "px";
                    tds[idx].style.height = (newheight - 2).toFixed(2) + "px";
                }
            }
            width = newwidth;
            height = newheight;
            delete tds;
            return true;
        }
        // }}}

        win.addEventListener("resize", resizer, false);

        return {update: update,
                start: start,
                reset: reset,
                onCongratulation: onCongratulation,
                onTip: onTip,
                onMove: onMove}
    }
    // }}}

    function app(win, doc) {
        var imgs = ["cat.jpg", "husky.jpg", "cat.jpg", "husky.jpg", "cat.jpg", "smile.jpg", "husky.jpg", "cat.jpg", "smile.jpg", "cat.jpg"], img = imgs[Math.floor(Math.random() * imgs.length)],
            container = doc.getElementById("container"), sections = container.querySelectorAll("section"),
            launcher = sections[0], playing = sections[1], congratulation = sections[2], gamebox = container.querySelectorAll("table")[0],
            radios = launcher.querySelectorAll("input[type=radio][name=mode]"), start = launcher.querySelectorAll("input[type=button]")[0],
            restart = congratulation.querySelectorAll("input[type=button][name=restart]")[0],
            reset = playing.querySelectorAll("input[type=button][name=reset]")[0], auto = playing.querySelectorAll("input[type=button][name=auto]")[0];
        // {{{ docongratulation
        function docongratulation(cost) {
            var ems = congratulation.querySelectorAll("em"),
                ctx = {
                    "time": (cost.elapsed / 1000).toFixed(1),
                    "steps": cost.steps.toLocaleString(),
                };
            for (var i = 0; i < ems.length; i++) {
                var tpl = ems[i].getAttribute("tpl");
                if (!tpl) {
                    tpl = ems[i].innerHTML;
                    ems[i].setAttribute("tpl", tpl);
                }
                ems[i].innerHTML = template(tpl, ctx);
            }
            congratulation.style.display = "block";
            delete ems;
            return true;
        }
        // }}}
        // {{{ dotip
        function dotip(e) {
            playing.style.left = e.pageX + "px";
            playing.style.top = e.pageY + "px";
            playing.style.display = "block";
            return true;
        }
        // }}}
        // {{{ onmove
        function onmove(e) {
            playing.style.display = "none";
            return true;
        }
        // }}}
        launcher.style.display = "block";
        game = puzzle(win, doc, container, gamebox, docongratulation);
        game.onCongratulation(docongratulation).onTip(dotip).onMove(onmove);
        game.update({mode:launcher.querySelectorAll("input[type=radio][name=mode]:checked")[0].value, img: img});

        for (var i = 0; i < radios.length; i++) {
            radios[i].addEventListener("change", function(e) { return game.update({mode: e.target.value}); }, false);
        }
        start.addEventListener("click", function(e) {
            launcher.style.display = "none";
            return game.start();
        }, false);
        restart.addEventListener("click", function(e) {
            congratulation.style.display = "none";
            launcher.style.display = "block";
            return true;
        }, false);
        reset.addEventListener("click", function(e) {
            game.reset();
            playing.style.display = "none";
            launcher.style.display = "block";
            return true;
        }, false);

        return true;
    }

    setTimeout(function() {
        return doc.readyState == "complete" ? app(win, doc) : setTimeout(arguments.callee, 200);
    }, 200);

    return true;
})(window, document);
