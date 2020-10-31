const { ApolloServer, gql } = require('apollo-server-lambda')

const faunadb = require('faunadb')
const q = faunadb.query

require('dotenv').config()

const typeDefs = gql`
  type Query {
    getTodos: [todoItem],
    deleteTodo(ref : String!): todoItem
    createTodo (title : String!): todoItem
  }
  type todoItem {
    title : String!
    ref : String!
  }
`
const resolvers = {
  Query: {
    getTodos: async () => {
      const client = new faunadb.Client({
        secret : process.env.FAUNA_SECRET
      })
       try {
           const result = await client.query(
            q.Map(
              q.Paginate(q.Documents(q.Collection('todos'))),
              q.Lambda(x => q.Get(x))
            ))
            console.log(result.data[0].ref.id)
            return result.data.map(item => {
              return {
                 title : item.data.title,
                 ref : item.ref.id
              }
            })
    
       } catch (error) {
         return [{title  : error.message}]
       }
    },
    deleteTodo : async (_,args) =>{
      const client = new faunadb.Client({
        secret : process.env.FAUNA_SECRET
      })
      try {
        const result = await client.query(
          q.Delete(q.Ref(q.Collection("todos"),`${args.ref}`))
        )
        return {
          title : result.data.title,
          ref : result.ref.id
        }
      } catch (error) {
        return error.message
      }
    },
    createTodo : async (_,args)=>{
      const client = new faunadb.Client({
        secret : process.env.FAUNA_SECRET
      })
      try {
        const result = await client.query(
          q.Create(q.Collection("todos"),{
            data :{
              title : args.title
            }
          })
        )
        return {
          title :result.data.title,
          ref : result.ref.id
        }
      } catch (error) {
        return error.message
      }
    }
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,

  playground : true,
  introspection :true
})

exports.handler = server.createHandler()
// const { ApolloServer, gql } = require("apollo-server-lambda");
// const faunadb = require('faunadb'),
//   q = faunadb.query;


// const typeDefs = gql`
//   type Query {
//     message: String
//   }
// `;



// const resolvers = {
//   Query: {
//     message: async (parent, args, context) => {
//       // try {
//       //   var client = new faunadb.Client({ secret: process.env.FAUNADB_ADMIN_SECRET });
//       //   let result = await client.query(
//       //     q.Get(q.Ref(q.Collection('posts'), '272284912966435334'))
//       //   );
        
//         return "fjdbskfjbs";
//       // } catch (err) {
//       //   return err.toString();
//       // }
//     }
//   }
// };

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   playground: true,
//   introspection: true
// });

// exports.handler = server.createHandler();


// const { ApolloServer, gql } = require('apollo-server-lambda')

// const typeDefs = gql`
//   type Query {
//     hello: String
//     allAuthors: [Author!]
//     author(id: Int!): Author
//     authorByName(name: String!): Author
//   }
//   type Author {
//     id: ID!
//     name: String!
//     married: Boolean!
//   }
// `

// const authors = [
//   { id: 1, name: 'Terry Pratchett', married: false },
//   { id: 2, name: 'Stephen King', married: true },
//   { id: 3, name: 'JK Rowling', married: false },
// ]

// const resolvers = {
//   Query: {
//     hello: () => {
//       return 'Hello, world!'
//     },
//     allAuthors: () => {
//       return authors
//     },
//     author: () => {},
//     authorByName: (root, args) => {
//       console.log('hihhihi', args.name)
//       return authors.find((x) => x.name === args.name) || 'NOTFOUND'
//     },
//   },
// }

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
// })

// exports.handler = server.createHandler()
