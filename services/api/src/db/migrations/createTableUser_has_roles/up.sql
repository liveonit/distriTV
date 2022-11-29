CREATE TABLE `user_has_roles` (
  `userId` varchar(36) NOT NULL,
  `roleId` varchar(36) NOT NULL,
  INDEX `IDX_5f9286e6c25594c6b88c108db7` (`userId`),
  INDEX `IDX_4be2f7adf862634f5f803d246b` (`roleId`),
  PRIMARY KEY (`userId`, `roleId`)
);

ALTER TABLE
  `user_has_roles`
ADD
  CONSTRAINT `FK_5f9286e6c25594c6b88c108db77` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE
  `user_has_roles`
ADD
  CONSTRAINT `FK_4be2f7adf862634f5f803d246b8` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
