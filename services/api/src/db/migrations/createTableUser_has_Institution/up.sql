CREATE TABLE IF NOT EXISTS `mydb`.`user_has_institution` (
  `user_idUser` INT NOT NULL,
  `institution_idInstitution` INT NOT NULL,
  `Rol` VARCHAR(45) NULL,
  PRIMARY KEY (`user_idUser`, `institution_idInstitution`),
  INDEX `fk_user_has_institution_institution1_idx` (`institution_idInstitution` ASC) VISIBLE,
  INDEX `fk_user_has_institution_user1_idx` (`user_iduser` ASC) VISIBLE,
  CONSTRAINT `fk_user_has_institution_user1`
    FOREIGN KEY (`user_idUser`)
    REFERENCES `mydb`.`user` (`idUser`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_has_institution_institution1`
    FOREIGN KEY (`institution_idInstitution`)
    REFERENCES `mydb`.`institution` (`idInstitution`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
