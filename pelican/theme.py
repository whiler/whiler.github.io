#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#

THEME = 'themes/default'

DISQUS_SITENAME = 'traced'
SINCE = 2016

ARCHIVES_SAVE_AS = 'archives.html'
AUTHOR_SAVE_AS = False
AUTHOR_URL = False
CATEGORY_SAVE_AS = False
TAG_SAVE_AS = False

DIRECT_TEMPLATES = ['index', 'archives']

FEED_ALL_ATOM = 'feed.xml'
AUTHOR_FEED_ATOM = False
AUTHOR_FEED_RSS = False
CATEGORY_FEED_ATOM = False
TRANSLATION_FEED_ATOM = False

PAGINATION_PATTERNS = (
    (1, '{base_name}/', '{base_name}/index.html'),
    (2, '{base_name}/page/{number}/', '{base_name}/page/{number}/index.html')
)
