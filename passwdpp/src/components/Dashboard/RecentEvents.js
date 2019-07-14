import React, { Component } from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import CommentIcon from '@material-ui/icons/Comment'
import Divider from '@material-ui/core/Divider'

import CardIcon from './CardIcon';

const classes = theme => ({
    main: {
        flex: '1',
        marginLeft: '1em',
        marginTop: 20,
    },
    card: {
        padding: '16px 0',
        overflow: 'inherit !important',
        textAlign: 'right',
    },
    title: {
        padding: '0 16px',
    },
    value: {
        padding: '0 16px',
        minHeight: 48,
    },
    avatar: {
        background: theme.palette.background.avatar,
    },
    listItemText: {
        paddingRight: 0,
    },
});

export class RecentEvents extends Component {
    render() {
        return (
            <div className={classes.main}>
                <CardIcon Icon={CommentIcon} bgColor="#4caf50" />
                <Card className={classes.card} style={{ overflow: 'visible' }}>
                    <CardContent>
                        <Typography className={classes.title} color="textSecondary">
                            {"Últimos eventos (limite 10)"}
                        </Typography>
                        <Typography
                            variant="headline"
                            component="h2"
                            className={classes.value}
                        >
                            {this.props.nb}
                        </Typography>
                        <Divider />
                        <List>
                            {this.props.events.map(record => (
                                <ListItem
                                    button
                                >
                                    <CommentIcon style={{ fontSize: "1em" }} />
                                    <ListItemText
                                        primary={`Usuário ${record.user_id} ${record.type} usuário ${record.user_id_target}`}
                                        secondary={record.dt_occurred}
                                        className={classes.listItemText}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </div>
        )
    }
}

export default RecentEvents