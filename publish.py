#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
"""
1. edit or create article
2. publish article and auto update
    1. articles/articles.json (title, createtime, path, summary)
    2. feed.xml (title, path, summary)
    3. sitemap.xml (path)
    4. main.appcache (path, static)
"""

# requirements
# pip install -U GitPython lxml markdown2 readability-lxml

import json
import logging
import os
import os.path
import re
import time
import uuid

import git
import lxml.etree
import lxml.html
import markdown2
import readability.readability


logging.basicConfig(level=logging.NOTSET,
                    format='[%(levelname)s]\t%(asctime)s\t%(message)s',
                    datefmt='%Y-%m-%d %H:%M:%S %Z')

DOMAIN = 'blog.whiler.me'
TITLE = 'trace'
SLOGAN = (
    'I leave no trace of wings in the air, '
    'but I am glad I have had my flight.'
)

HXPATH = '|'.join('.//h%d' % i for i in range(6))
ARTICLE = re.compile(r'articles/.+\.md$')


def summary(html):
    doc = readability.readability.Document(html)
    dirty = doc.summary(True)
    root = lxml.html.fromstring(dirty)
    for node in root.xpath(HXPATH):
        node.drop_tree()
    text = root.text_content()
    if text:
        return unicode(''.join(line.strip() for line in text.split('\n')))


def title(html):
    root = lxml.html.fromstring(html)
    for node in root.xpath(HXPATH):
        return unicode(node.text_content())


class Cached(object):
    EMPTY = {
        'path': None,
        'time': None,
        'title': None,
        'summary': None
    }

    def __init__(self, path):
        self.path = path
        with open(path) as fp:
            seqs = list()
            articles = dict()
            for article in json.load(fp):
                path = article['path']
                seqs.append(path)
                articles[path] = article
        self.seqs = seqs
        self.articles = articles
        self.updated = set()
        self.added = set()

    def verify(self, path):
        return path in self.articles and path in self.seqs

    def link(self, path):
        if path:
            return 'http://%s/#!%s' % (DOMAIN, path)
        else:
            return 'http://%s' % DOMAIN

    def delete(self, path):
        if self.verify(path):
            logging.info('deleting %s', path)
            del self.articles[path]
            self.seqs.remove(path)

    def update(self, path):
        if self.verify(path):
            tpl = """updating %s ...

    1. %s
    2. %s

chose 1 or 2 or input new, default 1
"""
            logging.info('updating %s', path)
            article = self.articles[path]

            with open(path[1: None]) as fp:
                content = fp.read()
            html = markdown2.markdown(content)

            origin = article['title']
            current = title(html)
            if origin != current:
                msg = tpl % ('title', origin, current)
                answer = raw_input(msg.encode('utf-8')).strip().decode('utf-8')
                if not answer or answer == '1':
                    logging.debug('title %s', origin)
                elif answer == '2':
                    logging.debug('title %s', current)
                    article['title'] = current
                else:
                    logging.debug('title %s', answer)
                    article['title'] = answer

            origin = article['summary']
            current = summary(html)
            if origin != current:
                msg = tpl % ('summary', origin, current)
                answer = raw_input(msg.encode('utf-8')).strip().decode('utf-8')
                if not answer or answer == '1':
                    logging.debug('summary %s', origin)
                elif answer == '2':
                    logging.debug('summary %s', current)
                    article['summary'] = current
                else:
                    logging.debug('summary %s', answer)
                    article['summary'] = answer

            self.updated.add(path)

    def add(self, path):
        if path in self.articles or path in self.seqs:
            logging.warning('%s is dirty, ignore it.', path)
            return

        logging.info('adding %s', path)
        tpl = """using %s
    %s
or input new
"""
        article = self.EMPTY.copy()
        article['path'] = path

        with open(path[1: None]) as fp:
            content = fp.read()
        html = markdown2.markdown(content)

        current = title(html)
        msg = tpl % ('title', current)
        answer = raw_input(msg.encode('utf-8')).strip().decode('utf-8')
        use = answer or current
        logging.debug('title %s', use)
        article['title'] = use

        current = summary(html)
        msg = tpl % ('summary', current)
        answer = raw_input(msg.encode('utf-8')).strip().decode('utf-8')
        use = answer or current
        logging.debug('summary %s', use)
        article['summary'] = use

        self.seqs.insert(0, path)
        self.articles[path] = article
        self.added.add(path)

    def dump(self, path=None):
        articles = list()
        for key in self.seqs:
            article = self.articles[key]
            if key in self.added:
                article['time'] = int(time.time())
            articles.append(article)

        content = json.dumps(articles,
                             ensure_ascii=False,
                             indent=4,
                             separators=(',', ': '),
                             sort_keys=True)
        with open(path or self.path, 'w') as fp:
            fp.write(content.encode('utf-8'))

    def feed(self, path):
        root = lxml.etree.Element('rss', version='2.0')

        channel = lxml.etree.SubElement(root, 'channel')

        title = lxml.etree.SubElement(channel, 'title')
        title.text = TITLE

        link = lxml.etree.SubElement(channel, 'link')
        link.text = self.link(None)

        description = lxml.etree.SubElement(channel, 'description')
        description.text = SLOGAN

        for key in self.seqs:
            article = self.articles[key]
            item = lxml.etree.SubElement(channel, 'item')

            title = lxml.etree.SubElement(item, 'title')
            title.text = article['title']

            link = lxml.etree.SubElement(item, 'link')
            link.text = self.link(article['path'])

            description = lxml.etree.SubElement(item, 'description')
            description.text = article['summary']

        content = lxml.etree.tostring(root,
                                      xml_declaration=True,
                                      encoding="UTF-8",
                                      pretty_print=True)
        with open(path, 'w') as fp:
            fp.write(content)

    def sitemap(self, path):
        root = lxml.etree.Element(
            'urlset',
            xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'
        )

        url = lxml.etree.SubElement(root, 'url')
        loc = lxml.etree.SubElement(url, 'loc')
        loc.text = self.link('')

        for key in self.seqs:
            url = lxml.etree.SubElement(root, 'url')
            loc = lxml.etree.SubElement(url, 'loc')
            loc.text = self.link(key)

        content = lxml.etree.tostring(root,
                                      xml_declaration=True,
                                      encoding="UTF-8",
                                      pretty_print=True)
        with open(path, 'w') as fp:
            fp.write(content)


