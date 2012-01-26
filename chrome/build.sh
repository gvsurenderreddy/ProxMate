#!/bin/bash

# Script zum bauen und minifien der applikation
fxfile="lib/fx.js"

gsfile="grooveshark.js"
ytfile="youtube.js"
ytcfile="youtube-channel.js"
ytsfile="youtube-search.js"
bgfile="background.js"

jqfile="lib/jquery-1.7.1.min.js"


function build {
	less $fxfile >> build/tmp/$1
	echo " " >> build/tmp/$1
	less sites/$1 >> build/tmp/$1
	uglifyjs build/tmp/$1 > build/s/$1
} 

echo "Starting build Process..."
[ -d build ] || mkdir build
rm -r build/*

[ -d build/s ] || mkdir build/s
[ -d build/tmp ] || mkdir build/tmp
[ -d build/l ] || mkdir build/l
[ -d build/images ] || mkdir build/images


echo "Building/Merging Grooveshark"
build $gsfile

echo "Building/Merging Youtube"
build $ytfile

echo "Building/Merging Youtube Channel"
build $ytcfile

echo "Building/Merging Youtube Search"
build $ytsfile

echo "Building Background Page"
uglifyjs $bgfile > build/$bgfile
cp background.html build/

echo "Adding jQuery"
cp $jqfile build/l/

echo "Adding images"
cp images/* build/images/

echo "Adding live manifest"
cp manifest.live.json build/manifest.json

echo "Cleaning temp Folder"
rm -r build/tmp/

echo "Finito! Check out your extension in build/"