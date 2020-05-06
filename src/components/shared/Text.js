import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Text = ({ children, variant = 'display3', ...rest }) => 
<StyledText variant = {variant} {...rest}>
    {children}
</StyledText>


Text.propTypes = {
    children: PropTypes.string,
    variant: PropTypes.string,
    rest: PropTypes.arrayOf(PropTypes.any)
}

const mapVariantToSize = (variant) => {
    switch(variant) {
        case 'display1': return 18;
        case 'display2': return 16;
        case 'display3': return 14;
        case 'display4': return 12;
    }
}

const StyledText = styled.div `
    font-family: 'Roboto', sans-serif;
    font-size: ${props => mapVariantToSize(props.variant)}px;
    font-weight: 400;
    color: #999;
    margin: 6px 0;
`
export default Text