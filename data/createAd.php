<?php
	//Includes
	require '../bin/setupDataConnection.php';
	require '../bin/mappings.php';
	require '../bin/repositories.php';
	
	//Set parameters
	$headline 		= $_POST["headline"];
	$description	= $_POST["description"];
	$locationId		= $locations$_POST["location"]];
	$lookingForId 	= $lookingFor[$_POST["lookingFor"]];
	$sportId		= $sports[$_POST["sport"]];
	$userId 		= $_POST["userId"];
	
	if (false) //ToDo: validate input data
	{
		$ad = AdRepository::Save(new Ad(-1,
									null,
									$description,
									$headline,
									LocationRepository::GetById($locationId),
									LookingForRepository::GetById($lookingForId),
									SportRepository::GetById($sportId),
									UserRepository::GetById($userId)));
	}
	
	//Close DB Connection
	mysqli_close($connection);
	
	echo null != $ad ? json_encode($ad) : "{}";
?>