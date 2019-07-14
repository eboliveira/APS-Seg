import React, { Component } from 'react'
import { Edit, SimpleForm, NumberInput, TextInput, BooleanInput } from 'react-admin'

export class EditUser extends Component {
    render() {
        return (
            <Edit {...this.props}>
                <SimpleForm>
                    <TextInput source="name" />
                    <BooleanInput label="Ativo" source="ative" />
                    <TextInput source="x" />
                    <NumberInput source="uid" />
                    <NumberInput source="gid" />
                    <TextInput source="info" />
                    <TextInput source="home" />
                    <TextInput source="cmds" />
                </SimpleForm>
            </Edit>
        )
    }
}


export default EditUser