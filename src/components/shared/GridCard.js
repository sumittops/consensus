import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const GridCard = ({ author, title, message }) => (
    <Root>
        <Title>{title}</Title>
        <Desc>{message}</Desc>
        <Footer>{author}</Footer>
    </Root>    
)
GridCard.propTypes = {
    author: PropTypes.string,
    title: PropTypes.string,
    message: PropTypes.string
}

const Root = styled.div`
    min-width: 210px;
    height: 140px;
    box-shadow: 0 0 3px 2px #eee;
    border-radius: 4px;
    padding: 6px;
    display: flex;
    flex-direction: column;
    margin: 2px 6px 2px 2px;
`

const Title = styled.div`
    font-size: 18px;
    font-weight: 600;
    font-family: 'Muli', sans-serif;
`
const Desc = styled.div `
    font-size: 14px;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    margin-top: 8px;
    color: #333;
`

const Footer = styled.div`
    font-size: 12px;
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
    color: #999;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
`

export default GridCard