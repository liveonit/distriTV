CREATE TABLE IF NOT EXISTS `content_has_television` (
  `contentId` INT NOT NULL,
  `televisionId` INT NOT NULL,
  `startDate` DATETIME NOT NULL,
  `endDate` DATETIME NOT NULL,
  `cron` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`contentId`, `televisionId`, `startDate`, `endDate`, `cron`),
  INDEX `fk_content_has_television_television1_idx` (`televisionId` ASC) VISIBLE,
  INDEX `fk_content_has_television_content1_idx` (`contentId` ASC) VISIBLE,
  CONSTRAINT `fk_content_has_television_content1`
    FOREIGN KEY (`contentId`)
    REFERENCES `content` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_content_has_television_television1`
    FOREIGN KEY (`televisionId`)
    REFERENCES `television` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);
