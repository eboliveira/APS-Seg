import React, { Component } from 'react'
<<<<<<< HEAD
import { Edit, SimpleForm, DisabledInput, TextInput, BooleanInput } from 'react-admin'
import Button from '@material-ui/core/Button';
=======
import { Edit, SimpleForm, NumberInput, TextInput, BooleanInput } from 'react-admin'
>>>>>>> aec894553761407507963b43fa6cf957472db9a6

export class EditUser extends Component {

    state = {
        mudarSenha: false,
    }

    renderInputMudarSenha = () => {
        return (
            <div>
                <TextInput label="Nova Senha" source="password" type="password" style={{width: '100%'}}/>
                <TextInput label="Confirmar a nova senha" source="confirm_password" type="password" />
            </div>
        );
    }

    onClickMudarSenha = () => {
        const {mudarSenha} = this.state
        this.setState({
            mudarSenha: !mudarSenha,
        })
    }

    render() {
        const {mudarSenha} = this.state
        return (
            <Edit {...this.props}>
                <SimpleForm>
<<<<<<< HEAD
                    <DisabledInput label="ID" source="id" />
                    <TextInput label="Usuário" source="username" />
                    <TextInput label="Name" source="name" />
                    <TextInput label="E-mail" source="email" />
                    <BooleanInput label="Ativo" source="ative" />
                    <Button color="primary" style={{ marginTop: '10px' }} onClick={this.onClickMudarSenha}>Mudar senha</Button>
                    {mudarSenha ? this.renderInputMudarSenha() : null}
=======
                    <TextInput disabled label="id" source="id" style={{ display:"none" }}/>
                    <TextInput label="Usuário" source="name" />
                    <BooleanInput label="Ativo" source="x" />
                    <NumberInput disabled label="UID" source="uid" />
                    <NumberInput disabled label="GID" source="gid" />
                    <TextInput label="Info" source="info" />
                    <TextInput label="Home" source="home" />
                    <TextInput label="CMDS" source="cmds" />
>>>>>>> aec894553761407507963b43fa6cf957472db9a6
                </SimpleForm>
            </Edit>
        )
    }
}


export default EditUser