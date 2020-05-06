import React, { useState } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'

import Modal from './shared/Modal'
import Button from './shared/Button'
import TextField from './shared/TextField'
import Title from './shared/Title'


const UserAuthenticator = ({ open, onClose }) => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [signIn, signInResponse] = useMutation(SIGN_IN);

    const handleText = e => {
        if (e.target.name === 'login') {
            setLogin(e.target.value)
        }
        if (e.target.name === 'password') {
            setPassword(e.target.value)
        }
    }

    const onSignIn = async () => {
        if (login.trim().length && password.trim().length) {
            const response = await signIn({
                variables: {
                    login,
                    password
                } 
            });
            if (response.data) {
                const { signIn: { token } } = response.data;
                localStorage.setItem('authToken', token);
                onClose(true);
            }
        }
    }

    if (!open) return null;
    return <Modal onClose = {onClose}>
        <Content>
            <Title>Sab Changa Si</Title>
            <TextField 
                name = "login"
                label = "Username" 
                placeholder = "Username / Email address"
                value = {login}
                onChange = {handleText}
                
            />
            <TextField
                name = "password"
                type = "password"
                label = "Password"
                placeholder = "**********"
                value = {password}
                onChange = {handleText}
            />
            <Button
                onClick = {onSignIn}
                disabled = {signInResponse.loading}
            >
                Sign In
            </Button>
        </Content>
    </Modal>
}

UserAuthenticator.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func
}

const Content = styled.div `
    width: 360px;
    padding: 16px;
    border-radius: 16px;
    background-color: #fff;
`

const SIGN_IN = gql `
    mutation signIn($login: String!, $password: String!) {
        signIn(login: $login, password: $password) {
            token
        }
    }
`

export default UserAuthenticator