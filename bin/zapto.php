<?php
	//Includes
	require_once '/../bin/mappings.php';
	
	class Zapto
	{
		static function GenerateGuid()
		{
			if (function_exists('com_create_guid') === true)
			{
				return trim(com_create_guid(), '{}');
			}

			return sprintf('%04X%04X-%04X-%04X-%04X-%04X%04X%04X', mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(16384, 20479), mt_rand(32768, 49151), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535));
		}
		
		static function getFilter($loc, $lf, $s)
		{
			global $locations, $sports, $lookingFor;
			
			//If faulty input, return null
			if(($loc != null && $loc !== "" && $locations[$loc] == null) || ($lf != null && $lf !== "" && $lookingFor[$lf] == null) || ($s != null && $s !== "" && $sports[$s] == null)) {
				return null;
			}
			
			//If no filter, return ""
			if(($loc == null || $loc === "") && ($lf == null || $lf === "") && ($s == null || $s === "")){
				return "";
			}
			
			//If OK filter, return " WHERE param1='value1' AND param2='value2' etc."
			$filter = " WHERE";
			$initialFilterLength = strlen($filter);
			
			if($locations[$loc] != null) {
				$filter = $filter . "  LocationId` = '" . $locations[$loc] . "'";
			}
			
			if($lookingFor[$lf] != null) {
				if(strlen($filter) > $initialFilterLength) {
					$filter = $filter . " AND";
				}
				$filter = $filter . " `LookingForId` = '" . $lookingFor[$lf] . "'";
			}
			
			if($sports[$s] != null) {
				if(strlen($filter) > $initialFilterLength) {
					$filter = $filter . " AND";
				}
				$filter = $filter . " `SportId` = '" . $sports[$s] . "'";
			}
			
			return $filter;
		}
		
		static function logIn($email, $password)
		{
			$user = UserRepository::GetByEmail($email);
			if (null != $user && UserRepository::ValidatePassword($user->Id, $password))
			{
				return UserRepository::StartSession($user);
			}
			
			return null;
		}
		
		static function logOut($sessionId)
		{
			return UserRepository::EndSession(UserRepository::GetBySessionId($sessionId));
		}
		
		static function requireSSL()
		{
			if(empty($_SERVER["HTTPS"]) || $_SERVER["HTTPS"] !== "on")
			{
				header("Location: https://" . $_SERVER["HTTP_HOST"] . $_SERVER["REQUEST_URI"]);
				exit();
			}
		}
	}
?>