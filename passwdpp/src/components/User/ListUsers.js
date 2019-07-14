import React, { Component } from 'react'
import { List,
    Responsive,
    SimpleList,
    Datagrid,
    TextField
} from 'react-admin'

const Title = () => {
    return <span>Usuários</span>;
};

const StatusField = ({ record = {}, source }) =>
    <span >
        {source === 'x' ? 'Ativo' : 'Bloqueado'}
    </span>;

export class ListUsers extends Component {
    render() {
        return (
            <List title={<Title />} pagination={false} {...this.props}>
                <Responsive
                    small={
                        <SimpleList
                            primaryText={record => `${record.name} - ${record.uid}`}
                            secondaryText={record => `${record.x}`}
                            tertiaryText={record => `${record.home}`}
                        />
                    }
                    medium={
                        <Datagrid rowClick="edit">
                            <TextField label="Usuário" source="name" />
                            <TextField label="Info" source="info" />
                            <TextField label="Home" source="home" />
                            <StatusField label="Status" source="x" />
                        </Datagrid>
                    }
                />
            </List>
        )
    }
}

export default ListUsers