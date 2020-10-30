import { ApolloProvider } from '@apollo/client'
import React from  'react'
import { client } from './index'

export const wrapRootElement =({element})=>(
    <ApolloProvider client={client}>
        {element}
    </ApolloProvider>
)