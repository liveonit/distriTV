CREATE TABLE IF NOT EXISTS `schedule` (
  `id` varchar(36) NOT NULL,
  `contentId` INT NOT NULL,
  `televisionId` INT NULL,
  `labelId` INT NULL,
  `startDate` DATETIME NOT NULL,
  `endDate` DATETIME NOT NULL,
  `cron` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_schedule_to_television1_idx` (`televisionId` ASC),
  INDEX `fk_schedule_to_content1_idx` (`contentId` ASC),
  INDEX `fk_schedule_to_label1_idx` (`labelId` ASC),
  CONSTRAINT `fk_schedule_to_content1`
    FOREIGN KEY (`contentId`)
    REFERENCES `content` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_schedule_to_television1`
    FOREIGN KEY (`televisionId`)
    REFERENCES `television` (`id`)
    ON DELETE CASCADE
  ON UPDATE CASCADE,
  CONSTRAINT `fk_schedule_to_label1`
    FOREIGN KEY (`labelId`)
    REFERENCES `label` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);
