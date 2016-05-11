uuid: f8f01700-1a02-4151-ab5f-a33e215cec60
title: 六度分割理论
summary: 一次求职笔试，考到了六度分隔理论，判断两个人之间是否存在可能的联系。
date: 2014-09-17

## 六度分割理论 ##
一次求职笔试，考到了六度分隔理论，判断两个人之间是否存在可能的联系。
问题是比较简单的，就是检查权重为1的无向图中两个节点在 6 层内是否有相通的路径。

### 解决办法 ###
1. 收集每一个人的一度好友
2. 从一个人开始，遍历他的所有好友，检查是否是另一个人的好友
3. 递归检查好友的好友，同时排除上一个好友

### 实现 ###
```
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


def create_edges(count):
    edges = set()
    for _ in range(count):
        a = random.choice(string.ascii_uppercase)
        b = random.choice(string.ascii_uppercase)
        while a == b or (a, b) in edges or (b, a) in edges:
            a = random.choice(string.ascii_uppercase)
            b = random.choice(string.ascii_uppercase)
        edges.add((a, b))
    return edges


def build_trees(edges):
    trees = collections.defaultdict(set)
    for a, b in edges:
        trees[a].add(b)
    return trees


def find(trees, a, b):
    if not (a in trees and b in trees):
        return -1
    elif a == b:
        return 0
    return walk(trees, a, b, 1) or -1


def walk(trees, a, b, depth, block=None):
    if depth > DEPTH:
        return -1
    children = trees[a]
    if b in children:
        return depth
    else:
        for child in children:
            if child == block:
                continue
            dep = walk(trees, child, b, depth + 1, a)
            if dep is not None:
                return dep


if __name__ == '__main__':
    edges = create_edges(128)
    trees = build_trees(edges)
    for a, b in itertools.combinations(string.ascii_uppercase, 2):
        dep = find(trees, a, b)
        logging.debug('degrees between %s and %s is %d', a, b, dep)
```

关于六度分隔理论的详细介绍，可以参考 [Six degrees of separation](https://en.wikipedia.org/wiki/Six_degrees_of_separation) 。
