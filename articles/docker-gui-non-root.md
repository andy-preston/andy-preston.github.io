---
# cSpell:words Ghidra blacktop
# cSpell:words DIYLC unzipper noninteractive workdir
tags: docker
date: "2024-02-25"
---
# Running GUI Apps in Docker as a non root user

## A Ready Made Image - Ghidra

I Wanted to run The NSA's brilliant [Ghidra](https://ghidra-sre.org/)
without "polluting" my system with a Java runtime.

There's a nice Docker image to do just that at
[blacktop/docker-ghidra](https://github.com/blacktop/docker-ghidra)
but their docs seem to be a bit Mac. focussed and I had to jump through a few
extra hoops to get things working on Linux.

--------------------------------------------------------------------------------

I created a shared directory to serve as a volume to hold project files.
If left to the docker run command to create it, it'll be owned by root and part
of the point of all of this is to not have files owned by root in my home
directory.

Then I run blacktop's container, passing in my UID and GID to ensure I'm
the owner of any files we create in the shared directory.

Normally when I've used `--user` the programs in the container don't care that
this UID has no name within the container. But, in this case, it did - I got
messages saying `User home directory does not exist` and
`Failed to find a supported JDK`. The "correct" way to deal with this would be
to create a matching user in the container but, here, it seemed a lot easier
to hack it by passing the host system's password and group files as read only
volumes.

The host password and group files will overwrite those already in the
container. In some cases may cause problems with users that should exist in the
container vanishing. But it worked fine for me this time round.

`--env DISPLAY=:0.0` was required to start Java. This was kinda odd as if it's
not present Java complains that it can't write to display `:0.0`... and if you
say don't use the default (`:0.0`) use `:0.0` instead... everything works.
My head is still spinning on that one.

We also need `--net=host` so that Java will access the X11 display using it's
host network address rather than Docker's virtual network. (better explanation
to follow).

```bash{aside="Script to run Ghidra in Docker"}
#!/bin/bash

HOME_DIR="/home/$(id --user --name)"
GHIDRA_HOME="${HOME_DIR}/Documents/ghidra"

mkdir -p "${GHIDRA_HOME}"

docker run --init --rm \
    --interactive --tty \
    --name ghidra \
    --user "$(id --user):$(id --group)" \
    --volume "${GHIDRA_HOME}:${HOME_DIR}" \
    --volume "/etc/group:/etc/group:ro" \
    --volume "/etc/passwd:/etc/passwd:ro" \
    --env DISPLAY=":0.0" \
    --net host \
    blacktop/ghidra
```

## No Dockerfile Available - DIY Layout Creator

There seems to be a running theme here of using Docker to try to throw a rug
over the fact that I'm using a JVM app. Because I've also got a container to
run [DIY Layout Creator](https://diy-fever.com/software/diylc/).

--------------------------------------------------------------------------------

Where DIYLC doesn't provide a ready-made Docker image,
it's up to us to create one for ourselves. This Dockerfile comes in two
sections: the first to define a build-time container image to assemble the
required components, the second to define the run-time container image.

The first container ("unzipper") has a copy of the downloadable
zip file for DIYLC and an unzip program to expand it. We also have to generate
locale information to keep the `unzip` utility happy.

(TODO: is that correct?) {.todo}

```dockerfile{aside="DIYLC Dockerfile"}
FROM ubuntu:focal AS unzipper
ENV TERM=linux
ENV DEBIAN_FRONTEND=noninteractive

ADD https://github.com/bancika/diy-layout-creator/releases/download/v4.37.0/diylc-4.37.0.zip \
    /diylc.zip

RUN apt-get update && \
    apt-get install --no-install-recommends -y \
        locales unzip

RUN locale-gen en_GB.UTF-8

ENV LANG en_GB.UTF-8
ENV LANGUAGE en_GB:en
ENV LC_ALL en_GB.UTF-8

RUN mkdir -p /opt/diylc && \
    cd /opt/diylc && \
    unzip /diylc.zip

FROM ubuntu:focal
ENV TERM=linux
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install --no-install-recommends -y \
        bash openjdk-17-jre && \
    rm -rf \
        /var/lib/apt/lists/* \
        /tmp/* \
        /var/tmp/* \
        /usr/src/doc/*

COPY --from=unzipper /opt/diylc /opt/diylc

RUN chmod a+x /opt/diylc/run.sh

WORKDIR /opt/diylc

CMD [ "bash", "/opt/diylc/run.sh" ]
```

The Script

```bash{aside="Script to run DIYLC in Docker"}
#!/bin/bash

docker build --progress=plain --tag diylc .

docker run \
    --interactive --tty --rm \
    --user $(id -u):$(id -g) \
    --volume /home/$(id --user --name)/Documents:/opt/diylc/Documents \
    --env DISPLAY=:0.0 \
    --net=host \
    diylc</syntax-highlight></aside></section>
```
