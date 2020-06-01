import React, { useState, createContext, useContext } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'

import SideNav from './components/SideNav'
import UserAuth from './components/UserAuth'

import Home from './pages/Home'
import Debates from './pages/Debates'
import theme from './theme'


export const useAppState = () => {
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [defaultAuthMode, setDefaultAuthMode] = useState('signIn');
    return {
        authModalOpen,
        defaultAuthMode,
        setAuthModalOpen,
        setDefaultAuthMode
    }
}

export const AppStateContext = createContext();

const App = () => {
    const { authModalOpen,
        defaultAuthMode,
        setAuthModalOpen,
        setDefaultAuthMode } = useContext(AppStateContext);
    return (
        <>
            <Root>
                <Router>
                    <SideNav setAuthOpen = {(defaultMode) => {
                        setAuthModalOpen(true)
                        setDefaultAuthMode(defaultMode)
                    }} />
                    <Content>
                        <Switch>
                            <Route path = "/" exact
                                render = {props => <Home {...props} />}
                            />
                            <Route path = "/debates"
                                render = {
                                    props => <Debates {...props }/>
                                }
                            />
                        </Switch>
                    </Content>
                </Router>
            </Root>
            <UserAuth 
                open = { authModalOpen }
                onClose = {() => setAuthModalOpen(false)}
                defaultMode = {defaultAuthMode}
            />
        </>
    )
};

const Root = styled.div`
    overflow: hidden;
    display: flex;
`
const Content = styled.div`
    flex: 1;
    width: calc(100vw - 265px);
    box-sizing: border-box;
    background-color: ${theme.color.backgroundColor};
    color: ${theme.color.foregroundColor};
`

export default App