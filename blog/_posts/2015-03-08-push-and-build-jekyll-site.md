---
layout: "post"
title: "How to Sync Changes & Remotely Build/Deploy a Jekyll Site"
location: "Athens, Ohio"
comments: true
tags: [cygwin, jekyll]
---

This entire workflow is probably too specific to be a huge help to anyone out there. But on the off chance that someone out there has a similar setup to mine, I thought I would share.

MORE TO COME

## My Jekyll Build-Site Bash Script

{% highlight bash linenos=table %}
#!/bin/sh
cd '/cygdrive/c/<Path-to-Git-Repos>/GitHub/willpresley-dotcom/'
rsync -crvz -e "ssh -p 9999" --exclude .git/ --exclude _psd/ --exclude _site/ --exclude "*.sublime-*" --delete . user@site.tld:jekyll/
ssh -p 9999 user@site.tld 'cd jekyll/; jekyll build'
{% endhighlight %}

### What This Script Does
1. Switch to your git directory with all site assets.
2. Run RSYNC (over a changed port) while excluding some things I don't want built.
3. SSH into my VPS, switch to remote Jekyll assets directory, and run the build command.

*Note: Be sure to change the cygdrive directory, ssh ports, usernames, etc to match your environment.*
