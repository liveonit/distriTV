CREATE TABLE `user` (
  `id` varchar(36) NOT NULL,
  `username` varchar(255) NOT NULL,
  `loginType` ENUM ('local','google') NOT NULL,
  `password` varchar(255),
  `enabled` tinyint NOT NULL,
  `emailVerified` tinyint default 0,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  UNIQUE INDEX `IDX_78a916df40e02a9deb1c4b75ed` (`username`),
  UNIQUE INDEX `IDX_78a916df40e02a9deb1c4b75ab` (`email`),
  PRIMARY KEY (`id`),
  CONSTRAINT CHK_Password CHECK (`loginType`='local' AND `password` IS NOT NULL OR `loginType`='google' AND `password` IS NULL)
);
