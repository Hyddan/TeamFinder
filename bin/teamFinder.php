<?php
	//Includes
	require_once "../bin/mappings.php";
	
	class TeamFinder
	{
		static function ChangePassword($sessionId, $currentPassword, $newPassword)
		{
			$user = UserRepository::GetBySessionId($sessionId);
			if (null != $user && UserRepository::ValidatePassword($user->Id, $currentPassword))
			{
				return UserRepository::SetPassword($user->Id, $newPassword);
			}
			
			return false;
		}
		
		static function GenerateGuid()
		{
			if (function_exists("com_create_guid") === true)
			{
				return trim(com_create_guid(), "{}");
			}

			return sprintf('%04X%04X-%04X-%04X-%04X-%04X%04X%04X', mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(16384, 20479), mt_rand(32768, 49151), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535));
		}
		
		static function GetError($message)
		{
			$error = new stdClass();
			$error->Error = new stdClass();
			$error->Error->Message = $message;
			
			return $error;
		}
		
		static function getFilter($loc, $lf, $s)
		{
			global $locations, $sports, $lookingFor;
			
			//If faulty input, return null
			if(($loc != null && $loc !== "" && $locations[$loc] == null) || ($lf != null && $lf !== "" && $lookingFor[$lf] == null) || ($s != null && $s !== "" && $sports[$s] == null)) {
				return null;
			}
			
			//If no filter, return ""
			if(empty($loc) && empty($lf) && empty($s)){
				return "";
			}
			
			//If OK filter, return " WHERE param1='value1' AND param2='value2' etc."
			$filter = " WHERE";
			$initialFilterLength = strlen($filter);
			
			if(!empty($loc) && $locations[$loc] != null) {
				$filter = $filter . "  `LocationId` = '" . $locations[$loc] . "'";
			}
			
			if(!empty($lf) && $lookingFor[$lf] != null) {
				if(strlen($filter) > $initialFilterLength) {
					$filter = $filter . " AND";
				}
				$filter = $filter . " `LookingForId` = '" . $lookingFor[$lf] . "'";
			}
			
			if(!empty($s) && $sports[$s] != null) {
				if(strlen($filter) > $initialFilterLength) {
					$filter = $filter . " AND";
				}
				$filter = $filter . " `SportId` = '" . $sports[$s] . "'";
			}
			
			return $filter;
		}
		
		static function logIn($userName, $password)
		{
			$user = UserRepository::GetByUserName($userName);
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
		
		static function returnHttpStatusCode($statusCode)
		{
			// For 4.3.0 <= PHP <= 5.4.0
			if (!function_exists('http_response_code'))
			{
				function http_response_code($newcode = NULL)
				{
					static $code = 200;
					if($newcode !== NULL)
					{
						header('X-PHP-Response-Code: '.$newcode, true, $newcode);
						if(!headers_sent())
							$code = $newcode;
					}       
					return $code;
				}
			}
			
			http_response_code($statusCode);
		}
	}
?>