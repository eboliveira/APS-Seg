import React, { Component } from 'react'
import { Edit, SimpleForm, NumberInput, TextInput, BooleanInput } from 'react-admin'

export class EditUser extends Component {
    render() {
        return (
            <Edit {...this.props}>
                <SimpleForm>
                    <TextInput disabled label="id" source="id" style={{ display:"none" }}/>
                    <TextInput label="Usuário" source="name" />
                    <BooleanInput label="Ativo" source="x" />
                    <NumberInput disabled label="UID" source="uid" />
                    <NumberInput disabled label="GID" source="gid" />
                    <TextInput label="Info" source="info" />
                    <TextInput label="Home" source="home" />
                    <TextInput label="CMDS" source="cmds" />
                </SimpleForm>
            </Edit>
        )
    }
}


export default EditUser