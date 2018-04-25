#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

SITEURL = 'http://local.whiler.me:10086/blog'
SITENAME = '轨迹/trace'
SITESUBTITLE = 'I leave no trace of wings in the air, but I am glad I have had my flight.'

PATH = 'content'
THEME = 'theme'

TIMEZONE = 'Asia/Shanghai'

# git submodule update --init --recursive
PLUGIN_PATHS = ['pelican-plugins', 'other-plugins']
PLUGINS=['sitemap', 'assets', 'minifyhtml', 'appcache']

DEFAULT_LANG = 'cmn'
AUTHOR_SAVE_AS = False
CATEGORY_SAVE_AS = False
TAG_SAVE_AS = False
ARCHIVES_SAVE_AS = 'archives.html'
DIRECT_TEMPLATES = ('index', 'archives')
ARTICLE_EXCLUDES = ['webroot', 'assets', 'html']

FILENAME_METADATA = '(?P<slug>.*)'
ARTICLE_URL = '{slug}.html'

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = 'feed.xml'
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None
TYPOGRIFY = None

STATIC_PATHS = ['assets', 'html', 'webroot/.nojekyll', 'webroot/LICENSE', 'webroot/README.md', 'webroot/favicon.svg', 'webroot/robots.txt']
EXTRA_PATH_METADATA = {
    'webroot/.nojekyll': {'path': '.nojekyll'},
    'webroot/LICENSE': {'path': 'LICENSE'},
    'webroot/README.md': {'path': 'README.md'},
    'webroot/favicon.svg': {'path': 'favicon.svg'},
    'webroot/robots.txt': {'path': 'robots.txt'}
}

DISQUS_SITENAME = 'traced'
GOOGLE_ANALYTICS = 'UA-74531835-1'

DEFAULT_PAGINATION = 7
PAGINATION_PATTERNS = (
    (1, '{base_name}/', '{base_name}/index.html'),
    (2, '{base_name}/page/{number}/', '{base_name}/page/{number}/index.html'),
)

SITEMAP = {
    'format': 'xml',
    'priorities': {
        'articles': 0.5,
        'indexes': 0.5
    },
    'changefreqs': {
        'articles': 'monthly',
        'indexes': 'weekly'
    }
}

import subprocess
import logging
import base64

def graph(raw, engine='dot', clazz='dot'):
    proc = subprocess.Popen([engine, '-Tsvg'],
                            stdin=subprocess.PIPE,
                            stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE)
    stdout, stderr = proc.communicate(raw.encode())
    if stderr:
        logging.error(raw)
        logging.error(stderr.decode())
    if stdout:
        return '<img src="data:image/svg+xml;charset=utf-8;base64,%s" class="%s" alt="Graph"/>' % (base64.b64encode(stdout).decode().strip(), clazz)
    else:
        return ''


FENCES = [
    {'name': engine, 'class': engine, 'format': graph}
    for engine in {'circo', 'sfdp', 'neato', 'osage', 'fdp', 'twopi', 'patchwork', 'dot'}
]

MARKDOWN = {
    'extension_configs': {
        'markdown.extensions.extra': {},
        'markdown.extensions.meta': {},

        'pymdownx.arithmatex': {},
        'pymdownx.superfences': {
            'highlight_code': False,
            'custom_fences': [
                {'name':'flow', 'class':'uml-flowchart'},
                {'name':'sequence', 'class':'uml-sequence-diagram'}
            ] + FENCES
        },
        'pymdownx.tilde': {},

        'markdown_blockdiag': {'format': 'svg'},
    },
    'output_format': 'html5'
}

ASSET_CONFIG = [
    ('cache', '/tmp'),
]

APPCACHE = False
MINIFYHTML = False

RELATIVE_URLS = True
