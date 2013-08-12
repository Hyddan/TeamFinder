<?php
	//--------------------------------------------------------------------------
	// Variables
	//--------------------------------------------------------------------------
	$headline 		= $_POST["headline"];
	$ad_text 		= $_POST["textarea"];
	$location 		= $_POST["selectLocation"];
	$looking_for 	= $_POST["looking_group"];
	$sport 			= $_POST["selectSport"];
	$gender 		= $_POST["gender"];
	$age 			= $_POST["age"];
	$password 		= $_POST["password"];
	$name 			= $_POST["name"];
	$email 			= $_POST["email"];
	
	$host = "localhost";
	$user = "root";
	$pass = "vasaloppet";

	$databaseName = "team";
	$tablename = 'ads';
	$field = "created";

	//--------------------------------------------------------------------------
	// 1) Connect to mysql database
	//--------------------------------------------------------------------------

	$con = mysql_connect($host,$user,$pass);
	$dbs = mysql_select_db($databaseName, $con) 
	or die("Could not select " + $database);
	
	//--------------------------------------------------------------------------
	// 2) Query database for data
	//--------------------------------------------------------------------------
	
	$query = "INSERT INTO ads (headline, ad_text, location, looking_for, 
				sport, gender, age, password, name, email) VALUES('$headline','$ad_text','$location', '$looking_for', 
				'$sport', '$gender', '$age', '$password', '$name', '$email')";
	mysql_query($query);
	echo "Data inserted!<br>";
	
	//--------------------------------------------------------------------------
	// 3) Close connetion to database
	//--------------------------------------------------------------------------
	mysql_close($con);
	echo "{}";
?>