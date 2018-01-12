This is a compilation of recommended performace, security and usability stuff to do on your website.

## Scanners

### All in one

* https://observatory.mozilla.org

* https://sonarwhal.com

### Security

* https://securityheaders.io
* https://hstspreload.org
* https://tls.imirhil.fr
* https://www.htbridge.com/ssl
* https://www.htbridge.com/websec

### Meta

* https://search.google.com/structured-data/testing-tool

* https://cards-dev.twitter.com/validator

* https://developers.facebook.com/tools/debug

## Other resources

* https://frontendchecklist.io

## Checklist
* Preload fonts
* Allow browser to swap to default font until font has downloaded
* Defer or async script
* Minimize HTML
* Minimize CSS
* Use gzip
* Return a 404 error page
* Return a 500 error page
* Add Open Graph meta data
  *  og:title and og:description will fallback to native `<title>` and `<description>` so you probably don't need those
* Add Twitter card meta data
  * Twitter will fallback to Open Graph so you'll probably only need the twitter:card meta data. 
* Add Apple ios meta
* Use Google Fonts for performance
* Restrict TLS ciphers
* Add x-frame-options header
* Add x-xss-protection header
* Add x-content-type-options header
* Add content-security-policy header
  * default-src
  * base-uri
  * form-action
  * frame-ancestors
  * connect-src
  * manifest-src
  * worker-src
  * report-uri
  * report-to
  * script-src
  * style-src
  * img-src
  * font-src
* Add strict-transport-security header
  *  Be careful with `preload`
* Add expect-ct header
* Add strict referrer policy header
