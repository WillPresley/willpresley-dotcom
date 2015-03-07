---
layout: page
title: Blog
permalink: /blog/
page-id: blog
---

## Last 20 Posts
<ul class="posts">
    {% for post in site.posts limit:20 %}
        <li class="title-item"><span class="post-title"><a href="{{ post.url }}" class="post-link">{{ post.title }}</a></span><br />
        <span class="post-meta"><span class="date">{{ post.date | date_to_string }}</span>{% if post.comments %}, <a href="{{ post.url }}#disqus_thread" class="comments-link" data-disqus-identifier="{{post.url}}"></a>{% endif %}</span></li>
        <li class="the-excerpt">{{ post.content | strip_html | truncatewords: 50 }}</li>
    {% endfor %}
</ul>
