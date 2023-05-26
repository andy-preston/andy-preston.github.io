# Securely erasing old hard disks

I occasionally find old hard disks in dumpsters or other people's rubbish.
Ask and the bin-man doth provide.

It's always a good idea to securely erase such disk... you've no idea what
sort of stuff is on them.

The easiest way to do this is with `dd` and `/dev/random`.

Although, if I'm going to sell them on E. Bay, I like to fill them up with a
video loop of Joey saying "I copied a garbage file" and Phreak responding
"Big deal, a garbage file's got shit in it Joey" just for jollies.

## Block Size!

But dding that many bytes can take a long time, so with the help of
http://blog.tdg5.com/tuning-dd-block-size/ I cooked up this little script to
find the optimal block size:

```shell
#!/bin/bash

# Since we're dealing with dd, abort if any errors occur
set -e

for PASS in 1 2
do
    cat /dev/null > /tmp/dd-random
    if [ $PASS == 1 ]
    then
        TEST_SIZE=134217728
        BLOCK_SIZES="512 1024 2048 4096 8192 16384 32768 65536 131072 262144 524288 1048576 2097152 4194304 8388608 16777216 33554432 67108864"
    else
        TEST_SIZE=2972450816
        BLOCK_SIZES=$(tail -n 4 /tmp/dd-random-results | awk '{ print $3 }')
    fi
    echo $BLOCK_SIZES
    for BLOCK_SIZE in $BLOCK_SIZES
    do
        REQUIRED_BLOCKS=$(($TEST_SIZE / $BLOCK_SIZE))
        if [ $REQUIRED_BLOCKS -le 0 ]
        then
            echo "Block size: $BLOCK_SIZE requires $REQUIRED_BLOCKS blocks"
        else
            sync
            DD_RESULT=$(
                dd if=/dev/random of=/dev/sdb \
                    bs=$BLOCK_SIZE count=$REQUIRED_BLOCKS 2>&1 1>/dev/null
            )
            TRANSFER_RATE=$(
                echo $DD_RESULT | \
                grep --only-matching -E '[0-9.]+ ([MGk]?B|bytes)/s(ec)?'
            )
            echo "$TRANSFER_RATE $BLOCK_SIZE"
            echo "$TRANSFER_RATE $BLOCK_SIZE" >> /tmp/dd-random
        fi
    done
    sort -n /tmp/dd-random > /tmp/dd-random-results
    echo ===============================================
    cat /tmp/dd-random-results
done
```
