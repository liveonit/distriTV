CREATE TABLE IF NOT EXISTS `mydb`.`Television` (
  `idTelevision` INT NOT NULL AUTO_INCREMENT,
  `institucion_idInstitucion` INT NOT NULL,
  `ip` VARCHAR(45) NULL,
  `mac` VARCHAR(45) NULL,
  PRIMARY KEY (`idTelevision`),
  INDEX `fk_Television_Institucion_idx` (`Institucion_idInstitucion` ASC) VISIBLE,
  CONSTRAINT `fk_Television_Institucion`
    FOREIGN KEY (`institucion_idInstitucion`)
    REFERENCES `mydb`.`Institucion` (`idInstitucion`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;