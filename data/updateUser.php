<?php
	//Includes
	require_once "../bin/mappings.php";
	require_once "../bin/repositories.php";
	
	//Set parameters
	$birthDate			=	isset($_POST["birthDate"]) ? $_POST["birthDate"] : null;
	$description		=	isset($_POST["description"]) ? $_POST["description"] : null;
	$email				=	isset($_POST["email"]) ? $_POST["email"] : null;
	$firstName			=	isset($_POST["firstName"]) ? $_POST["firstName"] : null;
	$gender				=	isset($_POST["gender"]) ? $_POST["gender"] : null;
	$lastName			=	isset($_POST["lastName"]) ? $_POST["lastName"] : null;
	$pictureFileName	=	isset($_POST["pictureFileName"]) ? "../images/users/" . $_POST["pictureFileName"] : null;
	$sessionId			=	isset($_POST["sessionId"]) ? $_POST["sessionId"] : null;
	$userName			=	isset($_POST["userName"]) ? $_POST["userName"] : null;
	$user				= 	null;
	
	if (null != $sessionId)
	{
		$user = UserRepository::GetBySessionId($sessionId);
		if (null != $user)
		{
			if (null != $userName && $user->UserName !== $userName && !UserRepository::IsUserNameAvailable($userName))
			{
				$user = TeamFinder::GetError("An account with this username already exists, please choose another one.");
			}
			else if (null != $email && $user->Email !== $email && !UserRepository::IsEmailAvailable($email))
			{
				$user = TeamFinder::GetError("An account with this email already exists, please use another one.");
			}
			else
			{
				$user->BirthDate = null != $birthDate && $user->BirthDate !== $birthDate ? $birthDate : $user->BirthDate;
				$user->Description = null != $description && $user->Description !== $description ? $description : $user->Description;
				$user->Email = null != $email && $user->Email !== $email ? $email : $user->Email;
				$user->FirstName = null != $firstName && $user->FirstName !== $firstName ? $firstName : $user->FirstName;
				$user->Gender = null != $gender && $user->Gender !== $gender ? $gender : $user->Gender;
				$user->LastName = null != $lastName && $user->LastName !== $lastName ? $lastName : $user->LastName;
				$user->PictureUrl = null != $pictureFileName && $user->PictureUrl !== $pictureFileName ? $pictureFileName : $user->PictureUrl;
				$user->UserName = null != $userName && $user->UserName !== $userName ? $userName : $user->UserName;
				
				$user = UserRepository::Save($user);
			}
		}
	}
	
	header("Content-Type: application/json; charset=utf-8", true);
	echo null != $user ? json_encode($user) : "{}";
?>