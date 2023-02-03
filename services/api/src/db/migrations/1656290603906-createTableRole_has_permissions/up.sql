CREATE TABLE `role_has_permissions` (
  `roleId` varchar(36) NOT NULL,
  `permissionId` varchar(36) NOT NULL,
  INDEX `IDX_b36cb2e04bc353ca4ede00d87b` (`roleId`),
  INDEX `IDX_bfbc9e263d4cea6d7a8c9eb3ad` (`permissionId`),
  PRIMARY KEY (`roleId`, `permissionId`)
);

ALTER TABLE
  `role_has_permissions`
ADD
  CONSTRAINT `FK_5f9286e6c25594c6b88c111db66` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE
  `role_has_permissions`
ADD
  CONSTRAINT `FK_4be2f7adf862634f5f234d24678` FOREIGN KEY (`permissionId`) REFERENCES `permission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
