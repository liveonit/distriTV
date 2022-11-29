CREATE TABLE IF NOT EXISTS `television_has_label` (
  `televisionId` INT NOT NULL,
  `labelId` INT NOT NULL,
  PRIMARY KEY (`televisionId`, `labelId`),
  INDEX `fk_television_has_label_label1_idx` (`labelId` ASC) VISIBLE,
  INDEX `fk_television_has_label_television1_idx` (`televisionId` ASC) VISIBLE,
  CONSTRAINT `fk_television_has_label_television1`
    FOREIGN KEY (`televisionId`)
    REFERENCES `television` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_television_has_label_label1`
    FOREIGN KEY (`labelId`)
    REFERENCES `label` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

