---
# cSpell:words Rossum
tags: philosophy
date: "2023-09-07"
---

# Parentheses on IF statements

Look at this statement:

```javascript
if (fortran == theRootOfAllEvil) {
    ...
}
```

Why are those parentheses there?

Logical expressions work just fine without them:

```javascript
fortran == theRootOfAllEvil ? "yes" : "no?"
```

So why are they there?

## A Journey into Antiquity

When I was at school, back in the dark ages, I desperately thirsted to know
more programmings languages. We had been taught BASIC and been given a few,
all too brief, examples of other languages - languages that have long since been
forgotten - like Cobol, Fortran and Algol.

I asked the teacher "But, Sir, what do these examples actually do?"
and I got back the response "Just copy them down into your book!!!"

I **needed** to know more. And in our school library, there was a long ignored
book on Fortran which I happily took home and digested. If was like that scene
from Hidden Figures when Katherine finds the book - except I'm not a black
woman in the American 1960s and I could just borrow the book and take it home
without being chased by a security guard.

Now one of the things I learned was that Fortran completely ignored ALL
whitespace. So the assignment `A = 2 * 3` would be rendered into `A=2*3` before
compilation. But that's fine and dandy - it's still valid, it still compiles.

But if we look at an `IF` statement, things are different `IF A .EQ. 5 THEN`
renders down into `IFA.EQ.5THEN`. The equality operator is still fine as only
operators start and end with a dot. But the poor old compiler didn't have a
clue what to do with the `IFA` or the `5THEN`.

The solution was to parenthesize the expression `IF(A.EQ.5)THEN` - everything
nicely tokenized - problem solved!

## But What's This Got to do With JavaScript?

Well, we've all met that one Java programmer who insists that all software
should be written in Java, or his older brother who insists that all software
must be written in C. It's like the vulgar Anglophone, who loudly enquires
"Why can't these foreigners speak English, just like everybody else does?".

Back in the long ago, before there was such a thing as C. The "only language
you need for everything" was Fortran. And there was such a programmer who was
working on an operating system (that went on to be quite famous) and so
desperately wanted to be allowed to write it in Fortran.

But his colleagues were working on a new replacement for Pascal, a horribly
underpowered language with a silly name: "C". And they knew that if they didn't
make it at least smell a little bit like Fortran their partner would never use
it... And so they added a little eau de Fortran in the form of, now completely
redundant parentheses around the logical expression in the "if" statement.

Fast forward to the 1990s and "C is the new Fortran"... every new language has
to smell a little of C or nobody will touch it (God bless you, Guido van
Rossum) and many of our new languages still carry that emotional baggage from
C and Fortran.

## Afterthought

Oh, by the way, I wrote ONE library to calculate hyperbolic functions for
my "O"-Level Computer Studies project and then never ever ever touched Fortran
again.

... Sadly, the spectre of C has never left my side.
