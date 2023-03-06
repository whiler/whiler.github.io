UUID: 57615493-5228-472d-9945-ac0dcd0d4c00
Title: 绘制心形图案
Summary: 半夜没事瞎折腾，想到绘制心形图案消磨时间。
Date: 2016-04-14

半夜没事瞎折腾，想到绘制心形图案消磨时间。
看了一些方案，最后采用半圆加正方形折叠的方式来绘制，`r = a * (1 - sin θ)` 真心不会。

绘制心形图案，首先想到了笛卡尔的 `r = a * (1 - sin θ)` ，但是折腾了半天不会将极坐标系的点转换到笛卡尔坐标系，于是改用正方形外接一个半圆再折叠一次来表示。
这样就只剩下简单的几何代数运算了。

代码：

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-
#

from math import sin, sqrt, pi


def heart(radius):
    side = radius * sin(pi / 4.0)
    offset = radius + side
    steps = radius + 3.0 * side
    top = 0
    while top <= steps:
        if top < offset:
            delta = sqrt(top * (2.0 * radius - top))
            left_min = side - delta
            if left_min < 0:
                left_min = 0.0
            left_max = side + delta
        else:
            left_max = steps - top
            left_min = 0.0

        line = ''
        i = 0
        while i < offset + left_max:
            if offset - left_max <= i <= offset - left_min:
                line = line + '*'
            elif offset + left_min <= i <= offset + left_max:
                line = line + '*'
            else:
                line = line + ' '
            i = i + 1

        print(line)

        top = top + 1
```
