#!/bin/bash

pip install --requirement requirements.txt
git submodule update --init --recursive
pushd markdown-extensions/markdown-simplechem
	python setup.py install
popd
