import { Arg, ClassType, Field, Mutation, ObjectType, Query, Resolver } from 'type-graphql'
import { PlayerBrawler } from '../../entity/PlayerBrawler'
import axios from 'axios'
import { Player } from '../../entity/Player'
import { Brawler } from '../../entity/Brawler'
import { tagTransform } from '../../utils/tagTransform'
import { BrawlerOfPlayer } from '../../entity/BrawlerOfPlayer'

function CommonResponse<TItem>(TItemClass: ClassType<TItem>) {
  @ObjectType({ isAbstract: true })
  abstract class CommonResponseClass {
    @Field(() => [TItemClass], { nullable: true })
    items?: TItem[]

    @Field(() => TItemClass, { nullable: true })
    item?: TItem

    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[]
  }
  return CommonResponseClass
}

@ObjectType()
class FieldError {
  @Field()
  field: string
  @Field()
  message: string
}

@ObjectType()
class PlayerBrawlerResponse extends CommonResponse(BrawlerOfPlayer) {}

@ObjectType()
class PlayerResponse extends CommonResponse(Player) {}

const createPlayer = async (tag: string): Promise<Player | null> => {
  try {
    const { data } = await axios.get(`https://api.brawlstars.com/v1/players/${tag}`, {
      headers: {
        authorization: `Bearer ${process.env.TOKEN}`,
        'X-Forwarded-For': process.env.IP as string
      }
    })

    const {
      name,
      trophies,
      highestTrophies,
      powerPlayPoints,
      highestPowerPlayPoints,
      soloVictories,
      duoVictories,
      nameColor,
      icon
    } = data

    const playerDataBrawlers: PlayerBrawler[] = []
    const player: Player = await Player.create({
      tag,
      name,
      trophies,
      highestTrophies,
      powerPlayPoints: powerPlayPoints ? powerPlayPoints : 0,
      highestPowerPlayPoints,
      soloVictories,
      duoVictories,
      teamVictories: data['3vs3Victories'],
      nameColor,
      iconId: icon.id
    }).save()

    for (let index = 0; index < data.brawlers.length; index++) {
      const brawlerData = data.brawlers[index]
      const brawler: Brawler | undefined = await Brawler.findOne({ id: brawlerData.id })
      const { power, rank, trophies, highestTrophies } = brawlerData
      await PlayerBrawler.create({
        playerTag: tag,
        brawlerId: brawler?.id,
        brawler,
        player,
        power,
        rank,
        trophies,
        highestTrophies
      }).save()
    }

    data.brawlers = playerDataBrawlers
    return data
  } catch (e) {
    console.log(e)
    return null
  }
}

@Resolver()
export class PlayerBrawlerResolver {
  @Query(() => PlayerBrawlerResponse, { nullable: true })
  async allBrawlersPlayerData(
    @Arg('tag', () => String) playerTag: string
  ): Promise<PlayerBrawlerResponse> {
    playerTag = tagTransform(playerTag)
    const brawlersOfUser = (await PlayerBrawler.getRepository().find({
      relations: ['brawler'],
      where: { playerTag }
    })) as BrawlerOfPlayer[]

    if (!brawlersOfUser) {
      return {
        errors: []
      }
    }
    return { items: brawlersOfUser }
  }

  @Query(() => PlayerBrawlerResponse, { nullable: true })
  async brawlersPlayerData(
    @Arg('tag', () => String) playerTag: string,
    @Arg('brawlerId', () => Number) brawlerId: number
  ): Promise<PlayerBrawlerResponse> {
    playerTag = tagTransform(playerTag)
    const brawlersOfUser = (await PlayerBrawler.getRepository().findOne({
      relations: ['brawler'],
      where: { playerTag, brawlerId }
    })) as BrawlerOfPlayer
    if (!brawlersOfUser) {
      return {
        errors: [
          {
            field: 'brawlersPlayer',
            message: 'not found brawler for this player'
          }
        ]
      }
    }

    return { item: brawlersOfUser }
  }

  @Mutation(() => PlayerResponse, { nullable: true })
  async addPlayer(@Arg('tag') tag: string): Promise<PlayerResponse> {
    tag = tagTransform(tag)
    const playerExist = await Player.findOne({ tag })
    if (playerExist) {
      return {
        errors: [
          {
            field: 'player',
            message: 'Player already added'
          }
        ]
      }
    }
    const player: Player | null = await createPlayer(tag)
    // TODO Add better errors to response
    // const { errors, player } = await createPlayer(tag)
    if (!player) {
      return {
        errors: [
          {
            field: 'player',
            message: 'Error occurred during adding this player'
          }
        ]
      }
    }
    console.log(player)
    return { items: [player], item: player }
  }
}
