import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Title = ({ children, variant = 'h3', ...rest }) =>  (
    <StyledTitle 
        variant = {variant}
        {...rest}
    >
        {children}
    </StyledTitle>
)


Title.propTypes = {
    children: PropTypes.string,
    variant: PropTypes.string,
    rest: PropTypes.arrayOf(PropTypes.any)
}

const mapVariantToSize = (variant) => {
    switch(variant) {
        case 'h1': return 32;
        case 'h2': return 24;
        case 'h3': return 18;
        case 'h4': return 16;
        case 'h5': return 14;
        case 'h6': return 14;
        default: return 18;
    }
}

const StyledTitle = styled.div `
    font-family: 'Muli', sans-serif;
    font-size: ${props => mapVariantToSize(props.variant)}px;
    font-weight: 500;
    margin: 12px 0;
`
export default Title