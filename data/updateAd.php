<?php
	//Includes
	require_once "../bin/mappings.php";
	require_once "../bin/repositories.php";
	
	//Set parameters
	$id				=	isset($_POST["id"]) ? (int) $_POST["id"] : null;
	$headline		=	isset($_POST["headline"]) ? $_POST["headline"] : null;
	$description	=	isset($_POST["description"]) ? $_POST["description"] : null;
	$locationId		=	isset($locations[$_POST["location"]]) ? (int) $locations[$_POST["location"]] : null;
	$lookingForId	=	isset($lookingFor[$_POST["lookingFor"]]) ? (int) $lookingFor[$_POST["lookingFor"]] : null;
	$sportId		=	isset($sports[$_POST["sport"]]) ? (int) $sports[$_POST["sport"]] : null;
	$sessionId		=	isset($_POST["sessionId"]) ? $_POST["sessionId"] : null;
	$ad				=	null;
	
	if (is_numeric($id) &&null != $locationId && null != $lookingForId && null != $sportId && null != $sessionId)
	{
		$ad = AdRepository::GetById($id);
		$user = UserRepository::GetBySessionId($sessionId);
		if (null != $ad && null != $user && $user->Id === $ad->User->Id)
		{
			$ad->Description = $description;
			$ad->Headline = $headline;
			$ad->Location = LocationRepository::GetById($locationId);
			$ad->LookingFor = LookingForRepository::GetById($lookingForId);
			$ad->Sport = SportRepository::GetById($sportId);
			
			$ad = AdRepository::Save($ad);
		}
		else
		{
			$ad = null;
		}
	}
	
	header("Content-Type: application/json; charset=utf-8", true);
	echo null != $ad ? json_encode($ad) : "{}";
?>