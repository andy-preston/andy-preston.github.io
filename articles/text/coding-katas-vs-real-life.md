---
# cSpell:words standup GAVRASM aaasss
tags: philosophy
date: "2024-12-02"
---
# Coding Katas Vs Real Life

## Advent of Code

It's around this time of year that my colleagues and the development community
as a whole start going on about Advent of Code and, every year, I have to
explain that I just don't see the point.

## Coding Katas

The whole idea of Advent of Code, and coding katas in general, is that you're
given a "toy" problem to solve and you want to learn Rust or you want to try out
TDD (you **should** try out TDD by the way!) So you try and solve the "toy"
problems using Rust or TDD or whatever you're grasping at.

But, at the end of it, what do you have?

Fine, you've got a better grasp of Rust or TDD and that's really great... but
what value can you gain from the actual software you've written?

## Real Life

I've got "a thousand and one" pieces of real software that I actually "need"
in my life.

I air quote "need" because many of these projects are quite pointless hobby
projects that add no real value to the world, I just want them.

But not always entirely pointless... without my
[Lume based, static site generator](https://github.com/andy-preston/andy-preston.github.io),
you wouldn't be reading this guff right now.

## My Telephone

But for one of my more trivial examples, I've been working for ages on a
project to
[connect an obsolete GPO-746 handset to modern mobile networks](https://github.com/andy-preston/gpo-746-android)
just to have a retro-hipster telephone that I can play with and show off to my
friends.

For this project, I found that I needed an Android App. So here I am learning
Kotlin, and finding that I need to write multi-threaded code. And then I want
to easily test my hardware, so I need a native Linux testing application
that shares code with my Android App and I find myself doing native Kotlin and
using it's foreign function interface to talk to a Linux USB library.

Multiple learning opportunities flood out of this project and at the end of it
I've got a working application that I want, not just a solution to a puzzle that
doesn't actually do anything.

--------------------------------------------------------------------------------

## Writing My Own Assembler

My telephone project has an AVR microcontroller in it and I like to program AVRs
in assembly language.

For my AVR projects, I was using
[GAVRASM](https://web.archive.org/web/20230918215320/http://www.avr-asm-tutorial.net/gavrasm/index_en.html).

But you'll notice that link is to The Wayback Machine... it seems my beloved
assembler has "died". I have a sad suspicion that it's author, Gerhard Schmidt
has gone to the big morning standup in the sky.

GAVRASM didn't have a fully Open Source compatible license and I want a
replacement that does. The available options don't quite "float my boat" and
so I'm now working on my own replacement.

What's more, just to troll the "Macho Programming Bros" just a little bit more,
I'm doing it in Typescript!

[github.com/andy-preston/aaa](https://github.com/andy-preston/aaa)

[github.com/andy-preston/aaasss](https://github.com/andy-preston/aaasss)

> The AVR community is full of people who can't wait to shout at
> you and tell you you are wrong the moment you dare to utter "assembler"
> and "how dare you abandon the one true road that is the glorious C
> language".
>
> If you get the opportunity, I can't recommend having a play-around with
> an assembly language enough. If you want to learn how computers really
> work, then assembly language will certainly show you that.
>
> And remember "All software is Open Source if you can read assembly!"
> {aside="Digression"}

## Coding Katas Vs Real Life

These are just a couple of examples, I haven't mentioned Zig, real time audio,
Python, video processing and all those other things on my mile long TODO list.

But this is my point. There are so many opportunities to learn that leave you
with a fun or maybe even useful piece of software at the end.

Why use up your valuable coding time solving puzzles for the sake of solving
puzzles when you could be building stuff?

## Or Just Carry On With Your Katas If You Like

I can't criticise the "Programmings Bros" for telling us that we're doing
everything wrong... and then come along and do the very same thing.

If coding katas work for you, if you can't wait for December to come along so
you can start this year's Advent of Code - then, please, ignore me and carry on.

There aren't any imps who are going to poke you in the nether regions with
pitchforks for eternity if you don't follow my one true way.

Although... I'm still obviously right and you're obviously wrong. ;)

## CTFs Too

The original version of this article was just a rambling stream of conciousness
and you don't want to read it... honestly you don't.

But it was inspired by a couple of excellent videos on Live Overflow:

[CTFs are awesome](https://www.youtube.com/watch?v=L2C8rVO2lAg) and
[CTFs are terrible](https://www.youtube.com/watch?v=lxJpKUoX-6E).

I'd still highly recommend these as a similar perspective on CTFs which are,
more or less, the same thing as coding katas but for security people
