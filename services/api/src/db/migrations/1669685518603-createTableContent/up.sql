CREATE TABLE IF NOT EXISTS `content` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `url` VARCHAR(255) NULL,
  `type` VARCHAR(55) NULL,
  `text` TEXT NULL,
  `duration` INT NULL,
  PRIMARY KEY (`id`));
