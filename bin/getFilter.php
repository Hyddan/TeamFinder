<?php 
	function getFilter($c, $l, $s)
	{
		$cities = array("st" => "Stockholm",
						"su"	=> "Sundsvall",
						"u"	=> "Uppsala",
						"l"	=> "Linköping");
		
		$sports = array("b" => "Basketball",
						"f"	=> "Floorball",
						"h"	=> "Hockey",
						"s"	=> "Soccer");
		
		$lookingFor = array("t" => "Team",
							"p"	=> "Player");
		
		$city = $cities[$c];
		$looking = $lookingFor[$l];
		$sport = $sport[$s];
		
		//If faulty input, return null
		if(($c != null && $c !== "" && $cities[$c] == null) || ($l != null && $l !== "" && $looking[$l] == null) || ($s != null && $s !== "" && $sports[$s] == null)) {
			return null;
		}
		
		//If no filter, return ""
		if(($c == null || $c === "") && ($l == null || $l === "") && ($s == null || $s === "")){
			return "";
		}
		
		//If OK filter, return " WHERE param1='value1' AND param2='value2' etc."
		$filter = " WHERE";
		$initialFilterLength = strlen($filter);
		
		if($cities[$c] != null) {
			$filter = $filter . " location = '" . $cities[$c] . "'";
		}
		
		if($lookingFor[$l] != null) {
			if(strlen($filter) > $initialFilterLength) {
				$filter = $filter . " AND";
			}
			$filter = $filter . " looking_for = '" . $lookingFor[$l] . "'";
		}
		
		if($sports[$s] != null) {
			if(strlen($filter) > $initialFilterLength) {
				$filter = $filter . " AND";
			}
			$filter = $filter . " sport = '" . $sports[$s] . "'";
		}
		
		return $filter;
	}
?>