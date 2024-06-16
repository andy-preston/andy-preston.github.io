---
# cSpell:words ucfirst Symfony
tags: php
noDate: true
---
# Accessing Doctrine Models as Arrays

A few years ago, I was working on a Symfony project that contained some
fairly torturous business logic and, as this logic was required in various
parts of the application, we kept it in some helper classes that could be used
as needed without reproducing the same logic throughout the application.

Obviously, this logic applied to various hierarchies of Doctrine models.

Now, Doctrine models are great when you're dealing with simple datasets.
But, even with pagination, hydrating all those PHP objects for a huge multi-row
management report can make too much of an impact on performance to be
tolerable. The answer is to hydrate data for big reports as arrays.

But what if those reports require the use of the business logic helpers?
Helpers that are full of constructs like:

```php
$order->getLines()[5]->getPrice()
```

After much wailing and gnashing of teeth and wishing PHP couldn't be more
like some of my preferred languages and let you access objects as though they
were arrays,
[The Class Array Access page of the PHP manual](https://www.php.net/manual/en/class.arrayaccess.php)
came to my rescue.

Each of out Doctrine models could inherit from this base class:

```php
abstract class objectOrArray implements \ArrayAccess {
    private static function getter(string $offset) {
        return 'get' . ucfirst($offset);
    }

    public function offsetSet($offset, $value) {
        // This method will never be used as we only need to read object
        // values as an array, not set them
    }

    public function offsetUnset($offset) {
        // This method will never be used as we only need to read object
        // values as an array, not set them
    }

    public function offsetExists($offset) {
        return method_exists($this, self::getter($offset));
    }

    public function offsetGet($offset) {
        $getter = self::getter($offset);
        return method_exists($this, $getter) ? $this->$getter() : null;
    }
}
```

And our actual objects didn't need to change any more than that.

```php
class orderLine extends objectOrArray {
    private $price;

    public function getPrice() : int {
        return $this->price;
    }

    public function setPrice(int $price) : self {
        $this->price = $price;
        return $this;
    }
}

class order extends objectOrArray {
    private $lines;

    private $customer;

    public function getLines() : array {
        return $this->lines;
    }

    public function setLines(array $lines) : self  {
        $this->lines = $lines;
        return $this;
    }

    public function getCustomer() : int {
        return $this->customer;
    }

    public function setCustomer(int $customer) : self {
        $this->customer = $customer;
        return $this;
    }
}
```

Then it was simply a matter of reimplementing this business logic (as per
the example above) to use:

```php
$order['lines'][5]['price']
```

And we could continue to use it with Doctrine model objects in most of the
code **and** it'd also allow us to fetch partial results from the
database and hydrate as arrays for those long and tortuous reports.
