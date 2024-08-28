---
draft: true
---

# All IO Is Async

Lot's of hype these days about how "my language" offers async IO.
It may come as a
surprise to some that all IO is async and it always has been.

A criticism against running JavaScript on the server is that it's single
threaded and running anything single threaded is a waste of all those processor
cores. But is it?

example - a REST API call!

I could include an example here about how your operating system actually
hides the true async nature of IO under an abstraction of blocking... but
any excursion into the world of operating systems is likely to get too
complicated for both of us. So, instead, let's take a different journey...
down... all the way down... onto the bare metal.

example - ADC conversion on AVR.
