import React from 'react'
import { Route, Switch } from 'react-router-dom'
import PropTypes from 'prop-types'
import DebateViewer from './DebateViewer'
import MyDebates from './MyDebates'
import CreateDebate from './CreateDebate'

const Debates = ({ match }) => (
    <Switch>
        <Route path = {match.url} exact 
            render = {props => <MyDebates {...props} />}
        />
        <Route path = {`${match.url}/create`} 
            render = {props => <CreateDebate {...props} />}
        />
        <Route path = {`${match.url}/:id`} 
            render = {props => <DebateViewer {...props} />}
        />
    </Switch>
)

Debates.propTypes = {
    location: PropTypes.object,
    match: PropTypes.object
}

export default Debates