import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import styled from 'styled-components'
import Title from '../../components/shared/Title'
import TextField from '../../components/shared/TextField'
import Button from '../../components/shared/Button'
import FormContainer from '../../components/shared/FormContainer'



const CreateDebate = ({ history, match }) => {
    const [createDebate, createDebateState] = useMutation(CREATE_DEBATE)
    const [formState, setFormState] = useState({
        title: '',
        description: '',
        forParticipant: '',
        againstParticipant: ''
    })

    const handleSubmit = () => {
        const valid = Object.keys(formState).reduce(
            (agg, key) => agg && formState[key].trim().length > 0,
            true
        )
        if (valid) {
            createDebate({
                variables: {
                    ...formState
                }
            })
        }

    }

    const handleFormFieldChange = (e) => {
        const { name, value } = e.target;
        setFormState({
            ...formState,
            [name]: value
        })
    }

    return <Root>
        <FormContainer>
            <Title variant = "h2">Add a debate</Title>
            <TextField
                name = "title"
                label = "Title for debate"
                value = {formState['title']}
                onChange = {handleFormFieldChange}
            />
            <TextField
                name = "description"
                label = "Description"
                multiline
                value = {formState['description']}
                onChange = {handleFormFieldChange}
            />
            <EndFlex>
                <Button variant = "outline"
                    onClick = {() => history.push('/debates')}
                >
                    Cancel
                </Button>
                <Divider />
                <Button
                    onClick = {handleSubmit}
                >
                    Add
                </Button>
            </EndFlex>
        </FormContainer>
    </Root>
}

const CREATE_DEBATE = gql `
    mutation createDebate($title: String!, $description: String, $forParticipant: ID!, $againstParticipant: ID!) {
        createDebate(title: $title, description: $description, forParticipant: $forParticipant, againstParticipant: $againstParticipant) {
            id
        }
    }
`

const EndFlex = styled.div `
    padding: 24px 0;
    display: flex;
    justify-content: flex-end;
`

const Divider = styled.div `
    width: 12px;
    height: 16px;
` 

const Root = styled.div `
    padding: 12px 18px;
`



export default CreateDebate