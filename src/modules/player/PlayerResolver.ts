import { tagTransform } from '../../utils/tagTransform'
import { Arg, Query, Resolver } from 'type-graphql'
import { Player } from '../../entity/Player'

@Resolver()
export class PlayerResolver {
  @Query(() => Player, { nullable: true })
  async player(@Arg('tag') tag: string): Promise<Player | null> {
    tag = tagTransform(tag)
    const playerData = await Player.findOne({ tag })
    if (!playerData) {
      return null
    }
    return playerData
  }
}
