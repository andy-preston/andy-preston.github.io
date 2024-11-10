---
# cSpell:words culting
tags: philosophy
date: "2024-02-18"
---
# Coding Katas Vs Real Life

I was watching Live Overflow the other day and he had made a pair of videos
about how [CTFs are awesome](https://www.youtube.com/watch?v=L2C8rVO2lAg)
and, conversely, how
[CTFs are terrible](https://www.youtube.com/watch?v=lxJpKUoX-6E).

And this got me thinking about how CTFs are the hackers' equivalent of
coding katas and how I don't particularly "get" the point of coding
katas.

## The Point of Coding Katas

Well, that's not strictly true.

I see coding katas as something akin to unit tests but for your personal
development.

You take a small, easily defined problem and attempt to implement it using
a technique or language you want to master and it's small and concise enough to
get it done in a reasonable amount of time.

But, then, when you've done it what do you have. Not a lot. A solution to a
trivial problem that nobody really needs a solution to. Chuck it in the bin now
I s'pose

## An alternative approach

So if this is all "so terrible", what's the alternative?

Find yourself a project that at least you will find more or less useful but
that's also going to offer a challenge or two, that's going to throw you into
"uncharted territory" or "stormy waters".

## Making Things Hard For Fun & Education.

In many of my spare-time projects, I like to muck around
with microcontrollers and, I've been working on a device to adapt an obsolete
[GPO-746](https://www.britishtelephones.com/t746.htm) and bring it back to life.

I've always though that it's a good idea for personal development to go down
one stage in abstraction. If, at work, you'd use a library or framework to
achieve something - instead try to implement that functionality yourself. If
Python would be a sensible language to use for some project, have a go at doing
it in Rust instead.

With my microcontroller projects, I've taken this to the extreme of working
in assembly language.

But I'm in danger of getting off topic. Keep your eyes peeled for my upcoming
"Applying Software Engineering Practices to Assembly Language
Programming" (Catchy title????)

## Go Looking For The Unfamiliar

... or better still "disdained"

After a while of working on my telephone project, it seemed the best way to
go about things was to adapt it into an Android handset and to create a
"simple" Android app to control it. If you want to have a look you
can find it in on GitHub at
[andy-preston/gpo-746-android](https://github.com/andy-preston/gpo-746-android).

If I'm thinking of Android apps, I've got to look at using the JVM
and Kotlin... I've got a bit of a problem there because, well, I've never really
got on at all with the whole Java ecosystem. Is it just some personal foible or
is it as bad as I say it is? I don't know. But I do know that it's certainly
unexplored territory for me.

And then there's Gradle... Oh Gradle, why are you so over-complex? You're
only a build system, do you really need to contain multiple turing-complete
programming languages just to run a few build tasks?

So here I am in both "uncharted territory", and "stormy waters"... Purely by
wanting to get something done, I've accidentally found that "perfect"
substitute for coding katas that I was going on about in the first place.

## And Let's Make it Even More Difficult on Myself.

I'm also using the CH340G serial USB chip to handle the communication between
my microcontroller in the old telephone and the Android device. On Linux or BSD,
this is just a matter of opening a serial connection to `/dev/ttyUSB0`. But on
Android you actually need your own drivers for "strange" USB devices in your
app.

I could use one of the available Java libraries for driving serial USB chips
on Android and, if this was a commercial project, I'd probably be stupid not to.
But, for an exercise like this, that's just way too easy. I'm sure all the
people at the real-life, non-metaphorical dojo would agree "no pain, no gain!".
And, for this chip, "pain" is certainly the word for it. The CH340 family of
chips are probably THE worst documented series of ICs in the entire history of
electronics.

The only documentation I've got is the actual source-code for the Linux
driver, the NetBSD driver, the FreeBSD driver and those 2 libraries I mentioned
earlier. But the people who wrote this code also had no real documentation and
reading their code, it comes over as leaning a little towards "cargo culting".

## Walking Out Of The Dojo

Now, if you're trying to "Do your 10,000 hours", you need Deliberate Practice.
And you can spend that time taking exercises with no goal beyond development
itself or you can find a useful (or, at least, useful to you) project to
complete. But make sure that project has some challenges that will make your
skill-set grow.

Be obsessed with software quality and refine your project again and again
until the code isn't just "not bad" but as close to perfect that you can get
without quasi-divine superpowers... this is a spare time project - there's no
manager here, fretting over deadlines.

And now you are free to walk out of the dojo!
