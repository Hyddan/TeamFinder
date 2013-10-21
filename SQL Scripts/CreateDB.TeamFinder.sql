-- Create DB
CREATE DATABASE IF NOT EXISTS `db1179530_TeamFinder` CHARACTER SET utf8 COLLATE utf8_general_ci;

/*
-- Create user and priviliges
CREATE USER 'u1179530_tf'@'%' IDENTIFIED BY 'teamfinder';
GRANT ALL PRIVILEGES ON `db1179530_TeamFinder`.* TO 'u1179530_tf'@'%';
FLUSH PRIVILEGES;
*/

-- Create tables
CREATE TABLE IF NOT EXISTS `db1179530_TeamFinder`.`Locations` (
	`Id` INT NOT NULL AUTO_INCREMENT,
	`Description` VARCHAR(5000) NULL,
	`Name` VARCHAR(500) NOT NULL,
	PRIMARY KEY (`Id`)
)
CHARACTER SET utf8 COLLATE utf8_general_ci
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `db1179530_TeamFinder`.`LookingFor` (
	`Id` INT NOT NULL AUTO_INCREMENT,
	`Description` VARCHAR(5000) NULL,
	`Name` VARCHAR(500) NOT NULL,
	PRIMARY KEY (`Id`)
)
CHARACTER SET utf8 COLLATE utf8_general_ci
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `db1179530_TeamFinder`.`Sports` (
	`Id` INT NOT NULL AUTO_INCREMENT,
	`Description` VARCHAR(5000) NULL,
	`Name` VARCHAR(500) NOT NULL,
	PRIMARY KEY (`Id`)
)
CHARACTER SET utf8 COLLATE utf8_general_ci
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `db1179530_TeamFinder`.`Users` (
	`Id` INT NOT NULL AUTO_INCREMENT,
	`BirthDate` TIMESTAMP NULL DEFAULT NULL,
	`CreatedDate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`Description` VARCHAR(5000) NULL,
	`Email` VARCHAR(500) NOT NULL,
	`FirstName` VARCHAR(500) NOT NULL,
	`Gender` VARCHAR(50) NULL,
	`LastName` VARCHAR(500) NOT NULL,
	`Password` VARCHAR(500) NULL,
	`PictureUrl` VARCHAR(500) NULL,
	`Salt` VARCHAR(500) NULL,
	`SessionId` VARCHAR(500) NULL,
	`UserName` VARCHAR(500) NULL,
	PRIMARY KEY (`Id`)
)
CHARACTER SET utf8 COLLATE utf8_general_ci
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `db1179530_TeamFinder`.`Ads` (
	`Id` INT NOT NULL AUTO_INCREMENT,
	`CreatedDate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`Deleted` BOOLEAN NOT NULL DEFAULT FALSE,
	`Description` VARCHAR(5000) NULL,
	`Headline` VARCHAR(500) NULL,
	`LocationId` INT NOT NULL,
	`LookingForId` INT NOT NULL,
	`SportId` INT NOT NULL,
	`UserId` INT NOT NULL,
	PRIMARY KEY (`Id`),
	CONSTRAINT `FK_Ads_Locations`
		FOREIGN KEY `FK_Ads_Locations` (`LocationId`) REFERENCES `db1179530_TeamFinder`.`Locations` (`Id`)
			ON DELETE NO ACTION
			ON UPDATE NO ACTION,
	CONSTRAINT `FK_Ads_LookingFor`
		FOREIGN KEY `FK_Ads_LookingFor` (`LookingForId`) REFERENCES `db1179530_TeamFinder`.`LookingFor` (`Id`)
			ON DELETE NO ACTION
			ON UPDATE NO ACTION,
	CONSTRAINT `FK_Ads_Sports`
		FOREIGN KEY `FK_Ads_Sports` (`SportId`) REFERENCES `db1179530_TeamFinder`.`Sports` (`Id`)
			ON DELETE NO ACTION
			ON UPDATE NO ACTION,
	CONSTRAINT `FK_Ads_Users`
		FOREIGN KEY `FK_Ads_Users` (`UserId`) REFERENCES `db1179530_TeamFinder`.`Users` (`Id`)
			ON DELETE NO ACTION
			ON UPDATE NO ACTION
)
CHARACTER SET utf8 COLLATE utf8_general_ci
ENGINE = InnoDB;

