UUID: 547ADD2C-32DB-4979-9B28-DA124B999E45
Title: Markdown 语法/Markdown Syntax
Summary: Markdown 语法/Markdown Syntax.
Date: 2018-04-01
Modified: 2023-03-06
Status: hidden

### Markdown 1.0.1 ###

The quick brown fox jumped over the lazy dog's back.

> 一层引用
> > 二层引用

- 我是无序列表项
- 我也是无序列表项

![这是插入的图片]({static}/assets/images/500.png "图片描述")

1. 有序列表项 甲
2. 有序列表项 乙

**粗体** *细体* 插入超链接 [bing.com](https://www.bing.com/) `行内代码` 自动链接 <https://whiler.github.io>

4 个空格缩进或者一个 tab 缩进定义的代码块

    create entire block code by indent 4 spaces
    (function(){return true;})(); // 这是代码块

水平线
- - -

### GitHub Flavored Markdown Spec (0.28-gfm) ###

```
int main (int argc, char *argv[]) {
	fprintf(stdout, "Hello World.\n");
	return EXIT_SUCCESS; /* 这是代码块 */
}
```

| 表头 | bar          |
| ---- | ------------ |
| baz  | bim          |
|      | 第二行第二列 |

- [ ] 未完成任务列表项
- [x] 已完成任务列表项

~~删除线~~ 魔法链接 https://whiler.github.io

以 2 个或者 2 个以上空格结尾换行。这是第一行  。  
这应该是第二行。

### Extensions ###

#### LaTeX math equations ####

行内 LaTeX 表达式: $p(x|y) = \frac{p(y|x)p(x)}{p(y)}$ .

块级 LaTeX 表达式:

$$E(\mathbf{v}, \mathbf{h}) = -\sum_{i,j}w_{ij}v_i h_j - \sum_i b_i v_i - \sum_j c_j h_j$$

$$
\begin{align}
    p(v_i=1|\mathbf{h}) & = \sigma\left(\sum_j w_{ij}h_j + b_i\right) \\
    p(h_j=1|\mathbf{v}) & = \sigma\left(\sum_i w_{ij}v_i + c_j\right)
\end{align}
$$

#### LaTex chemical equations ####

行内 LaTex 化学表达式: $\ce{Na2SO4 ->[H2O] Na+ + SO4^2-}$ .

块级 LaTex 化学表达式:

$$\ce{Na2SO4 ->[H2O] Na+ + SO4^2-}$$

$$
\ce{Na2SO4 ->[H2O] Na+ + SO4^2-}
$$

#### flow charts and sequence diagrams from SuperFences ####

```flow
st=>start: Start:>http://www.google.com[blank]
e=>end:>http://www.google.com
操作=>operation: 蜜汁操作
sub1=>subroutine: My Subroutine
cond=>condition: Yes
or No?:>http://www.google.com
io=>inputoutput: catch something...

st->操作->cond
cond(yes)->io->e
cond(no)->sub1(right)->操作
```

```sequence
Title: 示例时序图
A->B: Normal line
B-->C: 这是一条虚线
C->>D: Open arrow
D-->>A: Dashed open arrow
```

#### Graphviz dot ####

```dot
digraph AStar {
	bgcolor="transparent";

	S -> A[label=10]
	S -> B[label=10]
	S -> C[label=10]
	S -> D[label=10]
	A -> E[label=10,style=dashed]
	B -> E[label=20,style=dashed]
	C -> E[label=30,style=dashed]
}
```
