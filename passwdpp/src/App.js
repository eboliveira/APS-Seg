import React, { Component } from 'react'
import { Admin, Resource } from 'react-admin'
import UserIcon from '@material-ui/icons/Group'

import { dataProvider } from './Utils'
import { Dashboard } from './components/Dashboard'
import { ListUsers, EditUser } from './components/User'
import { authProvider } from './components/authProvider'

export class App extends Component {
  render() {
    return (
      <Admin dashboard={Dashboard} dataProvider={dataProvider} authProvider={authProvider}>
        <Resource options={{ label: 'Usuários' }}name="users" icon={UserIcon} list={ListUsers} edit={EditUser} />
      </Admin>
    )
  }
}

export default App