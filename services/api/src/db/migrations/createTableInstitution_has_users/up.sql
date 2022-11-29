CREATE TABLE IF NOT EXISTS `institution_has_users` (
  `institutionId` INT NOT NULL,
  `userId` varchar(36) NOT NULL,
  `rol` VARCHAR(45) NULL,
  PRIMARY KEY (`userId`, `institutionId`),
  INDEX `fk_institucion_has_users_user1_idx` (`userId` ASC) VISIBLE,
  INDEX `fk_institucion_has_users_institution1_idx` (`institutionId` ASC) VISIBLE,
  CONSTRAINT `fk_institucion_has_users_institution1`
    FOREIGN KEY (`institutionId`)
    REFERENCES `institution` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_institucion_has_users_user1`
    FOREIGN KEY (`userId`)
    REFERENCES `user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
