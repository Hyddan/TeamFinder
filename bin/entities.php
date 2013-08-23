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
		var $Gender;
		var $Name;
		var $PictureUrl;
		var $SessionId;
		
		function __construct($Id, $Age, $CreatedDate, $Description, $Email, $Gender, $Name, $PictureUrl, $SessionId)
		{
			$this->Id = $Id;
			$this->Age = $Age;
			$this->CreatedDate = $CreatedDate;
			$this->Description = $Description;
			$this->Email = $Email;
			$this->Gender = $Gender;
			$this->Name = $Name;
			$this->PictureUrl = $PictureUrl;
			$this->SessionId = $SessionId;
		}
	}
?>