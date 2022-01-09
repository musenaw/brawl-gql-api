import axios from 'axios'
import { Brawler } from '../entity/Brawler'
import { Player } from '../entity/Player'
import { PlayerBrawler } from '../entity/PlayerBrawler'
import { tagTransform } from './tagTransform'

const storePlayerData = async (
  player: Player,
  brawler: Brawler,
  power: number,
  rank: number,
  trophies: number,
  highestTrophies: number
) => {
  await PlayerBrawler.create({
    playerTag: player.tag,
    brawlerId: brawler.id,
    player,
    brawler,
    power,
    rank,
    trophies,
    highestTrophies
  }).save()
}

const updateBrawlersPlayer = async (playerTag: string) => {
  try {
    playerTag = tagTransform(playerTag)
    const { data } = await axios.get(`https://api.brawlstars.com/v1/players/${playerTag}`, {
      headers: {
        authorization: `Bearer ${process.env.TOKEN}`,
        'X-Forwarded-For': process.env.IP
      }
    })
    const {
      brawlers,
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
    const player = await Player.findOne({ tag: playerTag })
    if (!player) {
      return null
    }

    await Player.update(
      { tag: playerTag },
      {
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
      }
    )
    for (let index = 0; index < brawlers.length; index++) {
      const { id, power, rank, trophies, highestTrophies } = brawlers[index]
      const brawler = await Brawler.findOne({ id })
      if (!brawler) {
        continue
      }
      await storePlayerData(player, brawler, power, rank, trophies, highestTrophies)
    }
    return data
  } catch (e) {
    console.log(e)
    return null
  }
}

updateBrawlersPlayer('#P2P2PV028')
