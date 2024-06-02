import gql from "graphql-tag"

export const GET_PROFILE = gql`
  query {
    profile {
      id
      firstName
      lastName
      email
    }
  }
`
export const ADMIN_LOGIN = gql`
  mutation ($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`
