---
layout: "post"
title: "Building Jekyll Sites Locally, Using Rsync to Remotely Build & Deploy"
location: "Athens, Ohio"
comments: true
tags: [cygwin, jekyll]
---

This entire workflow is probably too specific to be a huge help to anyone out there. Because the whole thing took me a little while to put together for myself, I thought maybe someone out there had a similar setup to mine, so I wanted to share in case it could help.

## Jump Ahead

* [Prerequisites](#prerequisites)
* [About My Setup](#about)
* [How I Streamlined My Workflow](#streamline)
    - [My Jekyll Build-Site Bash Script](#the-script)
    - [What the Script Does](#explanation)
* [The Results](#results)

## Prerequisites

* Windows PC with Cygwin installed (and at least the ssh & rsync packages and their dependencies)
* A working SSH key-based login with the remote server (or enter your password each time)
* Server software, my preference right now is [nginx](http://nginx.org/en/){:target="_blank" rel="noreferrer"}, but Apache is always a solid choice as well.

## About My Setup {#about}

My current setup and situation (for this site actually) for using Jekyll is this:

* My site's source is kept in a [BitBucket repository](https://bitbucket.org/willpresley/willpresley-dotcom){:target="_blank" rel="noreferrer"} that I push to and pull from on my main development machine, a **Windows 7 PC** at home. I have Cygwin installed and have a very solid Windows development workstation.
* My server is hosted on a small VPS (shout-out to [MPServ/OrbitServers](https://clients.mpserv.net/cart.php?gid=25){:target="_blank" rel="noreferrer"} for the amazing deal) running Debian 7 (Wheezy) and Nginx.
* I came to find out that it is quite a bit easier to build with Jekyll using Linux/Unix or OS X than it is with Windows, and I am perfectly comfortable in the *nix environment.
* My Jekyll assets are stored on the server at *user home*/jekyll, and at build time the generated site is put straight into my Nginx public site root (using the \-\-destination flag).
* I got tired of using SFTP to move the files over that I had modified, then running the build command from a terminal, then checking for results.
* I had a **HUGE** amount of trouble getting Jekyll's built-in `--watch` flag to work. It would properly watch the files for about 10 minutes, then I would upload changes through SFTP without seeing a result.

## How I Streamlined My Workflow {#streamline}

My solution to speeding my build and deploy process, in a general sense, was to:

1. Start by using Cygwin (and its built-in cygdrive symbolic links, allowing full access to the file system from the command line) to switch into my local git repository on my Windows machine.
2. Then run the `rsync` command (along with flags for transfer efficiency and excludes for local/unnecessary files for the build) from within the git repository.
3. Lastly use some remote SSH commands to switch into my remote Jekyll directory and run the build command (including the `--destination` flag).

So finally, here is the script, my attempt at solving this issue for myself. Instead of having to use SFTP or the \-\-watch flag, I rolled my file updates, build commands, etc into one simple to use script.

### My Jekyll Build-Site Bash Script {#the-script}

``` bash
#!/bin/sh
cd '/cygdrive/c/<Path-to-Git-Repos>/'
rsync -crvz -e "ssh -p 9999" --delete --exclude .git/ --exclude _psd/ --exclude _site/ --exclude "*.sublime-*" . user@site.tld:jekyll/
ssh -p 9999 user@site.tld 'cd jekyll/; jekyll build --destination <nginx/Apache directory>/public_html'
```

### What The Script Does {#explanation}

1. Switch to your git directory with all site assets.
2. Run RSYNC
    * **With flags** (read more [here](http://linuxcommand.org/man_pages/rsync1.html){:target="_blank" rel="noreferrer"}):
        - c : \-\-checksum (Use checksum instead of modified time/date to decide on file's to skip for transfer), *This is important due to how Jekyll's build system regenerates all site pages/posts.*
        - r : \-\-recursive, *Standard, recurses into subdirectories.*
        - v : \-\-verbose, *I like knowing what is going on with the transfer. For large sites, you'd probably want to remove this flag.*
        - z : \-\-compress (Compress file data during transfer), *Great option to send compressed data, saving time/bandwidth.*
        - e : Specify remote shell. *Use this option to specify a port for the rsync to take place on (same as your SSH port, which you've hopefully changed from the default of 22).*
        - \-\-delete : Delete files from the remote server that don't exist on the local machine. *There are a lot of other options for this, see the man page link above.*
        - \-\-exclude : Exclude files or directories. *See the man page link for more options. If you have a lot, you can use a separate file, I only have these few.*
    * **With the "." dot**: The first command should have the script in the proper git repository that you want to sync, so nothing else needed here except a period/dot.
    * **user@site.tld**: Replace with your SSH username and IP/hostname/domain.
    * **:jekyll/**: This is the remote location of your <u>pre-build</u> Jekyll assets. In my case it is *\<user home>/jekyll*, so this part is simple. Be sure you include the colon at the beginning!
3. SSH into the remote server (using the correct port, user name, and IP/hostname/domain) and run the following commands:
    * **cd jekyll/**: Switch into the remote Jekyll assets directory (again, for me it is just ~/jekyll/)
    * **jekyll build \-\-destination <nginx/Apache directory>/public_html**: Run the Jekyll build command, with a flag pointing to your site's publicly available directory. Feel free to add your other build flags here as well.

*Note: Be sure to change the cygdrive directory (including the drive letter if necessary), ssh ports, user names/domains, etc to match your environment. I've kept things vague, but the script should be easy to understand and modify for your setup.*

## The Results {#results}

I have added the script to my Cygwin home directory, given it executable permissions, and created an alias for the command `bs` to run this: `bash ~/build-site.sh`. The results are fantastic, and exactly what I was looking for when I set out on this experiment. Only the absolute minimum number of files are sent to the remote server, and they are also compressed for even more speed.

{: .img_center}
![Results of the build.]({{site.url}}/uploads/2015-03/push-build-jekyll-site-results.png "Results of the build."){: .img_no-expand}

I would love to hear how I could improve this whole system, or how you've solved a similar problem for yourself, just head down to the comments!

## More Reading

* Nathan Grigg - [Rsyncing Jekyll](http://nathangrigg.net/2012/04/rsyncing-jekyll/){:target="_blank" rel="noreferrer"}
* ThorneLabs - [Commands Over SSH](http://thornelabs.net/2013/08/21/simple-ways-to-send-multiple-line-commands-over-ssh.html){:target="_blank" rel="noreferrer"}
