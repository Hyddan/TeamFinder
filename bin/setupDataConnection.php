<?php
	//Includes
	require_once "../bin/bootstrap.php";

	global $tfHost, $tfUser, $tfPass, $tfDatabaseName;
	$connection = mysqli_connect($tfHost, $tfUser, $tfPass, $tfDatabaseName)
		or die("Could not connect to database: " . $tfDatabaseName . "@" . $tfHost);
?>