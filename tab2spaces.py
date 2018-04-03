#!/usr/bin/env python
# -*- coding: utf-8 -*-
#

import codecs
import logging
import sys

logging.basicConfig(level=logging.NOTSET,
                    format='[%(levelname)s]\t%(asctime)s\t%(message)s',
                    datefmt='%Y-%m-%d %H:%M:%S %Z')
logger = logging.getLogger(__name__)


def tab2spaces(path, indent=4):
    raw = codecs.open(path).read()
    codecs.open(path, 'w').write(raw.replace('\t', ' ' * indent))
    return True


if '__main__' == __name__:
    for path in sys.argv[1:]:
        tab2spaces(path)
