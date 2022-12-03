CREATE TABLE IF NOT EXISTS `television_has_notification` (
  `televisionId` INT NOT NULL,
  `notificationId` INT NOT NULL,
  PRIMARY KEY (`televisionId`, `notificationId`),
  INDEX `fk_television_has_notification_notification1_idx` (`notificationId` ASC) VISIBLE,
  INDEX `fk_television_has_notification_television1_idx` (`televisionId` ASC) VISIBLE,
  CONSTRAINT `fk_television_has_notification_television1`
    FOREIGN KEY (`televisionId`)
    REFERENCES `television` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_television_has_notification_notification1`
    FOREIGN KEY (`notificationId`)
    REFERENCES `notification` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
