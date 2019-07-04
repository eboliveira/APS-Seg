import React, { Component } from 'react'
import { List, Responsive, SimpleList, Datagrid, TextField, EmailField, DateField } from 'react-admin'

const Title = ({ record }) => {
    return <span>Usuários</span>;
};

export class ListUsers extends Component {
    render() {
        return (
            <List title={<Title />} {...this.props}>
                <Responsive
                    small={
                        <SimpleList
                            primaryText={record => `${record.id} - ${record.username}`}
                            secondaryText={record => `${record.name}`}
                            tertiaryText={record => `${record.lastModification}`}
                        />
                    }
                    medium={
                        <Datagrid rowClick="edit">
                            <TextField label="ID" source="id" />
                            <TextField label="Nome de usuário" source="username" />
                            <TextField label="Nome" source="name" />
                            <EmailField label="E-mail" source="email" />
                            <DateField label="Modificado em" source="lastModification" />
                        </Datagrid>
                    }
                />
            </List>
        )
    }
}

export default ListUsers