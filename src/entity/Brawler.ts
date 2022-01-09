import { Field, ID, ObjectType } from 'type-graphql'
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { Gadget } from './Gadget'
import { PlayerBrawler } from './PlayerBrawler'
import { StarPower } from './StarPower'

@ObjectType()
@Entity()
export class Brawler extends BaseEntity {
  @Field(() => ID)
  @PrimaryColumn()
  id: number

  @Field()
  @Column()
  name: string

  @Field({ nullable: true })
  @Column({
    nullable: true
  })
  photo: string

  @Field(() => [Gadget])
  @OneToMany(() => Gadget, (gagdet) => gagdet.brawler)
  gadgets: Gadget[]

  @Field(() => [StarPower])
  @OneToMany(() => StarPower, (starpower) => starpower.brawler)
  starPowers: StarPower[]

  @OneToMany(() => PlayerBrawler, (pb) => pb.brawler)
  playerbrawlConnection: Promise<PlayerBrawler[]>
}
