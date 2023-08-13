# My Website

My website is built with Jekyll and is using a simple theme called [Tale](https://github.com/chesterhow/tale).

## Building

```bash
bundle install
bundle exec jekyll serve
```

## Deploying

1. Commit to master
2. Netlify automatically builds

Location of builder on netlify:
<https://app.netlify.com/sites/kshehadeh/overview>

Domain is registered on namecheap.com but DNS is handled by Netlify's DNS servers:

* dns1.p01.nsone.net
* dns2.p01.nsone.net
* dns3.p01.nsone.net
* dns4.p01.nsone.net

Netfliy is also handling MX records since all DNS handling has been delegated to it.
