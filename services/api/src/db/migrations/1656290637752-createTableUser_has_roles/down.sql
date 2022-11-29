ALTER TABLE
  `user_has_roles` DROP FOREIGN KEY (`userId`);

ALTER TABLE
  `user_has_roles` DROP FOREIGN KEY (`roleId`);

DROP TABLE `user_has_roles`;
