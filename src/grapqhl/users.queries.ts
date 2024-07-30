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
      role
      campus
      generationId
    }
  }
`
export const SEATCH_USERS = gql`
  mutation ($campus: CampusEnum!, $generation: Int!) {
    searchAllUsers(campus: $campus, generation: $generation) {
      id
      firstName
      lastName
      email
      phone
      active
      enrollment
      role
      campus
      active
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
      role
      campus
      active
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
      role
      campus
      active
      images {
        id
        url
      }
      documents {
        id
        userId
        name
        fileId
        startDate
        endDate
      }
    }
  }
`

export const ADD_PHOTO_TO_USER = gql`
  mutation createPhoto($userId: Int!, $photo: Upload!) {
    createPhoto(userId: $userId, photo: $photo) {
      id
      userId
      url
      createdAt
    }
  }
`

export const DELETE_PHOTO_FROM_USER = gql`
  mutation ($id: Int, $userId: Int!) {
    removePhoto(userId: $userId, id: $id) {
      message
    }
  }
`

export const ADD_FILE_TO_USER = gql`
  mutation ($startDate: String!, $endDate: String!, $recordFile: Upload!, $userId: Int!) {
    createConstancy(startDate: $startDate, endDate: $endDate, recordFile: $recordFile, userId: $userId) {
      id
      userId
      fileId
      name
      startDate
      endDate
    }
  }
`

export const DELETE_CONSTANCY_TO_USER = gql`
  mutation ($id: Int!) {
    removeConstancy(id: $id) {
      message
    }
  }
`
