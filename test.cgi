#!/bin/bash

COMMAND="echo $QUERY_STRING | cut -d\"&\" -f2 | cut -d\"=\" -f2"

echo $COMMAND > /tmp/querystr.txt

CERTNAME=`echo $QUERY_STRING | cut -d"&" -f2 | cut -d"=" -f2`

echo $CERTNAME > /tmp/querystr_.txt