---
# cSpell:words Hackaday LCSoft Sigrok Veroboard
tags: micro
date: "2024-12-06"
---
# Adding Buffering to LCSoft CY7C68013A Mini Board

Using
[74HC245 - Octal Bus Transceivers With 3-State Outputs](https://www.ti.com/lit/ds/symlink/sn74hc245.pdf)
to buffer the inputs to a
[LCSoft CY7C68013A Mini Board](https://sigrok.org/wiki/Lcsoft_Mini_Board).

This article was originally on
[Hackaday](https://hackaday.io/project/170532-adding-buffering-to-lcsoft-cy7c68013a-mini-board)
but this is an expanded and updated version.

## Replace power switch with 5V supply

The 74HC245 chips need a 5V power supply which isn't available on the board
headers but is available on the USB.

I "steal" this from the board by removing it's power switch and connecting a
flying lead to it's 5V lines.

But, now the switch is gone, you have to also short out the 5V and GND lines
so that the board is always switched on.

![Solder bridges and 5V lead replacing power switch](https://i.ibb.co/q0ZHhvS/1-replace-power-switch.jpg){aside}

## Board layout

This is a slightly unorthodox board layout. I don't normally use this pad-board.
I'm much happier with strip-board (like the old favourite from the U.K.,
Veroboard). But I wanted a double-sided board with plated through holes and
the green FR4 pad-board was the cheapest option.

The important constraint with the layout is to get everything on the board
without obstructing the USB socket or the jumpers on the CY7C68013A board.

I'm not really that happy (or skilled) with the deliberate solder bridge
technique that these boards favour so, instead, I got hold of some extra thin
single-strand telecoms wire and made most of the connections by pushing 2
strands into one hole.

The 74HC245 has a nice easy chip layout and Sigrok are good enough to
provide a map of which CY7C68013A pins go to which headers:
[sigrok.org/wiki/Lcsoft_Mini_Board](https://sigrok.org/wiki/Lcsoft_Mini_Board).

* The blue wires connect PB0-PB7 on the to CY7C68013A to A1-A8 on one 74245.

* The yellow wires connect PD0-PD7 to A1-A8 on the other 74245.

* B1-B8 on each 74245 go to the headers for connection to the device you're
probing.

* There's also a connection from the grounds on the 74245s to the CY7C68013A's
ground pins via the big solder bridge on the bottom header.

* And, like it says in the picture, "don't forget the decoupling caps". These
are across the VCC and ground pins on both 74245s. I crammed a couple of
little 100n 1206s in.

* The last part is a header pin for the 5V wire from the USB to the VCC pins of
the 74245s.

![Board Layout](https://i.ibb.co/HTk8FBB/2-board-layout.jpg){aside}

## Attach boards

This is just a matter of pushing the headers together and attaching the 5V lead.

Note the position of the 5V lead, this gives clues as to the correct orientation
of the boards.

![Attach Boards](https://i.ibb.co/N1wHN3h/3-attatch-boards.jpg){aside}

## And we're done

I had considered routing the CY7C68013A board's jumper through to a switch.

I think that in one jumper position Sigrok thinks it's an 8-input board
and in the other, a 16-input board.

But this needs a bit more investigation to see if it's either true or useful.

![And we're done](https://i.ibb.co/1z1gg4g/4-and-were-done.jpg){aside}
