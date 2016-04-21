uuid: 57615493-5228-472d-9945-ac0dcd0d4c00
title: 绘制心形图案
summary: 半夜没事瞎折腾，想到绘制心形图案消磨时间。看了一些方案，最后采用半圆加正方形折叠的方式来绘制，r = a * (1 - sin θ) 真心不会。
date: 2016-04-14

## 绘制心形图案 ##
半夜没事瞎折腾，想到绘制心形图案消磨时间。看了一些方案，最后采用半圆加正方形折叠的方式来绘制，` r = a * (1 - sin θ) ` 真心不会。

绘制心形图案，首先想到了笛卡尔的 ` r = a * (1 - sin θ) ` ，但是折腾了半天不会将极坐标系的点转换到笛卡尔坐标系，于是改用正方形外接一个半圆再折叠一次来表示。
这样就只剩下简单的几何代数运算了。

代码：
```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-
#

from math import sin, sqrt, pi


radius = 24.0 / (1.0 + sin(pi / 4))
unit = radius * sin(pi / 4)
offset = unit + radius
for i in range(int(round(3.0 * unit + radius)) + 1):
    if i <= (unit + radius):
        delta = sqrt(i * (2.0 * radius - i))
        up = unit + delta
        down = max(0.0, unit - delta)
    else:
        up = 3.0 * unit + radius - i
        down = 0.0
    a, b, c, d = map(
        lambda x: int(round(x + offset)),
        (-up, -down, down, up)
    )
    buf = []
    for x in range(d + 1):
        if a <= x <= b:
            buf.append('*')
        elif c <= x <= d:
            buf.append('*')
        else:
            buf.append(' ')
    print(''.join(buf))
```
