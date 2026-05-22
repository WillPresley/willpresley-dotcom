---
layout: "post"
title: "Taking Back the Scroll Wheel: A Selective Fix for Scroll Hijacking"
location: "Athens, Ohio"
date: 2026-05-22 16:00
comments: true
tags: ["javascript", "css", "tampermonkey", "web"]
---

We've all been there. You click a link to read an article, scroll down with your mouse wheel, and instead of the page moving normally, it glides, floats, or lurches along at a custom speed determined by the site's developer.

Scroll hijacking—often implemented via "smooth scrolling" libraries like GSAP, Locomotive Scroll, or Lenis—is a trend that refuses to die. While it can look neat on a highly produced portfolio site, reading a standard feature article or documentation page with hijacked scrolling is an exercise in frustration. It breaks muscle memory, ruins keyboard navigation, and often makes the page physically unscrollable if the custom JavaScript fails to load correctly.

I wanted a way to forcefully disable this behavior, but only on domains that annoyed me. A universal "kill all custom scrolling" script breaks too many legitimate web apps. I needed a selective Tampermonkey userscript that let me click a button in the toolbar, add the offending domain to a list, and restore native scrolling.

Getting it to actually work, however, was a surprisingly deep rabbit hole.

---

## The Anatomy of a Hijack

Modern custom scrolling sites don't just intercept your mouse wheel. They usually deploy a two-pronged attack:

1. **The Event Trap:** They use JavaScript to intercept `wheel`, `touchmove`, and `keydown` events, running `event.preventDefault()` to stop the browser from scrolling natively.
2. **The CSS Prison:** They disable the browser's native scrollbar entirely by applying `overflow: hidden` to the `<body>` or `<html>` tags, and wrap the entire page in a fixed `div` (e.g., `<div id="smooth-wrapper">`). They then use CSS transforms to physically move that wrapper up and down the screen.

If you just stop their JavaScript from running, the page freezes entirely because the CSS is still hiding the native scrollbar. You have to attack both simultaneously.

---

## The Challenges

My initial attempts at a userscript failed for a few interesting reasons:

* **The Sandbox Problem:** Tampermonkey scripts run in an isolated environment. If you try to override native browser functions (like neutering `preventDefault()`) from within the userscript, it only affects your script. The website's library, running in the main page context, ignores your override and continues to hijack the wheel.
* **The Event Paradox:** If you use `event.stopImmediatePropagation()` to catch the scroll wheel event before the site's script sees it, you *also* blind the browser. The browser's native engine relies on that event traveling down the DOM tree to know which specific container you are trying to scroll.
* **The CSS Nuance:** Aggressively forcing `overflow: auto` on every single `div` on the page destroys complex layouts, ripping sticky headers and mobile menus out of place.

---

## The Solution: Bypassing the Sandbox

To build a bulletproof fix, the script has to break out of the Tampermonkey sandbox. It does this by constructing the logic as a string and injecting it directly into the page's `<head>` as a native `<script>` tag at the absolute split-second the page starts loading.

This injected script does two things:
1. It intercepts all `addEventListener` calls for scrolling and forces them to be `passive: true`. This is a browser-level command that physically prevents the site from canceling native scrolling.
2. It declaws `preventDefault` specifically for keyboard navigation (Arrow keys, Spacebar, Page Up/Down), ensuring you can still read articles normally.

Simultaneously, the userscript injects a surgical CSS block targeting the specific wrapper IDs and data-attributes used by the most common smooth-scrolling libraries (GSAP, Locomotive, ASScroll, Luxy, Butter), forcing them back to standard static positioning.

---

## The Userscript

Here is the final, optimized script. It includes safeguards to prevent running inside iframes (saving CPU cycles on ad-heavy pages) and strips `www.` subdomains so your saved domains apply consistently.

