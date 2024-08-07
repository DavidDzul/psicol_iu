import gql from "graphql-tag"

export const CREATE_GENERATION = gql`
  mutation ($createGenerationInput: CreateGenerationInput!) {
    createGeneration(createGenerationInput: $createGenerationInput) {
      id
      entryName
      inProgress
      campus
    }
  }
`
export const GET_GENERATIONS = gql`
  query getGenerations {
    findAllGenerations {
      id
      entryName
      inProgress
      campus
    }
  }
`
export const UPDATE_GENERATION = gql`
  mutation ($updateGenerationInput: UpdateGenerationInput!) {
    updateGeneration(updateGenerationInput: $updateGenerationInput) {
      id
      entryName
      inProgress
      campus
    }
  }
`
