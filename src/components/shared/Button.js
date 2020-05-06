import React from 'react'
import styled from 'styled-components'
import theme from '../../theme'
import PropTypes from 'prop-types'


const Button = ({ onClick, children, variant = 'solid', ...rest }) => {
    return <Root
        variant = {variant}
        onClick = {onClick} 
        {...rest}
    >
        { children }
    </Root>
}

Button.propTypes = {
    onClick: PropTypes.func,
    children: PropTypes.node,
    variant: PropTypes.string
}


const Root = styled.div `
    cursor: pointer;
    min-width: 100px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.variant === 'outline' ? theme.color.primaryColor : '#fff' };
    background-color: ${props => props.variant == 'outline' ? '#fff' : theme.color.primaryColor};
    border: solid 1px ${theme.color.primaryColor};
    border-radius: 30px;
    box-sizing: border-box;
    padding: 8px 20px;
    box-shadow: ${props => props.variant === 'raised' ? '0px 1px 1px 1px #b1afaf' : 'none'};
    transition: all 0.3s ease-in;
    &:hover {
        background-color: ${theme.color.primaryDarkColor};
        color: #fff;
    }

`
export default Button
