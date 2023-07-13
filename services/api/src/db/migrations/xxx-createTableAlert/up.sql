CREATE TABLE IF NOT EXISTS `schedule` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `destinationType` VARCHAR(10),
  `televisionId` INT NULL,
  `labelId` INT NULL,
  `text` TEXT NULL,
  `duration` INT NULL,
  `startDate` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_schedule_to_television1_idx` (`televisionId` ASC),
  INDEX `fk_schedule_to_content1_idx` (`contentId` ASC),
  INDEX `fk_schedule_to_label1_idx` (`labelId` ASC),
  CONSTRAINT `fk_alert_to_television1`
    FOREIGN KEY (`televisionId`)
    REFERENCES `television` (`id`)
    ON DELETE CASCADE
  ON UPDATE CASCADE,
  CONSTRAINT `fk_alert_to_label1`
    FOREIGN KEY (`labelId`)
    REFERENCES `label` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);
