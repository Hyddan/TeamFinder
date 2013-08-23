-- Create DB
CREATE DATABASE IF NOT EXISTS `TeamFinder` CHARACTER SET utf8 COLLATE utf8_general_ci;

/*
-- Create user and priviliges
CREATE USER 'teamfinder'@'localhost' IDENTIFIED BY 'teamfinder';
GRANT ALL PRIVILEGES ON teamfinder.* TO 'teamfinder'@'localhost';
FLUSH PRIVILEGES;
*/

-- Create tables
CREATE TABLE IF NOT EXISTS `TeamFinder`.`Locations` (
	`Id` INT NOT NULL AUTO_INCREMENT,
	`Description` VARCHAR(5000) NULL,
	`Name` VARCHAR(500) NOT NULL,
	PRIMARY KEY (`Id`)
)
CHARACTER SET utf8 COLLATE utf8_general_ci
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `TeamFinder`.`LookingFor` (
	`Id` INT NOT NULL AUTO_INCREMENT,
	`Description` VARCHAR(5000) NULL,
	`Name` VARCHAR(500) NOT NULL,
	PRIMARY KEY (`Id`)
)
CHARACTER SET utf8 COLLATE utf8_general_ci
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `TeamFinder`.`Sports` (
	`Id` INT NOT NULL AUTO_INCREMENT,
	`Description` VARCHAR(5000) NULL,
	`Name` VARCHAR(500) NOT NULL,
	PRIMARY KEY (`Id`)
)
CHARACTER SET utf8 COLLATE utf8_general_ci
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `TeamFinder`.`Users` (
	`Id` INT NOT NULL AUTO_INCREMENT,
	`Age` INT NULL,
	`CreatedDate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`Description` VARCHAR(5000) NULL,
	`Email` VARCHAR(500) NOT NULL,
	`Gender` VARCHAR(50) NULL,
	`Name` VARCHAR(500) NOT NULL,
	`Password` VARCHAR(500) NOT NULL,
	`PictureUrl` VARCHAR(500) NULL,
	`SessionId` VARCHAR(500) NULL,
	PRIMARY KEY (`Id`)
)
CHARACTER SET utf8 COLLATE utf8_general_ci
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `TeamFinder`.`Ads` (
	`Id` INT NOT NULL AUTO_INCREMENT,
	`CreatedDate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`Description` VARCHAR(5000) NULL,
	`Headline` VARCHAR(500) NULL,
	`LocationId` INT NOT NULL,
	`LookingForId` INT NOT NULL,
	`SportId` INT NOT NULL,
	`UserId` INT NOT NULL,
	PRIMARY KEY (`Id`),
	CONSTRAINT `FK_Ads_Locations`
		FOREIGN KEY `FK_Ads_Locations` (`LocationId`) REFERENCES `TeamFinder`.`Locations` (`Id`)
			ON DELETE NO ACTION
			ON UPDATE NO ACTION,
	CONSTRAINT `FK_Ads_LookingFor`
		FOREIGN KEY `FK_Ads_LookingFor` (`LookingForId`) REFERENCES `TeamFinder`.`LookingFor` (`Id`)
			ON DELETE NO ACTION
			ON UPDATE NO ACTION,
	CONSTRAINT `FK_Ads_Sports`
		FOREIGN KEY `FK_Ads_Sports` (`SportId`) REFERENCES `TeamFinder`.`Sports` (`Id`)
			ON DELETE NO ACTION
			ON UPDATE NO ACTION,
	CONSTRAINT `FK_Ads_Users`
		FOREIGN KEY `FK_Ads_Users` (`UserId`) REFERENCES `TeamFinder`.`Users` (`Id`)
			ON DELETE NO ACTION
			ON UPDATE NO ACTION
)
CHARACTER SET utf8 COLLATE utf8_general_ci
ENGINE = InnoDB;

-- Fill "static" tables
INSERT INTO `TeamFinder`.`Locations` (`Description`, `Name`) VALUES ('Stockholm', 'Stockholm');
INSERT INTO `TeamFinder`.`Locations` (`Description`, `Name`) VALUES ('Uppsala', 'Uppsala');
INSERT INTO `TeamFinder`.`Locations` (`Description`, `Name`) VALUES ('Sundsvall', 'Sundsvall');
INSERT INTO `TeamFinder`.`Locations` (`Description`, `Name`) VALUES ('Linköping', 'Linköping');

INSERT INTO `TeamFinder`.`LookingFor` (`Description`, `Name`) VALUES ('Player', 'Player');
INSERT INTO `TeamFinder`.`LookingFor` (`Description`, `Name`) VALUES ('Team', 'Team');
INSERT INTO `TeamFinder`.`LookingFor` (`Description`, `Name`) VALUES ('Opponent', 'Opponent');

INSERT INTO `TeamFinder`.`Sports` (`Description`, `Name`) VALUES ('Floorball', 'Floorball');
INSERT INTO `TeamFinder`.`Sports` (`Description`, `Name`) VALUES ('Soccer', 'Soccer');
INSERT INTO `TeamFinder`.`Sports` (`Description`, `Name`) VALUES ('Basketball', 'Basketball');
INSERT INTO `TeamFinder`.`Sports` (`Description`, `Name`) VALUES ('Hockey', 'Hockey');
INSERT INTO `TeamFinder`.`Sports` (`Description`, `Name`) VALUES ('Squash', 'Squash');

INSERT INTO `TeamFinder`.`Users` (`Age`, `Description`, `Email`, `Gender`, `Name`, `Password`, `PictureUrl`)
	VALUES (25, 'System Developer & Ball sport enthusiast', 'daniel.hedenius@gmail.com', 'Male', 'Daniel Hedenius', 'asdf', null);

INSERT INTO `TeamFinder`.`Ads` (`Description`, `Headline`, `LocationId`, `LookingForId`, `SportId`, `UserId`)
	VALUES ('Some Description', 'Some Headline', 1, 1, 1, 1);
INSERT INTO `TeamFinder`.`Ads` (`Description`, `Headline`, `LocationId`, `LookingForId`, `SportId`, `UserId`)
	VALUES ('Some Description', 'Some Headline', 2, 3, 5, 1);
INSERT INTO `TeamFinder`.`Ads` (`Description`, `Headline`, `LocationId`, `LookingForId`, `SportId`, `UserId`)
	VALUES ('Some Description', 'Some Headline', 3, 2, 2, 1);
INSERT INTO `TeamFinder`.`Ads` (`Description`, `Headline`, `LocationId`, `LookingForId`, `SportId`, `UserId`)
	VALUES ('Some Description', 'Some Headline', 1, 2, 2, 1);
INSERT INTO `TeamFinder`.`Ads` (`Description`, `Headline`, `LocationId`, `LookingForId`, `SportId`, `UserId`)
	VALUES ('Some Description', 'Some Headline', 1, 1, 4, 1);