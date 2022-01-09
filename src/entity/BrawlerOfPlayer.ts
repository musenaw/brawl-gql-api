import { Field, ObjectType } from 'type-graphql'

@ObjectType()
class BasicBrawlInfo {
  @Field()
  id: number

  @Field()
  name: string
}

@ObjectType()
export class BrawlerOfPlayer {
  @Field(() => BasicBrawlInfo)
  brawler: BasicBrawlInfo

  @Field({ nullable: true })
  power: number

  @Field({ nullable: true })
  rank: number

  @Field({ nullable: true })
  trophies: number

  @Field({ nullable: true })
  highestTrophies: number
}
