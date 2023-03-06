BASE := $(CURDIR)
INPUT := $(BASE)/content
OUTPUT := $(BASE)/output
SETTINGS := $(BASE)/pelican/settings.py
PELICAN := $(BASE)/.venv/bin/pelican
SRCBRANCH := content
DSTBRANCH := view

build: $(INPUT) $(SETTINGS)
	mkdir -p $(OUTPUT)
	find $(OUTPUT) -type f -delete
	find $(OUTPUT) -mindepth 1 -type d -delete
	$(PELICAN) -s $(SETTINGS) -o $(OUTPUT) $(INPUT)

fetch:
	git checkout -b $(shell date "+building-%Y%m%dT%H%M%S")
	git pull origin --depth=1 --allow-unrelated-histories --no-edit $(SRCBRANCH)

publish: build
	.venv/bin/ghp-import --message=$(shell date "+Generated at %Y-%m-%d %H:%M:%S %Z") --push --branch=$(DSTBRANCH) $(OUTPUT)

bootstrap: .venv/bin/pip3
	.venv/bin/pip3 install -U -r requirements.txt

.venv/bin/pip3:
	python3 -m venv .venv
	.venv/bin/pip3 install -U pip wheel
