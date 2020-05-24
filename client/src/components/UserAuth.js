import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'

import Modal from './shared/Modal'
import Button from './shared/Button'
import TextField from './shared/TextField'
import Title from './shared/Title'
import theme from '../theme'


const UserAuthenticator = ({ open, onClose, defaultMode = 'signIn' }) => {
    const [login, setLogin] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [mode, setMode] = useState(defaultMode)
    
    const [signIn, signInResponse] = useMutation(SIGN_IN)
    const [signUp, signUpResponse] = useMutation(SIGN_UP)
    
    
    useEffect(() => {
        if(open === false) {
            setLogin('');
            setEmail('')
            setPassword('')
        }
        setMode(defaultMode)
    }, [open, defaultMode])  

    const handleText = e => {
        if (e.target.name === 'login') {
            setLogin(e.target.value)
        }
        if (e.target.name === 'password') {
            setPassword(e.target.value)
        }
        if (e.target.name === 'email') {
            setEmail(e.target.value)
        }
    }

    const delayedPageRefresh = () => {
        setTimeout(() => {
            window.location.reload();
        }, 500);
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
                delayedPageRefresh();
                onClose(true);
            }
        }
    }

    const onSignUp = async () => {
        if (login.trim().length && password.trim().length > 6 && email.trim().length > 6) {
            const response = await signUp({
                variables: {
                    username: login,
                    email,
                    password
                } 
            });
            if (response.data) {
                const { signUp: { token } } = response.data;
                localStorage.setItem('authToken', token);
                delayedPageRefresh();
                onClose(true);
            }
        }
    }

    if (!open) return null;
    const titleStr = mode !== 'signUp' ? 'Hello! Good to see you back' : 'Welcome to the club. Apply today.';

    return <Modal onClose = {onClose}>
        <Content>
            <TabBar>
                <Tab active = {mode !== 'signUp'} onClick = {() => setMode('signIn')}>Sign In</Tab>
                <Tab active = {mode === 'signUp'} onClick = {() => setMode('signUp')}>Sign Up</Tab>
            </TabBar>
            <Title>{titleStr}</Title>
            <TextField 
                name = "login"
                label = "Username" 
                placeholder = {mode !== 'signUp' 
                    ? "Username / Email address" :
                    "Enter username"
                }
                value = {login}
                onChange = {handleText}
                
            />
            { mode === 'signUp' ? <TextField 
                name = "email"
                label = "Email Address" 
                placeholder = "Email address"
                value = {email}
                onChange = {handleText}
             /> : null 
            }
            <TextField
                name = "password"
                type = "password"
                label = "Password"
                placeholder = "**********"
                value = {password}
                onChange = {handleText}
            />
            <Button
                onClick = { mode !== 'signUp' ? onSignIn : onSignUp}
                disabled = {signInResponse.loading}
            >
                {mode === 'signUp' ? 'Register' : 'Sign In' }
            </Button>
        </Content>
    </Modal>
}

UserAuthenticator.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    mode: PropTypes.string
}

const Content = styled.div `
    width: 360px;
    padding: 16px;
    border-radius: 16px;
    background-color: #fff;
`

const TabBar = styled.div`
    display: flex;

`

const Tab = styled.div `
    padding: 12px 8px;
    cursor: ${props => props.active ? 'initial' : 'pointer'};
    font-weight: ${props => props.active ? '500' : '300'};
    margin-right: 8px;
    color: ${props => props.active ? theme.color.primaryColor : theme.color.foregroundColor};
    border-bottom: ${props => props.active ? `solid 1px #7f98ff` : 'none'};
`

const SIGN_IN = gql `
    mutation signIn($login: String!, $password: String!) {
        signIn(login: $login, password: $password) {
            token
        }
    }
`
const SIGN_UP = gql `
    mutation signIn($username: String!, $email: String!, $password: String!) {
        signUp(username: $username, email: $email, password: $password) {
            token
        }
    }
`


export default UserAuthenticator