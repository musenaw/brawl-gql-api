import axios from 'axios'
import { Brawler } from '../entity/Brawler'
import { Gadget } from '../entity/Gadget'
import { StarPower } from '../entity/StarPower'
import { createConnection } from 'typeorm'

const createAllBrawlers = async (): Promise<[Brawler] | null> => {
  try {
    await createConnection()
    const { data } = await axios.get(`https://api.brawlstars.com/v1/brawlers`, {
      headers: {
        authorization: `Bearer ${process.env.TOKEN}`,
        'X-Forwarded-For': process.env.IP
      }
    })
    for (let index = 0; index < data.items.length; index++) {
      const brawler: Brawler = data.items[index]
      await createBrawler(brawler)
    }
    return data.items
  } catch (e) {
    console.log(e)
    return null
  }
}

const createBrawler = async (brawler: Brawler) => {
  const { gadgets, starPowers } = brawler
  const gadgetsCreated: Gadget[] = []
  const starpowersCreated: StarPower[] = []
  for (let index = 0; index < gadgets.length; index++) {
    const gagdet = gadgets[index]
    const gadgetCreated: Gadget = await Gadget.create({ ...gagdet }).save()
    gadgetsCreated.push(gadgetCreated)
  }

  for (let index = 0; index < starPowers.length; index++) {
    const starpower = starPowers[index]
    const starpowerCreated: StarPower = await StarPower.create({ ...starpower }).save()
    starpowersCreated.push(starpowerCreated)
  }

  await Brawler.create({
    id: brawler.id,
    name: brawler.name,
    gadgets: gadgetsCreated,
    starPowers: starpowersCreated
  }).save()

  return brawler
}

async function main() {
  try {
    await createAllBrawlers()
    console.log('All brawlers created')
  } catch (error) {
    console.error(error)
  }
}

main()
