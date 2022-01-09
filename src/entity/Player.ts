import { Field, ObjectType } from 'type-graphql'
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { PlayerBrawler } from './PlayerBrawler'

@ObjectType()
@Entity()
export class Player extends BaseEntity {
  @Field()
  @PrimaryColumn()
  tag: string

  @Field({ nullable: true })
  @Column({
    nullable: true
  })
  name: string

  @Field({ nullable: true })
  @Column({
    nullable: true
  })
  trophies: number

  @Field({ nullable: true })
  @Column({
    nullable: true
  })
  highestTrophies: number

  @Field({ nullable: true })
  @Column({
    nullable: true
  })
  powerPlayPoints: number

  @Field({ nullable: true })
  @Column({
    nullable: true
  })
  highestPowerPlayPoints: number

  @Field({ nullable: true })
  @Column({
    nullable: true
  })
  soloVictories: number

  @Field({ nullable: true })
  @Column({
    nullable: true
  })
  duoVictories: number

  @Field({ nullable: true })
  @Column({
    nullable: true
  })
  teamVictories: number

  @Field({ nullable: true })
  @Column({
    nullable: true
  })
  nameColor: string

  @Field({ nullable: true })
  @Column({
    nullable: true
  })
  iconId: number

  @OneToMany(() => PlayerBrawler, (pb) => pb.player)
  playerbrawlConnection: Promise<PlayerBrawler[]>
}
