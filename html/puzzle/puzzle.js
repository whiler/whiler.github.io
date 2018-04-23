(function(win, doc) {
    "use strict";

    function template(tpl, ctx) {
        return tpl.replace(/\{(\w+)\}/g, function(m, key) {
            return key in ctx ? ctx[key] : key;
        });
    }

    // {{{ BinaryHeap
    // 0. 33297
    // 1. 25120
    // 2. 13277
    // 3. 13101
    // 4. 12828
    // 5. 10036
    // 6. 382
    // 7. 181
    function BinaryHeap(keyFunction, scoreFunction) {
        this.content = [];
        this.map = {};
        this.keyFunction = keyFunction;
        this.scoreFunction = scoreFunction;
    }
    BinaryHeap.prototype = {
        push: function(node) {
            this.content.push(node);
            this.map[this.keyFunction(node)] = this.bubbleUp(this.content.length - 1, node,
                                                             this.scoreFunction(node));
            return true;
        },
        pop: function() {
            var result = this.content[0], end = this.content.pop();
            if (this.content.length > 0) {
                this.content[0] = end;
                this.map[this.keyFunction(end)] = this.sinkDown(0, end, this.scoreFunction(end));
            }
            delete this.map[this.keyFunction(result)];
            return result;
        },
        get: function(key) {
            return this.map.hasOwnProperty(key) ? this.content[this.map[key]] : null;
        },
        size: function() {
            return this.content.length;
        },
        update: function(key) {
            var idx = this.map[key], node = this.content[idx], score = this.scoreFunction(node);
            idx = this.bubbleUp(idx, node, score);
            this.map[key] = this.sinkDown(idx, node, score);
            return true;
        },
        bubbleUp: function(n, node, score) {
            var parentIdx = null, parent = null;
            while (n > 0) {
                parentIdx = ((n + 1) >> 1) - 1;
                parent = this.content[parentIdx];
                if (score < this.scoreFunction(parent)) {
                    this.content[parentIdx] = node;
                    this.content[n] = parent;
                    this.map[this.keyFunction(parent)] = n;
                    n = parentIdx;
                } else {
                    break;
                }
            }
            return n;
        },
        sinkDown: function(n, node, score) {
            var length = this.content.length,
                left = null, leftIdx = null, leftScore = null,
                right = null, rightIdx = null, rightScore = null,
                swap = null, swapKey = null;

            while (true) {
                rightIdx = (n + 1) << 1;
                leftIdx = rightIdx - 1;
                swap = null;
                swapKey = null;
                if (leftIdx < length) {
                    left = this.content[leftIdx];
                    leftScore = this.scoreFunction(left);
                    if (leftScore < score) {
                        swap = leftIdx;
                        swapKey = this.keyFunction(left);
                    }
                }
                if (rightIdx < length) {
                    right = this.content[rightIdx];
                    rightScore = this.scoreFunction(right);
                    if (rightScore < (swap === null ? score : leftScore)) {
                        swap = rightIdx;
                        swapKey = this.keyFunction(right);
                    }
                }
                if (swap !== null) {
                    this.content[n] = this.content[swap];
                    this.content[swap] = node;
                    this.map[swapKey] = n;
                    n = swap;
                } else {
                    break;
                }
            }

            return n;
        }
    };
    // }}}
    // {{{ puzzle
    function puzzle(win, doc, container, table) {
        var mode = null, img = null,
            grids = {"simple": "2x3", "normal": "3x5", "hard": "5x5"},
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
            tds = null;
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
                    td = null;
                }
                table.appendChild(tr);
                tr = null;
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
            tds = null;
            cur = null;
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
            var callee = function() {
                var cur = block.className.trim();
                if (elapsed < duration) {
                    block.className = (cur.indexOf(className) != -1 ? cur.replace(className, "") : cur + " " + className).trim();
                    elapsed += 1000 / 6;
                    setTimeout(callee, 1000 / 6);
                } else {
                    block.className = origin;
                    block = null;
                    callback && callback();
                }
                return true;
            };
            setTimeout(callee, 1000 / 6);
            return true;
        }
        // }}}
        // {{{ doshuffle
        function doshuffle() {
            var end = Math.pow(Math.max(rows, cols), 2), delay = 0,
                cur = current, target = -1, block = -1,
                row = 0, col = 0,
                path = [],
                callee = null;
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
            callee = function() {
                var target = path.shift();
                if (target != undefined) {
                    gopath.push(target);
                    walk(target);
                    setTimeout(callee, delay);
                } else {
                    startat = new Date();
                }
                return true;
            };
            setTimeout(callee, delay);
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
            block = null;
            cur = null;
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
            tds = null;
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
                    cur = null;
                    return docongratulation({"elapsed": elapsed, "steps": steps});
            });});
            return true;
        }
        // }}}
        // {{{ replay
        function replay(callback) {
            var path = gopath.concat(comepath), delay = 2000 / path.length, callee = null;
            callee = function() {
                var target = path.shift();
                if (target != undefined) {
                    walk(target);
                    setTimeout(callee, delay);
                } else {
                    callback();
                }
                return true;
            };
            setTimeout(callee, delay);
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
            tds = null;
            return true;
        }
        // }}}
        // {{{ auto
        function auto() {
            var tds = table.querySelectorAll("td"), src = [], dest = [], path = null, cur = -1,
                callee = null;
            playing = false;
            for (var i = 0; i < tds.length; i++) {
                var row = Math.abs(Math.round(parseInt(tds[i].style.backgroundPositionY) / height)),
                    col = Math.abs(Math.round(parseInt(tds[i].style.backgroundPositionX) / width));
                src.push(row * cols + col);
                dest.push(i);
                if (i == current) {
                    cur = row * cols + col;
                }
            }
            tds = null;
            path = astar(rows, cols, src, dest, cur);
            if (path) {
                callee = function() {
                    var target = path.pop();
                    if (target != undefined) {
                        comepath.push(target);
                        walk(target);
                        setTimeout(callee, 50);
                    } else if (checkresolved()) {
                        resolved = new Date();
                        congratulation();
                    }
                    return true;
                };
                setTimeout(callee, 50);
            } else {
                console.debug("astar failed", src, cur);
                playing = true;
            }
            return true;
        }
        // }}}
        // {{{ astar
        function encode(ns) {
            return String.fromCharCode.apply(null, ns);
        }
        function decode(asciis) {
            var ret = [];
            for (var i = 0, len = asciis.length; i < len; i++) {
                ret.push(asciis.charCodeAt(i));
            }
            return ret;
        }
        function getHeuristic(src, dest) {
            var heuristic = 0;
            for (var i = 0; i < dest.length; i++) {
                if (dest[i] != src[i]) {
                    heuristic++;
                }
            }
            return heuristic;
        }
        function getChildren(rows, cols, node, cur) {
            var nodestate = decode(node.id), i = node.target,
                children = [],
                state = null, t = null;
            if (i + cols < rows * cols) {
                state = nodestate.slice(0);
                t = state[i + cols];
                state[i + cols] = cur;
                state[i] = t;
                children.push({
                    id: encode(state),
                    parent: node,
                    gscore: 0,
                    heuristic: 0,
                    factor: 0,
                    target: i + cols
                });
            }
            if (i - cols >= 0) {
                state = nodestate.slice(0);
                t = state[i - cols];
                state[i - cols] = cur;
                state[i] = t;
                children.push({
                    id: encode(state),
                    parent: node,
                    gscore: 0,
                    heuristic: 0,
                    factor: 0,
                    target: i - cols
                });
            }
            if (i % cols + 1 < cols) {
                state = nodestate.slice(0);
                t = state[i + 1];
                state[i + 1] = cur;
                state[i] = t;
                children.push({
                    id: encode(state),
                    parent: node,
                    gscore: 0,
                    heuristic: 0,
                    factor: 0,
                    target: i + 1
                });
            }
            if (i % cols - 1 >= 0) {
                state = nodestate.slice(0);
                t = state[i - 1];
                state[i - 1] = cur;
                state[i] = t;
                children.push({
                    id: encode(state),
                    parent: node,
                    gscore: 0,
                    heuristic: 0,
                    factor: 0,
                    target: i - 1
                });
            }
            return children;
        }
        function astar(rows, cols, src, dest, cur) {
            var openset = null, closeset = {},
                found = false, path = [],
                children = null, child = null, curr = null, idx = 0, dup = null, gscore = 0,
                start = encode(src), target = encode(dest);

            openset = new BinaryHeap(function(node) { return node.id; },
                                     function(node) { return node.factor; });
            openset.push({
                id: start,
                parent: null,
                gscore: 0,
                heuristic: getHeuristic(start, target),
                factor: getHeuristic(start, target),
                target: src.indexOf(cur)
            });
            while (openset.size() && !found) {
                curr = openset.pop();
                closeset[curr.id] = true;
                children = getChildren(rows, cols, curr, cur);
                for (var i = 0, len = children.length; i < len; i++) {
                    idx = -1;
                    dup = null;
                    gscore = curr.gscore + 1;
                    child = children[i];
                    if (child.id in closeset) {
                        continue;
                    } else if (child.id == target) {
                        while (child.parent) {
                            path.push(child.target);
                            child = child.parent;
                        }
                        found = true;
                        break;
                    }
                    dup = openset.get(child.id);
                    if (!dup) {
                        child.gscore = gscore;
                        child.heuristic = getHeuristic(child.id, target);
                        child.factor = child.gscore + child.heuristic;
                        openset.push(child);
                    } else if (dup.gscore > gscore) {
                        dup.gscore = gscore;
                        dup.factor = gscore + dup.heuristic;
                        dup.parent = curr;
                        openset.update(child.id);
                    }
                }
            }

            return path;
        }
        // }}}

        win.addEventListener("resize", resizer, false);

        return {update: update,
                start: start,
                reset: reset,
                auto: auto,
                onCongratulation: onCongratulation,
                onTip: onTip,
                onMove: onMove}
    }
    // }}}
    // {{{ app
    function app(win, doc) {
        var imgs = ["cat.jpg", "husky.jpg", "cat.jpg", "husky.jpg", "cat.jpg", "smile.jpg", "husky.jpg", "cat.jpg", "smile.jpg", "cat.jpg"], img = imgs[Math.floor(Math.random() * imgs.length)],
            container = doc.getElementById("container"), sections = container.querySelectorAll("section"),
            launcher = sections[0], playing = sections[1], congratulation = sections[2], gamebox = container.querySelectorAll("table")[0],
            radios = launcher.querySelectorAll("input[type=radio][name=mode]"), start = launcher.querySelectorAll("input[type=button]")[0],
            restart = congratulation.querySelectorAll("input[type=button][name=restart]")[0],
            reset = playing.querySelectorAll("input[type=button][name=reset]")[0], auto = playing.querySelectorAll("input[type=button][name=auto]")[0],
            game = null;
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
            ems = null;
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
        auto.addEventListener("click", function(e) {
            playing.style.display = "none";
            return game.auto();
        }, false);

        return true;
    }
    // }}}

    function launcher () {
        return doc.readyState == "complete" ? app(win, doc) : setTimeout(launcher, 200);
    }

    setTimeout(launcher, 200);

    return true;
})(window, document);
