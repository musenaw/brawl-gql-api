import { Arg, Query, Resolver } from 'type-graphql'
import { Brawler } from '../../entity/Brawler'

@Resolver()
export class BrawlerResolver {
  @Query(() => Brawler, { nullable: true })
  async brawlerById(@Arg('id') id: number): Promise<Brawler | null> {
    const brawlerData = await Brawler.findOne({ id }, { relations: ['gadgets', 'starPowers'] })
    if (!brawlerData) {
      return null
    }
    return brawlerData
  }

  @Query(() => Brawler, { nullable: true })
  async brawlerByName(@Arg('name') name: string): Promise<Brawler | null> {
    const brawlerData = await Brawler.findOne({ name })
    if (!brawlerData) {
      return null
    }
    return brawlerData
  }

  @Query(() => [Brawler], { nullable: true })
  async brawlers(): Promise<Brawler[] | null> {
    const brawlers = await Brawler.find({ relations: ['gadgets', 'starPowers'] })
    if (brawlers.length == 0) {
      return null
    }
    return brawlers
  }
}
