---
layout: page
title: Blog Archive
permalink: /blog/archive/
page-id: blog-archive
---

## All Blog Posts <a class="archive-more-link" href="{{site.url}}/blog/">[less]</a>
<ul class="posts postlist-long">
    {% for post in site.posts %}
        {% capture post_year %}{{ post.date | date: '%Y' }}{% endcapture %}
        {% if forloop.first %}
            <h3>{{ post_year }}</h3><div class="list-group">
        {% endif %}

        {% if forloop.first == false %}
            {% assign previous_index = forloop.index0 | minus: 1 %}
            {% capture previous_post_year %}{{ site.posts[previous_index].date | date: '%Y' }}{% endcapture %}
            {% if post_year != previous_post_year %}
                </div><h3>{{ post_year }}</h3><div class="list-group">
            {% endif %}
        {% endif %}

        <h5 class="list-group-link-item"><span class="meta">{% assign d = post.date | date: "%-d" %}{{ post.date | date: "%B " }}{% case d %}{% when '1' or '21' or '31' %}{{ d }}st{% when '2' or '22' %}{{ d }}nd{% when '3' or '23' %}{{ d }}rd{% else %}{{ d }}th{% endcase %}, {{ post.date | date: "%Y" }}</span> &raquo; <a href="{{ post.url }}" class="list-group-item">{{ post.title }}</a></h5>

        {% if forloop.last %}
            </div>
        {% endif %}
    {% endfor %}
</ul>
