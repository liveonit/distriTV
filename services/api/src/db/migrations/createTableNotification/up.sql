CREATE TABLE IF NOT EXISTS `mydb`.`Notification` (
  `idNotification` INT NOT NULL AUTO_INCREMENT,
  `mensaje` VARCHAR(100) NULL,
  `titulo` VARCHAR(45) NULL,
  PRIMARY KEY (`idNotification`))
ENGINE = InnoDB;
