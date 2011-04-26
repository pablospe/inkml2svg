#!/bin/bash

if [ -z $2 ]; then
    OUTPUT=`basename $1 | sed -e 's/\(.*\)\..*/\1/'`.svg
else
    OUTPUT=$2
fi

printf "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:ink='http://www.w3.org/2003/InkML' onload='Init(evt)'>\n\n\t<!-- Include the javascript -->\n\t<script type='text/ecmascript' xlink:href='inkml2svg.js'/>\n\n\t<!-- Include the file -->\n" >$OUTPUT

cat $1 >>$OUTPUT

printf "\n</svg>" >>$OUTPUT