-- Fill "static" tables
INSERT INTO `db1179530_TeamFinder`.`Locations` (`Description`, `Name`) VALUES ('Stockholm', 'Stockholm');
INSERT INTO `db1179530_TeamFinder`.`Locations` (`Description`, `Name`) VALUES ('Sundsvall', 'Sundsvall');
INSERT INTO `db1179530_TeamFinder`.`Locations` (`Description`, `Name`) VALUES ('Uppsala', 'Uppsala');
INSERT INTO `db1179530_TeamFinder`.`Locations` (`Description`, `Name`) VALUES ('Linköping', 'Linköping');

INSERT INTO `db1179530_TeamFinder`.`LookingFor` (`Description`, `Name`) VALUES ('Player', 'Player');
INSERT INTO `db1179530_TeamFinder`.`LookingFor` (`Description`, `Name`) VALUES ('Team', 'Team');
INSERT INTO `db1179530_TeamFinder`.`LookingFor` (`Description`, `Name`) VALUES ('Opponent', 'Opponent');

INSERT INTO `db1179530_TeamFinder`.`Sports` (`Description`, `Name`) VALUES ('Floorball', 'Floorball');
INSERT INTO `db1179530_TeamFinder`.`Sports` (`Description`, `Name`) VALUES ('Soccer', 'Soccer');
INSERT INTO `db1179530_TeamFinder`.`Sports` (`Description`, `Name`) VALUES ('Basketball', 'Basketball');
INSERT INTO `db1179530_TeamFinder`.`Sports` (`Description`, `Name`) VALUES ('Hockey', 'Hockey');
INSERT INTO `db1179530_TeamFinder`.`Sports` (`Description`, `Name`) VALUES ('Squash', 'Squash');

INSERT INTO `db1179530_TeamFinder`.`Users` (`BirthDate`, `Description`, `Email`, `FirstName`, `Gender`, `LastName`, `Password`, `PictureUrl`, `Salt`, `SessionId`, `UserName`)
	VALUES ('1987-09-28', 'System Developer & Ball sport enthusiast', 'daniel.hedenius@gmail.com', 'Daniel', 'Male', 'Hedenius', 'asdf', null, 'asdf', null, 'hyddan');

INSERT INTO `db1179530_TeamFinder`.`Ads` (`Description`, `Headline`, `LocationId`, `LookingForId`, `SportId`, `UserId`)
	VALUES ('Some Description', 'Some Headline', 1, 1, 1, 1);
INSERT INTO `db1179530_TeamFinder`.`Ads` (`Description`, `Headline`, `LocationId`, `LookingForId`, `SportId`, `UserId`)
	VALUES ('Some Description', 'Some Headline', 2, 3, 5, 1);
INSERT INTO `db1179530_TeamFinder`.`Ads` (`Description`, `Headline`, `LocationId`, `LookingForId`, `SportId`, `UserId`)
	VALUES ('Some Description', 'Some Headline', 3, 2, 2, 1);
INSERT INTO `db1179530_TeamFinder`.`Ads` (`Description`, `Headline`, `LocationId`, `LookingForId`, `SportId`, `UserId`)
	VALUES ('Some Description', 'Some Headline', 1, 2, 2, 1);
INSERT INTO `db1179530_TeamFinder`.`Ads` (`Description`, `Headline`, `LocationId`, `LookingForId`, `SportId`, `UserId`)
	VALUES ('Some Description', 'Some Headline', 1, 1, 4, 1);