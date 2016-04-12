## 六度分割理论 ##
一次求职笔试，考到了六度分隔理论，判断两个人之间是否存在可能的联系。问题是比较简单的，就是检查权重为1的无向图中两个节点在6层内是否有相通的路径。

### 解决办法 ###
1. 收集每一个人的一度好友
2. 从一个人开始，遍历他的所有好友，检查是否是另一个人的好友
3. 递归检查好友的好友，同时排除上一个好友

### 实现 ###
```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-
#

import collections
import itertools
import logging
import random
import string

logging.basicConfig(level=logging.NOTSET,
                    format='[%(levelname)s]\t%(asctime)s\t%(message)s',
                    datefmt='%Y-%m-%d %H:%M:%S %Z')

DEPTH = 6


def get_edges(count):
    edges = set()
    for _ in range(count):
        a = random.choice(string.ascii_uppercase)
        b = random.choice(string.ascii_uppercase)
        while a == b or (a, b) in edges:
            a = random.choice(string.ascii_uppercase)
            b = random.choice(string.ascii_uppercase)
        edges.add((a, b))
    return edges


def build_nodes(edges):
    nodes = collections.defaultdict(set)
    for a, b in edges:
        nodes[a].add(b)
    return nodes


def find(nodes, a, b):
    if not (a in nodes and b in nodes):
        return -1
    elif a == b:
        return 0
    return walk(nodes, a, b, 1)


def walk(nodes, a, b, depth, block=None):
    if depth > DEPTH:
        return -1
    children = nodes[a]
    if b in children:
        return depth
    else:
        for child in children:
            if child == block:
                continue
            dep = walk(nodes, child, b, depth + 1, a)
            if dep is not None:
                return dep


if __name__ == '__main__':
    edges = get_edges(128)
    nodes = build_nodes(edges)
    for a, b in itertools.combinations(string.ascii_uppercase, 2):
        dep = find(nodes, a, b)
        logging.debug('degrees between %s and %s is %d', a, b, dep)
```

关于六度分隔理论的详细介绍，可以参考 [Six degrees of separation](https://en.wikipedia.org/wiki/Six_degrees_of_separation) 。
