---
# cSpell:words Symfony
tags: php
noDate: true
---

# Debugging and Testing with Symfony's Mailer Component

When SwiftMailer was the standard component for sending E. mail in Symfony,
we could use "enqueue" as a simple means of saving E. mails to a text
file that could be easily be tested and debugged.

Often, during testing and debugging, we don't want to bother with actually
sending the E. mail and all that malarkey with transports and protocols.

With the new
[Symfony Mailer Component](https://symfony.com/doc/current/mailer.html)
this isn't so easy to do.

But we can, edit our `.env.local`, `.env.dev`, or `.env` file to include:

```bash
MAILER_URL=null://null
```

And then edit
`vendor/symfony/mailer/Transport/NullTransport.php`
and paste the following code into the `doSend` method:

```php
protected function doSend(SentMessage $message): void {
    $now = new \DateTime();
    $envelope = $message->getEnvelope();
    file_put_contents(
        dirname(__DIR__) .
            '../../../../var/mail/' .
            $now->format('Y-m-d-H-i-s'),
        json_encode([
            'sender' => $envelope->getSender()->toString(),
            'recipients' => array_map(function ($recipient) {
                return $recipient->toString();
            }, $envelope->getRecipients()),
            'messageId' => $message->getMessageId(),
            'debug' => $message->getDebug(),
            'message' => $message->getMessage()->toString()
        ])
    );
}
```

This is just a quick hack-up. The handling of `./var/mail/` is hardly what
could be called "robust". But it's fine for testing and debugging environments.
