# FFMPEG Recipes

Not exactly "an FFMPEG cookbook",
more like a collection of recipes scrawled on the back of old envelopes.

Extract the audio from a bunch of MPEG-4 movies

```bash
for a in *.mp4
do
    ffmpeg -i $a -map 0:1 -acodec copy $(
        echo $a | sed -e 's/mp4/aac/g'
    )
done
```

Extract audio from an MPEG-4 stream and re-encode it as MP3

```bash
ffmpeg -hide_banner -i ./stream.mp4 \
    -map_metadata -1 -vn ./audio.mp3
```

Re-encode audio to MP3 with a selected bitrate

```bash
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

```bash
for a in *.avi
do
    ffmpeg -hide_banner -i $a -map_metadata -1 \
        -vcodec copy -acodec copy $(echo $a | sed 's/avi/mp4/g')
done
```

Concatenate 100% compatible videos that have already been split into parts

```bash
echo file part1.mp4 > list.txt
echo file part2.mp4 >> list.txt
ffmpeg -f concat -safe 0 -i list.txt -c copy -y output.mp4
```

Merge video and audio held into 2 MPEG-4 streams into a single
MPEG-4 stream

```bash
ffmpeg -hide_banner -i ./video.mp4 -i ./audio.mp4 \
    -map_metadata -1 -c:v copy -c:a copy \
    ./merged.mp4
```

Deinterlace, rescale and encode as silent H264/MPEG-4

```bash
ffmpeg -i ./original.mp4 \
    -vf yadif -vf scale=720:574 \
    -c:v libx264 -preset slow -crf 0 \
    -an ./processed.mp4
```
