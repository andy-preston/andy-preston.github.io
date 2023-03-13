# Why Indenting With Tab is "Wrong"

I've tried numerous indenting schemes over the years.

I've gone down to 2 spaces in the past specifically with the idea that this
gives me the highest number of nesting levels without exceeding 80 columns.
But that was long ago and since that time I've become a never nester.

In olden times, TAB seemed like a good idea because it was only one keystroke.
But all of our code editors, these days, allow to to press TAB and have the
editor convert that into whatever number of spaces our coding standard requires.

In BASIC (now that's going back) I even did 4 spaces after a DEF or a FOR,
7 spaces after a repeat 6 after a WHILE... it made sense at the time.

```basic
40 DEF PROCplot(x, y)
50     PLOT 85, x, y
60 ENDPROC
```

```basic
70 REPEAT x = x + 1
80        y = y - 1
90 UNTIL x > 23
```

But now we have coding standards and PSR-12 says 4 spaces, PEP-8 says 4 spaces,
the Rust style guide says 4 spaces...

And since working on a PHP codebase with an in-house style-guide that specifies
TAB, I've become a fanatical devotee of the "4 spaces school"

## Why?

Let's say you've got a REPL or two in your development environment. There's a
strong possibility that that REPL will use TAB completion. And now imagine you
need to cut and paste code from your editor into that REPL to try things out...
that's what REPLs are for, right? You cut the code from your editor and your
REPL try's to TAB-complete each and every start of line and throws a fit. So
you need to cut and paste your code from one editor set up for the TAB coding
standard into another editor that still permits space indenting, edit all the
code indenting, and then, finally, you get to paste it into your REPL.

Drives me mad, every single day!

Let's not even get on to the fact there's an industry standard PHP style that
we've got our own "special" version of...

# Why Else?

There is more, but I can't think right now...

To Be continued...

