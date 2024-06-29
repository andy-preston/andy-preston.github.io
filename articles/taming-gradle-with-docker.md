---
tags: "docker"
draft: true
date: "2023-09-25"
---

# Taming Gradle With Docker

## A Monster!

Let's face it... Gradle is, indeed, a monster! You can ask Gradle "Hey, who's
in charge of this codebase anyway, you or me?" and it'll happily reply
"Well, me of course, why would I want to listen to you, pathetic human!"

Many build systems will litter your codebase with all manner of intermediate
files that are really useful if you don't want your build to keep taking a
million years each time you try out a new bugfix. And Gradle
**really goes to town** in this department downloading all kinds
of libraries, components and even compilers as it gnaws through it's build
process.

Which leaves you with something of a dilemma. You don't want to keep finding
matches in this "crap" whilst you're trying to `grep` things in your codebase...
but you don't want to keep deleting it because, when it comes to build time,
it's certainly not "crap".

As is the case in many situations these days, it a case of...

## Docker to the Rescue!
