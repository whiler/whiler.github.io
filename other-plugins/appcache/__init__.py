#!/usr/bin/env python
# -*- coding: utf-8 -*-
#

import logging
import os.path
import codecs
import hashlib
import urllib.parse
from datetime import datetime

from pelican import signals
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)


def resolv(current, relative):
    return os.path.abspath(os.path.join(os.path.dirname(current), relative))


def getStatics(soup, current):
    statics = list()
    statics.extend(e['href']
                   for e in soup.select('link[rel=stylesheet]')
                   if e.get('href') is not None)
    statics.extend(e['href']
                   for e in soup.select('link[rel=icon]')
                   if e.get('href') is not None)
    statics.extend(e['src'] for e in soup.select('script[src]'))
    statics.extend(e['src'] for e in soup.select('img[src]'))

    return sorted(list(set(
        resolv(current, path) if path.startswith('.') else path
        for path in statics
    )))


def getRev(webroot, current, statics):
    hsh = hashlib.md5()
    hsh.update(open(webroot + current, 'rb').read())
    for path in statics:
        if not path.startswith('/'):
            continue
        hsh.update(open(webroot + path, 'rb').read())
    return hsh.hexdigest()


def generateManifest(sitepath, current, rev, statics):
    buf = list()
    buf.append('CACHE MANIFEST')
    buf.append('# manifest for %s' % current)
    buf.append('# rev: %s' % rev)
    buf.append('# date: %s' % datetime.now().isoformat())
    buf.append('')

    buf.append('CACHE:')
    for path in statics:
        buf.append(sitepath + path)
    buf.append('')

    buf.append('NETWORK:')
    buf.append('*')
    buf.append('')

    buf.append('FALLBACK:')
    buf.append('')

    return str('\n').join(buf)


def manifest(webroot, sitepath, current):
    logger.debug('manifest %s', current)
    filepath = webroot + current
    soup = BeautifulSoup(codecs.open(filepath).read(), 'html.parser')
    statics = getStatics(soup, current)
    rev = getRev(webroot, current, statics)
    filepath = filepath + '.appcache'
    logger.debug('generating %s', filepath.replace(webroot, ''))
    with codecs.open(filepath, 'w') as fp:
        fp.write(generateManifest(sitepath, current, rev, statics))


def plugin(pelican):
    webroot = pelican.settings['OUTPUT_PATH']
    sitepath = urllib.parse.urlparse(pelican.settings['SITEURL']).path.rstrip('/')
    for root, dirs, filenames in os.walk(webroot):
        for filename in filenames:
            if not filename.endswith('.html'):
                continue
            manifest(webroot, sitepath,
                     os.path.join(root, filename).replace(webroot, ''))


def register():
    signals.finalized.connect(plugin)
