CREATE TABLE IF NOT EXISTS `mydb`.`television_has_label` (
  `Television_idTelevision` INT NOT NULL,
  `label_idlabel` INT NOT NULL,
  PRIMARY KEY (`Television_idTelevision`, `label_idlabel`),
  INDEX `fk_Television_has_label_label1_idx` (`label_idLabel` ASC) VISIBLE,
  INDEX `fk_Television_has_label_Television1_idx` (`Television_idTelevision` ASC) VISIBLE,
  CONSTRAINT `fk_Television_has_label_Television1`
    FOREIGN KEY (`Television_idTelevision`)
    REFERENCES `mydb`.`Television` (`idTelevision`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Television_has_label_label1`
    FOREIGN KEY (`label_idLabel`)
    REFERENCES `mydb`.`label` (`idLabel`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

