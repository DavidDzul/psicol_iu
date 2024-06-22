import gql from "graphql-tag"

export const CREATE_GENERATION = gql`
  mutation ($createGenerationInput: CreateGenerationInput!) {
    createGeneration(createGenerationInput: $createGenerationInput) {
      id
      generation
      inProgress
      campus
    }
  }
`
export const GET_GENERATIONS = gql`
  query getGenerations {
    findAllGenerations {
      id
      generation
      inProgress
      campus
    }
  }
`
export const UPDATE_GENERATION = gql`
  mutation ($updateGenerationInput: UpdateGenerationInput!) {
    updateGeneration(updateGenerationInput: $updateGenerationInput) {
      id
      generation
      inProgress
      campus
    }
  }
`
