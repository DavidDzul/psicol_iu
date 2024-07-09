import gql from "graphql-tag"

export const GET_AUTORIZATION = gql`
  mutation searchAllUsers($campus: CampusEnum!, $generation: Int!, $date: String!) {
    searchAllUsers(campus: $campus, generation: $generation, date: $date) {
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
      attendanceMap(date: $date) {
        id
        userId
        checkIn
        checkOut
        delay
        justifiedDelay
        justifiedAbsence
      }
    }
  }
`