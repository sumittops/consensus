import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import Title from '../../components/shared/Title'
import Text from '../../components/shared/Text'
import { useQuery, useMutation } from '@apollo/react-hooks'
import useUserSession from '../../useUserSession'
import useVideoCall from '../../useVideoCall'
import Button from '../../components/shared/Button'


const DebateViewer = ({ match }) => {
    let userId = null;
    let userType = 'viewer';
    const debateId = match.params.id;

    
    const forVideoRef = useRef(null)
    const againstVideoRef = useRef(null)
    
    var { data: userData } = useUserSession()
    var { data: debateData, loading: debateLoading  } = useQuery(GET_DEBATE, { variables: { id: debateId } });
    
    const [activeCall, localStream, remoteStream, callMethods] = useVideoCall(debateId, userData && userData.me && userData.me.id)

    

    const { data: onlineUsers } = useQuery(GET_ONLINE_USERS, { variables: {
        debateId: debateId
    }});
    
    const [ userConnected, userConnectedResp ] = useMutation(USER_CONNECTED)
    const [ userDisconnected ] = useMutation(USER_DISCONNECTED)

    useEffect(() => {
        if (userData && userData.me && userData.me.id) {
            userConnected({
                variables: {
                    userId: userData.me.id,
                    debateId: match.params.id
                }
            });
        }
        return () => {
            if (userData && userData.me && userData.me.id) {
                userDisconnected({
                    variables: {
                        userId: userData.me.id,
                        debateId: match.params.id
                    }
                })
            }
        }
    }, [userConnected, userDisconnected, userData]);

    useEffect(() => {
        if (userType === 'for') {
            forVideoRef.current.srcObject = localStream
            if (remoteStream) againstVideoRef.current.srcObject = remoteStream
        } else {
            if (remoteStream) forVideoRef.current.srcObject = remoteStream
            againstVideoRef.current.srcObject = localStream
        }
        // async function playStream() {
        //     if (forVideoRef.current.srcObject) {
        //         await forVideoRef.current.play();
        //     }
        //     if (againstVideoRef.current.srcObject) {
        //         await againstVideoRef.current.play();
        //     }
        // }
        // if (localStream || remoteStream) {
        //     playStream();
        // }
    }, [activeCall, remoteStream, localStream])
    
    if (userData && userData.me) {
        userId = userData.me.id;
    }
    
    let particpantsOnline = false;
    let userIsParticipant = false;
    if(debateData && debateData.debate && onlineUsers && onlineUsers.onlineUsers) {
        const { forParticipant, againstParticipant } = debateData.debate;
        const onlineUserIds =  onlineUsers.onlineUsers.map(d => d.id)
        particpantsOnline = onlineUserIds.includes(forParticipant.id) && onlineUserIds.includes(againstParticipant.id)
        userIsParticipant = [forParticipant.id, againstParticipant.id].includes(userId)
        if (userIsParticipant) {
            userType = userId === againstParticipant.id ? 'against' : 'for' 
        }
    }

    const handleCall = (e) => {
        e.preventDefault()
        callMethods.makeCall(
            userData.me.id,
            userIsParticipant && userType === 'for' 
            ? debateData.debate.againstParticipant.id
            : debateData.debate.forParticipant.id
        )
    }

    const handleAccept = async (e) => {
        e.preventDefault()
        await callMethods.acceptCall()
    }

    return <Root>
        <Header>
            { debateLoading && <Title>Loading</Title>}
            { debateData && debateData.debate && (
                <>
                    <Title variant = "h2">{ debateData.debate.title}</Title>
                    <Text style = {{ width: 560 }}>
                        {debateData.debate.description}
                    </Text>
                </>
            )
            }
        </Header>
        <Content>
            <ParticipantViewport type = "for">
                <ParticipantVideo ref = {forVideoRef} autoPlay/>
                <ArgumentSheet>
                    <Title variant = "h3">For</Title>
                    { debateData && debateData.debate && <Text>{debateData.debate.forParticipant.username}</Text> }
                    { debateData && debateData.debate && userId === debateData.debate.forParticipant.id && userConnectedResp && userConnectedResp.loading && <Text>Connecting...</Text>}
                    { debateData && debateData.debate && onlineUsers && onlineUsers.onlineUsers &&
                         onlineUsers.onlineUsers.find(user => user.id === debateData.debate.forParticipant.id) && <Text>Connected</Text>}
                </ArgumentSheet>
            </ParticipantViewport>
            <ParticipantViewport type = "against">
                <ParticipantVideo ref = {againstVideoRef}  autoPlay/>
                <ArgumentSheet>
                    <Title variant = "h3">Against</Title>
                    { debateData && debateData.debate && <Text>{debateData.debate.againstParticipant.username}</Text> }
                    { debateData && debateData.debate && userId === debateData.debate.againstParticipant.id && userConnectedResp && userConnectedResp.loading && <Text>Connecting...</Text>}
                    { debateData && debateData.debate && onlineUsers && onlineUsers.onlineUsers &&
                         onlineUsers.onlineUsers.find(user => user.id === debateData.debate.againstParticipant.id) && <Text>Connected</Text>}
                </ArgumentSheet>
            </ParticipantViewport>
            {  !activeCall && userIsParticipant && particpantsOnline && <StartButton>
                    <Button onClick = {handleCall}>
                        Start
                    </Button>
                </StartButton>
            }
            {  activeCall && activeCall.to == userData.me.id && <StartButton>
                    <Button onClick = {handleAccept}>
                        Accept
                    </Button>
                </StartButton>
            }
        </Content>
    </Root>
}

const GET_DEBATE = gql `
    query($id: ID!) {
        debate(id: $id) {
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

const GET_ONLINE_USERS = gql `
    query($debateId: ID!) {
        onlineUsers(debateId: $debateId) {
            id
            username
        }
    }
`


const USER_CONNECTED = gql `
    mutation($userId: ID!, $debateId: ID!) {
        userConnected(
            userId: $userId
            debateId: $debateId
        )
    }
`

const USER_DISCONNECTED = gql `
    mutation($userId: ID!, $debateId: ID!) {
        userDisconnected(
            userId: $userId
            debateId: $debateId
        )
    }
`


DebateViewer.propTypes = {
    match: PropTypes.object
}

const Root = styled.div `
    display: flex;
    flex-direction: column;
    align-items: stretch;
    height: 100%;
`

const Header = styled.div `
    padding: 12px 18px;
`

const Content = styled.div`
    display: flex;
    flex: 1;
    position: relative;
`

const StartButton = styled.div `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`

const ParticipantViewport = styled.div`
    position: relative;
    flex: 1;
    background-color: ${props => props.type === "against" ? 'rgba(250, 56, 94, 0.1)' : 'rgba(120, 202, 149, 0.1)'};
    border-right: solid 1px ${props => props.type === "for" ? '#ccc' : 'transparent'};
    display: flex;
    flex-direction: column-reverse;
`

const ArgumentSheet = styled.div `
    padding: 12px;
    margin: 32px 16px;
    background: #fff;
    border-radius: 30px;
    display: flex;
    flex-direction: column;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
`

const ParticipantVideo = styled.video `
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    z-index: 0;
`

export default DebateViewer;