---
tags: arch
draft: true
---

# Why the Active Record Pattern Isn't (Necessarily) a Good Idea

From the point of view of DDD, the Active Record design pattern certainly
encapsulates a single responsibility but, when considering it's
implementation in PHP (and quite probably other interpreted languages too)
we need to think about the number of responsibilities contained in a single
class. If we are dealing with single objects representing single entities
there is less to worry about. But if our system has to deal with collections
problems can arise. A collection containing Plain Ordinary Data Objects will
have little impact on the system but an Active Record containing "stuff" can
lead to excessive memory usage.

## Memory Usage and The Active Record Pattern

Let's return to my fixing memory usage bugs by doing the mapping
&quot;by hand&quot;

## Further Reading

https://en.wikipedia.org/wiki/Active_record_pattern#Criticism

Cal Paterson - The Troublesome Active Record Pattern (March 2020)
https://medium.com/r/?url=https%3A%2F%2Fcalpaterson.com%2Factiverecord.html

Matthias Noback - Active Record Versus Data Mapper (August 2022)
https://medium.com/r/?url=https%3A%2F%2Fmatthiasnoback.nl%2F2022%2F08%2Fsimple-solutions-1-active-record-versus-data-mapper%2F

Mehdi Khalili - ORM Anti Patterns, Active Record (December 2010)
https://medium.com/r/?url=https%3A%2F%2Fwww.mehdi-khalili.com%2Form-anti-patterns-part-1-active-record
