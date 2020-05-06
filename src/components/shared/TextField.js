import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import theme from '../../theme'



const TextField = ({ value, onChange, label, error, width, height, multiline, placeholder, ...rest }) => {
    return <Root width = {width}>
        <Label>{label}</Label>
        { !multiline && <Input 
                value = {value} 
                placeholder = {placeholder}
                onChange = {onChange} 
                width = {width}
                height = {height}
                {...rest}    
            /> 
        }
        { multiline && <TextArea 
            value = {value}
            placeholder = {placeholder}
            onChange = {onChange}
            width = {width}
            height = {height} {...rest} /> 
        }
        <Error>{error}</Error>
    </Root>
}

TextField.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    label: PropTypes.string,
    error: PropTypes.string,
    height: PropTypes.oneOf([PropTypes.number, PropTypes.string]),
    width: PropTypes.oneOf([PropTypes.number, PropTypes.string]),
    multiline: PropTypes.bool,
    placeholder: PropTypes.string,
    rest: PropTypes.arrayOf(PropTypes.any)
}

const Root = styled.div `
    padding: 12px 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
`

const Label = styled.div `
    font-size: 13px;
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
    margin-bottom: 6px;
`
const Input = styled.input `
    width: ${props => props.width || 'initial'};
    height: ${props => props.height || 'initial'};
    font-size: 14px;
    font-weight: 400;
    padding: 12px 8px;
    border-radius: 4px;
    border: solid 1px #ccc;
    &:focus {
        outline: none;
        border: solid 1px ${theme.color.primaryDarkColor};
    }
    &::placeholder {
        font-weight: 300;
        font-size: 13px;
        font-family: 'Muli', sans-serif;
    }
`

const TextArea = styled.textarea`
    width: ${props => props.width || 'initial'};
    height: ${props => props.height || 160};
    font-size: 14px;
    font-weight: 400;
    padding: 12px 8px;
    border-radius: 4px;
    border: solid 1px #ccc;
    &:focus {
        outline: none;
        border: solid 1px ${theme.color.primaryDarkColor};
    }
    &::placeholder {
        font-weight: 300;
        font-size: 13px;
        font-family: 'Muli', sans-serif;
    }
`

const Error = styled.div `
    font-size: 12px;
    color: #e00;
    font-weight: 300;
    margin-top: 4px;

`

export default TextField