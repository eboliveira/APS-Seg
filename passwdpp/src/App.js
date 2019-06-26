import React, { Component } from 'react'
import { Admin, Resource, ListGuesser } from 'react-admin'

import { dataProvider } from './Utils'
import { Dashboard } from './components/Dashboard'
import { ListUsers } from './components/User'

export class App extends Component {
  render() {
    return (
      <Admin dashboard={Dashboard} dataProvider={dataProvider}>
        <Resource name="users" list={ListUsers} />
      </Admin>
    )
  }
}

export default App