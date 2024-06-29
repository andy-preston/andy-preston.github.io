---
# cSpell:words steenkin
tags: javascript
date: "2024-02-23"
---

# Little JavaScript (TypeScript) Examples

I don't know what title to give this yet. Some provisional ideas are:

- "JavaScript don't need no steenkin' classes"
- "I love to troll functional programming advocates"
- "Don't stand so closure me"

Here we have a nice little closure that returns a function that accesses
a private saved state.

I love how concise the execution of the returned functions are. These would
have to be method invocations in a "classical" OOP language and simply would be
as neat.

Just in case you were wondering what all this messing around with sines
and periodicity are all about, this is a prototype for a generator of the
classic British GPO dial tone for
[an antique phone emulation](https://github.com/andy-preston/gpo-746-android)
that I seem to have become obsessed with.

```typescript {aside="Closure and higher-order function example"}
const samplePeriod = 1 / 11025;
const twoPi = 2 * Math.PI;

const sines = (period: number) => {
    const inc = twoPi / (period / samplePeriod);
    var theta = 0.0;
    return (): number => {
        const previousTheta = theta;
        theta = theta + inc;
        if (theta > twoPi) {
            theta = theta - twoPi;
        }
        return Math.sin(previousTheta);
    }
}

const sines1 = sines(1 / 350);
const sines2 = sines(1 / 450);

for (let sample = 0; sample < 300; sample++) {
    console.log(sines1(),  sines2());
}
```
