CREATE TABLE IF NOT EXISTS `mydb`.`Auditory` (
  `idAuditory` INT NOT NULL AUTO_INCREMENT,
  `user` VARCHAR(45) NULL,
  `ip_user` VARCHAR(45) NULL,
  `action` VARCHAR(100) NULL,
  `date` DATETIME NULL,
  PRIMARY KEY (`idAuditory`))
ENGINE = InnoDB;