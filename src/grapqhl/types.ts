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
  campus?: Maybe<CampusEnum>
  role?: Maybe<UserTypeEnum>
  createdAt: Scalars["String"]
  updatedAt: Scalars["String"]
}

export enum CampusEnum {
  Merida = "MERIDA",
  Valladolid = "VALLADOLID",
  Tizimin = "TIZIMIN",
  Oxkutzcab = "OXKUTZCAB",
}

export enum UserTypeEnum {
  Student = "STUDENT",
  Graduate = "GRADUATE",
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
  createdAt: Scalars["String"]
  updatedAt: Scalars["String"]
}

export enum RoleEnum {
  Admin = "ADMIN",
  Psicol = "PSICOL",
}

export type Token = {
  __typename?: "Token"
  token: Scalars["String"]
}

export type Query = {
  __typename?: "Query"
  profile: Admin
  adminTest: Admin
}

export type Mutation = {
  __typename?: "Mutation"
  createUser: User
  login: Token
}

export type MutationCreateUserArgs = {
  createUserInput: CreateUserInput
}

export type MutationLoginArgs = {
  email: Scalars["String"]
  password: Scalars["String"]
}

export type CreateUserInput = {
  firstName: Scalars["String"]
  lastName: Scalars["String"]
  email: Scalars["String"]
  password: Scalars["String"]
  enrollment: Scalars["String"]
  phone?: Maybe<Scalars["String"]>
  campus: CampusEnum
  role: UserTypeEnum
}
