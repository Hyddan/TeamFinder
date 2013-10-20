<?php
	//Includes
	require_once "../bin/mappings.php";
	require_once "../bin/repositories.php";
	
	//Set parameters
	$age				=	isset($_POST["age"]) ? (int) $_POST["age"] : null;
	$description		=	isset($_POST["description"]) ? $_POST["description"] : null;
	$email				=	isset($_POST["email"]) ? $_POST["email"] : null;
	$firstName			=	isset($_POST["firstName"]) ? $_POST["firstName"] : null;
	$gender				=	isset($_POST["gender"]) ? $_POST["gender"] : null;
	$lastName			=	isset($_POST["lastName"]) ? $_POST["lastName"] : null;
	$password			=	isset($_POST["password"]) ? $_POST["password"] : null;
	$pictureFileName	=	isset($_POST["pictureFileName"]) ? "../images/users/" . $_POST["pictureFileName"] : null;
	$user				= 	null;
	
	if (null != $age && null != $description && null != $email && null != $firstName && null != $gender && null != $lastName && null != $password)
	{
		$user = UserRepository::Save(new User(-1,
												$age,
												null,
												$description,
												$email,
												$firstName,
												$gender,
												$lastName,
												$pictureFileName,
												null,
												$email));
		
		if (null != $user) {
			if (UserRepository::SetPassword($user->Id, base64_decode($password))) {
				$user = TeamFinder::logIn($user->UserName, base64_decode($password));
			}
			else {
				$user = null;
			}
		}
	}
	
	echo null != $user ? json_encode($user) : "{}";
?>