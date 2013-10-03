<?php
	//Includes
	require_once "../bin/bootstrap.php";
	require_once "../bin/entities.php";
	require_once "../bin/teamFinder.php";
	
	class AdRepository
	{
		static function Find($filter, $pageIndex, $pageSize)
		{
			global $tfHost, $tfUser, $tfPass, $tfDatabaseName;
			$connection = mysqli_connect($tfHost, $tfUser, $tfPass, $tfDatabaseName)
				or die("Could not connect to database: " . $tfDatabaseName . "@" . $tfHost);
			
			if (null == $filter)
			{
				$filter = "";
			}
			
			if (!is_int($pageIndex))
			{
				$pageIndex = 0;
			}
			
			if (!is_int($pageSize))
			{
				$pageSize = 2147483647;
			}
			
			$data = array();
			$query = "SELECT * FROM `Ads`" . $filter . " ORDER BY `CreatedDate` DESC LIMIT " . ($pageIndex * $pageSize) . "," . $pageSize;
			mysqli_query($connection, "SET CHARACTER SET 'utf8'");
			if ($result = mysqli_query($connection, $query)) {
				while ($row = mysqli_fetch_row($result)) {
					$data[] = new Ad($row[0],
									$row[1],
									$row[2],
									$row[3],
									LocationRepository::GetById($row[4]),
									LookingForRepository::GetById($row[5]),
									SportRepository::GetById($row[6]),
									UserRepository::GetById($row[7]));
				}
			}
			
			mysqli_close($connection);
			
			return $data;
		}
		
		static function GetAll()
		{
			return AdRepository::Find(null, null, null);
		}
		
		static function GetByFilter($filter)
		{
			global $tfHost, $tfUser, $tfPass, $tfDatabaseName;
			$connection = mysqli_connect($tfHost, $tfUser, $tfPass, $tfDatabaseName)
				or die("Could not connect to database: " . $tfDatabaseName . "@" . $tfHost);
			
			$query = "SELECT * FROM `Ads`" . $filter . " LIMIT 1;";
			mysqli_query($connection, "SET CHARACTER SET 'utf8'");
			if ($result = mysqli_query($connection, $query)) {
				if ($row = mysqli_fetch_row($result)) {
					mysqli_free_result($result);
					
					mysqli_close($connection);
					
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
			
			mysqli_close($connection);
			
			return null;
		}
		
		static function GetById($id)
		{
			return AdRepository::GetByFilter(" WHERE `Id` = " . $id);
		}
		
		static function GetCount($filter)
		{
			global $tfHost, $tfUser, $tfPass, $tfDatabaseName;
			$connection = mysqli_connect($tfHost, $tfUser, $tfPass, $tfDatabaseName)
				or die("Could not connect to database: " . $tfDatabaseName . "@" . $tfHost);
			
			if (null == $filter)
			{
				$filter = "";
			}
			
			$count = 0;
			$query = "SELECT COUNT(*) FROM `Ads`" . $filter . " LIMIT 1;";
			mysqli_query($connection, "SET CHARACTER SET 'utf8'");
			if ($result = mysqli_query($connection, $query)) {
				while ($row = mysqli_fetch_row($result)) {
					mysqli_free_result($result);
					
					$count = $row[0];
				}
			}
			
			mysqli_close($connection);
			
			return $count;
		}
		
		static function Save($ad)
		{
			global $tfHost, $tfUser, $tfPass, $tfDatabaseName;
			$connection = mysqli_connect($tfHost, $tfUser, $tfPass, $tfDatabaseName)
				or die("Could not connect to database: " . $tfDatabaseName . "@" . $tfHost);
			
			$query = "INSERT INTO `Ads` (`Description`, `Headline`, `LocationId`, `LookingForId`, `SportId`, `UserId`) VALUES('" . $ad->Description . "', '" . $ad->Headline . "', " . $ad->Location->Id . ", " . $ad->LookingFor->Id . ", " . $ad->Sport->Id . ", " . $ad->User->Id . ");";
			if (0 < $ad->Id) {
				$query = "UPDATE `Ads` SET `Description` = '" . $ad->Description . "', `Headline` = '" . $ad->Headline . "', `LocationId` = " . $ad->Location->Id . ", `LookingForId` = " . $ad->LookingFor->Id . ", `SportId` = " . $ad->Sport->Id . ", `UserId` = " . $ad->User->Id . " WHERE `Id` = " . $ad->Id;
			}
			
			mysqli_query($connection, "SET CHARACTER SET 'utf8'");
			if ($result = mysqli_query($connection, $query)) {
				if (0 < $ad->Id) {
					$ad = AdRepository::GetById(mysqli_insert_id($connection));
				}
			}
			
			mysqli_close($connection);
			
			return $ad;
		}
	}
		
	class LocationRepository
	{
		static function GetByFilter($filter)
		{
			global $tfHost, $tfUser, $tfPass, $tfDatabaseName;
			$connection = mysqli_connect($tfHost, $tfUser, $tfPass, $tfDatabaseName)
				or die("Could not connect to database: " . $tfDatabaseName . "@" . $tfHost);
			
			$query = "SELECT * FROM `Locations`" . $filter . " LIMIT 1;";
			mysqli_query($connection, "SET CHARACTER SET 'utf8'");
			if ($result = mysqli_query($connection, $query)) {
				if ($row = mysqli_fetch_row($result)) {
					mysqli_free_result($result);
			
					mysqli_close($connection);
					
					return new Location($row[0], $row[1], $row[2]);
				}
			}
			
			mysqli_close($connection);
			
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
			global $tfHost, $tfUser, $tfPass, $tfDatabaseName;
			$connection = mysqli_connect($tfHost, $tfUser, $tfPass, $tfDatabaseName)
				or die("Could not connect to database: " . $tfDatabaseName . "@" . $tfHost);
			
			$query = "SELECT * FROM `LookingFor`" . $filter . " LIMIT 1;";
			mysqli_query($connection, "SET CHARACTER SET 'utf8'");
			if ($result = mysqli_query($connection, $query)) {
				if ($row = mysqli_fetch_row($result)) {
					mysqli_free_result($result);
			
					mysqli_close($connection);
					
					return new LookingFor($row[0], $row[1], $row[2]);
				}
			}
			
			mysqli_close($connection);
			
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
			global $tfHost, $tfUser, $tfPass, $tfDatabaseName;
			$connection = mysqli_connect($tfHost, $tfUser, $tfPass, $tfDatabaseName)
				or die("Could not connect to database: " . $tfDatabaseName . "@" . $tfHost);
			
			$query = "SELECT * FROM `Sports`" . $filter . " LIMIT 1;";
			mysqli_query($connection, "SET CHARACTER SET 'utf8'");
			if ($result = mysqli_query($connection, $query)) {
				if ($row = mysqli_fetch_row($result)) {
					mysqli_free_result($result);
			
					mysqli_close($connection);
					
					return new Sport($row[0], $row[1], $row[2]);
				}
			}
			
			mysqli_close($connection);
			
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
			global $tfHost, $tfUser, $tfPass, $tfDatabaseName;
			$connection = mysqli_connect($tfHost, $tfUser, $tfPass, $tfDatabaseName)
				or die("Could not connect to database: " . $tfDatabaseName . "@" . $tfHost);
			
			$query = "SELECT `Id`,`Age`, `CreatedDate`, `Description`, `Email`, `FirstName`, `Gender`, `LastName`, `PictureUrl`, `SessionId` FROM `Users`" . $filter . " LIMIT 1;";
			mysqli_query($connection, "SET CHARACTER SET 'utf8'");
			if ($result = mysqli_query($connection, $query)) {
				if ($row = mysqli_fetch_row($result)) {
					mysqli_free_result($result);
			
					mysqli_close($connection);
					
					return new User($row[0], $row[1], $row[2], $row[3], $row[4], $row[5], $row[6], $row[7], $row[8], $row[9]);
				}
			}
			
			mysqli_close($connection);
			
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
			global $tfHost, $tfUser, $tfPass, $tfDatabaseName;
			$connection = mysqli_connect($tfHost, $tfUser, $tfPass, $tfDatabaseName)
				or die("Could not connect to database: " . $tfDatabaseName . "@" . $tfHost);
			
			$query = "SELECT `Salt` FROM `Users` WHERE `Id` = " . $userId;
			mysqli_query($connection, "SET CHARACTER SET 'utf8'");
			if ($result = mysqli_query($connection, $query)) {
				if ($row = mysqli_fetch_row($result)) {
					mysqli_free_result($result);
			
					mysqli_close($connection);
					
					return $row[0];
				}
			}
			
			mysqli_close($connection);
			
			return null;
		}
		
		static function Save($user)
		{
			global $tfHost, $tfUser, $tfPass, $tfDatabaseName;
			$connection = mysqli_connect($tfHost, $tfUser, $tfPass, $tfDatabaseName)
				or die("Could not connect to database: " . $tfDatabaseName . "@" . $tfHost);
			
			$query = "INSERT INTO `Users` (`Age`, `Description`, `Email`, `FirstName`, `Gender`, `LastName`, `Password`, `PictureUrl`, `SessionId`) VALUES(" . $user->Age . ", '" . $user->Description . "', '" . $user->Email . "', '" . $user->FirstName . "', '" . $user->Gender . "', '" . $user->LastName . "', null, '" . $user->PictureUrl . "', null);";
			if (0 < $user->Id) {
				$query = "UPDATE `Users` SET `Age` = " . $user->Age . ", `Description` = '" . $user->Description . "', `Email` = '" . $user->Email . "', `FirstName` = '" . $user->FirstName . "', `Gender` = '" . $user->Gender . "', `LastName` = '" . $user->LastName . "', `PictureUrl` = '" . $user->PictureUrl . "', `SessionId` = '" . $user->SessionId . "' WHERE `Id` = " . $user->Id;
			}
			
			mysqli_query($connection, "SET CHARACTER SET 'utf8'");
			if ($result = mysqli_query($connection, $query)) {
				if (0 >= $user->Id) {
					$user = UserRepository::GetById(mysqli_insert_id($connection));
				}
			}
			
			mysqli_close($connection);
			
			return $user;
		}
		
		static function SetPassword($userId, $password)
		{
			global $tfHost, $tfUser, $tfPass, $tfDatabaseName;
			$connection = mysqli_connect($tfHost, $tfUser, $tfPass, $tfDatabaseName)
				or die("Could not connect to database: " . $tfDatabaseName . "@" . $tfHost);
			
			$salt = UserRepository::SetSalt($userId);
			
			$query = "UPDATE `Users` SET `Password` = '" . hash("sha256", (null != $salt ? $salt : "") . $password) . "' WHERE `Id` = " . $userId;
			mysqli_query($connection, "SET CHARACTER SET 'utf8'");
			if ($result = mysqli_query($connection, $query)) {
				mysqli_close($connection);
				
				return true;
			}
			
			mysqli_close($connection);
			
			return false;
		}
		
		static function SetSalt($userId)
		{
			global $tfHost, $tfUser, $tfPass, $tfDatabaseName;
			$connection = mysqli_connect($tfHost, $tfUser, $tfPass, $tfDatabaseName)
				or die("Could not connect to database: " . $tfDatabaseName . "@" . $tfHost);
			
			$salt = TeamFinder::GenerateGuid();
			$query = "UPDATE `Users` SET `Salt` ='" . $salt . "' WHERE `Id` = " . $userId;
			mysqli_query($connection, "SET CHARACTER SET 'utf8'");
			if ($result = mysqli_query($connection, $query)) {
				mysqli_close($connection);
				
				return $salt;
			}
			
			mysqli_close($connection);
			
			return null;
		}
		
		static function StartSession($user)
		{
			$user->SessionId = TeamFinder::GenerateGuid();
			
			return UserRepository::Save($user);
		}
		
		static function ValidatePassword($userId, $password)
		{
			global $tfHost, $tfUser, $tfPass, $tfDatabaseName;
			$connection = mysqli_connect($tfHost, $tfUser, $tfPass, $tfDatabaseName)
				or die("Could not connect to database: " . $tfDatabaseName . "@" . $tfHost);
			
			$query = "SELECT `Password` FROM `Users` WHERE `Id` = " . $userId;
			mysqli_query($connection, "SET CHARACTER SET 'utf8'");
			if ($result = mysqli_query($connection, $query)) {
				if ($row = mysqli_fetch_row($result)) {
					mysqli_free_result($result);
					
					return $row[0] == hash("sha256", UserRepository::GetSalt($userId) . $password);
				}
			}
			
			mysqli_close($connection);
			
			return false;
		}
	}
?>