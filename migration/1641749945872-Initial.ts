import { MigrationInterface, QueryRunner } from 'typeorm'

export class Initial1641749945872 implements MigrationInterface {
  name = 'Initial1641749945872'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "gadget" ("id" integer NOT NULL, "name" character varying NOT NULL, "brawlerId" integer, CONSTRAINT "PK_0498ae0e75a2324586e3d0ccdb5" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "player" ("tag" character varying NOT NULL, "name" character varying, "trophies" integer, "highestTrophies" integer, "powerPlayPoints" integer, "highestPowerPlayPoints" integer, "soloVictories" integer, "duoVictories" integer, "teamVictories" integer, "nameColor" character varying, "iconId" integer, CONSTRAINT "PK_854cbd417e523bfa1687262e16c" PRIMARY KEY ("tag"))`
    )
    await queryRunner.query(
      `CREATE TABLE "player_brawler" ("playerTag" character varying NOT NULL, "brawlerId" integer NOT NULL, "power" integer, "rank" integer, "trophies" integer DEFAULT '0', "highestTrophies" integer DEFAULT '0', "tag" character varying NOT NULL, "id" integer NOT NULL, CONSTRAINT "PK_9aa8092af72103a8d7061f3b08a" PRIMARY KEY ("playerTag", "brawlerId", "tag", "id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "star_power" ("id" integer NOT NULL, "name" character varying NOT NULL, "brawlerId" integer, CONSTRAINT "PK_bb91af80b408de0864449b8c5bb" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "brawler" ("id" integer NOT NULL, "name" character varying NOT NULL, "photo" character varying, CONSTRAINT "PK_ce4eb09a7474e092cdd02bcc96a" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "gadget" ADD CONSTRAINT "FK_7f19e0296c8a2e52d3c53607b19" FOREIGN KEY ("brawlerId") REFERENCES "brawler"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "player_brawler" ADD CONSTRAINT "FK_4bac4e3b877e5ae41f0732f45f8" FOREIGN KEY ("tag") REFERENCES "player"("tag") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "player_brawler" ADD CONSTRAINT "FK_e7c4e5b010aa1fbb304b1fb82c7" FOREIGN KEY ("id") REFERENCES "brawler"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "star_power" ADD CONSTRAINT "FK_fec2113100073cfb82e5b158b9e" FOREIGN KEY ("brawlerId") REFERENCES "brawler"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "star_power" DROP CONSTRAINT "FK_fec2113100073cfb82e5b158b9e"`
    )
    await queryRunner.query(
      `ALTER TABLE "player_brawler" DROP CONSTRAINT "FK_e7c4e5b010aa1fbb304b1fb82c7"`
    )
    await queryRunner.query(
      `ALTER TABLE "player_brawler" DROP CONSTRAINT "FK_4bac4e3b877e5ae41f0732f45f8"`
    )
    await queryRunner.query(`ALTER TABLE "gadget" DROP CONSTRAINT "FK_7f19e0296c8a2e52d3c53607b19"`)
    await queryRunner.query(`DROP TABLE "brawler"`)
    await queryRunner.query(`DROP TABLE "star_power"`)
    await queryRunner.query(`DROP TABLE "player_brawler"`)
    await queryRunner.query(`DROP TABLE "player"`)
    await queryRunner.query(`DROP TABLE "gadget"`)
  }
}
