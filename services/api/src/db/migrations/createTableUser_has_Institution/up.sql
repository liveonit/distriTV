CREATE TABLE IF NOT EXISTS `user_has_institution` (
  `userId` varchar(36) NOT NULL,
  `institutionId` INT NOT NULL,
  `Rol` VARCHAR(45) NULL,
  PRIMARY KEY (`userId`, `institutionId`),
  INDEX `fk_user_has_institution_institution1_idx` (`institutionId` ASC) VISIBLE,
  INDEX `fk_user_has_institution_user1_idx` (`userId` ASC) VISIBLE,
  CONSTRAINT `fk_user_has_institution_user1`
    FOREIGN KEY (`userId`)
    REFERENCES `user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_has_institution_institution1`
    FOREIGN KEY (`institutionId`)
    REFERENCES `institution` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
