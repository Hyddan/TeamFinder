<?php
	//Includes
	require_once '/../bin/mappings.php';
	require_once '/../bin/repositories.php';
	
	//Set parameters
	$age				=	isset($_POST["age"]) ? (int) $_POST["age"] : null;
	$description		=	isset($_POST["description"]) ? $_POST["description"] : null;
	$email				=	isset($_POST["email"]) ? $_POST["email"] : null;
	$gender				=	isset($_POST["gender"]) ? $_POST["gender"] : null;
	$name				=	isset($_POST["name"]) ? $_POST["name"] : null;
	$password			=	isset($_POST["password"]) ? $_POST["password"] : null;
	$pictureFileName	=	isset($_POST["pictureFileName"]) ? $_POST["pictureFileName"] : null;
	$user				= 	null;
	
	if (null != $age && null != $description && null != $email && null != $gender && null != $name && null != $password)
	{
		$user = UserRepository::Save(new User(-1,
												$age,
												null,
												$description,
												$email,
												$gender,
												$name,
												"../images/users/" . $pictureFileName,
												null));
		
		if (null != $user) {
			if (UserRepository::SetPassword($user->Id, base64_decode($password))) {
				$user = Zapto::logIn($user->Email, base64_decode($password));
			}
			else {
				$user = null;
			}
		}
	}
	
	echo null != $user ? json_encode($user) : "{}";
?>