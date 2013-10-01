<?php
	//Includes
	require_once '../bin/mappings.php';
	require_once '../bin/repositories.php';
	
	//Set parameters
	$headline		=	isset($_POST["headline"]) ? $_POST["headline"] : null;
	$description	=	isset($_POST["description"]) ? $_POST["description"] : null;
	$locationId		=	isset($locations[$_POST["location"]]) ? (int) $locations[$_POST["location"]] : null;
	$lookingForId	=	isset($lookingFor[$_POST["lookingFor"]]) ? (int) $lookingFor[$_POST["lookingFor"]] : null;
	$sportId		=	isset($sports[$_POST["sport"]]) ? (int) $sports[$_POST["sport"]] : null;
	$userId			=	isset($_POST["userId"]) ? (int) $_POST["userId"] : null;
	$ad				=	null;
	
	if (null != $locationId && null != $lookingForId && null != $sportId && null != $userId)
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
	
	header("Content-Type: application/json; charset=utf-8", true);
	echo null != $ad ? json_encode($ad) : "{}";
?>