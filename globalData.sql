CREATE TABLE `guild` ( `v_id` VARCHAR(18) NOT NULL , `v_language` VARCHAR(2) NULL , `v_actionAdd` VARCHAR(100) NOT NULL DEFAULT '[]' , `v_actionRemove` VARCHAR(100) NOT NULL DEFAULT '[]' , `v_data` VARCHAR(1000) NOT NULL DEFAULT '{}' , `t_deleteifempty` TINYINT(4) NOT NULL DEFAULT '0' , PRIMARY KEY (`v_id`)) ENGINE = InnoDB;

CREATE TABLE `category` ( `v_id` VARCHAR(18) NOT NULL , `v_idGuild` VARCHAR(18) NOT NULL , `v_type` VARCHAR(15) NULL , `t_deleteifempty` TINYINT(1) NOT NULL , PRIMARY KEY (`v_id`)) ENGINE = InnoDB;

CREATE TABLE `textchannel` ( `v_id` VARCHAR(18) NOT NULL , `v_idGuild` VARCHAR(18) NOT NULL , `v_type` VARCHAR(25) NOT NULL , `v_language` VARCHAR(2) NULL , `v_data` VARCHAR(1000) NOT NULL DEFAULT '{}' , PRIMARY KEY (`v_id`)) ENGINE = InnoDB;

CREATE TABLE `message` ( `v_id` VARCHAR(18) NOT NULL , `v_idChannel` VARCHAR(18) NOT NULL , `v_idGuild` VARCHAR(18) NOT NULL , `v_language` VARCHAR(2) NULL , `v_category_mess` VARCHAR(20) NOT NULL , `v_type_mess` VARCHAR(20) NOT NULL , `v_name_mess` VARCHAR(20) NOT NULL , `v_emoji` VARCHAR(50) NOT NULL DEFAULT '[]' , `v_type` VARCHAR(100) NOT NULL DEFAULT '[]' , `v_data` VARCHAR(1000) NOT NULL DEFAULT '{}' , PRIMARY KEY (`v_id`)) ENGINE = InnoDB;

CREATE TABLE `invite` ( `v_code` VARCHAR(16) NOT NULL , `v_idGuild` VARCHAR(18) NOT NULL , `v_actionAdd` VARCHAR(100) NOT NULL DEFAULT '[]' , `i_uses` INT(10) NOT NULL DEFAULT 0 , `v_data` VARCHAR(1000) NOT NULL DEFAULT ' {}' , PRIMARY KEY (`v_code`)) ENGINE = InnoDB;

CREATE TABLE `guildMembers` ( `i_id` INT(5) NOT NULL AUTO_INCREMENT , `v_idUser` VARCHAR(18) NOT NULL , `v_idGuild` VARCHAR(18) NOT NULL , `t_allowedSpecialChannel` TINYINT NOT NULL , `t_muted` TINYINT NOT NULL DEFAULT '0' , `v_language` VARCHAR(2) NULL , `v_data` VARCHAR(500) NOT NULL DEFAULT '{}' , PRIMARY KEY (`i_id`)) ENGINE = InnoDB;

CREATE TABLE `user` ( `v_id` VARCHAR(18) NOT NULL , `v_language` VARCHAR(2) NULL , `t_isbot` TINYINT NOT NULL , `v_data` VARCHAR(1000) NOT NULL DEFAULT '{}' , PRIMARY KEY (`v_id`)) ENGINE = InnoDB;

CREATE TABLE `specialVoiceChannel` ( `id` VARCHAR(18) NOT NULL , `type` VARCHAR(25) NOT NULL , `data` VARCHAR(1000) NOT NULL DEFAULT '{}' , PRIMARY KEY (`id`)) ENGINE = InnoDB;

CREATE TABLE `musicTag` ( `i_id` INT NOT NULL AUTO_INCREMENT , `v_name` VARCHAR(25) NOT NULL , `v_emoji` VARCHAR(25) NOT NULL , `i_user` INT(18) DEFAULT NULL , `b_enable` BOOLEAN NOT NULL , `v_data` VARCHAR(500) NOT NULL DEFAULT '{}' , PRIMARY KEY (`i_id`)) ENGINE = InnoDB;

CREATE TABLE `musicsList` ( `i_id` INT(6) NOT NULL AUTO_INCREMENT , `v_tagName` VARCHAR(12) NOT NULL unique, PRIMARY KEY (`i_id`)) ENGINE = InnoDB;

CREATE TABLE `musicsCorrelation` ( `i_id` INT NOT NULL AUTO_INCREMENT , `i_idTag` INT(3) NOT NULL , `i_idMusic` INT(6) NOT NULL , PRIMARY KEY (`i_id`)) ENGINE = InnoDB;

CREATE TABLE `playlist` ( `i_id` INT NOT NULL AUTO_INCREMENT , `i_user` VARCHAR(18) NOT NULL , `v_name` VARCHAR(25) NOT NULL , `v_tag` VARCHAR(34) NOT NULL , PRIMARY KEY (`i_id`)) ENGINE = InnoDB;