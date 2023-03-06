BASE := $(CURDIR)
INPUT := $(BASE)/content
OUTPUT := $(BASE)/output
SETTINGS := $(BASE)/pelican/settings.py
PELICAN := $(BASE)/.venv/bin/pelican
SRCBRANCH := content
DSTBRANCH := view

build: $(INPUT) $(SETTINGS)
	find $(OUTPUT) -type f -delete
	find $(OUTPUT) -mindepth 1 -type d -delete
	$(PELICAN) -s $(SETTINGS) $(INPUT) $(OUTPUT)

fetch:
	git fetch origin $(SRCBRANCH)
	git merge $(SRCBRANCH)

publish: build
	.venv/bin/ghp-import --message=$(shell date "+Generated at %Y-%m-%d %H:%M:%S %Z") --push --branch=$(DSTBRANCH) $(OUTPUT)

bootstrap: .venv/bin/pip3
	.venv/bin/pip3 install -U -r requirements.txt

.venv/bin/pip3:
	python3 -m venv .venv
	.venv/bin/pip3 install -U pip wheel
