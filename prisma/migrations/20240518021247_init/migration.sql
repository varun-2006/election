-- CreateTable
CREATE TABLE `Election` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `complete` BOOLEAN NOT NULL DEFAULT false,
    `filters` JSON NOT NULL,

    UNIQUE INDEX `Election_id_key`(`id`),
    INDEX `Election_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    INDEX `Account_userId_idx`(`userId`),
    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_sessionToken_key`(`sessionToken`),
    INDEX `Session_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `emailVerified` DATETIME(3) NULL,
    `image` VARCHAR(191) NULL,

    UNIQUE INDEX `Admin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerificationToken` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VerificationToken_token_key`(`token`),
    UNIQUE INDEX `VerificationToken_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Teacher` (
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Teacher_email_key`(`email`),
    INDEX `Teacher_email_idx`(`email`),
    PRIMARY KEY (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Student` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `house` VARCHAR(191) NOT NULL,
    `std` INTEGER NOT NULL,
    `section` VARCHAR(191) NOT NULL,
    `rollNo` INTEGER NOT NULL,
    `image` VARCHAR(191) NULL,

    UNIQUE INDEX `Student_id_key`(`id`),
    INDEX `Student_std_section_rollNo_idx`(`std`, `section`, `rollNo`),
    INDEX `Student_id_idx`(`id`),
    UNIQUE INDEX `Student_std_section_rollNo_key`(`std`, `section`, `rollNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `electionId` VARCHAR(191) NOT NULL,
    `house` VARCHAR(191) NULL,

    UNIQUE INDEX `Category_id_key`(`id`),
    INDEX `Category_name_idx`(`name`),
    INDEX `Category_electionId_idx`(`electionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vote` (
    `id` VARCHAR(191) NOT NULL,
    `candidateId` VARCHAR(191) NOT NULL,
    `voterId` VARCHAR(191) NOT NULL,
    `electionId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Vote_id_key`(`id`),
    INDEX `Vote_candidateId_idx`(`candidateId`),
    INDEX `Vote_voterId_idx`(`voterId`),
    INDEX `Vote_electionId_idx`(`electionId`),
    UNIQUE INDEX `Vote_candidateId_voterId_electionId_key`(`candidateId`, `voterId`, `electionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TeacherVote` (
    `id` VARCHAR(191) NOT NULL,
    `candidateId` VARCHAR(191) NOT NULL,
    `voterEmail` VARCHAR(191) NOT NULL,
    `electionId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `TeacherVote_id_key`(`id`),
    INDEX `TeacherVote_voterEmail_idx`(`voterEmail`),
    INDEX `TeacherVote_candidateId_idx`(`candidateId`),
    INDEX `TeacherVote_electionId_idx`(`electionId`),
    UNIQUE INDEX `TeacherVote_electionId_candidateId_voterEmail_key`(`electionId`, `candidateId`, `voterEmail`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CategoryToStudent` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_CategoryToStudent_AB_unique`(`A`, `B`),
    INDEX `_CategoryToStudent_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
