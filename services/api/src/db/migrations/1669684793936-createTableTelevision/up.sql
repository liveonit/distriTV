CREATE TABLE IF NOT EXISTS `television` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `institutionId` INT,
  `alertId` INT NULL,
  `monitorId` INT,
  `ip` VARCHAR(45) NULL,
  `mac` VARCHAR(45) NULL,
  `tvCode` VARCHAR(60) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Television_institution_idx` (`institutionId` ASC) VISIBLE,
  CONSTRAINT `fk_television_institution`
    FOREIGN KEY (`institutionId`)
    REFERENCES `institution` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_television_alert`
    FOREIGN KEY (`alertId`)
    REFERENCES `alert` (`id`)
    ON DELETE CASCADE
    ON UPDATE SET NULL,
  CONSTRAINT `fk_television_monitor`
    FOREIGN KEY (`monitorId`)
    REFERENCES `monitor` (`id`)
    ON DELETE CASCADE
    ON UPDATE SET NULL);
