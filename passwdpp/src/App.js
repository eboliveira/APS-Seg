import React, { Component } from 'react'
import { Admin, Resource, ListGuesser, EditGuesser } from 'react-admin'
import portugueseMessages from 'ra-language-portuguese';
import englishMessages from 'ra-language-english';
import UserIcon from '@material-ui/icons/Group'
import LockIcon from '@material-ui/icons/Lock'

import { dataProvider } from './Utils'
import { Dashboard } from './components/Dashboard'
import { ListUsers, EditUser, CreateUser } from './components/User'
import authProvider from './components/authProvider'

const messages = {
    pt: portugueseMessages,
    en: englishMessages,
}
const i18nProvider = locale => messages.pt;

export class App extends Component {
    render() {
        return (
            <Admin dashboard={Dashboard} dataProvider={dataProvider} authProvider={authProvider} i18nProvider={i18nProvider}>
                <Resource options={{ label: 'Usuários' }}
                name="user" icon={UserIcon} list={ListUsers} edit={EditUser} create={CreateUser}/>
                <Resource options={{ label: 'Requisitos de senhas' }}
                name="pattern_passwd" icon={LockIcon} list={ListGuesser} edit={EditGuesser}/>
            </Admin>
        )
    }
}

export default App