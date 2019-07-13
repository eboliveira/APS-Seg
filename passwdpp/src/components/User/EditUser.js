import React, { Component } from 'react'
import { Edit, SimpleForm, DisabledInput, TextInput, BooleanInput } from 'react-admin'
import Button from '@material-ui/core/Button';

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
                    <DisabledInput label="ID" source="id" />
                    <TextInput label="Usuário" source="username" />
                    <TextInput label="Name" source="name" />
                    <TextInput label="E-mail" source="email" />
                    <BooleanInput label="Ativo" source="ative" />
                    <Button color="primary" style={{ marginTop: '10px' }} onClick={this.onClickMudarSenha}>Mudar senha</Button>
                    {mudarSenha ? this.renderInputMudarSenha() : null}
                </SimpleForm>
            </Edit>
        )
    }
}

export default EditUser