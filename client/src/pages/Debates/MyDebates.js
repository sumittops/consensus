import React from 'react'
import styled from 'styled-components'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'
import Title from '../../components/shared/Title'
import Text from '../../components/shared/Text'

const MyDebates = ({ history, match }) => {
    const { loading, data } = useQuery(GET_MY_DEBATES)

    return <Root>
        <Title variant = "h1">My Debates</Title>
        { loading && <Title variant = "h4">Loading</Title>}
        { data && data.debates && data.debates.map(debate => (
            <DebateListItem key = {debate.id} onClick = {() => {
                history.push(`${match.url}/${debate.id}`);
            }}>
                <Title variant = "h2">{debate.title}</Title>
                <Text>{debate.description}</Text>
                <Text variant = "display4">{debate.forParticipant.username} vs {debate.againstParticipant.username}</Text>
            </DebateListItem>
        ))}
        { data && data.debates && data.debates.length === 0 && (
            <div>
                <Title>No Debates Yet!</Title>
                <Text>Create Yours</Text>
            </div>
        )}
    </Root>

}

MyDebates.propTypes = {
    history: PropTypes.object,
    match: PropTypes.object
}

const GET_MY_DEBATES = gql `
    {
        debates {
            id
            title
            description
            forParticipant {
                id
                username
            }
            againstParticipant {
                id
                username
            }
        }
    }
`
const Root = styled.div `
    padding: 12px 18px;
`
const DebateListItem = styled.div `
    margin: 20px 0;
    padding: 12px 16px;
    background-color: #fff;
    cursor: pointer;
`


export default MyDebates