---
tags: philosophy
date: "2023-07-10"
---
# Why Indenting With Tab is "Wrong"

This used to be long an complicated. With all manner of comparisons and
discussion.

But I've decoded to cut it down just to essentials and keep it very short and
equally sweet.

Since working on a PHP codebase with an in-house style-guide that specifies
TAB, I've come across this little frustration that drives me a mad every single
day.

Let's say you've got a REPL or two in your development environment. There's a
strong possibility that that REPL will use TAB completion.

And now imagine you need to cut and paste code from your editor into that
REPL to try things out... that's what REPLs are for, right? You cut the code
from your editor and your REPL tries to TAB-complete each and every start of
line and throws a fit.

So you need to cut and paste your code from one editor into another editor
that still permits space indenting, edit all the code indenting, and then,
finally, you get to paste it into your REPL.
