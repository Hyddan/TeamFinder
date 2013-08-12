<?php 
	$host = "localhost";
	$user = "root";
	$pass = "vasaloppet";

	$databaseName = "team";
	$tablename = 'ads';

	//$con = mysql_connect($host,$user,$pass);
	//$dbs = mysql_select_db($databaseName, $con);
		
	$q = $_GET["q"];
	
	if($q != "sports" && $q != "cities" && $q != "lookingFor")
	{
		echo "{}";
	}
	else
	{
		$query = "SELECT '" . $q . "' AS `type`, name AS `value` FROM " . $q . " ORDER BY name ASC";
		
		mysql_query("SET CHARACTER SET 'utf8'");
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