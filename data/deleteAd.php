<?php
	//Includes
	require_once "../bin/mappings.php";
	require_once "../bin/repositories.php";
	
	//Set parameters
	$i				=	isset($_POST["i"]) ? $_POST["i"] : null;
	$sessionId		=	isset($_POST["sessionId"]) ? $_POST["sessionId"] : null;
	$response		=	null;
	
	if (null != $i && null != $sessionId)
	{
		$response = new stdClass();
		$response->deleted = AdRepository::Delete($i, $sessionId);
	}
	
	header("Content-Type: application/json; charset=utf-8", true);
	echo null != $response ? json_encode($response) : "{}";
?>