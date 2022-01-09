import { Field, ID, ObjectType } from 'type-graphql'
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm'
import { Brawler } from './Brawler'

@ObjectType()
@Entity()
export class StarPower extends BaseEntity {
  @Field(() => ID)
  @PrimaryColumn()
  id: number

  @Field()
  @Column()
  name: string

  @Field(() => Brawler)
  @ManyToOne(() => Brawler, (brawler) => brawler.starPowers, { onDelete: 'CASCADE' })
  brawler: Brawler
}
