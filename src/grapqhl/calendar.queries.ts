import gql from "graphql-tag"

export const GET_CALENDAR = gql`
  query getGenerations {
    findAllCalendar {
      id
      name
      generationId
      date
    }
  }
`
export const CREATE_CALENDAR = gql`
  mutation ($createCalendarInput: CreateCalendarInput!) {
    createCalendar(createCalendarInput: $createCalendarInput) {
      id
      name
      generationId
      date
    }
  }
`
export const UPDATE_CALENDAR = gql`
  mutation ($updateCalendarInput: UpdateCalendarInput!) {
    updateCalendar(updateCalendarInput: $updateCalendarInput) {
      id
      name
      generationId
      date
    }
  }
`
export const DELETE_CALENDAR = gql`
  mutation ($id: Int!) {
    removeCalendar(id: $id) {
      message
    }
  }
`
