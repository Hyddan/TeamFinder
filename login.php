<?php
	//Includes
	require_once '/bin/repositories.php';
	require_once '/bin/zapto.php';
	
	if ("POST" === $_SERVER["REQUEST_METHOD"])
	{
		$username	=	isset($_POST["username"]) ? $_POST["username"] : null;
		$password	=	isset($_POST["password"]) ? $_POST["password"] : null;
		
		if (null != $username && null != $password)
		{
			$user = Zapto::logIn(base64_decode($username), base64_decode($password));
			
			echo null != $user ? json_encode($user) : "{}";
		}
	}
	else
	{
		http_response_code(405);
	}
?>