(function(win, doc) {
    var cfg = {};
    var taskQueue = win.taskQueue = win.taskQueue || (function() {
        var queue = [];
        return {
                'enqueue': function() { return queue.push(arguments); },
                'dequeue': function() { return queue.shift(); },
                'getLength': function() { return queue.length; }
        };
    })();
    var page = win.page = win.page || (function() {
        return {'get': function(name) { return cfg[name]; }};
    })();
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

    if ('undefined' != typeof(win.Worker) && 'undefined' != typeof(doc.querySelectorAll) && !getQueryVariable('noscript')) {
        function dispatch(args) {
            var action = args[0];
            if ('create' == action) {
                var element = doc.createElement(args[1]), attrs = args[2];
                for (var name in attrs) {
                    if ('innerHTML' == name || 'text' == name) {
                        element[name] = attrs[name];
                    } else {
                        element.setAttribute(name, attrs[name]);
                    }
                }
                (doc.head || doc.body).appendChild(element);
                delete element;
            } else if ('wait' == action) {
                if (args[1]()) {
                    args[2]();
                } else {
                    taskQueue.enqueue('wait', args[1], args[2]);
                }
            } else {
                console.warn(args);
                return false;
            }
            return true;
        }
        var times = 0, max = 200, sleep = 300, domReady = false, entry = doc.getElementById('entry'), reg = /data-(.+)/;
        var consumer = function() {
            times++;
            var taskLength = taskQueue.getLength();
            domReady = domReady = domReady || doc.readyState === 'complete';
            if (domReady && 0 < taskLength) {
                console.info(taskQueue.getLength() + ' task(s) in taskQueue');
                for (var i = 0; i < taskLength; i++) {
                    dispatch(taskQueue.dequeue());
                }
            }
            if (times < max) {
                setTimeout(consumer, sleep);
            } else {
                console.warn('ignore any task');
            }
            return true;
        };
        setTimeout(consumer, sleep);
        for (var i = 0; i < entry.attributes.length; i++) {
            var match = reg.exec(entry.attributes[i].nodeName);
            if (match) {
                if ('config' == match[1]) {
                    var config = JSON.parse(entry.attributes[i].nodeValue);
                    for (var name in config) {
                        cfg[name] = config[name];
                    }
                } else {
                    cfg[match[1]] = entry.attributes[i].nodeValue;
                }
            }
        }
        delete entry, reg;
    }

    return true;
})(window, document);