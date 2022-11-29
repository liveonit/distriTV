CREATE TABLE IF NOT EXISTS `mydb`.`Institution` (
  `idInstitucion` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NULL,
  `departamento` VARCHAR(45) NULL,
  `localidad` VARCHAR(45) NULL,
  PRIMARY KEY (`idInstitucion`))
ENGINE = InnoDB;