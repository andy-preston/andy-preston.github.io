# Why Indenting With Tab is "Wrong"

I've tried numerous indenting schemes over the years.

## In olden times

In olden times, TAB seemed like a good idea because it was only one keystroke.
But all of our code editors, these days, allow you to to press TAB and have the
editor convert that into whatever number of spaces are required.

## "TWO spaces, are you insane?" - Yes, quite probably.

I've gone down to 2 spaces in the past specifically with the idea that this
gives me the highest number of nesting levels without exceeding 80 columns.
But that was long ago and since that time I've become a
[never nester](https://www.youtube.com/watch?v=CFRhGnuXG-4).

## More madness from my youth

In BASIC (now that's going back) I even did 4 spaces after a DEF or a FOR,
7 spaces after a repeat 6 after a WHILE... it made sense (at least to me)
at the time.

```text
40 DEF PROCplot(x, y)
50     PLOT 85, x, y
60 ENDPROC
```

```text
70 REPEAT x = x + 1
80        y = y - 1
90 UNTIL x > 23
```

## Coding standards

But now we have coding standards and PSR-12 says 4 spaces, PEP-8 says 4 spaces,
the Rust style guide says 4 spaces.

Wouldn't it be nice if we could start to move towards a "base class" for all
coding standards for all languages. I think 4 spaces for indents would be a
good starting point with very little argument from the existing coding
standards. Well... except for one - looking at you, Golang!

## But why though?

Since working on a PHP codebase with an in-house style-guide that specifies
TAB, I've become come across this little frustration that drives me mad
every single day.

Let's say you've got a REPL or two in your development environment. There's a
strong possibility that that REPL will use TAB completion. And now imagine you
need to cut and paste code from your editor into that REPL to try things out...
that's what REPLs are for, right? You cut the code from your editor and your
REPL try's to TAB-complete each and every start of line and throws a fit. So
you need to cut and paste your code from one editor into another editor that
still permits space indenting, edit all the ode indenting, and then, finally,
you get to paste it into your REPL.

## Code example on the web

Spending all day at work with the hated TAB based coding standard has given
me bad habits.

I spend some time every day doing moderation on Stack Overflow (It's dirty
work but someone's got to do it) and a lot of that time is spent editing
questions so that the poorly formatted code is at least readable.

You know, where I'm going with this. What does pressing TAB on a web form
mean? Yes, "jump to the next field". Gah! I hate you TAB, get out of my
code formatting habits!

## That key you keep using, I don't think it does what you think it does (anymore)

In the last 30 years or so, the TAB key has changed from the days when it
was used to TABulate stuff on an typewriter, and no matter how much we may
long for those far-off days, things change.

And TABulating brings me to my final subject

## I still do Assembly Language

Any discussion of the TAB key has to take us off to the dark ages, and
it doesn't get much darker than the darkest of dark arts - Assembly
Language - which (in my hobby projects) I still use quite extensively.

For decades, assembly languages was formatted as Label, TAB, Mnemonic,
Operands, TAB, Comment

```text
loop:   LD A, (BC)
        OR A            ; Compare A to 0 - NULL terminator
        RET Z
        CP 255          ; 255 means "goto the verse specified after the 255"
        JR Z, Previous
```

Except, hang on, that's sometimes Label, TAB, Mnemonic, Operands, TAB, TAB,
Comment.

Except when it's only one after the operands.

And what if we want meaningful labels, How many tabs before the Mnemonic, then?

Enough of this madness, let's just use a 4-space indent and sanity returns.

```text
    cpi _digit, 10    ; if it's not 10 pulses ("0" digit)
    brne digitFound   ; ... it's just an ordinary digit
    clr _digit        ; ... otherewise use a zero
digitFound:
    add _digit, _asciiZero ; convert integer to ASCII char
```
