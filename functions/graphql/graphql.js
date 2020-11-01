const { ApolloServer, gql } = require("apollo-server-lambda")

const faunadb = require("faunadb")
const q = faunadb.query

require("dotenv").config()

const typeDefs = gql`
  type Query {
    getTodos: [todoItem]
  }
  type todoItem {
    title: String!
    ref: String!
  }
  type Mutation {
    createTodo(title: String!): todoItem
    deleteTodo(ref: String!): todoItem
  }
`
const resolvers = {
  Query: {
    getTodos: async () => {
      const client = new faunadb.Client({
        secret: process.env.FAUNA_SECRET,
      })
      try {
        const result = await client.query(
          q.Map(
            q.Paginate(q.Documents(q.Collection("todos"))),
            q.Lambda(x => q.Get(x))
          )
        )
        return result.data.map(item => {
          return {
            title: item.data.title,
            ref: item.ref.id,
          }
        })
      } catch (error) {
        return [{ title: error.message }]
      }
    },
  },
  Mutation : {
    createTodo: async (_, args) => {
      const client = new faunadb.Client({
        secret: process.env.FAUNA_SECRET,
      })
      try {
        const result = await client.query(
          q.Create(q.Collection("todos"), {
            data: {
              title: args.title,
            },
          })
        )
        return {
          title: result.data.title,
          ref: result.ref.id,
        }
      } catch (error) {
        return error.message
      }
    },
    deleteTodo: async (_, args) => {
      const client = new faunadb.Client({
        secret: process.env.FAUNA_SECRET,
      })
      try {
        const result = await client.query(
          q.Delete(q.Ref(q.Collection("todos"), `${args.ref}`))
        )
        return {
          title: result.data.title,
          ref: result.ref.id,
        }
      } catch (error) {
        return error.message
      }
    },
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,

  playground: true,
  introspection: true,
})

exports.handler = server.createHandler()
