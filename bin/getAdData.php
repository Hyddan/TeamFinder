<?php
	//Includes
	require 'getFilter.php';
	
	//Setup DB connection
	$host = "localhost";
	$user = "root";
	$pass = "vasaloppet";
	$databaseName = "team";
	$tablename = 'ads';
	$con = mysql_connect($host,$user,$pass);
	$dbs = mysql_select_db($databaseName, $con);
	
	//Set parameters				 
	$pageIndex = (int) $_GET["pageIndex"];
	$pageSize = (int) $_GET["pageSize"];
	$q = $_GET["q"];
	$filter = getFilter($_GET["c"], $_GET["l"], $_GET["s"]);
	
	if(($q != "count" && $q != "data") || $filter === null)
	{
		echo "{}";
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
		
		$query = "SELECT COUNT(*) AS `AdCount` FROM ads" . $filter;
		
		if($q == "data")
		{
			$query = "SELECT * FROM ads" .$filter ." ORDER BY created DESC LIMIT " . ($pageIndex * $pageSize) . "," . $pageSize;
		}
		
		$result = mysql_query($query);
		
		$data = array();
		
		$i = 0;
		
		while($row = mysql_fetch_assoc($result)) { 
			 $data["" . $i++] = $row;
		}
		
		mysql_free_result($result);
		mysql_close($con);
		
		echo json_encode($data);
	}
?>