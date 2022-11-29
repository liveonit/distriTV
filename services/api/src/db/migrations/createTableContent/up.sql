CREATE TABLE IF NOT EXISTS `mydb`.`Content` (
  `idContenido` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NULL,
  `tipo` VARCHAR(45) NULL,
  `duracion` INT NULL,
  PRIMARY KEY (`idContenido`))
ENGINE = InnoDB;