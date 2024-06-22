export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

export type User = {
  __typename?: "User"
  id: Scalars["Int"]
  firstName: Scalars["String"]
  lastName: Scalars["String"]
  email: Scalars["String"]
  password: Scalars["String"]
  enrollment: Scalars["String"]
  phone?: Maybe<Scalars["String"]>
  active: Scalars["Boolean"]
  campus: CampusEnum
  generationId?: Maybe<Scalars["Float"]>
  createdAt: Scalars["String"]
  updatedAt: Scalars["String"]
  generation?: Maybe<Generation>
}

export enum CampusEnum {
  Merida = "MERIDA",
  Valladolid = "VALLADOLID",
  Tizimin = "TIZIMIN",
  Oxkutzcab = "OXKUTZCAB",
}

export type Admin = {
  __typename?: "Admin"
  id: Scalars["Int"]
  firstName: Scalars["String"]
  lastName: Scalars["String"]
  email: Scalars["String"]
  password: Scalars["String"]
  active: Scalars["Boolean"]
  role?: Maybe<RoleEnum>
  campus: CampusEnum
  createdAt: Scalars["String"]
  updatedAt: Scalars["String"]
}

export enum RoleEnum {
  Admin = "ADMIN",
  Psicol = "PSICOL",
}

export type Generation = {
  __typename?: "Generation"
  id: Scalars["Int"]
  generation: Scalars["Int"]
  campus: CampusEnum
  inProgress: Scalars["Boolean"]
  createdAt: Scalars["String"]
  updatedAt: Scalars["String"]
  users: Array<User>
}

export type Token = {
  __typename?: "Token"
  token: Scalars["String"]
}

export type Query = {
  __typename?: "Query"
  findAllGenerations: Array<Generation>
  findAllUsers: Array<User>
  findOneUser: User
  profile: Admin
  adminTest: Admin
}

export type QueryFindAllUsersArgs = {
  campus: CampusEnum
  generation: Scalars["Int"]
}

export type QueryFindOneUserArgs = {
  id: Scalars["Int"]
}

export type Mutation = {
  __typename?: "Mutation"
  createGeneration: Generation
  updateGeneration: Generation
  createUser: User
  testFindUsers: Array<User>
  updateUser: User
  login: Token
}

export type MutationCreateGenerationArgs = {
  createGenerationInput: CreateGenerationInput
}

export type MutationUpdateGenerationArgs = {
  updateGenerationInput: UpdateGenerationInput
}

export type MutationCreateUserArgs = {
  createUserInput: CreateUserInput
}

export type MutationTestFindUsersArgs = {
  campus: CampusEnum
  generation: Scalars["Int"]
}

export type MutationUpdateUserArgs = {
  updateUserInput: UpdateUserInput
}

export type MutationLoginArgs = {
  email: Scalars["String"]
  password: Scalars["String"]
}

export type CreateGenerationInput = {
  generation: Scalars["Int"]
  inProgress: Scalars["Boolean"]
  campus: CampusEnum
}

export type UpdateGenerationInput = {
  generation?: Maybe<Scalars["Int"]>
  inProgress?: Maybe<Scalars["Boolean"]>
  campus?: Maybe<CampusEnum>
  id: Scalars["Int"]
}

export type CreateUserInput = {
  firstName: Scalars["String"]
  lastName: Scalars["String"]
  email: Scalars["String"]
  password: Scalars["String"]
  enrollment: Scalars["String"]
  phone?: Maybe<Scalars["String"]>
  generationId: Scalars["Int"]
  campus: CampusEnum
}

export type UpdateUserInput = {
  firstName?: Maybe<Scalars["String"]>
  lastName?: Maybe<Scalars["String"]>
  email?: Maybe<Scalars["String"]>
  password?: Maybe<Scalars["String"]>
  phone?: Maybe<Scalars["String"]>
  generationId?: Maybe<Scalars["Int"]>
  id: Scalars["Int"]
}
