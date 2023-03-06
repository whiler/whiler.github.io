UUID: D3F3B928-3211-490F-8897-C42002EDB1F1
Title: 把一张纸撕成一个纸圈
Summary: 不用任何粘接工具，把一张纸撕成一个纸圈
Date: 2018-05-21

一次培训的放松环节，导师让我们在 5 分钟内，把一张纸撕成一个纸圈，围住我们所有人。

我做到了。

一张纸从中间开始撕，能撕成一个闭合的圈。如图：

![纸圈]({static}/assets/images/circle.jpg "一张纸从中间开始撕，能撕成一个闭合的圈")

从边上撕能得到纸条，而不是闭合的圈。如图：

![纸条]({static}/assets/images/strip.jpg "从边上撕能得到纸条，而不是闭合的圈")

从中间撕能得到一个圈，周长最大也只能是纸的周长，不能围住所有人。
从边上撕能得到一个纸条，只要撕得足够细，纸条可以就可以足够的长，首尾相连形成圈就能围住所有人了。
但是，怎么连呢？

对折！

对折后从中间撕一个口子，展开就是一个圈了。如图：

![对折]({static}/assets/images/fold-1.jpg "对折")
![撕一个口子]({static}/assets/images/fold-2.jpg "撕一个口子")
![圈]({static}/assets/images/fold-3.jpg "得到一个圈")

能不能把这个圈的周长变得更大一些呢？

能，对折后从折线一边开始，左右交替撕奇数个口子；把折线上除第一个和最后一个折痕撕开，展开就能得到周长更长的圈了。如图：

![左右交替撕奇数个口子]({static}/assets/images/tear.jpg "左右交替撕奇数个口子，把折线上除第一个和最后一个折痕撕开")
![展开]({static}/assets/images/unfold.jpg "展开，得到一个圈")

假设纸的周长是 d ，圈的周长是 D ，对折一次，左右交替撕奇数 $N = 2 * n - 1$ 个口子，那么纸圈的周长可以表示为：

$$D = (N + 1) / 2 *d$$
