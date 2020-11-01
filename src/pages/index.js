import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { Todos } from "../components/todos"
const IndexPage = () => {
  return(
    <Layout>
      <SEO title="Home" />
      <h1>Todo app</h1>
      <Todos/>
    </Layout>
  )

}
  


export default IndexPage
