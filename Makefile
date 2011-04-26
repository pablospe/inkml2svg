
# replace "example.inkml"

all:
	xsltproc --stringparam filename example.inkml inkml2svg.xslt null.xml >example.inkml.svg