import { Field, ObjectType } from 'type-graphql'
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { Brawler } from './Brawler'
import { Player } from './Player'

@Entity()
@ObjectType()
export class PlayerBrawler extends BaseEntity {
  @PrimaryColumn()
  playerTag: string

  @PrimaryColumn()
  brawlerId: number

  @Field(() => Player)
  @ManyToOne(() => Player, (player) => player.playerbrawlConnection, {
    primary: true,
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'tag' })
  player: Player

  @Field(() => Brawler)
  @ManyToOne(() => Brawler, (brawler) => brawler.playerbrawlConnection, {
    primary: true,
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'id' })
  brawler: Brawler

  @Field({ nullable: true })
  @Column({
    nullable: true
  })
  power: number

  @Field({ nullable: true })
  @Column({
    nullable: true
  })
  rank: number

  @Field({ nullable: true })
  @Column({
    nullable: true,
    default: 0
  })
  trophies: number

  @Field({ nullable: true })
  @Column({
    nullable: true,
    default: 0
  })
  highestTrophies: number
}
