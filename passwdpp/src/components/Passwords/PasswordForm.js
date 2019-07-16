import React, { Component } from 'react'
import { SimpleForm, NumberInput, Create } from 'react-admin'
import axios from 'axios'

const required = value => value ? undefined : 'Obrigatório';
const number = value => value && isNaN(Number(value)) ? 'Deveser um número' : undefined;
const validateAll = (value, allValues) => {
    if(value < 2) {
        return 'Senha Fraca, aumente o valor do campo'
    }
}
const validadeSomeItens = [number, validateAll]

export default class PasswordForm extends Component {

    render() {
        return (
            <Create {...this.props}>
                <SimpleForm>
                    <NumberInput label="Letras maiúsculas" source="min_capital_letters" validate={validadeSomeItens}/>
                    <NumberInput label="Letras Minusculas" source="min_tiny_letters" validate={validadeSomeItens}/>
                    <NumberInput label="Números" source="min_numbers" validate={validadeSomeItens}/>
                    <NumberInput label="Caracteres especiais" source="min_special_chars" validate={validadeSomeItens}/>
                    <NumberInput label="Mínimo de caracteres" source="min_all_chars" validate={required}/>
                    <NumberInput label="Nova senha em X meses" source="months_change" validate={required}/>
                </SimpleForm>
            </Create>
        )
    }
}
