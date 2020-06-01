import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http'
import { ApolloLink, from, split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { onError } from 'apollo-link-error'
import { getMainDefinition } from 'apollo-utilities'
import { InMemoryCache } from 'apollo-cache-inmemory'

import { ApolloProvider } from '@apollo/react-hooks'
import App, { useAppState, AppStateContext } from './App'
import ErrorDisplay from './components/shared/ErrorDisplay'
import { AppErrorContext, useAppError } from './components/shared/ErrorDisplay'


const httpLink = new HttpLink({
    uri: process.env.GRAPHQL_HOST
});

const wsLink = new WebSocketLink({
    uri: process.env.GRAPHQL_WS_HOST,
    options: {
        reconnect: true,
        connectionParams: {
            authorization: localStorage.getItem('authToken')
        }
    }
});



const authLink = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers = {}}) => {
        const token = localStorage.getItem('authToken');
        if (!token) return { headers };
        return {
            headers: {
                ...headers,
                authorization: token
            }
        }
    });
    return forward(operation);
});

const terminalLink = split(({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription'

}, wsLink, authLink.concat(httpLink))

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.log('GraphQL error:', message, 'locations:', locations, 'path:', path);
      });
    }
  
    if (networkError) {
      console.log('Network error', networkError);
    }
});


const client = new ApolloClient({
    link: from([errorLink, terminalLink]),   
    cache: new InMemoryCache()
});

const Main = () => {

    const appError = useAppError()
    const appState = useAppState()
    return (
        <ApolloProvider client = {client}>
            <ThemeProvider theme = {{ mode: 'light' }}>
            <AppErrorContext.Provider value  = {appError}>
                <AppStateContext.Provider value = {appState}>
                    <App />
                    <ErrorDisplay />
                </AppStateContext.Provider>
            </AppErrorContext.Provider>
            </ThemeProvider>
        </ApolloProvider>
    )
}

ReactDOM.render(
    <Main />,
    document.querySelector('#app')
);
