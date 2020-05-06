import { useMutation, useSubscription } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { useState } from 'react';

const { RTCPeerConnection, RTCSessionDescription } = window;

const useVideoCall = (caller, callee, debateId) => {

    const [onCall, setOnCall] = useState(false)
    const [peerConnection, setPeerConnection] = useState(null)
    const [activeCall, setActiveCall] = useState(null);
    const [localStream, setLocalStream] = useState(null)
    const [remoteStream, setRemoteStream] = useState(null)
    
    const [makeCallApi] = useMutation(MAKE_CALL)
    const [endCallApi] = useMutation(END_CALL)
    const [acceptCallApi] = useMutation(ACCEPT_CALL)


    useSubscription(
        USER_CALLED, {
            async onSubscriptionData({ subscriptionData }) {
                console.log('call received', subscriptionData);
                await peerConnection.setRemoteDescription(
                    subscriptionData.callerOffer
                )
                setOnCall(true)
                // setActiveCall(subscriptionData)
            }
        }
    )
    useSubscription(CALL_ACCEPTED, {
        async onSubscriptionData({ subscriptionData }) {
            console.log('call accepted', subscriptionData);
            if (!onCall) {
                await peerConnection.setRemoteDescription(
                    subscriptionData.callerOffer
                )
                // setActiveCall(subscriptionData)
                setOnCall(true)
            }
        }
    })
    useSubscription(
        CALL_ENDED,
        {
            onSubscriptionData(endSuccess) {
                endSuccess && 
                peerConnection.close();
            }
        }
    )
    
    async function makeCall(stream) {
        const peerConnection = new RTCPeerConnection()
        const offer = await peerConnection.createOffer()
        await peerConnection.setLocalDescription(new RTCSessionDescription(offer))
        await makeCallApi({ variables: { calleeId: callee, callerId: caller, offer }})
        peerConnection.getTracks().forEach(
            track => peerConnection.addTrack(track, stream)
        )
        peerConnection.ontrack = ({ streams: [stream] }) => {
            setRemoteStream(stream);
        }
        setPeerConnection(peerConnection)
        setLocalStream(stream)
    }

    async function acceptCall() {
        const answer = await peerConnection.createAnswer()
        await peerConnection.setLocalDescription(new RTCSessionDescription(answer))
        await acceptCallApi({
            variables: {
                debateId,
                offer: answer
            }
        })
        peerConnection.ontrack = ({ streams: [stream] }) => {
            setRemoteStream(stream);
        }
    }

    async function endCall(debateId) {
        await endCallApi({
            variables: { debateId }
        })
    }


    return [
        activeCall,
        localStream,
        remoteStream, 
        { 
            makeCall, acceptCall, endCall
        }
    ]
}

const MAKE_CALL = gql `
    mutation makeCall($callerId: ID!, $calleeId: ID!, $offer: RTCOfferInput!) {
        makeCall(callerId: $callerId, calleeId: $calleeId, offer: $offer)
    }
`

const ACCEPT_CALL = gql `
    mutation acceptCall($debateId: ID!, $offer: RTCOfferInput) {
        acceptCall(debateId: $debateId, offer: $offer)
    }
`

const END_CALL = gql `
    mutation endCall($debateId: ID!) {
        endCall(debateId: $debateId)
    }
`
const USER_CALLED = gql `
    subscription onUserCalled {
        userCalled {
            calleeId
            callerId
            calleeOffer
            callerOffer
        }
    }
`

const CALL_ACCEPTED = gql `
    subscription onCallAccepted {
        callAccepted {
            calleeId
            callerId
            calleeOffer
            callerOffer
        }
    }
`

const CALL_ENDED = gql `
    subscription onCallEnded {
        callEnded
    }
`

export default useVideoCall