import React, { createContext, useReducer, useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import Title from './Title'
import Text from './Text'

const initialState = {
    errors: []
}

export const AppErrorContext = createContext({})

export const useAppError = () => {
    const [errors, setErrors] = useState([])
    const [deleteErrorRoutine, setDeleteErrorRoutine] = useState(null)


    const addError = payload => {
        const timestamp = new Date()
        const updated = [
            ...errors,
            {
                ...payload,
                timestamp,
                deleteAt: new Date(timestamp.getTime() + 3000)
            }
        ];
        setErrors(updated)
    }

    const deleteError = idx => {
        const updated = [...errors.slice(0, idx), ...errors.slice(idx + 1)]
        setErrors(updated);
    }

    useEffect(() => {
        const interval = setInterval(() => {
            errors.forEach((error, idx) => {
                if (error.deleteAt <= new Date()) {
                    deleteError(idx)
                }
            })
        }, 1000)
        setDeleteErrorRoutine(interval)

        return () => {
            clearInterval(deleteErrorRoutine)
        }
    }, [errors]);


    return { addError, deleteError, errors }
}

const ErrorDisplay = () => {
    const { errors } = useContext(AppErrorContext);
    if (errors.length) {
        return (
            <Root>
                { errors.map((error, idx) => <ErrorRoot key = {`app-error-${idx}`}>
                    <Title>{error.title}</Title>
                    <Text>{error.description}</Text>
                </ErrorRoot>)}
            </Root>
        );
    }
    return null;
}


const ErrorRoot = styled.div `
    padding: 12px 16px;
    max-width: 420px;
    box-shadow: 0 0 1px #ccc;
    border-radius: 5px;
    background-color: #fff;
`

const Root = styled.div `
    display: flex;
    flex-direction: column-reverse;
    position: fixed;
    z-index: 9999;
    align-items: center;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;

`


export default ErrorDisplay;