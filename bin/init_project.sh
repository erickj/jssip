#!/bin/sh
LN=/bin/ln
MKDIR=/bin/mkdir
RM=/bin/rm
WGET=/usr/bin/wget
UNZIP=/usr/bin/unzip
BASENAME=/usr/bin/basename

dst=tools

jstd_jar="http://js-test-driver.googlecode.com/files/JsTestDriver-1.3.5.jar"
jstd_dst=$dst/`$BASENAME $jstd_jar`
jstd_ln=JsTestDriver.jar

jscompiler_zip="http://closure-compiler.googlecode.com/files/compiler-latest.zip"
jscompiler_tmp="/tmp/jscompiler.zip"
jscompiler_ln=compiler.jar

if [ -d $dst ]; then
    echo "Detected 'tools' directory. Are you sure you want to continue? [y/n]"
    read conf
    if [ ! $conf = "y" ]; then
        exit
    fi
fi

# Cleanup
$RM -f $jscompiler_ln $jstd_ln
$RM -rf $dst

# Setup tools directory
$MKDIR $dst

# Get JSTD
$WGET -O $jstd_dst $jstd_jar
$LN -s $jstd_dst $jstd_ln

# Get JSCompiler
$WGET -O $jscompiler_tmp $jscompiler_zip
$UNZIP $jscompiler_tmp -d $dst
$LN -s $dst/$jscompiler_ln
