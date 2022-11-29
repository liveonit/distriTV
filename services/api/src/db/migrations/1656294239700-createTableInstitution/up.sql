CREATE TABLE IF NOT EXISTS `institution` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `city` VARCHAR(45),
  `locality` VARCHAR(45),
  PRIMARY KEY (`id`));
