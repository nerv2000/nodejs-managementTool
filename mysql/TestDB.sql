/*
SQLyog Community v13.1.0 (64 bit)
MySQL - 5.7.23-0ubuntu0.16.04.1 : Database - TestDB
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`TestDB` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `TestDB`;

/*Table structure for table `tblAdmin` */

DROP TABLE IF EXISTS `tblAdmin`;

CREATE TABLE `tblAdmin` (
  `adminNo` int(11) NOT NULL AUTO_INCREMENT COMMENT '관리자 계정 고유번호',
  `accountId` varchar(256) NOT NULL COMMENT '관리가 계정',
  `pw` varchar(256) NOT NULL COMMENT '암호',
  `createDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성날짜',
  PRIMARY KEY (`adminNo`),
  UNIQUE KEY `accountId_unique` (`accountId`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

/*Table structure for table `tblUser` */

DROP TABLE IF EXISTS `tblUser`;

CREATE TABLE `tblUser` (
  `userNo` int(11) NOT NULL AUTO_INCREMENT COMMENT '유저 고유 번호',
  `nickName` char(255) NOT NULL COMMENT '닉네임',
  `userLv` smallint(6) NOT NULL COMMENT '유저레벨',
  `createDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '유저 생성 날짜',
  PRIMARY KEY (`userNo`),
  UNIQUE KEY `nickName_unique` (`nickName`)
) ENGINE=MyISAM AUTO_INCREMENT=34 DEFAULT CHARSET=utf8;

/*Data for the table `tblUser` */

insert  into `tblUser`(`userNo`,`nickName`,`userLv`,`createDate`) values 
(1,'개똥이',1,'2018-08-13 15:09:40'),
(2,'소똥이',10,'2018-08-13 15:10:04'),
(3,'말똥이',2,'2018-08-13 15:10:04'),
(4,'나는전설이다',11,'2018-08-13 15:10:04'),
(5,'내칼을받아라',16,'2018-08-13 15:10:04'),
(6,'테스트요원',5,'2018-08-13 15:10:04'),
(7,'일하고싶다',2,'2018-08-13 15:10:04'),
(8,'아프다살살',13,'2018-08-13 15:10:04'),
(9,'너때릴꺼야',1,'2018-08-13 15:10:04'),
(10,'비번을까먹었다',1,'2018-08-13 15:11:15'),
(11,'누구냐넌',2,'2018-08-13 15:11:41'),

/* Procedure structure for procedure `uspAdminCreate` */

/*!50003 DROP PROCEDURE IF EXISTS  `uspAdminCreate` */;

DELIMITER $$

/*!50003 CREATE PROCEDURE `uspAdminCreate`(
	IN `_accountId` varchar(255),
	IN `_pw` varchar(255) ,
	IN `_key` VARCHAR(128)
)
    COMMENT '관리 계정 추가'
BEGIN
	DECLARE error INT DEFAULT 0;
	
	#insert 실패시 에러 처리 
	DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET error=-1;

	INSERT INTO tblAdmin(accountId, pw) 
	VALUES(_accountId, hex(AES_ENCRYPT(_pw, CONCAT(_pw, _key))));
	
	SELECT error;
END */$$
DELIMITER ;

/* Procedure structure for procedure `uspAdminLoginCheck` */

/*!50003 DROP PROCEDURE IF EXISTS  `uspAdminLoginCheck` */;

DELIMITER $$

/*!50003 CREATE PROCEDURE `uspAdminLoginCheck`(
    	IN `_accountId` VARCHAR(255),
	IN `_pw` VARCHAR(255) ,
	IN `_key` VARCHAR(128)
    )
    COMMENT '관리 계정 로그인체크'
BEGIN
	DECLARE error INT;
	SET error = 0;
	SET @tempAdminNo=NULL;
	SET @tempPw=NULL;
	
	SELECT @tempAdminNo:=adminNo, @tempPw:=pw
	FROM tblAdmin 
	WHERE accountId = _accountId; 
	
	if (@tempAdminNo IS NULL) THEN
	   SET error = -1;	# 계정없음
	ELSEIF (AES_DECRYPT(UNHEX(@tempPw), CONCAT(_pw, _key)) IS NULL) THEN 
	   SET error = -2;	# 비번틀림
	END IF;
	
	SELECT error;
END */$$
DELIMITER ;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
