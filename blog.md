---
layout: page
title: Blog
permalink: /blog/
page-id: blog
---

## Last 15 Posts
<ul class="posts postlist-long">
    {% for post in site.posts limit:15 %}
        <li class="title-item"><span class="post-title"><a href="{{ post.url }}" class="post-link">{{ post.title }}</a></span><br />
        <span class="post-meta"><span class="date">{% assign d = post.date | date: "%-d" %}{{ post.date | date: "%B " }}{% case d %}{% when '1' or '21' or '31' %}{{ d }}st{% when '2' or '22' %}{{ d }}nd{% when '3' or '23' %}{{ d }}rd{% else %}{{ d }}th{% endcase %}, {{ post.date | date: "%Y" }}</span>{% if post.comments %} &ndash; <a href="{{ post.url }}#disqus_thread" class="comments-link" data-disqus-identifier="{{post.url}}"></a>{% endif %}</span></li>
        <li class="the-excerpt">{{ post.content | strip_html | truncatewords: 60 }}</li>
    {% endfor %}
</ul>
