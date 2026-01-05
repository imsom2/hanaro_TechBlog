-- CreateTable
CREATE TABLE `Category` (
    `id` TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(31) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comment` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `content` TEXT NOT NULL,
    `user` INTEGER UNSIGNED NOT NULL,
    `post` INTEGER UNSIGNED NOT NULL,
    `comment` INTEGER UNSIGNED NOT NULL,

    INDEX `fk_Comment_comment`(`comment`),
    INDEX `fk_Comment_post`(`post`),
    INDEX `fk_Comment_user`(`user`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Likes` (
    `user` INTEGER UNSIGNED NOT NULL,
    `post` INTEGER UNSIGNED NOT NULL,

    INDEX `fk_Like_post`(`post`),
    PRIMARY KEY (`user`, `post`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Post` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `title` VARCHAR(31) NOT NULL,
    `content` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PostCategory` (
    `post` INTEGER UNSIGNED NOT NULL,
    `category` TINYINT UNSIGNED NOT NULL,

    INDEX `fk_PostCategory_category`(`category`),
    PRIMARY KEY (`post`, `category`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StopWord` (
    `value` VARCHAR(31) NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(31) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `image` VARCHAR(255) NULL,
    `passwd` VARCHAR(256) NULL,
    `isadmin` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `uniq_User_email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`user`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`post`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `comment_ibfk_3` FOREIGN KEY (`comment`) REFERENCES `Comment`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Likes` ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`user`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Likes` ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`post`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `PostCategory` ADD CONSTRAINT `postcategory_ibfk_1` FOREIGN KEY (`post`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `PostCategory` ADD CONSTRAINT `postcategory_ibfk_2` FOREIGN KEY (`category`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
