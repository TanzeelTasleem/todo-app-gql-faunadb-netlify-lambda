import React, { useState } from "react"
import { gql, useMutation, useQuery } from "@apollo/client"
import Icon from "../images/delete.png"
const getAllTodos = gql`
  query {
    getTodos {
      title
      ref
    }
  }
`
const createTodos = gql`
  mutation createTodo($title: String!) {
    createTodo(title: $title) {
      title
    }
  }
`
const removeTodo = gql`
  mutation deleteTodo($ref: String!) {
    deleteTodo(ref: $ref) {
      title
    }
  }
`
export const Todos = () => {
  const [value, setValue] = useState("")
  const { loading, error, data, refetch } = useQuery(getAllTodos, {
    notifyOnNetworkStatusChange: true,
  })
  const [createTodo, { loading: todoLoading , error : todoError }] = useMutation(createTodos)
  const [deleteTodo, { loading: removeLoading , error: removeError }] = useMutation(removeTodo)

  const handleSubmit = async e => {
    e.preventDefault()
    if (/^\s+$/.test(value)) {
      alert("should contain any string")
    } else {
      setValue("")
      await createTodo({ variables: { title: value } })
      await refetch()
    }
  }
 
  const handleDelete = async ref => {
    await deleteTodo({ variables: { ref: ref } })
    await refetch()
  }
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={value}
          required
          onChange={e => {
            setValue(e.target.value)
          }}
        />
        <button>add Todo</button>
      </form>
      {todoError && <p style={{fontWeight : "bold"}}>error in saving data</p>}
      {removeError && <p style={{fontWeight : "bold"}}>error in removing data</p>}
      {error && <p style={{fontWeight : "bold"}}>error in getting data</p>}
      {loading && <p style={{fontWeight : "bold"}}>loading data ...</p>}
      {data && 
         data?.getTodos?.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "300px",
            }}
          >
            <p>{item.title}</p>
            <input
              type="image"
              alt="delete"
              onClick={() => {
                handleDelete(item.ref + "")
              }}
              src={Icon}
              style={{ width: "20px", height: "20px" }}
            />
          </div>
        ))}
      {todoLoading && <p style={{fontWeight : "bold"}}> saving...</p>}
      {removeLoading && <p style={{fontWeight : "bold"}}>deleting...</p>}
    </div>
  )
}
