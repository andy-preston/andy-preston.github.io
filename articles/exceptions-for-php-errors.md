---
tags: php
date: "2023-06-26"
---
# Exceptions for all PHP Errors

I don't remember actually using this for quite some time now. For all I know,
somewhere along the line they've fixed this inside the PHP run-time system.

PHP has many issues with backward compatibility. It traces it's lineage back
to a simple templating engine and over the years has gained many features to
try and turn it into a multi-paradigm programming language. All this whilst
trying to maintain full backward compatibility.

Something has got to break.

One element of this backward compatibility is that some errors don't throw
handleable exceptions instead they rely on an older mechanism that takes me
back to my days of programming in BASIC (that's a long, long, long, long time
ago).

And even if we wrap all this up in a nice "modern" lambda function, it's still
hard to deal with the errors:

```php{aside="bottom}
set_error_handler(
    function($severity, $message, $file, $line) {
        if (!(error_reporting() && $severity)) {
            echo "Setting a flag to ignore errors";
            echo " in any language in any environment";
            echo " is repugnant! Don't do it!\n";
            return;
        }
        // Try to handle the error here
        // and recover with dignity!
    }
);
```

But this error handling mechanism does give us a simple way to generate
exceptions that can be handled with `catch`.

```php{aside}
set_error_handler(
    function($severity, $message, $file, $line) {
        throw new ErrorException(
            $message,
            0,
            $severity,
            $file,
            $line
        );
    }
);
```
