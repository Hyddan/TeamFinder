<?php
	//Includes
	require_once '../bin/entities.php';
	require_once '../bin/teamFinder.php';
	
	//Set parameters
	$GLOBALS["reposHost"] = "83.168.227.176";
	$GLOBALS["reposUser"] = "u1179530_tf";
	$GLOBALS["reposPass"] = "teamfinder";
	$GLOBALS["reposDatabaseName"] = "db1179530_TeamFinder";
	
	class AdRepository
	{
		static function GetByFilter($filter)
		{
			$reposConnection = mysqli_connect($GLOBALS["reposHost"], $GLOBALS["reposUser"], $GLOBALS["reposPass"], $GLOBALS["reposDatabaseName"])
				or die("Could not connect to database: " . $GLOBALS["reposDatabaseName"] . "@" . $GLOBALS["reposHost"]);
			
			$query = "SELECT * FROM `Ads`" . $filter . " LIMIT 1;";
			if ($result = mysqli_query($reposConnection, $query)) {
				if ($row = mysqli_fetch_row($result)) {
					mysqli_free_result($result);
					
					mysqli_close($reposConnection);
					
					return new Ad($row[0],
									$row[1],
									$row[2],
									$row[3],
									LocationRepository::GetById($row[4]),
									LookingForRepository::GetById($row[5]),
									SportRepository::GetById($row[6]),
									UserRepository::GetById($row[7]));
				}
			}
			
			mysqli_close($reposConnection);
			
			return null;
		}
		
		static function GetById($id)
		{
			return AdRepository::GetByFilter(" WHERE `Id` = " . $id);
		}
		
		static function Save($ad)
		{
			$reposConnection = mysqli_connect($GLOBALS["reposHost"], $GLOBALS["reposUser"], $GLOBALS["reposPass"], $GLOBALS["reposDatabaseName"])
				or die("Could not connect to database: " . $GLOBALS["reposDatabaseName"] . "@" . $GLOBALS["reposHost"]);
			
			$query = "INSERT INTO `Ads` (`Description`, `Headline`, `LocationId`, `LookingForId`, `SportId`, `UserId`) VALUES('" . $ad->Description . "', '" . $ad->Headline . "', " . $ad->Location->Id . ", " . $ad->LookingFor->Id . ", " . $ad->Sport->Id . ", " . $ad->User->Id . ");";
			if (0 < $ad->Id) {
				$query = "UPDATE `Ads` SET `Description` = '" . $ad->Description . "', `Headline` = '" . $ad->Headline . "', `LocationId` = " . $ad->Location->Id . ", `LookingForId` = " . $ad->LookingFor->Id . ", `SportId` = " . $ad->Sport->Id . ", `UserId` = " . $ad->User->Id . " WHERE `Id` = " . $ad->Id;
			}
			
			if ($result = mysqli_query($reposConnection, $query)) {
				if (0 < $ad->Id) {
					$ad = AdRepository::GetById(mysqli_insert_id($reposConnection));
				}
			}
			
			mysqli_close($reposConnection);
			
			return $ad;
		}
	}
		
	class LocationRepository
	{
		static function GetByFilter($filter)
		{
			$reposConnection = mysqli_connect($GLOBALS["reposHost"], $GLOBALS["reposUser"], $GLOBALS["reposPass"], $GLOBALS["reposDatabaseName"])
				or die("Could not connect to database: " . $GLOBALS["reposDatabaseName"] . "@" . $GLOBALS["reposHost"]);
			
			$query = "SELECT * FROM `Locations`" . $filter . " LIMIT 1;";
			if ($result = mysqli_query($reposConnection, $query)) {
				if ($row = mysqli_fetch_row($result)) {
					mysqli_free_result($result);
			
					mysqli_close($reposConnection);
					
					return new Location($row[0], $row[1], $row[2]);
				}
			}
			
			mysqli_close($reposConnection);
			
			return null;
		}
		
		static function GetById($id)
		{
			return LocationRepository::GetByFilter(" WHERE `Id` = " . $id);
		}
		
		static function GetByName($name)
		{
			return LocationRepository::GetByFilter(" WHERE `Name` = '" . $name . "'");
		}
	}
		
	class LookingForRepository
	{
		static function GetByFilter($filter)
		{
			$reposConnection = mysqli_connect($GLOBALS["reposHost"], $GLOBALS["reposUser"], $GLOBALS["reposPass"], $GLOBALS["reposDatabaseName"])
				or die("Could not connect to database: " . $GLOBALS["reposDatabaseName"] . "@" . $GLOBALS["reposHost"]);
			
			$query = "SELECT * FROM `LookingFor`" . $filter . " LIMIT 1;";
			if ($result = mysqli_query($reposConnection, $query)) {
				if ($row = mysqli_fetch_row($result)) {
					mysqli_free_result($result);
			
					mysqli_close($reposConnection);
					
					return new LookingFor($row[0], $row[1], $row[2]);
				}
			}
			
			mysqli_close($reposConnection);
			
			return null;
		}
		
		static function GetById($id)
		{
			return LookingForRepository::GetByFilter(" WHERE `Id` = " . $id);
		}
		
		static function GetByName($name)
		{
			return LookingForRepository::GetByFilter(" WHERE `Name` = '" . $name . "'");
		}
	}
		
	class SportRepository
	{
		static function GetByFilter($filter)
		{
			$reposConnection = mysqli_connect($GLOBALS["reposHost"], $GLOBALS["reposUser"], $GLOBALS["reposPass"], $GLOBALS["reposDatabaseName"])
				or die("Could not connect to database: " . $GLOBALS["reposDatabaseName"] . "@" . $GLOBALS["reposHost"]);
			
			$query = "SELECT * FROM `Sports`" . $filter . " LIMIT 1;";
			if ($result = mysqli_query($reposConnection, $query)) {
				if ($row = mysqli_fetch_row($result)) {
					mysqli_free_result($result);
			
					mysqli_close($reposConnection);
					
					return new Sport($row[0], $row[1], $row[2]);
				}
			}
			
			mysqli_close($reposConnection);
			
			return null;
		}
		
		static function GetById($id)
		{
			return SportRepository::GetByFilter(" WHERE `Id` = " . $id);
		}
		
		static function GetByName($name)
		{
			return SportRepository::GetByFilter(" WHERE `Name` = '" . $name . "'");
		}
	}
		
	class UserRepository
	{
		static function EndSession($user)
		{
			$user->SessionId = null;
			
			return UserRepository::Save($user);
		}
		
		static function GetByFilter($filter)
		{
			$reposConnection = mysqli_connect($GLOBALS["reposHost"], $GLOBALS["reposUser"], $GLOBALS["reposPass"], $GLOBALS["reposDatabaseName"])
				or die("Could not connect to database: " . $GLOBALS["reposDatabaseName"] . "@" . $GLOBALS["reposHost"]);
			
			$query = "SELECT `Id`,`Age`, `CreatedDate`, `Description`, `Email`, `FirstName`, `Gender`, `LastName`, `PictureUrl`, `SessionId` FROM `Users`" . $filter . " LIMIT 1;";
			if ($result = mysqli_query($reposConnection, $query)) {
				if ($row = mysqli_fetch_row($result)) {
					mysqli_free_result($result);
			
					mysqli_close($reposConnection);
					
					return new User($row[0], $row[1], $row[2], $row[3], $row[4], $row[5], $row[6], $row[7], $row[8], $row[9]);
				}
			}
			
			mysqli_close($reposConnection);
			
			return null;
		}
		
		static function GetById($id)
		{
			return UserRepository::GetByFilter(" WHERE `Id` = " . $id);
		}
		
		static function GetByEmail($email)
		{
			return UserRepository::GetByFilter(" WHERE `Email` = '" . $email . "'");
		}
		
		static function GetBySessionId($sessionId)
		{
			return UserRepository::GetByFilter(" WHERE `SessionId` = '" . $sessionId . "'");
		}
		
		static function GetSalt($userId)
		{
			$reposConnection = mysqli_connect($GLOBALS["reposHost"], $GLOBALS["reposUser"], $GLOBALS["reposPass"], $GLOBALS["reposDatabaseName"])
				or die("Could not connect to database: " . $GLOBALS["reposDatabaseName"] . "@" . $GLOBALS["reposHost"]);
			
			$query = "SELECT `Salt` FROM `Users` WHERE `Id` = " . $userId;
			
			if ($result = mysqli_query($reposConnection, $query)) {
				if ($row = mysqli_fetch_row($result)) {
					mysqli_free_result($result);
			
					mysqli_close($reposConnection);
					
					return $row[0];
				}
			}
			
			mysqli_close($reposConnection);
			
			return null;
		}
		
		static function Save($user)
		{
			$reposConnection = mysqli_connect($GLOBALS["reposHost"], $GLOBALS["reposUser"], $GLOBALS["reposPass"], $GLOBALS["reposDatabaseName"])
				or die("Could not connect to database: " . $GLOBALS["reposDatabaseName"] . "@" . $GLOBALS["reposHost"]);
			
			$query = "INSERT INTO `Users` (`Age`, `Description`, `Email`, `FirstName`, `Gender`, `LastName`, `Password`, `PictureUrl`, `SessionId`) VALUES(" . $user->Age . ", '" . $user->Description . "', '" . $user->Email . "', '" . $user->FirstName . "', '" . $user->Gender . "', '" . $user->LastName . "', null, '" . $user->PictureUrl . "', null);";
			if (0 < $user->Id) {
				$query = "UPDATE `Users` SET `Age` = " . $user->Age . ", `Description` = '" . $user->Description . "', `Email` = '" . $user->Email . "', `FirstName` = '" . $user->FirstName . "', `Gender` = '" . $user->Gender . "', `LastName` = '" . $user->LastName . "', `PictureUrl` = '" . $user->PictureUrl . "', `SessionId` = '" . $user->SessionId . "' WHERE `Id` = " . $user->Id;
			}
			
			if ($result = mysqli_query($reposConnection, $query)) {
				if (0 >= $user->Id) {
					$user = UserRepository::GetById(mysqli_insert_id($reposConnection));
				}
			}
			
			mysqli_close($reposConnection);
			
			return $user;
		}
		
		static function SetPassword($userId, $password)
		{
			$reposConnection = mysqli_connect($GLOBALS["reposHost"], $GLOBALS["reposUser"], $GLOBALS["reposPass"], $GLOBALS["reposDatabaseName"])
				or die("Could not connect to database: " . $GLOBALS["reposDatabaseName"] . "@" . $GLOBALS["reposHost"]);
			
			$salt = UserRepository::SetSalt($userId);
			
			$query = "UPDATE `Users` SET `Password` = '" . hash("sha256", (null != $salt ? $salt : "") . $password) . "' WHERE `Id` = " . $userId;
			
			if ($result = mysqli_query($reposConnection, $query)) {
				mysqli_close($reposConnection);
				
				return true;
			}
			
			mysqli_close($reposConnection);
			
			return false;
		}
		
		static function SetSalt($userId)
		{
			$reposConnection = mysqli_connect($GLOBALS["reposHost"], $GLOBALS["reposUser"], $GLOBALS["reposPass"], $GLOBALS["reposDatabaseName"])
				or die("Could not connect to database: " . $GLOBALS["reposDatabaseName"] . "@" . $GLOBALS["reposHost"]);
			
			$salt = TeamFinder::GenerateGuid();
			$query = "UPDATE `Users` SET `Salt` ='" . $salt . "' WHERE `Id` = " . $userId;
			
			if ($result = mysqli_query($reposConnection, $query)) {
				mysqli_close($reposConnection);
				
				return $salt;
			}
			
			mysqli_close($reposConnection);
			
			return null;
		}
		
		static function StartSession($user)
		{
			$user->SessionId = TeamFinder::GenerateGuid();
			
			return UserRepository::Save($user);
		}
		
		static function ValidatePassword($userId, $password)
		{
			$reposConnection = mysqli_connect($GLOBALS["reposHost"], $GLOBALS["reposUser"], $GLOBALS["reposPass"], $GLOBALS["reposDatabaseName"])
				or die("Could not connect to database: " . $GLOBALS["reposDatabaseName"] . "@" . $GLOBALS["reposHost"]);
			
			$query = "SELECT `Password` FROM `Users` WHERE `Id` = " . $userId;
			
			if ($result = mysqli_query($reposConnection, $query)) {
				if ($row = mysqli_fetch_row($result)) {
					mysqli_free_result($result);
					
					return $row[0] == hash("sha256", UserRepository::GetSalt($userId) . $password);
				}
			}
			
			mysqli_close($reposConnection);
			
			return false;
		}
	}
?>