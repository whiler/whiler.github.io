UUID: 547ADD2C-32DB-4979-9B28-DA124B999E45
Title: Markdown 语法/Markdown Syntax
Summary: Markdown 语法/Markdown Syntax.
Date: 2018-04-01

### Markdown 1.0.1 ###

The quick brown fox jumped over the lazy dog's back.

> This is a blockquote.
> > The quick brown fox jumped over the lazy dog's back.

The quick **strong** fox jumped over the *emphasized* dog's back.

- the
- quick
- brown
- fox
- jumped

The quick brown fox jumped over the lazy dog's back.

1. over
2. the
3. lazy
4. dog's
5. back

link to [bing.com](https://www.bing.com/).

![image]({static}/assets/images/500.png "VIA")

inline `code` ?

To specify an entire block of pre-formatted code, indent every line of the block by 4 spaces or 1 tab.

    create entire block code by indent 4 spaces
    (function(){return true;})();

autolink <https://whiler.github.io>

horizontal
- - -

### GitHub Flavored Markdown Spec (0.28-gfm) ###

fenced code blocks

```
int main (int argc, char *argv[]) {
	fprintf(stdout, "Hello World.\n");
	return EXIT_SUCCESS;
}
```

tables (extension)

| foo | bar |
| --- | --- |
| baz | bim |


task list items (extension)

- [ ] foo
- [x] bar

strikethrough (extension)

~~del~~ Hello, world!

autolink https://whiler.github.io

Hard line breaks

A line break (not in a code span or HTML tag) that is preceded by two or more spaces  
and does not occur at the end of a block is parsed as a hard line break.

### Extensions ###

#### LaTeX math equations ####

inline LaTeX equation: $p(x|y) = \frac{p(y|x)p(x)}{p(y)}$ .

block LaTeX equation:

$$E(\mathbf{v}, \mathbf{h}) = -\sum_{i,j}w_{ij}v_i h_j - \sum_i b_i v_i - \sum_j c_j h_j$$

$$
\begin{align}
    p(v_i=1|\mathbf{h}) & = \sigma\left(\sum_j w_{ij}h_j + b_i\right) \\
    p(h_j=1|\mathbf{v}) & = \sigma\left(\sum_i w_{ij}v_i + c_j\right)
\end{align}
$$

#### LaTex chemical equations ####

inline LaTex chemical equation: $\ce{Na2SO4 ->[H2O] Na+ + SO4^2-}$ .

block LaTex chemical equation:

$$\ce{Na2SO4 ->[H2O] Na+ + SO4^2-}$$

$$
\ce{Na2SO4 ->[H2O] Na+ + SO4^2-}
$$

#### flow charts and sequence diagrams from SuperFences ####

flow charts

```flow
st=>start: Start:>http://www.google.com[blank]
e=>end:>http://www.google.com
op1=>operation: My Operation
sub1=>subroutine: My Subroutine
cond=>condition: Yes
or No?:>http://www.google.com
io=>inputoutput: catch something...

st->op1->cond
cond(yes)->io->e
cond(no)->sub1(right)->op1
```

sequence diagrams

```sequence
Title: Here is a title
A->B: Normal line
B-->C: Dashed line
C->>D: Open arrow
D-->>A: Dashed open arrow
```

#### blockdiag ####

blockdiag {
    A -> B -> C -> D;
    A -> E -> F -> G;
}

#### Graphviz dot ####

```dot
digraph R {
	bgcolor="transparent";

	node [shape=record];

	{ rank=same rA sA tA }
	{ rank=same uB vB wB }

	rA -> sA;
	sA -> vB;
	t  -> rA;
	uB -> vB;
	wB -> u;
	wB -> tA;

}
```
