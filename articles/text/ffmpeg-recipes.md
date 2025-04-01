---
# cSpell:words libmp3lame yadif libx264 yuva444p colorchannelmixer
# cSpell:words astats ametadata lavfi concat webm
tags: shell
date: "2024-02-18"
---

# FFMPEG Recipes

Not exactly "an FFMPEG cookbook", more like a collection of recipes scrawled
on the back of old envelopes.

--------------------------------------------------------------------------------

Extract the audio from a bunch of MPEG-4 movies

```bash{aside="Audio extraction from movies"}
for a in *.mp4
do
    ffmpeg -i $a -map 0:1 -codec:a copy $(
        echo $a | sed -e 's/mp4/aac/g'
    )
done
```

Extract audio from an MPEG-4 stream and re-encode it as MP3

```bash{aside="MP3 extraction from steams"}
ffmpeg -hide_banner \
    -i ./stream.mp4 \
    -map_metadata -1 -vn ./audio.mp3
```

Re-encode audio to MP3 with a selected bitrate

```bash{aside="MP3 encoding from AAC"}
for a in $(
    find -name \*.aac
)
do
    ffmpeg -hide_banner -i $a -map_metadata -1 \
        -c:a libmp3lame -ac 2 -b:a 192k $(
            echo $a | sed 's/aac/mp3/'
        )
done
```

Convert MPEG-4 AVI files to MPEG-4 streams

```bash{aside="AVI to MPEG-4"}
for a in *.avi
do
    ffmpeg -hide_banner -i $a -map_metadata -1 \
        -codec:v copy -codec:a copy \
        $(echo $a | sed 's/avi/mp4/g')
done
```

Concatenate 100% compatible videos that have already been split into parts

```bash{aside="Concatenation example"}
echo file part1.mp4 > list.txt
echo file part2.mp4 >> list.txt
ffmpeg -f concat -safe 0 -i list.txt \
    -c copy -y output.mp4
```

Merge video and audio held into 2 MPEG-4 streams into a single MPEG-4 stream

```bash{aside="Mix audio and video"}
ffmpeg -hide_banner \
    -i ./video.mp4 -i ./audio.mp4 \
    -map_metadata -1 \
    -codec:v copy -codec:a copy \
    ./merged.mp4
```

De-interlace, rescale and encode as silent H264/MPEG-4

```bash{aside="Deinterlace and rescale silent movie"}
ffmpeg -i ./original.mp4 \
    -vf yadif -vf scale=720:574 \
    -c:v libx264 -preset slow -crf 0 \
    -an ./processed.mp4
```

Overlay two video camera streams on top of each other

```bash{aside="Overlay camera streams"}
ffmpeg \
    -f video4linux2 -r 30 -s 640x480 -i /dev/video0 \
    -f video4linux2 -r 30 -s 640x480 -i /dev/video2 \
    -filter_complex "[1]format=yuva444p,colorchannelmixer=aa=0.5[in2];[0][in2]overlay" \
    -y overlaid.mp4
```

Determine which (video) frames in a soundtrack contain peaks

```bash{aside="peak detector"}
FPS=25
ffmpeg \
    -i ./soundtrack.wav \
    -af astats=metadata=1:reset=$(
        echo ${FPS} | awk '{ printf 1 / $1 }'
    ),ametadata=print:key=lavfi.astats.Overall.Max_level:file=- \
    -f null /dev/null
```

Split into chunks each starting on a keyframe

```bash{aside="Chunking example"}
ffmpeg -i ./input.mp4 \
    -codec:a copy -format segment -codec:v copy \
    -reset_timestamps 1 \
    -map 0 chunk_%06d.mp4
```

After the chunks in the previous example have been split, you can copy them
into subdirectories and join each subdirectory back into a video with:

```bash{aside="Join the chunks back together"}
AWK='{ print "file " $1; }'

for CHUNK in $(find -type d | grep / | sort)
do
    CHUNK_NUMBER=$(echo $CHUNK | sed -e 's/.\///g')
    LIST_FILE=list_${CHUNK_NUMBER}.txt
    ls ${CHUNK}/*.mp4 | \
        grep mp4 | \
        awk "${AWK}" &gt;${LIST_FILE}
    NEXT_CHUNK=./$((CHUNK_NUMBER + 1))
    if [ -d ${NEXT_CHUNK} ]
    then
        ls ${NEXT_CHUNK}/*.mp4 | \
            head --lines 1 | \
            awk "${AWK}" &gt;${LIST_FILE}
    fi
    ffmpeg -f concat -safe 0 -i ${LIST_FILE} \
        -c copy -y chunk_${CHUNK_NUMBER}.mp4
done
```

Rescale old-school PAL TV programmes.

- Truncate to length of audio or video (whichever is shortest).
- Rescale the video to PAL "standard" size.
- Take the video quality down to "good enough" for PAL.
- Take the audio down to 44.1 mono at a suitable compression rate.

```bash{aside="Rescaling PAL TV"}
for a in *webm
do
    ffmpeg -hide_banner -i $a -shortest -map_metadata -1 \
        -c:v libx264 -crf 27 \
        -filter:v scale=746x576 -aspect 4:3 \
        -ar 44100 -ac 1 -b:a 64k \
        -y $( echo $a | sed -e 's/webm/mp4/g' )
done
```

DVD Ripping

This one isn't `ffmpeg`, it's `HandBrakeCLI`. I don't want to do any cropping,
rescaling and de-interlacing directly from the DVD. I want to just get the
video onto my filesystem so I can do all the processing without the
inconvienience of an optical disc going "Viiirt, viiirt, vit vit vit, viiiiir".

So this is the quickest and easiest way I can get a (far too big) copy off of
the disc.

If you want a smaller (or even bigger) working copy, you may want to tweak the
`--quality` value.

```bash{aside="DVD Ripping"}
DVD="/dev/sr0"
DISC_TITLE=$(
    lsdvd ${DVD} | \
    grep "Disc Title" | \
    sed 's/Disc Title: //g'
)
TITLES=$(
    lsdvd ${DVD} | \
    grep Chapters: | \
    awk '{ print $2 }' | \
    sed 's/,//g'
)
for TITLE in $TITLES
do
    OUTPUT_FILE=${DISC_TITLE}_${TITLE}.mp4
    if [ ! -f ${OUTPUT_FILE} ]
    then
        HandBrakeCLI --input ${DVD} \
            --title $TITLE \
            --encoder x264 \
            --quality 15 \
            --no-markers \
            --no-multi-pass \
            --cfr \
            --first-audio \
            --subtitle none \
            --output ${OUTPUT_FILE}
    fi
done
eject
```
