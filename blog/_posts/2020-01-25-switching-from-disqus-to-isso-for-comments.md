---
layout: "post"
title: "Joining the Club: Switching from Disqus to Isso for Comments"
location: "Athens, Ohio"
comments: true
tags: ["meta", "privacy", "website"]
---

This site does not get a lot of traffic. It probably never will. In the same way, I don't have a huge *need* for comments on blog posts, projects, and so on. That said, I like to give people the option to comment on something if they feel the desire to, so from the launch of this site until very recently, Disqus was embedded (when 'comments: true' in the Jekyll front-matter at least). As I am building a static site into HTML files, Disqus was a perfectly fine option, especially in 2015 when I first built this iteration of the site.

As time has gone on, Disqus has gone the way of many free online services, making their money by scooping up and selling the data of its users (or just [displaying hideous ads](https://wptavern.com/disqus-hits-sites-with-unwanted-advertising-plans-to-charge-large-publishers-a-monthly-fee-to-remove-ads)). Not only that but embedding their code adds hundreds of kilobytes and at least a few requests to the page load. That slowdown was a large reason that many sites went the 'Click to Load Comments' route, which affected folks deciding whether they would comment at all. Considering that my entire site (excluding images) is under 500kb, [loading 500kb+](https://sitebee.co.uk/disqus-is-slowing-down-your-website-heres-proof/) just for the rarely-used commenting feature started to look like a worse and worse decision.

At this point I considered just removing comments altogether, as others have done, making their case convincingly:

* **Kev Quirk** - [Removing Comments](https://kevq.uk/removing-comments) -- 2019/11/19
* **Seth Godin** - [Why I don't have comments](https://seths.blog/2006/06/why_i_dont_have/) -- **2006**/06/03

I just couldn't bring myself to to not have an option (aside from email or social media) for someone to interact with a piece of content on my site, so I looked for alternatives. Two stood out head and shoulders above the rest: [Commento](https://commento.io/) and [Isso](https://posativ.org/isso/). Here are some of the great posts by others who went through the same search before I did:

* **Victor Zhou** - [Why I Replaced Disqus and You Should Too](https://dev.to/vzhou842/why-i-replaced-disqus-and-you-should-too-2o0e)
* **Vincent Bernat** - [A More Privacy-Friendly Blog](https://vincent.bernat.ch/en/blog/2018-more-privacy-blog)
* **Marko Saric** - [Why you should remove Disqus from your site](https://markosaric.com/remove-disqus/)
* **Jan-Lukas Else** - [A reply to Marko Saric](https://jlelse.blog/links/2019/12/2019-12-22-swyfu/)
* **Remy Sharp** - [Ejecting Disqus](https://remysharp.com/2019/06/11/ejecting-disqus)
* **Ben Fedidat** - [Blog comment systems: Disqus alternatives](https://fedidat.com/530-blog-comments/)
* **Matthias Adler** - [Bye, Bye Disqus - Say Hello to Isso](https://matthiasadler.info/blog/isso-comment-integration/)

The more I looked into Isso, and based on some of the glowing recommendations above, the better it seemed to fit what I was looking for:

* **Free** - I have had exactly [*one* comment](https://willpresley.com/blog/push-then-build-jekyll-site/#isso-thread) on this site in its five years of existence, so paying any amount to provide comments was quickly deemed not worth it.
* **Open Source** - [https://github.com/posativ/isso/](https://github.com/posativ/isso/)
* **Project under active, quality development** - [https://github.com/posativ/isso/commits/master](https://github.com/posativ/isso/commits/master)
* **Lightweight & Fast** - The embed script is under 70kb and is only loaded on pages with comments. The count script is only 35kb and is only loaded where comment counts are used. This still isn't amazing, but this keeps a total page load, with all the 'bells and whistles' (Google Analytics [soon to go as well, see Vincent Bernat's post above], Google Fonts [now loaded locally instead of from Google], etc), under 1 second from my fairly crappy work network.
* **Respect Privacy** - Preferably while still allowing anonymous commenting.
* **Ability to moderate comments** - Some folks knocked Isso for its lack of an admin panel/moderation queue early in its life, but it has one now, and it works well.
* **Migration** - Very easy to [import comments](https://posativ.org/isso/docs/quickstart/#migration) (even just one!) from a [Disqus export](https://help.disqus.com/en/articles/1717164-comments-export).

I wanted to have a few sources for installation and configuration information, just in case. Here are the resources that I found helpful:

* **The Random Bits** - [How to add Isso comments to your site](https://therandombits.com/2018/12/how-to-add-isso-comments-to-your-site/)
* **Tyler Hallada** - [Isso Comments](https://www.hallada.net/2017/11/15/isso-comments.html)
* **Prateek Randey** - [Installing Isso](https://overiq.com/installing-isso/)

## Things I Learned Installing Isso

* **Do not** use the Debian package. Install using a Python 3 virtual environment, I personally used The Random Bits link above for most of my setup, with some configuration tweaks pulled from the others and the official documentation due to my use of Debian + Nginx instead of using Apache.
* Crafting a sane Content Security Policy won't be very easy, mainly due to the unsafe-inline and unsafe-eval in use for the admin panel.

## Isso Config File

``` properties
[general]
dbpath = /home/isso/comments.db
host = https://willpresley.com/
log-file = /home/isso/isso.log

[admin]
enabled = true
password = {password-here}

[server]
listen = http://localhost:8080
public-endpoint = https://comments.willpresley.com

[moderation]
enabled = true

[hash]
salt = 3EFech7co8Ohlsad4324aso6Adsbaimi
algorithm = pbkdf2
```

## Nginx Host Setup

Uses some includes from the HTML5 Boilerplate [Nginx Server Configs git repo](https://github.com/h5bp/server-configs-nginx).

``` nginx
server {
    listen 443 ssl http2;

    server_name comments.willpresley.com;

    include h5bp/ssl/policy_intermediate.conf;
    include h5bp/basic.conf;
    include h5bp/security/content-security-policy-witheval.conf;
    include h5bp/security/strict-transport-security.conf;

    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    ssl_certificate /etc/letsencrypt/live/comments.willpresley.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/comments.willpresley.com/privkey.pem;

    location / {
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass http://127.0.0.1:8080;
    }
}

server {
    listen 80;
    server_name comments.willpresley.com;
    return 301 https://$host$request_uri;
}
```

## More Reading

* [Isso Documentation](https://posativ.org/isso/docs/)
