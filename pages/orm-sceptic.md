---
publishAsDraft: true
tags: arch
date: "2023-06-26"
---
# A Sceptic's Guide to ORM

**This is an early draft.**

I've started well... but the article peters out and the ending is a massive
disappointment.

I'll finish it soon but, in the meantime, "you have been warned".

--------------------------------------------------------------------------------

I'm not really what you could an ORM Sceptic but I'm certainly not an
enthusiast either, I suppose you could say I'm "agnostic".

Over the years, I've cursed whatever ORM I'm using many times, but a recent
task at work has "crystallized" my thoughts and I feel I've now replaced most
of my previously held opinions with something approaching the facts about this
surprisingly difficult subject.

--------------------------------------------------------------------------------

## What is ORM?

The difficulty starts with the fact that ORM is both a noun and a verb.
We have a pattern called "Object Relational Mapping" and many software
libraries known collectively as "Object Relational Mappers". So when we say
"ORM&"", it's not immediately obvious what we're talking about.

--------------------------------------------------------------------------------

## What is a Mapper, then?

Rather than immediately define what a Mapper is here, perhaps it's a lot
easier to deal with some popular misconceptions and deal with what it's not.

### Not (Just) SQL Abstraction

It's often thought that ORM libraries are there to provide an abstraction
over SQL, that the query builders they often provide give a simplified API
to the complexities of SQL, and that they allow an easy path to move between
the various different implementations and dialects of SQL. Although they
**do** often provide this, it's not their real purpose.

### Not (Necessarily) Classical OOP

Because ORM has "object" in it's name, it's easy to assume that what we're
discussing is an object in the terms of classes and strict OOP. Although many
ORMs do treat data objects as "OOP objects" there's another way to view
objects, without classes and methods, just simple JSON (or a PHP associative
array or a Python dictionary...):

```json{aside="bottom"}
    "orders": [{
        "customer": {
            "name": "Tim Tester",
            "delivery_address": {...},
            "billing_address": {...}
        },
        "items": [{
            "Description": "Hacking Flange",
            "Price": 4.18
        }, {
            "Description": "Strong Glue",
            "Price": 5.28
        }]
    }]
}
```

## And, Here's Where The Mapping Comes in

Looking at things from "the other side of the fence", in SQL everything is a
table.

This, at the time it was created, was considered the great strength of SQL.
If a view looks like a table, if a stored procedure yields a table, if a
sub-query is basically just another table, then all of these things can be
joined in a bigger query as though they were all tables.

| cust_id | name       | addr_type | addr_id | address | item_id | description    | price |
| ------- | ---------- | --------- | ------- | ------- | ------- | -------------- | ----- |
| 23      | Tim Tester | Delivery  | 39      | ...     | 57      | Hacking Flange | 4.18  |
| 23      | Tim Tester | Delivery  | 39      | ...     | 75      | Strong Glue    | 5.28  |
| 23      | Tim Tester | Billing   | 93      | ...     | 57      | Hacking Flange | 4.18  |
| 23      | Tim Tester | Billing   | 93      | ...     | 75      | Strong Glue    | 5.28  |

{aside}

--------------------------------------------------------------------------------

## But The Formats Don't Match

On receiving this table into our application code, the obvious disparity
between the result set and the format of the data we need becomes apparent
and, in a simple example like this, mapping this result into the objects that
our hypothetical API has to deliver in JSON can be achieved with a simple
iteration.

But as the complexity of the queried data increases so does the complexity
of the code required to map it.

--------------------------------------------------------------------------------

## It's not as simple as it seems

I've recently been working on a fix which came down to doing the mapping
"by hand" for a query containing around 5 joins and the resulting
code ended up being over 100 lines.

This is where using an ORM library comes into it's own, it's simply a matter
of "pumping the query into one end and getting a nicely mapped result set
out of the other"... or is it?

The reason why I was doing this fix was to overcome excessive memory usage
issues our chosen ORM library.

--------------------------------------------------------------------------------

## Your Mileage May Vary

The application I'm working on may be a special case, it's legacy code with
a database that was designed before ORM libraries were "a thing",
it's "stuck" on an obsolete version of PHP, and it's using a
heavily modified version of an equally obsolete ORM. I say it might be a
special case but I'm sure many of you have also had to work on something very
similar at some point in your careers.

--------------------------------------------------------------------------------

## Who's Schema Is It Anyway?

All of the ORMs that I've used (something like 3 for PHP, 1 for Ruby and 1
for Python) "want to" own the database schema. The classic pattern
is that you design the objects that are to be used in your application and the
ORM creates the database schema to suit those objects.

This is more or less fine for green field projects but not so great for
legacy applications. There are many patterns which work fine in your chosen
database but are difficult to shoe-horn into your ORM or maybe just impossible
to use. It might be as simple as the ORM does not support ENUM fields or you
may have pivot-tables that also contain data of their own. Sometimes you can
fix these issues by redesigning the database, sometimes by inserting
horrible kludges into your ORM code. But neither of these solutions yield
anything that could be described as "elegant".

--------------------------------------------------------------------------------

## Is There a Punchline?

No! Not yet!
