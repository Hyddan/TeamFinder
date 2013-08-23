<?php
	//Includes
	require_once '../bin/setupDataConnection.php';
	require_once '../bin/entities.php';
	
	//Set parameters
	$q = isset($_GET["q"]) ? $_GET["q"] : null;
	$class = ("locations" == $q ? "Location" : ("lookingFor" == $q ? "LookingFor" : ("sports" == $q ? "Sport" : null)));
	
	if(null == $class)
	{
		echo "{}";
	}
	else
	{
		$query = "SELECT * FROM `" . ucfirst($q) . "` ORDER BY `Name` ASC";
		
		$data = array();
		mysqli_query($connection, "SET CHARACTER SET 'utf8'");
		if($result = mysqli_query($connection, $query)) {
			$i = 0;
			while($row = mysqli_fetch_assoc($result)) {
				 $data["" . $i++] = new $class($row["Id"], $row["Description"], $row["Name"]);
			}
			
			mysqli_free_result($result);
		}
		
		//Close DB Connection	
		mysqli_close($connection);
		
		header("Content-Type: application/json; charset=utf-8", true);
		echo json_encode(array("type" => $q, "items" => $data), true);
	}
?>