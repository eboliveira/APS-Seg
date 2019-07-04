import React, { Component } from 'react'
import { Edit, SimpleForm, DisabledInput, TextInput, BooleanInput } from 'react-admin'

export class EditUser extends Component {
    render() {
        return (
            <Edit {...this.props}>
                <SimpleForm>
                    <DisabledInput label="ID" source="id" />
                    <TextInput label="Usuário" source="username" />
                    <TextInput label="Name" source="name" />
                    <TextInput label="E-mail" source="email" />
                    <BooleanInput label="Ativo" source="ative" />
                    <TextInput label="Nova Senha" source="password" type="password" />
                    <TextInput label="Confirmar a nova senha" source="confirm_password" type="password" />
                </SimpleForm>
            </Edit>
        )
    }
}

export default EditUser