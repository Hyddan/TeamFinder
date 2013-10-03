<?php
	global $tfHost, $tfUser, $tfPass, $tfDatabaseName;
	
	if (strstr($_SERVER["HTTP_HOST"], "localhost" ))
	{
		//local config
		$tfHost				=		"localhost";
		$tfUser				=		"teamfinder";
		$tfPass				=		"teamfinder";
		$tfDatabaseName		=		"teamfinder";
	}
	else
	{
		//production config
		$tfHost				=		"83.168.227.176";
		$tfUser				=		"u1179530_tf";
		$tfPass				=		"teamfinder";
		$tfDatabaseName		=		"db1179530_TeamFinder";
	}
?>