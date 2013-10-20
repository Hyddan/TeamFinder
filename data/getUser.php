<?php
	//Includes
	require_once "../bin/teamFinder.php";
	require_once "../bin/entities.php";
	require_once "../bin/repositories.php";
	
	//Set parameters
	$sessionId	=	isset($_GET["sessionId"]) ? $_GET["sessionId"] : null;
	$user		=	null;
	
	header("Content-Type: application/json; charset=utf-8", true);
	if (null == $sessionId)
	{
		echo "{}";
	}
	else
	{
		$user = UserRepository::GetBySessionId($sessionId);
		
		echo null != $user ? json_encode($user) : "{}";
	}
?>