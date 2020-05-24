import React from 'react'
import styled from 'styled-components'

import Title from '../components/shared/Title'
import Text from '../components/shared/Text'


const Home =  () => {
    return <Root>
        <Title variant = "h1">Consensus</Title>
        <Text>
            Lets resolve conflicts and reach consensus.
        </Text>
    </Root>
}

const Root = styled.div`
    padding: 24px 32px;
`

const PageTitle = styled.div`
    font-family: 'Muli', sans-serif;
    font-size: 32px;
    font-weight: 600;
    margin-bottom: 12px;
`

const TextDisplay1 = styled.div`
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
    font-weight: 400;
`


export default Home;