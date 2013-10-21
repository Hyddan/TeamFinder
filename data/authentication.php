<?php
	//Includes
	require_once "../bin/repositories.php";
	require_once "../bin/teamFinder.php";
	
	//TeamFinder::requireSSL();
	
	if ("POST" === $_SERVER["REQUEST_METHOD"])
	{
		$ajaxAction = isset($_POST["ajaxAction"]) ? $_POST["ajaxAction"] : null;
		
		if ("logIn" === $ajaxAction)
		{
			$userName = isset($_POST["userName"]) ? $_POST["userName"] : null;
			$password = isset($_POST["password"]) ? $_POST["password"] : null;
			
			if (null != $userName && null != $password)
			{
				$user = TeamFinder::logIn(base64_decode($userName), base64_decode($password));
				
				echo null != $user ? json_encode($user) : "{}";
				exit();
			}
		}
		else if ("logOut" === $ajaxAction)
		{
			$sessionId = isset($_POST["sessionId"]) ? $_POST["sessionId"] : null;
			$user = TeamFinder::logOut($sessionId);
			
			echo null != $user ? json_encode($user) : "{}";
			exit();
		}
		else if ("changePassword" === $ajaxAction)
		{
			$currentPassword = isset($_POST["currentPassword"]) ? $_POST["currentPassword"] : null;
			$newPassword = isset($_POST["newPassword"]) ? $_POST["newPassword"] : null;
			$sessionId = isset($_POST["sessionId"]) ? $_POST["sessionId"] : null;
			
			$user = null;
			if (TeamFinder::ChangePassword($sessionId, base64_decode($currentPassword), base64_decode($newPassword)))
			{
				$user = UserRepository::GetBySessionId($sessionId);
			}
			else
			{
				$user = TeamFinder::GetError("Unable to change password.");
			}
			
			echo null != $user ? json_encode($user) : "{}";
			exit();
		}
		
		echo "{}";
		exit();
	}
	else
	{
		TeamFinder::returnHttpStatusCode(405);
	}
?>