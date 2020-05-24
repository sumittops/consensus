import React from 'react'
import styled from 'styled-components'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import theme from '../theme'
import useUserSession from '../useUserSession'

const SideNav = ({ location, setAuthOpen }) => {
    const { data } = useUserSession();
    const hideSignUp = data && data.me;
    return (
        <Root>
            <AppBrand>Consensus</AppBrand>
            {
                links.map(({ label, route, match }) =>
                    <NavPill to = {route} active = {match.test(location.pathname).toString()} key = {route}>
                        { label }
                    </NavPill>
                )
            }
            <Flexer />
            { !hideSignUp && <SignUpPill>
                    <SubButton withBorder onClick = {() => setAuthOpen('signIn')}>
                        Sign In
                    </SubButton>
                    <SubButton onClick = {() => setAuthOpen('signUp')}>
                        Sign Up
                    </SubButton>
                </SignUpPill>
            }
            { hideSignUp && <NavPill to = "/profile">
                { data.me && data.me.username }
            </NavPill>}
        </Root>
    )
}

SideNav.propTypes = {
    location: PropTypes.object,
    setAuthOpen: PropTypes.func
}


const links = [{
    label: 'Home',
    route: '/',
    match: /^\/?$/,
}, {
    label: 'Debates',
    route: '/debates',
    match: /\/debates\/?.*/g

}];

const Root = styled.div`
    width: 265px;
    background-color: #c0ccfb;
    color: ${theme.color.foregroundColor};
    padding: 20px;
    height: 100vh;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
`

const AppBrand = styled.div`
    height: 120px;
    display: flex;
    font-family: 'Muli', sans-serif;
    font-weight: bold;
    font-weight: 600;
    font-size: 26px;
    align-items: center;
    justify-content: center;
`

const NavPill = styled(Link)`
    font-family: 'Muli', sans-serif;
    font-size: 20px;
    font-weight: bold;
    display: block;
    text-align: center;
    text-decoration: none;
    color: ${theme.color.foregroundColor};
    padding: 12px;
    margin-bottom: 8px;
    border-radius: 30px;
    background-color: ${props => props.active === 'true' ? theme.color.primaryDarkColor : theme.color.primaryColor};
    border: solid 1px transparent;
    &:hover {
        border: solid 1px ${theme.color.primaryDarkColor};
    }
`
const SignUpPill = styled.div`
    font-family: 'Muli', sans-serif;
    font-size: 20px;
    font-weight: 500;
    display: block;
    text-align: center;
    text-decoration: none;
    background-color: ${props => props.backgroundColor || '#fff'};
    margin-bottom: 8px;
    border-radius: 30px;
    border: solid 1px #fff;
    display: flex;
    align-items: stretch;
    padding: 2px 0;
`

const SubButton = styled.div`
    cursor: pointer;
    flex: 1;
    color: #666;
    padding: 10px;
    border-right: solid 1px ${props => props.withBorder ? '#ccc' : 'transparent'};
`

const Flexer = styled.div `
    flex: 1;
    display: flex;
    flex-direction: column-reverse;
    padding: 20px 0;
    justify-content: flex-end;
`


export default withRouter(SideNav)