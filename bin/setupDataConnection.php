<?php
	$host = "localhost";
	$user = "teamfinder";
	$pass = "teamfinder";
	$databaseName = "teamfinder";

	$connection = mysqli_connect($host, $user, $pass, $databaseName)
		or die("Could not connect to database: " . $databaseName . "@" . $host);
?>