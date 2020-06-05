import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { FaTimes } from 'react-icons/fa'

const Modal = ({ children, onClose }) => (
    <Root>
        <Overlay>
            <Header>
                <IconButton id = "close-button" onClick = {onClose}>
                    <FaTimes size = {32} color = "#fff"/>
                </IconButton>
            </Header>
            <Content>
                { children }
            </Content>
        </Overlay>
    </Root>
)

Modal.propTypes = {
    children: PropTypes.element,
    onClose: PropTypes.func
}

const Root = styled.div `
    position: fixed;
    height: 100vh;
    width: 100vw;
    top: 0;
`

const IconButton = styled.div `
    height: 32px;
    width: 32px;
    border-radius: 12px;
    padding: 8px;
    &:hover {
        cursor: pointer;
        background-color: #333a;
    }
    position: relative;
    z-index: 1;
`

const Header = styled.div `
    padding: 20px 32px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-end;
`

const Content = styled.div `
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transform: translate(0, -50px);
`

const Overlay = styled.div `
    zIndex: 99;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
`

export default Modal