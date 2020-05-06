import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

const useUserSession = () => {
    const token = localStorage.getItem('authToken')
    const meData = useQuery(GET_ME);
    if (token && meData && meData.data) {
        return meData;
    }
    return {};
}

const GET_ME = gql `
    {
        me {
            id
            username
            email
        }
    }
`
export default useUserSession