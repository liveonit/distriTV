INSERT INTO
  `user`(
    `id`,
    `username`,
    `password`,
    `enabled`,
    `firstName`,
    `lastName`,
    `email`
  )
VALUES
  (
    '06ab86cb-52cf-4b6a-ac19-0d62e0307dc6',
    'admin',
    '$argon2i$v=19$m=4096,t=3,p=1$MTBKRkhlMXlrNU9hVWZBTQ$0++JDeYSWZ0GkXXKgvZMgA',
    1,
    'admin',
    'user',
    'admin@example.com'
  );

INSERT INTO
  `user_has_roles`(`userId`, `roleId`)
VALUES
  (
    '06ab86cb-52cf-4b6a-ac19-0d62e0307dc6',
    '48f76d11-2932-4536-9198-7ce0ce4bb1c7'
  );
INSERT INTO
  `user`(
    `id`,
    `username`,
    `password`,
    `enabled`,
    `firstName`,
    `lastName`,
    `email`
  )
VALUES
  (
    '48f75e89-0f7f-4d82-8c3a-8a2a45ecdd09',
    'user1',
    '$argon2i$v=19$m=4096,t=3,p=1$N0pNbWJzSnZoSk9ubFdJVw$7p4JA2zUyeUurWHSZ1PQ1A',
    1,
    'user1',
    'uno',
    'user1@example.com'
  );

INSERT INTO
  `user_has_roles`(`userId`, `roleId`)
VALUES
  (
    '48f75e89-0f7f-4d82-8c3a-8a2a45ecdd09',
    '7b5ec802-5923-4a1b-b9d1-2f522ad6c6a3'
  );
INSERT INTO
  `user`(
    `id`,
    `username`,
    `password`,
    `enabled`,
    `firstName`,
    `lastName`,
    `email`
  )
VALUES
  (
    'eb273257-f77a-493b-a10b-5f7e874e41c6',
    'user2',
    '$argon2i$v=19$m=4096,t=3,p=1$TEgzU0pBMGswcm5qaVVhNg$U+R7nIGEQDgOPsJpQQejlA',
    1,
    'user',
    'two',
    'usuario2@example.com'
  );
