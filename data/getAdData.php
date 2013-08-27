<?php
	//Includes
	require_once '/../bin/setupDataConnection.php';
	require_once '/../bin/zapto.php';
	require_once '/../bin/entities.php';
	require_once '/../bin/repositories.php';
	
	//Set parameters
	$tableName = '`Ads`';
	
	$pageIndex	=	isset($_GET["pageIndex"]) ? (int) $_GET["pageIndex"] : null;
	$pageSize	=	isset($_GET["pageSize"]) ? (int) $_GET["pageSize"] : null;
	$q 			=	isset($_GET["q"]) ? $_GET["q"] : null;
	$loc 		=	isset($_GET["loc"]) ? $_GET["loc"] : null;
	$lf 		=	isset($_GET["lf"]) ? $_GET["lf"] : null;
	$s			=	isset($_GET["s"]) ? $_GET["s"] : null;
	$i			=	isset($_GET["i"]) ? (int) $_GET["i"] : null;
	$filter 	=	Zapto::getFilter($loc, $lf, $s);
	
	if(("count" != $q && "data" != $q && "specific" != $q) || null === $filter)
	{
		echo "{}";
	}
	else if ("specific" == $q && is_int($i))
	{
		$ad = AdRepository::GetById($i);
		
		echo null != $ad ? json_encode($ad) : "{}";
	}
	else
	{
		if(!is_int($pageIndex))
		{
			$pageIndex = 0;
		}
		
		if(!is_int($pageSize))
		{
			$pageSize = 20;
		}
		
		$query = "SELECT COUNT(*) AS `AdCount` FROM " . $tableName . $filter . " LIMIT 1;";
		
		if($q == "data")
		{
			$query = "SELECT * FROM " . $tableName . $filter ." ORDER BY `CreatedDate` DESC LIMIT " . ($pageIndex * $pageSize) . "," . $pageSize;
		}
		
		$data = array();
		mysqli_query($connection, "SET CHARACTER SET 'utf8'");
		if($result = mysqli_query($connection, $query)) {
			$i = 0;
			while($row = mysqli_fetch_assoc($result)) {
				 $data["" . $i++] = "count" == $q ? $row : new Ad($row["Id"],
											$row["CreatedDate"],
											$row["Description"],
											$row["Headline"],
											LocationRepository::GetById($row["LocationId"]),
											LookingForRepository::GetById($row["LookingForId"]),
											SportRepository::GetById($row["SportId"]),
											UserRepository::GetById($row["UserId"]));
			}
			
			mysqli_free_result($result);
		}
			
		//Close DB Connection
		mysqli_close($connection);
		
		header("Content-Type: application/json; charset=utf-8", true);
		echo json_encode($data);
		
		/*
			{
				"Id": 1,
				"headline": "SomeTitle",
				"description": "SomeDescription",
				"location": {
					"Id": 1,
					"name": "Stockholm"
				},
				"lookingFor": {
					"Id": 1,
					"name": "player"
				},
				"sport": {
					"Id": 1,
					"name": "Floorball"
				},
				"user": {
					"Id": 1,
					"name": "Stockholm"
					"age": 25
					"gender": "Male"
				}
			}
		*/
	}
?>