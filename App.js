import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

import { withAuthenticator } from 'aws-amplify-react-native'

import { createTodo } from './graphql/mutations';
import { listTodos } from './graphql/queries';

//Aws imports
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import config from './aws-exports'
Amplify.configure(config)

const initialState = { name: "", description: "" }

const App = () => {

  const [formState, setFormState] = useState(initialState);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    getTodos()
  }, [])

  const setInput = (key, value) => {
    setFormState({ ...formState, [key]: value })
  }

  const getTodos = async () => {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos))
      //setTodos
      const todos = todoData.data.listTodos.items
      setTodos(todos)
      console.log(todos);
    } catch (error) {
      console.log('error fetching todos')
    }
  }

  const addTodo = async () => {
    try {
      const todo = { ...formState }
      setTodos([...todos, todo])
      setFormState(initialState)
      await API.graphql(graphqlOperation(createTodo, { input: todo }))
    } catch (err) {
      console.log('error creating todo:', err)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>CREATE TODO</Text>
      <TextInput
        onChangeText={val => setInput('name', val)}
        style={styles.input}
        value={formState.name}
        placeholder="Name"
      />
      <TextInput
        onChangeText={val => setInput('description', val)}
        style={styles.input}
        value={formState.description}
        placeholder="Description"
      />
      <Button title="Create Todo" onPress={addTodo} />
      {
        todos.map((todo, index) => (
          <View key={todo.id ? todo.id : index} style={styles.todo}>
            <Text style={styles.todoName}>{todo.name}</Text>
            <Text>{todo.description}</Text>
          </View>
        ))

      }
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20
  },
  todo: {
    marginVertical: 10
  },
  input: {
    width: '100%'
    , height: 50,
    backgroundColor: '#ddd',
    marginBottom: 10,
    padding: 8
  },
  todoName: {
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default withAuthenticator(App);
