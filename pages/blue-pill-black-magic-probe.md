---
# cSpell:words blacksphere blackmagic stlink swlink imgur
# cSpell:words JTAG GPIO libnewlib multiarch eabi swdp
tags: micro
date: "2023-06-26"
---
# Using a Blue Pill as a Black Magic Probe - The Easy Way

## The Right Kind of Blue Pill

To fit the software in flash you require a 128K Blue Pill rather than the 64K
variety.

From my rather confused and stumbling research, the 128K variety are far more
common now and you may have to struggle to find a 64K version.

Any clarification of the 64K / 128K issue would be more than welcome.

## Obtaining the firmware

The Black Magic Probe project is hosted at:
[github.com/blacksphere/blackmagic](https://github.com/blacksphere/blackmagic)
and you can obtain the firmware with:

```text
git clone git@github.com:blacksphere/blackmagic.git
cd blackmagic
```

At the time of writing, the current release is v1.7.1, but you can substitute
this with the current release in your time-stream by checking
[github.com/blacksphere/blackmagic/tags](https://github.com/blacksphere/blackmagic/tags)

```text
git checkout v1.7.1
```

## Build the Firmware

You'll find many instructions online saying use the `stlink` target and this
does, indeed, work. But if you do use this target, the onboard LED doesn't work
and the wires you need to connect to the target device will be an arbitrary
collection of GPIOs.

If you use the `swlink` target, the LED works and the SWD pins **are** the SWD
pins and the JTAG pins **are** the JTAG pins and any need for funny adapter
boards just disappears.

As well as `arm-none-eabi-gcc`, you'll need `libnewlib-arm-none-eabi` installed.

```text
make clean && make PROBE_HOST=swlink
```

--------------------------------------------------------------------------------

## Prepare to Upload

Move the **BOOT0** jumper from **0** to **1** to use the serial flasher boot
loader.

Connect a USB/serial adaptor to the Blue Pill:

| USB/Serial | Blue Pill |
| ---------- | --------- |
| 3V3        | 3V3       |
| GND        | GND       |
| RX         | A9(TX1)   |
| TX         | A10(RX1)  |

Insert the USB/serial adapter in your computer.

![Blue Pill serial upload](https://i.imgur.com/dKSzLko.jpg){aside}

## Upload the firmware

**I'm using [stm32flash](https://aur.archlinux.org/packages/stm32flash) to do my
serial uploads.**

I didn't want to bother using the DFU option to upgrade my firmware in the
future and I made the mistake of skipping uploading the DFU boot loader. But,
even if you plan to never use DFU, you still need the boot loader to make the
Blue Pill enumerate it's USB ports!

```text
stm32flash -o /dev/ttyUSB0
stm32flash -w src/blackmagic_dfu.bin -v /dev/ttyUSB0
stm32flash -w src/blackmagic.bin -v -S 0x08002000 /dev/ttyUSB0
```

I'm not sure if the `stm32flash -o` option is actually required (I'm a newbie
myself) but it doesn't do any particular harm.

--------------------------------------------------------------------------------

## Try it Out

Unplug and disconnect the USB/serial adaptor, put the **BOOT0** jumper back on
**0**, and re connect the new Black Magic Probe via USB.

Trying `ls /dev/tty*` should show up `/dev/ttyACM0` **and** `/dev/ttyACM1`.

Unplug it and try connecting a second "pill" to the SWD port.

The following should now give the expected results.

```text
gdb-multiarch
target extended-remote /dev/ttyACM0
monitor swdp
attach 1
info registers
quit
```

![Blue Pill BMP SWD](https://i.imgur.com/D0Xk3ND.jpg){aside}

## Flashing script

We can use the BMP to flash an STM-32 dev board with
[this script](https://github.com/andy-preston/avrnude/blob/master/scripts/bmp-flash)

## We're done

Right I'm off to try and learn how to debug embedded Zig. And you're off to do
whatever it is you need to do... See you soon, maybe.

--------------------------------------------------------------------------------

## Hang on, What about JTAG?

Well, I'm not quite ready for JTAG just yet. But, with an extra header for the
other 3 JTAG pins, it shouldn't be a problem.

![Blue Pill BMP JTAG](https://i.imgur.com/c0yRLfN.jpg){aside}
