#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#

PLUGIN_PATHS = ['plugins']
PLUGINS = ['sitemap', 'webassets', 'minifyhtml']

SITEMAP = {
    'format': 'xml',
    'priorities': {
        'articles': 0.5,
        'indexes': 0.5,
        'pages': 0.5
    },
    'changefreqs': {
        'articles': 'monthly',
        'indexes': 'weekly',
        'pages': 'monthly'
    }
}
