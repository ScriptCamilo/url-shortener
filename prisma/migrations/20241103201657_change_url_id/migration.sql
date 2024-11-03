/*
  Warnings:

  - The primary key for the `urls` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "urls" DROP CONSTRAINT "urls_user_id_fkey";

-- AlterTable
ALTER TABLE "urls" DROP CONSTRAINT "urls_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "urls_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "urls_id_seq";

-- AddForeignKey
ALTER TABLE "urls" ADD CONSTRAINT "urls_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
