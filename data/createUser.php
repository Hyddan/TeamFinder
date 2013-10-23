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
	$password			=	isset($_POST["password"]) ? $_POST["password"] : null;
	$pictureFileName	=	isset($_POST["pictureFileName"]) ? $_POST["pictureFileName"] : null;
	$user				= 	null;
	
	if (null != $birthDate && null != $description && null != $email && null != $firstName && null != $gender && null != $lastName && null != $password)
	{
		if (!UserRepository::IsUserNameAvailable($email))
		{
			$user = TeamFinder::GetError("An account with this username already exists, please choose another one.");
		}
		else if (!UserRepository::IsEmailAvailable($email))
		{
			$user = TeamFinder::GetError("An account with this email already exists, please use another one.");
		}
		else
		{
			$user = UserRepository::Save(new User(-1,
													$birthDate,
													null,
													$description,
													$email,
													$firstName,
													$gender,
													$lastName,
													$pictureFileName,
													null,
													$email));
			
			if (null != $user)
			{
				if (UserRepository::SetPassword($user->Id, base64_decode($password)))
				{
					$user = TeamFinder::logIn($user->UserName, base64_decode($password));
				}
				else
				{
					$user = null;
				}
			}
		}
	}
	
	echo null != $user ? json_encode($user) : "{}";
?>