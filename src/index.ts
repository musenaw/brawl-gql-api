import { ApolloServer } from 'apollo-server-express'
import 'reflect-metadata'
import 'dotenv-safe/config'
import { createConnection } from 'typeorm'
import { buildSchema } from 'type-graphql'
import express from 'express'
import { BrawlerResolver } from './modules/brawler/BrawlerResolver'
import { PlayerResolver } from './modules/player/PlayerResolver'
import { PlayerBrawlerResolver } from './modules/player-brawler/PlayerBrawlerResolver'

const main = async () => {
  console.log(process.env)
  await createConnection()

  const app = express()

  const createSchema = () =>
    buildSchema({
      resolvers: [BrawlerResolver, PlayerResolver, PlayerBrawlerResolver]
    })
  const schema = await createSchema()

  const apolloServer = new ApolloServer({
    schema
  })

  await apolloServer.start()
  apolloServer.applyMiddleware({ app })

  app.listen(4000, () => {
    console.log('server sdtarted on http://localhost:4000/graphql')
  })
}

main().catch((err) => console.error(err))
