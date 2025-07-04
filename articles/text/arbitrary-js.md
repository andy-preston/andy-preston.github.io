---
tags: javascript
date: "2024-04-21"
---
# Evaluating arbitrary JS inside a scope

## UPDATE

This was just a quick experiment to see if I could do this using some ideas
"stolen" from
[StackOverflow](https://stackoverflow.com/questions/8403108/calling-eval-in-particular-context#25859853).
Since then, I actually started to implement the code for my use case and
there's a better solution
[On my Github](https://github.com/andy-preston/aaa/tree/main/src/javascript)
and this article will be updated to match that in "the near future".
{class="update"}

--------------------------------------------------------------------------------

Here we have a normal JS object that stands in for the scope of our `eval`ed code.

```javascript {aside="Scope Object"}
var scopeObject = {
    "a": 1,
    "b": 2,
    "c": 3
};
```

Read only properties do require a little extra work to add
them to the object and they don't appear as ordinary fields (e.g. in a
`console.log`

```javascript {aside="Adding Properties"}
Object.defineProperty(scopeObject, "doNotTouch", {
    "value": 47,
    "writeable": false,
});
```

Here's the actual evaluation function.

The function constructor both does the evaluation without an explicit call
to `eval` (just in case you were wondering where it was).

It also side-steps the `"strict-mode"` prohibition on using `with`. The
`with` is necessary to allow us to access properties within `scopeObject` as
though they were any normal JS scope (i.e. without prefixing them with `this.`).

```javascript {aside="Using 'eval'"}
const evalInScope = function(jsString) {
    return new Function(
        `with (this) { return (${jsString}); }`
    ).call(scopeObject);
}
```

To read values from the scope, we can just reference them by name.

```javascript {aside="Read Test"}
const readTest = evalInScope("a + b");
if (readTest != scopeObject.a + scopeObject.b) {
    throw "read test failed";
}
if (readTest != 3) {
    throw "read test failed";
}
```

You can also write existing values with a "straight assignment"

```javascript {aside="Write Test"}
evalInScope("c = 25");
if (scopeObject.c !== 25) {
    throw "write test failed";
}
```

To add values to the scope they must be prefixed with `this`

```javascript {aside="Writing with 'this' prefix"}
evalInScope("this.x = 23");
if (scopeObject.x !== 23) {
    throw "new value test failed";
}
```

Read only properties can be read just like normal properties

```javascript {aside="Reading read-only properties"}
const readOnlyTest = evalInScope("doNotTouch");
if (readOnlyTest !== scopeObject.doNotTouch) {
    throw "read (only) test failed";
}
if (readOnlyTest != 47) {
    throw "read (only) test failed";
}
```

Read only properties cannot be changed

```javascript {aside="Trying to change read-only properties"}
evalInScope("doNotTouch = 999");
if (scopeObject.doNotTouch != 47) {
    throw "write read-only test failed";
}
evalInScope("this.doNotTouch = 999");
if (scopeObject.doNotTouch != 47) {
    throw "write read-only test failed";
}
```
