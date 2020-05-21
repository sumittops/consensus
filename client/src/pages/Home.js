import React from 'react'
import styled from 'styled-components'



const Home =  () => {
    return <Root>
        <PageTitle>Consensus</PageTitle>
        <TextDisplay1>
            Lets resolve conflicts and reach consensus.
        </TextDisplay1>
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