
This is a compilation of recommended performace, security and usability stuff to do on your website.

## Links

### Scanners

#### All In One

* https://observatory.mozilla.org

* https://sonarwhal.com

#### Security

* https://securityheaders.io
* https://hstspreload.org
* https://tls.imirhil.fr
* https://www.htbridge.com/ssl
* https://www.htbridge.com/websec

#### Meta

* https://search.google.com/structured-data/testing-tool

* https://cards-dev.twitter.com/validator

* https://developers.facebook.com/tools/debug

### Other resources

* https://frontendchecklist.io

## Checklist
* Preload fonts
* Allow browser to swap to default font until font has downloaded
* Defer or async script
* Minimize HTML
* Minimize CSS
* Use gzip and Brotli
* Return a 404 error page
* Return a 500 error page
* Add Open Graph meta data
  *  og:title and og:description will fallback to native `<title>` and `<description>` so you probably don't need those
* Add Twitter card meta data
  * Twitter will fallback to Open Graph so you'll probably only need the twitter:card meta data. 
* Add Apple ios meta
* Use Google Fonts for performance
* Restrict TLS ciphers
* Add X-Content-Type-Options header
* Add Strict-Transport-Security header
* Add Expect-CT header
* Add X-Frame-Options header
* Add X-XSS-Protection header
* Add Content-Security-Policy header
* Add Referrer-Policy header

## TLS ciphers
For services that don't need backward compatibility, the parameters below provide a higher level of security. This configuration is compatible with Firefox 27, Chrome 30, IE 11 on Windows 7, Edge, Opera 17, Safari 9, Android 5.0, and Java 8.

Use TLS version 1.2

    ECDHE-ECDSA-AES256-GCM-SHA384
    ECDHE-RSA-AES256-GCM-SHA384
    ECDHE-ECDSA-CHACHA20-POLY1305
    ECDHE-RSA-CHACHA20-POLY1305
    ECDHE-ECDSA-AES128-GCM-SHA256
    ECDHE-RSA-AES128-GCM-SHA256
    ECDHE-ECDSA-AES256-SHA384
    ECDHE-RSA-AES256-SHA384
    ECDHE-ECDSA-AES128-SHA256
    ECDHE-RSA-AES128-SHA256

### More Info
* https://wiki.mozilla.org/Security/Server_Side_TLS#Recommended_configurations

## HTTP Headers
There are some headers that don't need to be sent for non-HTML resources. Sending these does not provide any value to users and just increases header bloat.

### Headers for all requests
* X-Content-Type-Options
* Strict-Transport-Security
* Expect-CT
* Referrer-Policy

### HTML Only Headers
* X-Frame-Options
* X-XSS-Protection
* Content-Security-Policy

### X-Content-Type-Options
The X-Content-Type-Options response HTTP header is a marker used by the server to indicate that the MIME types advertised in the Content-Type headers should not be changed and be followed.

#### Recommended Value
`X-Content-Type-Options: nosniff`

#### More Info
* https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options

### Strict-Transport-Security
The HTTP Strict-Transport-Security response header (often abbreviated as HSTS)  lets a web site tell browsers that it should only be accessed using HTTPS, instead of using HTTP.

#### Recommended Value
`Strict-Transport-Security: max-age=31556926; includeSubDomains; preload`

Start with a low max-age, a couple of minutes, and make sure you don't have any issues before increasing to a year.

**Warning:** This will make your entire domain and all subdomains only accessable via HTTPS. Preloading should be viewed as a one way ticket. Whilst it is possible to be removed, it can take a long time and you may not be removed from all browsers.

`preload` - Google maintains an HSTS preload service. By following the guidelines and successfully submitting your domain, browsers will never connect to your domain using an insecure connection. While the service is hosted by Google, all browsers have stated an intent to use (or actually started using) the preload list. However, it is not part of the HSTS specification and should not be treated as official.

* https://hstspreload.org

#### More Info
* https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security

### Expect-CT
The Expect-CT header allows sites to opt in to reporting and/or enforcement of Certificate Transparency requirements, which prevents the use of misissued certificates for that site from going unnoticed. When a site enables the Expect-CT header, they are requesting that Chrome check that any certificate for that site appears in public CT logs.

#### Recommended Value
`enforce, max-age=30, report-uri="<uri>"`

#### More Info
* https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expect-CT

### X-Frame-Options
The X-Frame-Options HTTP response header can be used to indicate whether or not a browser should be allowed to render a page in a `<frame>`, `<iframe>` or `<object>`. Sites can use this to avoid clickjacking attacks, by ensuring that their content is not embedded into other sites.

#### Recommended Value
`X-Frame-Options: DENY`

If you need to load the page in a frame use `SAMEORIGIN` or `ALLOW-FROM <uri>`.

#### More Info
* https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options

### X-XSS-Protection
The HTTP X-XSS-Protection response header is a feature of Internet Explorer, Chrome and Safari that stops pages from loading when they detect reflected cross-site scripting (XSS) attacks.

#### Recommended Value
`X-XSS-Protection: 1; mode=block`

#### More Info
* https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection

### Content-Security-Policy
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware.

#### Recommended Value

    default-src
    base-uri
    form-action
    frame-ancestors
    connect-src
    manifest-src
    worker-src
    report-uri
    report-to
    script-src
    style-src
    img-src
    font-src

#### More Info
* https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP

### Referrer-Policy
The Referrer-Policy HTTP header governs which referrer information, sent in the Referer header, should be included with requests made.

#### Recommended Value
`Referrer-Policy: strict-origin-when-cross-origin`

Send a full URL when performing a same-origin request, only send the origin of the document to a-priori as-much-secure destination (HTTPS->HTTPS), and send no header to a less secure destination (HTTPS->HTTP).

#### More Info
* https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
