import React, { Component } from 'react'
import { Create, SimpleForm, NumberInput, TextInput, BooleanInput } from 'react-admin'

export class CreateUser extends Component {
    render() {
        return (
            <Create {...this.props}>
                <SimpleForm>
                    <TextInput label="Usuário" source="username" />
                    <BooleanInput label="Ativo" source="x" />
                    <TextInput label="Info" source="info" />
                    <TextInput label="Senha" source="password" type="password" />
                    <TextInput label="Confirmação de senha" source="confirm_password" type="password" />
                </SimpleForm>
            </Create>
        )
    }
}


export default CreateUser