CREATE TABLE IF NOT EXISTS `mydb`.`content_has_television` (
  `Content_idContent` INT NOT NULL,
  `Television_idTelevision` INT NOT NULL,
  `fecha_inicio_agenda` DATETIME NOT NULL,
  `fecha_fin_agenda` DATETIME NOT NULL,
  `cron` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`Content_idContent`, `Television_idTelevision`, `fecha_inicio_agenda`, `fecha_fin_agenda`, `cron`),
  INDEX `fk_Content_has_Television_Television1_idx` (`Television_idTelevision` ASC) VISIBLE,
  INDEX `fk_Content_has_Television_Content1_idx` (`Content_idContent` ASC) VISIBLE,
  CONSTRAINT `fk_Content_has_Television_Content1`
    FOREIGN KEY (`Content_idContent`)
    REFERENCES `mydb`.`Content` (`idContent`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Content_has_Television_Television1`
    FOREIGN KEY (`Television_idTelevision`)
    REFERENCES `mydb`.`Television` (`idTelevision`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;