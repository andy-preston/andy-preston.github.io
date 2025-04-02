---
# cSpell:words Sorber datasheet
tags: micro
date: "2025-04-01"
---
# Time Dependant Debugging on AVR Microcontrollers

## Background (and link farming)

I've got an issue with my
[Obsolete GPO-746 Telephone as Android Handset](https://github.com/andy-preston/gpo-746-android)
project that's going to need some heavy debugging.

In the time I've spent diverting my attention to my
[AVR Assembler](https://github.com/andy-preston/aaa),
I've been given some time to consider the options for how I'm going to debug
this issue.

## Logging Vs "Proper" Debugging

I'm by no means an expert on microcontrollers, this is entirely a spare-time
activity. In my day job, for my sins, I'm doing web development and, in that
world, the everyday solution to debugging issues is still to log everything.

There's a great video on YouTube by Jacob Sorber:
[How not to debug your programs](https://www.youtube.com/watch?v=IepIFbK3Ee8)
advising that this is precisely **not** the way to debug your programs and that
you should be using a debugger instead.

In most cases, I would say "Yup, Jacob - you're completely right". But, for one
thing, I've never invested the time in working out how to even attach a
debugger to any of my hastily cobbled together AVR-based devices. And, more
importantly here, this issue is dependent on an external mechanical switch and,
the moment I drop into single-step, the external device will have finished it's
cycle and my time for spotting the bug will have long gone.

### Time Dependent Debugging

Where I have no control of the operating speed of the external device that my
bug is dependent on, I literally don't have the time to venture into "proper"
debugging - "logging" or "printf debugging" are my only options.

This is where we come upon another peculiarity of this specific bug that
overcomplicates the issue. I've put "logging" and "printf debugging" in quotes
because I'm on a microcontroller and I have no console to send my output to and
no file system to save my logfiles on. I'm also running in this very time
constrained environment where sending output to a serial port for display on my
development machine will almost certainly will take far too much time
(I haven't measured but I am as sure as I can be without adequate data).

### Logfiles!?! ... on a Microcontroller?!?

Translating the basic idea of a logfile into something that can be achieved on
a μC, we've got basically two options.

We can either save the contents of the bytes or flags or whatever we need to
analyse to understand our bug or we can write them to a spare GPIO and grab
them using a logic analyser.

And the constraints queue up to mock me yet again!

My project is based on the ATTiny-2313 which has just enough IO pins to control
my old phone and has only 128 **bytes** of SRAM. So I'm going to need to set up
a debug system based around the bigger ATMega-1284 that has 4 "complete" 8-bit
IO ports and a "huge" 16K bytes of SRAM.

## Real Time Status Port or Store and Dump?

So, we have two options both of which have their advantages and costs. The main
concern we have is which will waste the fewest clock cycles. Every single clock
cycle that is "wasted" by debugging is a chance that it'll alter the program
state enough to hide the bug (we're back to Jacob Sorber's arguments against
this methodology in the first place).

### Option 1 - Store and Dump

Hopefully we can reduce the state we need to examine into one byte and store
this in SRAM and, after the device has been sufficiently exercised, dump this
out.

This dump can be done over a UART as we no longer care that much about speed
now that all our precious data is stashed away safely in SRAM. But, whilst I
don't have any idea what the problem is, The fact that a store operating takes
2 cycles rather than the 1 cycle of option 2 is "bothersome".

### Option 2 - Status Port

An alternative would be to write the a byte or two to IO Ports and log it on
an external device.

The problem here is that now there's yet another device that has to match the
speed of the CPU. According to the datasheet, an IO operation only takes 1 clock
cycle so that's good.

### Logic Analyser

In both cases it'd really help to have the "log entry" be just a single byte.
Writing two bytes to SRAM takes twice as long. Outputting two bytes need to
write to two IO ports **and** needs a 16-bit logic analyser to read the ports.

What's all this about logic analysers?

I've been reading articles about using a Blue Pill, a Pi Pico, etc, etc as a
DIY data logger. And there's an issue with all of these options: compared to
oscilloscopes or dedicated logic analysers they're **SO SLOW**. Although the
μCs on these boards "go like the clappers" compared to my humble AVRs, there's
a considerable delay caused by their IO subsystems.

*This is filling me with doubts about the certainty of "IO operations will take
1 clock cycle" that I mentioned above and I'm going to have to do even more
experiments to alleviate them.*

Anyway... anyway... anyway... let's worry about that later.

The answer to this problem has a nice simple "ready rolled" solution. The
Cypress EZ-USB chips have a nice firmware bundle that can drag data off of an
8-bit or 16-bit parallel bus and cram them down a USB as fast as can be done.

Again, even here, we're trying to constrain the debug information "record" to
one byte as the EZ-USB can do 8-bits much faster than it can do 16-bits.

![The Debug-a-Tron](https://i.ibb.co/WNCyQBkn/the-debug-a-tron.jpg){aside}

## No Answer - But at Least I've Defined The Questions

So, I still have no answer to "what's wrong with my code?" but at least now,
I've got a list of other questions that I'll need to answer before I get to
ask that question again.

Is that good???
