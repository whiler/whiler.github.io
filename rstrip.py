#!/usr/bin/env python
# -*- coding: utf-8 -*-
#

import codecs
import logging
import sys
import os

logging.basicConfig(level=logging.NOTSET,
                    format='[%(levelname)s]\t%(asctime)s\t%(message)s',
                    datefmt='%Y-%m-%d %H:%M:%S %Z')
logger = logging.getLogger(__name__)


def rstrip(path):
    buf = [
        line.rstrip()
        for line in codecs.open(path)
    ]
    with codecs.open(path, 'w') as fp:
        fp.write(os.linesep.join(buf))
    return True


if '__main__' == __name__:
    for path in sys.argv[1:]:
        rstrip(path)
