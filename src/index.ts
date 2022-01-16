import { ApolloServer } from 'apollo-server-express'
import 'dotenv-safe/config'
import express from 'express'
import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import { createConnection } from 'typeorm'
import { BrawlerResolver } from './modules/brawler/BrawlerResolver'
import { PlayerBrawlerResolver } from './modules/player-brawler/PlayerBrawlerResolver'
import { PlayerResolver } from './modules/player/PlayerResolver'

const main = async () => {
  const conn = await createConnection()
  conn.runMigrations()

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
