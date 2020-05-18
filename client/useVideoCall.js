import { useMutation, useSubscription } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { useState } from 'react';

const { RTCPeerConnection, RTCSessionDescription } = window;
const MEDIA_CONSTRAINTS = {
    video: true,
    audio: true
}

const useVideoCall = (debateId, meId) => {
    
    const [peerConnection] = useState(new RTCPeerConnection());
    // const [onCall, setOnCall] = useState(false)
    const [activeCall, setActiveCall] = useState(null);
    const [localStream, setLocalStream] = useState(null)
    const [remoteStream, setRemoteStream] = useState(null)
    
    const [makeCallApi] = useMutation(MAKE_CALL)
    const [endCallApi] = useMutation(END_CALL)
    const [acceptCallApi] = useMutation(ACCEPT_CALL)

    peerConnection.ontrack = ({ streams: [stream] }) => {
        setRemoteStream(stream);
    }

    useSubscription(
        USER_CALLED, {
            async onSubscriptionData({ subscriptionData }) {
                const { data: { userCalled: data } } = subscriptionData
                console.log('data.to === meId', data.to === meId);
                if (data.to === meId) {
                    console.log('call received');
                    await peerConnection.setRemoteDescription(
                        new RTCSessionDescription(data.offer)
                    )
                    const stream = await navigator.mediaDevices.getUserMedia(MEDIA_CONSTRAINTS);
                    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream))
                    const answer = await peerConnection.createAnswer()
                    await peerConnection.setLocalDescription(new RTCSessionDescription(answer))
                    acceptCall(answer);
                    setActiveCall(data)
                    console.log('call accepted');
                }
            }
        }
    )
    useSubscription(CALL_ACCEPTED, {
        async onSubscriptionData({ subscriptionData }) {
            const { data: { callAccepted: data }  } = subscriptionData
            if (data.answer && data.from == meId) {
                console.log('current pc', peerConnection.localDescription);
                await peerConnection.setRemoteDescription(
                    new RTCSessionDescription(data.answer)
                )                
                // setOnCall(true)
                setActiveCall(data)
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

    
    async function makeCall(caller, callee) {
        const stream = await window.navigator.mediaDevices.getUserMedia(MEDIA_CONSTRAINTS)
        const offer = await peerConnection.createOffer()
        await peerConnection.setLocalDescription(new RTCSessionDescription(offer))
        await makeCallApi({ variables: { to: callee, from: caller, offer, debateId }})
        stream.getTracks().forEach(
            track => peerConnection.addTrack(track, stream)
        )
        setLocalStream(stream)
    }

    async function acceptCall(answer) {
        await acceptCallApi({
            variables: {
                debateId,
                offer: answer
            }
        })
        setActiveCall({ ...activeCall, answer });
        // setOnCall(true)
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
    mutation makeCall($debateId: ID!, $from: ID!, $to: ID!, $offer: RTCOfferInput!) {
        makeCall(debateId: $debateId, from: $from, to: $to, offer: $offer)
    }
`

const ACCEPT_CALL = gql `
    mutation acceptCall($debateId: ID!, $offer: RTCOfferInput!) {
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
            to
            from
            answer {
                type
                sdp
            }
            offer {
                type
                sdp
            }
        }
    }
`

const CALL_ACCEPTED = gql `
    subscription onCallAccepted {
        callAccepted {
            to
            from
            answer {
                type
                sdp
            }
            offer {
                type
                sdp
            }
        }
    }
`

const CALL_ENDED = gql `
    subscription onCallEnded {
        callEnded
    }
`

export default useVideoCall