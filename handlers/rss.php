<?php
	//Includes
	require_once "../lib/universalFeedGenerator/FeedWriter.php";
	require_once "../bin/repositories.php";
	
	date_default_timezone_set("UTC");
	
	$rssFeed = new FeedWriter(RSS2);
	$rssFeed->setTitle("TeamFinder");
	$rssFeed->setLink("http://teamfinder.se/");
	$rssFeed->setDescription("Displaying the 20 latest ads from http://teamfinder.se/");
	$rssFeed->setChannelElement("pubDate", date(DATE_RSS, time()));

	$rssFeed->setImage("TeamFinder","http://teamfinder.se/","http://teamfinder.se/images/logo.png");

	$adArray = AdRepository::Find(null, 0, 20);
	foreach ($adArray as $index => $ad) 
	{
		$adItem = $rssFeed->createNewItem();
		$adItem->setTitle($ad->Headline);
		$adItem->setLink("http://teamfinder.se/listAds.html?i=" . $ad->Id);
		$adItem->setDate($ad->CreatedDate);
		$adItem->setDescription($ad->Description);
		$adItem->addElement("location", $ad->Location->Name);
		$adItem->addElement("lookingFor", $ad->LookingFor->Name);
		$adItem->addElement("sport", $ad->Sport->Name);
		
		$rssFeed->addItem($newItem);
	}

	$rssFeed->genarateFeed();
?>
