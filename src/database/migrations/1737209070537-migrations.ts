import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1737209070537 implements MigrationInterface {
    name = 'Migrations1737209070537'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_3b810c99fae8b4b46555c8bdfc"`);
        await queryRunner.query(`CREATE TYPE "public"."user_profiles_gender_enum" AS ENUM('MALE', 'FEMALE')`);
        await queryRunner.query(`CREATE TABLE "user_profiles" ("id" uuid NOT NULL, "name" character varying NOT NULL, "birth_date" date NOT NULL, "bio" character varying, "gender" "public"."user_profiles_gender_enum" NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1ec6662219f4605723f1e41b6cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f899d55e5a3f1368c9da7dcbf1" ON "user_profiles" ("gender") `);
        await queryRunner.query(`ALTER TABLE "user_preferences" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "birth_date"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "bio"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "gender"`);
        await queryRunner.query(`DROP TYPE "public"."users_gender_enum"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "swipe_history" DROP CONSTRAINT "FK_05c70e3339852fbfa6dd6025711"`);
        await queryRunner.query(`ALTER TABLE "swipe_history" DROP CONSTRAINT "FK_25a2ac658ac560909ccf22e4c36"`);
        await queryRunner.query(`ALTER TABLE "swipe_history" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "swipe_history" ALTER COLUMN "target_user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_d0a95ef8a28188364c546eb65c1"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_d0a95ef8a28188364c546eb65c" ON "subscriptions" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "swipe_history" ADD CONSTRAINT "FK_05c70e3339852fbfa6dd6025711" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "swipe_history" ADD CONSTRAINT "FK_25a2ac658ac560909ccf22e4c36" FOREIGN KEY ("target_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_d0a95ef8a28188364c546eb65c1" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_1ec6662219f4605723f1e41b6cb" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_1ec6662219f4605723f1e41b6cb"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_d0a95ef8a28188364c546eb65c1"`);
        await queryRunner.query(`ALTER TABLE "swipe_history" DROP CONSTRAINT "FK_25a2ac658ac560909ccf22e4c36"`);
        await queryRunner.query(`ALTER TABLE "swipe_history" DROP CONSTRAINT "FK_05c70e3339852fbfa6dd6025711"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d0a95ef8a28188364c546eb65c"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_d0a95ef8a28188364c546eb65c1" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "swipe_history" ALTER COLUMN "target_user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "swipe_history" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "swipe_history" ADD CONSTRAINT "FK_25a2ac658ac560909ccf22e4c36" FOREIGN KEY ("target_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "swipe_history" ADD CONSTRAINT "FK_05c70e3339852fbfa6dd6025711" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`CREATE TYPE "public"."users_gender_enum" AS ENUM('MALE', 'FEMALE')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "gender" "public"."users_gender_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "bio" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "birth_date" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f899d55e5a3f1368c9da7dcbf1"`);
        await queryRunner.query(`DROP TABLE "user_profiles"`);
        await queryRunner.query(`DROP TYPE "public"."user_profiles_gender_enum"`);
        await queryRunner.query(`CREATE INDEX "IDX_3b810c99fae8b4b46555c8bdfc" ON "users" ("gender") `);
    }

}
