---
layout: page
title: Blog
permalink: /blog/
page-id: blog
add-counter: true
---

## Last 10 Posts <a class="archive-more-link" href="{{site.url}}/blog/archive/">[more]</a>
<ul class="posts postlist-long">
    {% for post in site.posts limit:10 %}
        <li class="title-item"><span class="post-title"><a href="{{ post.url }}" class="post-link">{{ post.title }}</a></span><br />
        <span class="post-meta"><span class="date">{% assign d = post.date | date: "%-d" %}{{ post.date | date: "%B " }}{% case d %}{% when '1' or '21' or '31' %}{{ d }}st{% when '2' or '22' %}{{ d }}nd{% when '3' or '23' %}{{ d }}rd{% else %}{{ d }}th{% endcase %}, {{ post.date | date: "%Y" }}</span>{% if post.comments %} &ndash; <a href="{{ post.url }}#isso-thread" class="comments-link"></a>{% endif %}</span></li>
        <li class="the-excerpt">{{ post.content | strip_html | truncatewords: 80 }}</li>
    {% endfor %}
</ul>
