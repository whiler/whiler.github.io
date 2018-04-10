#!/usr/bin/env python
# -*- coding: utf-8 -*-
#

import logging
import os.path
import codecs

import htmlmin

from pelican import signals

logger = logging.getLogger(__name__)


def minifyhtml(webroot, current):
    logger.debug('minifyhtml %s', current)
    filepath = webroot + current
    raw = codecs.open(filepath).read()
    minified = htmlmin.minify(raw,
                              remove_comments=True, remove_empty_space=True,
                              remove_all_empty_space=True, reduce_empty_attributes=True,
                              reduce_boolean_attributes=True, remove_optional_attribute_quotes=True,
                              convert_charrefs=True, keep_pre=False)
    with codecs.open(filepath, 'w') as fp:
        fp.write(minified)


def plugin(pelican):
    if not pelican.settings.get('MINIFYHTML', False):
        return
    webroot = pelican.settings['OUTPUT_PATH']
    for root, dirs, filenames in os.walk(webroot):
        for filename in filenames:
            if not filename.endswith('.html'):
                continue
            minifyhtml(webroot,
                       os.path.join(root, filename).replace(webroot, ''))


def register():
    signals.finalized.connect(plugin)
