PELICAN?=.venv/bin/pelican
GHP?=.venv/bin/ghp-import
PELICANOPTS=

BASEDIR=$(CURDIR)
CONTENT=content
INPUTDIR=$(BASEDIR)/$(CONTENT)
OUTPUTDIR=$(BASEDIR)/output
CONFFILE=$(BASEDIR)/pelicanconf.py
PUBLISHCONF=$(BASEDIR)/publishconf.py

SYNTAX=syntax.md

GITHUB_PAGES_BRANCH=master

DEBUG ?= 0
ifeq ($(DEBUG), 1)
	PELICANOPTS += -D
endif

RELATIVE ?= 0
ifeq ($(RELATIVE), 1)
	PELICANOPTS += --relative-urls
endif

help:
	@echo 'Makefile for a pelican Web site                                               '
	@echo '                                                                              '
	@echo 'Usage:                                                                        '
	@echo '   make html                           (re)generate the web site              '
	@echo '   make clean                          remove the generated files             '
	@echo '   make publish                        generate using production settings     '
	@echo '   make github                         upload the web site via gh-pages       '
	@echo '   make bootstrap                      bootstrap the running time environment '
	@echo '                                                                              '
	@echo 'Set the DEBUG variable to 1 to enable debugging, e.g. make DEBUG=1 html       '
	@echo 'Set the RELATIVE variable to 1 to enable relative urls                        '
	@echo '                                                                              '

html:
	$(PELICAN) $(INPUTDIR) -o $(OUTPUTDIR) -s $(CONFFILE) $(PELICANOPTS)

clean:
	[ ! -d $(OUTPUTDIR) ] || rm -rf $(OUTPUTDIR)

publish:
ifeq ($(CONTENT)/$(SYNTAX), $(wildcard $(CONTENT)/$(SYNTAX)))
	mv $(CONTENT)/$(SYNTAX) /tmp
	$(PELICAN) $(INPUTDIR) -o $(OUTPUTDIR) -s $(PUBLISHCONF) $(PELICANOPTS)
	mv /tmp/$(SYNTAX) $(CONTENT)
else
	$(PELICAN) $(INPUTDIR) -o $(OUTPUTDIR) -s $(PUBLISHCONF) $(PELICANOPTS)
endif

github: publish
	$(GHP) -m "Generate Pelican site" -b $(GITHUB_PAGES_BRANCH) $(OUTPUTDIR)
	git push origin $(GITHUB_PAGES_BRANCH)

bootstrap: venv
	echo 'please graphviz for graphing'
	git submodule update --init --recursive

venv: .venv/bin/pelican
.venv/bin/pelican: .venv/bin/activate requirements.txt
	.venv/bin/pip3 install -U -r requirements.txt

.venv/bin/activate:
	virtualenv .venv

.PHONY: help html clean publish github bootstrap
