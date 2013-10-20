<?php
	//Includes
	require_once "../bin/teamFinder.php";
	require_once "../bin/entities.php";
	require_once "../bin/repositories.php";
	
	//Set parameters
	$pageIndex	=	isset($_GET["pageIndex"]) ? (int) $_GET["pageIndex"] : null;
	$pageSize	=	isset($_GET["pageSize"]) ? (int) $_GET["pageSize"] : null;
	$q 			=	isset($_GET["q"]) ? $_GET["q"] : null;
	$loc 		=	isset($_GET["loc"]) ? $_GET["loc"] : null;
	$lf 		=	isset($_GET["lf"]) ? $_GET["lf"] : null;
	$s			=	isset($_GET["s"]) ? $_GET["s"] : null;
	$i			=	isset($_GET["i"]) ? (int) $_GET["i"] : null;
	$filter 	=	TeamFinder::getFilter($loc, $lf, $s);
	
	header("Content-Type: application/json; charset=utf-8", true);
	if (("count" != $q && "data" != $q && "specific" != $q) || null == $filter)
	{
		echo "{}";
	}
	else if ("specific" == $q && is_numeric($i))
	{
		$ad = AdRepository::GetById($i);
		
		echo null != $ad ? json_encode($ad) : "{}";
	}
	else
	{
		if (!is_numeric($pageSize))
		{
			$pageSize = 50;
		}
		
		$data = array();
		if ("count" == $q)
		{
			$data[0] = new stdClass();
			$data[0]->AdCount = AdRepository::GetCount($filter);
		}		
		else if ("data" == $q)
		{
			$data = AdRepository::Find($filter, $pageIndex, $pageSize);
		}
		
		echo null != $data ? json_encode($data) : "{}";
	}
?>