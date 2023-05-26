# Running GUI Apps as a non root user

I Wanted to run The NSA's brilliant [Ghidra](https://ghidra-sre.org/) app
without "polluting" my system with a Java runtime.

There's a nice Docker image to do just that at
[blacktop/docker-ghidra](https://github.com/blacktop/docker-ghidra)
but their docs seem to be a bit Mac. focussed and I had to jump through a few
extra hoops to get things working on Linux.

My script runs something like this:
```bash
#!/bin/bash

xhost +

HOME_DIR=/home/$(id --user --name)/Documents/ghidra

mkdir -p ${HOME_DIR}

docker run --init --interactive --tty --rm --name ghidra \
    --user $(id --user):$(id --group) \
    --volume ${HOME_DIR}:/home/$(id --user --name) \
    --volume="/etc/group:/etc/group:ro" \
    --volume="/etc/passwd:/etc/passwd:ro" \
    --volume="/etc/shadow:/etc/shadow:ro" \
    --env DISPLAY=:0.0 \
    --net=host \
    blacktop/ghidra
```

First, I used `xhost +` to allow X11 connections from anywhere.
This command is rather unselective and may even be unnecessary.
Some more experimentation is required.

Then I create a directory to be shared between the container and the host
and make sure it's created. If left to the docker run command to create it,
it'll be owned by root and part of the point of all of this is to not have`
files owned by root in my home directory.

Then we run blacktop's container, passing in my UID and GID to ensure I'm
the owner of any files we create in the shared directory.

Sometimes when I've used `--user` the programs in the container don't care
that this UID has no name within the container. But in the case of Ghidra
and/or Java, it did. So I pass in the host system's password and group files
as read only volumes. They will overwrite the files already in the container's
file system and in some cases may cause problems with users that should exist
in the container vanishing. But it worked for me this time round.

`--env DISPLAY=:0.0` was required to start Ghidra &/or Java. This was kinda
odd as if it's not present Ghidra &/or Java complains that it can't write to
display `:0.0`... and if you say don't use the default (`:0.0`) use `:0.0`
instead... everything works. My head is still spinning on that one.

We also need `--net=host` so that Java will access the X11 display using
it's host network address rather than Docker's virtual network. (better
explanation to follow).
