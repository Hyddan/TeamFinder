<?php
	$host = "83.168.227.176";
	$user = "u1179530_tf";
	$pass = "teamfinder";
	$databaseName = "db1179530_TeamFinder";

	$connection = mysqli_connect($host, $user, $pass, $databaseName)
		or die("Could not connect to database: " . $databaseName . "@" . $host);
?>