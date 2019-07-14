import React, { Component } from 'react'
import { Admin, Resource, ListGuesser, EditGuesser } from 'react-admin'
import UserIcon from '@material-ui/icons/Group'

import { dataProvider } from './Utils'
import { Dashboard } from './components/Dashboard'
import { ListUsers, EditUser, CreateUser } from './components/User'
import { authProvider } from './components/authProvider'

export class App extends Component {
    render() {
        return (
            <Admin dashboard={Dashboard} dataProvider={dataProvider} authProvider={authProvider}>
                <Resource options={{ label: 'Usuários' }}
                name="user" icon={UserIcon} list={ListUsers} edit={EditUser} create={CreateUser}/>
            </Admin>
        )
    }
}

export default App