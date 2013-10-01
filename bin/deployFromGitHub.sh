#!/bin/bash
wget -q https://github.com/Hyddan/TeamFinder/archive/master.zip -O /tmp/teamFinder.zip

if [ -f /tmp/teamFinder.zip ]; then
    unzip -q /tmp/teamFinder.zip

    rm -rf /tmp/Project-master/SQL Scripts
    rm -rf /tmp/Project-master/UnmodifiedLibSources
	
    rm -rf /var/www/teamfinder.se
    mv /tmp/Project-master /var/www/teamfinder.se

    rm /tmp/teamFinder.zip
fi