```javascript
// ==UserScript==
// @name         Scroll Hijacking Fixer (Selective)
// @namespace    https://willpresley.com/
// @version      1.7
// @description  Selectively disable scroll hijacking on specific domains.
// @author       Billy Presley
// @license      Apache-2.0
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-start
// @updateURL    https://gist.github.com/WillPresley/ec209f684ac856cc63316f47880bd515/raw/userscript_scroll-hijack-fixer.user.js
// @downloadURL  https://gist.github.com/WillPresley/ec209f684ac856cc63316f47880bd515/raw/userscript_scroll-hijack-fixer.user.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. GUARD: Do not run inside iframes.
    if (window.top !== window.self) return;

    // 2. NORMALIZE: Strip 'www.' so subdomains share the same fix.
    const currentDomain = window.location.hostname.replace(/^www\./, '');
    let fixedDomains = GM_getValue('saved_scroll_fixes', []);

    const applyScrollFix = () => {

        // --- JS FIX: INJECT INTO MAIN PAGE CONTEXT ---
        const pageContextLogic = `(function() {
            const originalAdd = EventTarget.prototype.addEventListener;
            EventTarget.prototype.addEventListener = function(type, listener, options) {
                if (['wheel', 'mousewheel', 'DOMMouseScroll', 'touchstart', 'touchmove'].includes(type)) {
                    let newOptions = { passive: true };
                    if (typeof options === 'boolean') newOptions.capture = options;
                    else if (options && typeof options === 'object') newOptions = Object.assign({}, options, { passive: true });
                    return originalAdd.call(this, type, listener, newOptions);
                }
                return originalAdd.call(this, type, listener, options);
            };

            const originalPreventDefault = Event.prototype.preventDefault;
            Event.prototype.preventDefault = function() {
                if (this.type === 'keydown' && ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', ' ', 'Home', 'End'].includes(this.key)) return;
                if (['wheel', 'mousewheel', 'DOMMouseScroll', 'touchmove'].includes(this.type)) return;
                originalPreventDefault.call(this);
            };
        })();`;

        const scriptEl = document.createElement('script');
        scriptEl.textContent = pageContextLogic;
        if (document.documentElement) {
            document.documentElement.appendChild(scriptEl);
            scriptEl.remove();
        }

        // --- CSS FIX: SURGICAL WRAPPER REMOVAL ---
        const cssOverride = `
            html, body { overflow: auto !important; overflow-x: hidden !important; height: auto !important; overscroll-behavior: auto !important; }
            #page { overflow: visible !important; }
            #smooth-wrapper, #smooth-content, [data-scroll-container], [asscroll-container], [data-scrollbar], #luxy, #butter {
                overflow: visible !important; transform: none !important; position: static !important; height: auto !important; min-height: 0 !important; max-height: none !important; width: auto !important;
            }
        `;

        document.addEventListener("DOMContentLoaded", () => {
            if (typeof GM_addStyle !== 'undefined') GM_addStyle(cssOverride);
            else {
                const style = document.createElement('style');
                style.textContent = cssOverride;
                document.head.appendChild(style);
            }
        });
    };

    const isDomainFixed = fixedDomains.includes(currentDomain);
    if (isDomainFixed) applyScrollFix();

    GM_registerMenuCommand(isDomainFixed ? `❌ Remove fix for ${currentDomain}` : `✅ Fix site scrolling (${currentDomain})`, () => {
        if (isDomainFixed) fixedDomains = fixedDomains.filter(d => d !== currentDomain);
        else fixedDomains.push(currentDomain);
        GM_setValue('saved_scroll_fixes', fixedDomains);
        window.location.reload();
    });
})();

```
Once installed, it sits entirely dormant with zero performance overhead. When you hit a site that refuses to let you scroll normally, just open the Tampermonkey extension menu, click **Fix site scrolling**, and the page will reload with standard, native behavior restored.

[![An example of the userscript in action in Google Chrome]({{site.url}}/uploads/2026-05/scroll-hijack-fix_blog.png "An example of the userscript in action in Google Chrome")]({{site.url}}/uploads/2026-05/scroll-hijack-fix_blog.png){: target="_blank" .image-link}

### Getting Updates

This script is hosted on GitHub. If I release improvements or add support for new smooth-scrolling libraries, your browser will automatically detect the changes and update the script for you. You can also view the latest source code or contribute directly via the [GitHub Gist](https://gist.github.com/WillPresley/ec209f684ac856cc63316f47880bd515).

---

## A Note on Web Standards

While I prefer to let site developers have creative control over their UI, "hijacking" basic browser functionality like scrolling—which users have spent decades developing muscle memory for—is rarely a good idea. Accessibility is a first-class citizen on the web. When we break the native scroll, we often break keyboard navigation for screen readers and other assistive technologies.

Hopefully, this script helps you reclaim that control on the sites that prioritize aesthetic "smoothness" over functional utility. If you find a site that manages to circumvent these overrides, it's likely using an even more aggressive technique, and I'd be interested to see the source.

As always, keep your browser fast, your privacy tight, and your scroll wheel native.
