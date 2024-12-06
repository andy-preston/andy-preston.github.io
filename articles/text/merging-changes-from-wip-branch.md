---
tags: shell
date: "2024-12-06"
---
# Merging Code Changes From a WIP Branch

## Scenario

I was working on a bunch of changes but we had to put that work on hold for a
while whilst I was assigned to some higher priority tasks.

We pushed my current work in progress to another branch just to have them
safely stashed away in the repository.

But we work with dev. branches and pull-requests and we like to have our commits
as a series of self-contained "blobs" to ease the code review process, so the
last thing we want is a random collection of work-in-progress in that final
branch.

So I'd like to pull my work in progress into the dev. branch so that I can
re-commit them in a less higgledy-piggledy manner.

## The Merging

Now, there could be some `git` magic to do this, but this seemed to be the
simplest way of doing this.

I copied my work directory ("folder" if you must) and checked out the dev.
branch in one copy and the work-in-progress branch in the other and ran this.

```bash{aside=merge script}
cd slim3-dev
for FILE in $(find -type f)
do
    OTHER=$(echo $FILE | sed 's/^\./..\/..\/slim3-wip\/app/g')
    diff -q $FILE $OTHER || meld $FILE $OTHER
done

cd ../../slim3-wip/app
for FILE in $(find -type f)
do
    OTHER=$(echo $FILE | sed 's/^\./..\/..\/slim3-dev\/app/g')
    diff -q $FILE $OTHER || meld $FILE $OTHER
done
```
