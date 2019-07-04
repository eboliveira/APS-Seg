import React, { Component, Fragment } from 'react'

import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import UserIcon from '@material-ui/icons/AssignmentInd'
import Typography from '@material-ui/core/Typography';


export class Dashboard extends Component {
    render() {
        return (
            <Fragment>
                <Grid
                    container
                    spacing={16}
                    justify="center"
                >
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardHeader title="Bem vindo ao Passwd++" />
                            <CardContent>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="center"
                                    spacing={8}
                                >
                                    <Grid item style={{ textAlign: "center" }} xs={4}>
                                        <Grid
                                            container
                                            direction="row"
                                            justify="flex-start"
                                            alignItems="center"
                                            spacing={8}
                                        >
                                            <Grid item style={{ textAlign: "end" }} xs={6}>
                                                <UserIcon style={{ fontSize: "4em" }} />
                                            </Grid>
                                            <Grid item style={{ textAlign: "start" }} xs={6}>
                                                <span style={{ fontSize: "3em" }}>50</span>
                                            </Grid>
                                        </Grid>

                                    </Grid>
                                </Grid>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="center"
                                    spacing={8}
                                >
                                    <Grid item style={{ textAlign: "center" }} xs={4}>
                                        <Typography style={{ fontSize: "1em" }} variant="caption">Usuários no sistema</Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardHeader title="Últimos eventos" />
                            <CardContent>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Fragment>
        )
    }
}

export default Dashboard