def webcache(path, root, *args):
    mem = list()
    version = uuid.uuid1()
    offset = len(root)
    cache = list()

    def verify(path):
        return any(path.startswith(x) for x in args)

    for dirpath, dirnames, filenames in os.walk(root):
        for filename in filenames:
            filepath = os.path.join(dirpath, filename)[offset: None]
            if verify(filepath):
                cache.append(filepath)

    mem.append('CACHE MANIFEST')
    mem.append('# version: %s' % version)
    mem.append('')
    mem.append('CACHE:')
    mem.extend(cache)
    mem.append('')
    mem.append('NETWORK:')
    mem.append('*')

    content = os.linesep.join(mem)
    with open(path, 'w') as fp:
        fp.write(content)


def main(root, index, feed, sitemap, appcache):
    cached = Cached(index)

    repo = git.Repo(root)
    for diff in repo.index.diff(None):
        filepath = diff.a_path
        if not ARTICLE.match(filepath):
            continue

        if diff.deleted_file:
            cached.delete('/' + filepath)
        elif diff.renamed or diff.new_file:
            logging.warning('unsupported operation on %s', filepath)
        else:
            cached.update('/' + filepath)

    for filepath in repo.untracked_files:
        if not ARTICLE.match(filepath):
            continue
        cached.add('/' + filepath)

    cached.dump()
    cached.feed(feed)
    cached.sitemap(sitemap)

    webcache(appcache, root, '/index.html', '/articles', '/static')


if __name__ == '__main__':
    main('.',
         'articles/articles.json',
         'feed.xml',
         'sitemap.xml',
         'main.appcache')
