import gql from "graphql-tag"

export const GET_USERS_ATTENDANCE = gql`
  query findAllUsers {
    findAllUsers {
      id
      firstName
      lastName
      enrollment
      campus
      generationId
    }
  }
`

export const ATTENDANCE_USERS = gql`
  mutation findAttendanceUsers($campus: CampusEnum!, $generation: Int!, $date: String!) {
    findAttendanceUsers(campus: $campus, generation: $generation, date: $date) {
      id
      checkIn
      checkOut
      delay
      justifiedDelay
      justifiedAbsence
      reason
      descripcion
      userAttendance {
        id
        firstName
        lastName
        enrollment
      }
    }
  }
`

export const CREATE_ATTENDANCE = gql`
  mutation ($createAttendanceInput: CreateAttendanceInput!) {
    createAttendance(createAttendanceInput: $createAttendanceInput) {
      id
    }
  }
`
export const UPDATE_ATTENDANCE = gql`
  mutation ($updateAttendanceInput: UpdateAttendanceInput!) {
    updateAttendance(updateAttendanceInput: $updateAttendanceInput) {
      id
      checkIn
      checkOut
      delay
      justifiedDelay
      justifiedAbsence
      reason
      descripcion
      userAttendance {
        id
        firstName
        lastName
        enrollment
      }
    }
  }
`
