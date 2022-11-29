CREATE TABLE IF NOT EXISTS `mydb`.`television_has_notification` (
  `Television_idTelevision` INT NOT NULL,
  `Notification_idNotification` INT NOT NULL,
  PRIMARY KEY (`television_idTelevision`, `notification_idNotification`),
  INDEX `fk_Television_has_Notification_Notification1_idx` (`notification_idNotification` ASC) VISIBLE,
  INDEX `fk_Television_has_Notification_Television1_idx` (`television_idTelevision` ASC) VISIBLE,
  CONSTRAINT `fk_Television_has_Notification_Television1`
    FOREIGN KEY (`television_idTelevision`)
    REFERENCES `mydb`.`Television` (`idTelevision`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Television_has_Notification_Notification1`
    FOREIGN KEY (`notification_idNotification`)
    REFERENCES `mydb`.`Notification` (`idNotification`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
