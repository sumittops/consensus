import styled from 'styled-components'
import theme from '../../theme'

const Chip = styled.div `
    background-color: ${theme.color.backgroundColor};
    padding: 4px 16px;
    border-radius: 30px;
    border: solid 1px #ccc;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    transition: all 0.3s ease-in;
    cursor: pointer;
    margin-top: 8px;
    margin-right: 6px;
    &:hover {
        background-color: #fff;
    }
`

export default Chip;