<?php
	class Ad
	{
		var $Id;
		var $CreatedDate;
		var $Description;
		var $Headline;
		var $Location;
		var $LookingFor;
		var $Sport;
		var $User;
		
		function __construct($Id, $CreatedDate, $Description, $Headline, $Location, $LookingFor, $Sport, $User)
		{
			$this->Id = $Id;
			$this->CreatedDate = $CreatedDate;
			$this->Description = $Description;
			$this->Headline = $Headline;
			$this->Location = $Location;
			$this->LookingFor = $LookingFor;
			$this->Sport = $Sport;
			$this->User = $User;
		}
	}
	
	class Location
	{
		var $Id;
		var $Description;
		var $Name;
		
		function __construct($Id, $Description, $Name)
		{
			$this->Id = $Id;
			$this->Description = $Description;
			$this->Name = $Name;
		}
	}
	
	class LookingFor
	{
		var $Id;
		var $Description;
		var $Name;
		
		function __construct($Id, $Description, $Name)
		{
			$this->Id = $Id;
			$this->Description = $Description;
			$this->Name = $Name;
		}
	}
	
	class Sport
	{
		var $Id;
		var $Description;
		var $Name;
		
		function __construct($Id, $Description, $Name)
		{
			$this->Id = $Id;
			$this->Description = $Description;
			$this->Name = $Name;
		}
	}
	
	class User
	{
		var $Id;
		var $Age;
		var $CreatedDate;
		var $Description;
		var $Email;
		var $FirstName;
		var $Gender;
		var $LastName;
		var $PictureUrl;
		var $SessionId;
		var $UserName;
		
		function __construct($Id, $Age, $CreatedDate, $Description, $Email, $FirstName, $Gender, $LastName, $PictureUrl, $SessionId, $UserName)
		{
			$this->Id = $Id;
			$this->Age = $Age;
			$this->CreatedDate = $CreatedDate;
			$this->Description = $Description;
			$this->Email = $Email;
			$this->FirstName = $FirstName;
			$this->Gender = $Gender;
			$this->LastName = $LastName;
			$this->PictureUrl = $PictureUrl;
			$this->SessionId = $SessionId;
			$this->UserName = $UserName;
		}
	}
?>