CREATE TABLE IF NOT EXISTS `television` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `institutionId` INT,
  `ip` VARCHAR(45) NULL,
  `mac` VARCHAR(45) NULL,
  `tvCode` VARCHAR(60) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Television_institution_idx` (`institutionId` ASC) VISIBLE,
  CONSTRAINT `fk_television_institution`
    FOREIGN KEY (`institutionId`)
    REFERENCES `institution` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
