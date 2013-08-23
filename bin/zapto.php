<?php
	//Includes
	require_once '../bin/mappings.php';
	
	class Zapto
	{
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
			if (UserRepository::ValidatePassword($user->Id, $password))
			{
				return UserRepository::StartSession($user);
			}
			
			return false;
		}
		
		static function logOut($sessionId)
		{
			return UserRepository::StartSession(UserRepository::GetBySessionId($sessionId));
		}
	}
?>