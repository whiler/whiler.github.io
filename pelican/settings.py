#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#

import os
import sys

sys.path.append(os.curdir)

from plugin import *
from theme import *

SITENAME = '轨迹/trace'
SITEURL = 'https://whiler.github.io'

DEFAULT_LANG = 'zh'
TIMEZONE = 'Asia/Shanghai'

FILENAME_METADATA = '(?P<slug>.*)'
SUMMARY_MAX_LENGTH = 70
ARTICLE_EXCLUDES = ['assets', 'html', 'pages', 'webroot']
STATIC_PATHS = ['assets', 'html', 'webroot/.nojekyll', 'webroot/favicon.ico', 'webroot/favicon.svg', 'webroot/robots.txt']
EXTRA_PATH_METADATA = {
    'webroot/.nojekyll': {'path': '.nojekyll'},
    'webroot/favicon.ico': {'path': 'favicon.ico'},
    'webroot/favicon.svg': {'path': 'favicon.svg'},
    'webroot/robots.txt': {'path': 'robots.txt'}
}

DEFAULT_PAGINATION = 7

RELATIVE_URLS = True

MARKDOWN = {
    'extension_configs': {
        'markdown.extensions.extra': {},
        'markdown.extensions.meta': {},

        'pymdownx.arithmatex': {},
        'pymdownx.magiclink': {},
        'pymdownx.smartsymbols': {},
        'pymdownx.tasklist': {},
        'pymdownx.tilde': {},
    },
    'output_format': 'html5'
}
