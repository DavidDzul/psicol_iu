import gql from "graphql-tag"

export const CREATE_USER = gql`
  mutation ($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      id
      firstName
      lastName
      email
      phone
      active
      enrollment
      campus
      generationId
    }
  }
`
export const GET_USERS = gql`
  query findAllUsers($campus: CampusEnum!, $generation: Int!) {
    findAllUsers(campus: $campus, generation: $generation) {
      id
      firstName
      lastName
      email
      password
      enrollment
      phone
      active
      campus
      generationId
    }
  }
`

export const TEST_USERS = gql`
  mutation ($campus: CampusEnum!, $generation: Int!) {
    testFindUsers(campus: $campus, generation: $generation) {
      id
      firstName
      lastName
      email
      phone
      active
      enrollment
      campus
    }
  }
`

export const UPDATE_USER = gql`
  mutation ($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput) {
      id
      firstName
      lastName
      email
      phone
      active
      enrollment
      campus
    }
  }
`

export const GET_USER = gql`
  query getUser($id: Int!) {
    findOneUser(id: $id) {
      id
      firstName
      lastName
      email
      phone
      active
      enrollment
      campus
    }
  }
`
