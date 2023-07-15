CREATE TABLE IF NOT EXISTS `alert` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `labelId` INT NULL,
  `destinationType` VARCHAR(10),
  `text` TEXT NULL,
  `duration` INT NULL,
  `durationLeft` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_alert_to_label1_idx` (`labelId` ASC),
  CONSTRAINT `fk_alert_to_label1`
    FOREIGN KEY (`labelId`)
    REFERENCES `label` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);