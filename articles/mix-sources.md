uuid: 91c2c440-e264-48a2-9e3a-9f34c0cee405
title: 多数据源混合输出
summary: 拥有相同数据格式的数据源按照数量混合分页输出。比如在新闻列表中混合输出政治、经济、娱乐、科技新闻；在用户 Feed 流中混合输出用户订阅的条目和推荐给用户的条目。
date: 2012-07-15

## 多数据源混合输出 ##
拥有相同数据格式的数据源按照数量混合分页输出。比如在新闻列表中混合输出政治、经济、娱乐、科技新闻；在用户 Feed 流中混合输出用户订阅的条目和推荐给用户的条目。

数据源输出有 **开始正常输出**、**开始变换输出（填补前一个数据源不足分页的量）**、**变换输出** 和 **结束输出** 四个阶段。
每一个数据源开始时，按照指定的数量输出，到最后一个分页不足时，由下一个数据源填补不足的量。
将前面所有的数据源视为一个数据源，简化计算。

### 实现 ###
```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-
#

import logging

from colorama import init
from termcolor import colored

logging.basicConfig(level=logging.NOTSET,
                    format='[%(levelname)s]\t%(asctime)s\t%(message)s',
                    datefmt='%Y-%m-%d %H:%M:%S %Z')


def source(color, count):
    return [colored('%d' % i, color) for i in range(count)]


def mix(page, *args):
    """
        @page starts at zero
    """

    sources = [
        (source, len(source) / size, size)
        for source, size in args
    ]
    sources.sort(key=lambda (source, total, size): total)

    total = 0
    size = 0
    first = True
    delta = list()
    for source, _, need in sources:
        count = len(source)

        if total == size == 0:
            sep = count / need
            if page < sep:
                start = page * need
                delta.extend(source[start: start + need])
            elif page == sep:
                start = page * need
                delta.extend(source[start: start + count % need])
        else:
            sep = total / size
            if page < sep:
                start = page * need
                delta.extend(source[start: start + need])
            elif page == sep:
                start = page * need
                delta.extend(source[start: start + need + size - total % size])
            else:
                if page < (total + count) / (size + need):
                    start = page * (size + need) - total
                    delta.extend(source[start: start + need + size])
                else:
                    start = page * (size + need) - total
                    delta.extend(source[start: start + (total + count) % (size + need)])

        total += count
        size += need
    return delta


if __name__ == '__main__':
    init(autoreset=True)
    a = source('red', 3)
    b = source('green', 10)
    c = source('yellow', 45)
    page = 0
    items = mix(page, (a, 2), (b, 3), (c, 5))
    while items:
        logging.debug('Page: %d\t%s', page, '\t'.join(items))
        page += 1
        items = mix(page, (a, 2), (b, 3), (c, 5))
```
