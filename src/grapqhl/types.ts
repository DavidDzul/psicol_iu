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
  /** The `Upload` scalar type represents a file upload. */
  Upload: any
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
  role: RoleUser
  createdAt: Scalars["String"]
  updatedAt: Scalars["String"]
  generation?: Maybe<Generation>
  attendances?: Maybe<Attendance>
  photos?: Maybe<Array<Photo>>
  constancy?: Maybe<Array<Constancy>>
  attendanceMap?: Maybe<Array<Attendance>>
  images: Array<Photo>
}

export type UserAttendanceMapArgs = {
  date: Scalars["String"]
}

export enum CampusEnum {
  Merida = "MERIDA",
  Valladolid = "VALLADOLID",
  Tizimin = "TIZIMIN",
  Oxkutzcab = "OXKUTZCAB",
}

export enum RoleUser {
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

export type Attendance = {
  __typename?: "Attendance"
  id: Scalars["Int"]
  userId: Scalars["Int"]
  checkIn: Scalars["String"]
  checkOut?: Maybe<Scalars["String"]>
  delay: Scalars["Boolean"]
  justifiedDelay: Scalars["Boolean"]
  justifiedAbsence: Scalars["Boolean"]
  reason?: Maybe<ReasonEmun>
  descripcion?: Maybe<Scalars["String"]>
  createdAt: Scalars["String"]
  updatedAt: Scalars["String"]
  user: User
  userAttendance?: Maybe<User>
}

export enum ReasonEmun {
  Academic = "ACADEMIC",
  Personal = "PERSONAL",
  Other = "OTHER",
}

export type Photo = {
  __typename?: "Photo"
  id: Scalars["Int"]
  userId: Scalars["Int"]
  url: Scalars["String"]
  admin: Scalars["Boolean"]
  createdAt: Scalars["String"]
}

export type Constancy = {
  __typename?: "Constancy"
  id: Scalars["Int"]
  name: Scalars["String"]
  userId: Scalars["Int"]
  url: Scalars["String"]
  fileId: Scalars["String"]
  startDate: Scalars["String"]
  endDate: Scalars["String"]
  createdAt: Scalars["String"]
}

export type Token = {
  __typename?: "Token"
  token: Scalars["String"]
}

export type SuccessMessage = {
  __typename?: "SuccessMessage"
  message: Scalars["String"]
}

export type Query = {
  __typename?: "Query"
  findAllGenerations: Array<Generation>
  findAllUsers: Array<User>
  findOneUser: User
  profile: Admin
}

export type QueryFindOneUserArgs = {
  id: Scalars["Int"]
}

export type Mutation = {
  __typename?: "Mutation"
  createConstancy: Constancy
  createPhoto: Photo
  removePhoto: SuccessMessage
  generateAttendance: User
  createAttendance: Attendance
  updateAttendance: Attendance
  findAttendanceUsers: Array<Attendance>
  createGeneration: Generation
  updateGeneration: Generation
  createUser: User
  searchAllUsers: Array<User>
  updateUser: User
  login: Token
}

export type MutationCreateConstancyArgs = {
  userId: Scalars["Int"]
  recordFile: Scalars["Upload"]
  startDate: Scalars["String"]
  endDate: Scalars["String"]
}

export type MutationCreatePhotoArgs = {
  userId: Scalars["Int"]
  photo: Scalars["Upload"]
}

export type MutationRemovePhotoArgs = {
  id?: Maybe<Scalars["Int"]>
  userId: Scalars["Int"]
}

export type MutationGenerateAttendanceArgs = {
  attendanceInput: AttendanceInput
}

export type MutationCreateAttendanceArgs = {
  createAttendanceInput: CreateAttendanceInput
}

export type MutationUpdateAttendanceArgs = {
  updateAttendanceInput: UpdateAttendanceInput
}

export type MutationFindAttendanceUsersArgs = {
  campus: CampusEnum
  generation: Scalars["Int"]
  date: Scalars["String"]
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

export type MutationSearchAllUsersArgs = {
  campus: CampusEnum
  generation: Scalars["Int"]
  date?: Maybe<Scalars["String"]>
}

export type MutationUpdateUserArgs = {
  updateUserInput: UpdateUserInput
}

export type MutationLoginArgs = {
  email: Scalars["String"]
  password: Scalars["String"]
}

export type AttendanceInput = {
  enrollment: Scalars["String"]
}

export type CreateAttendanceInput = {
  userId: Scalars["Int"]
  date: Scalars["String"]
  delay: Scalars["Boolean"]
  justifiedDelay: Scalars["Boolean"]
  justifiedAbsence: Scalars["Boolean"]
  reason?: Maybe<ReasonEmun>
  descripcion?: Maybe<Scalars["String"]>
}

export type UpdateAttendanceInput = {
  userId?: Maybe<Scalars["Int"]>
  date?: Maybe<Scalars["String"]>
  delay?: Maybe<Scalars["Boolean"]>
  justifiedDelay?: Maybe<Scalars["Boolean"]>
  justifiedAbsence?: Maybe<Scalars["Boolean"]>
  reason?: Maybe<ReasonEmun>
  descripcion?: Maybe<Scalars["String"]>
  id: Scalars["Int"]
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
  role: RoleUser
}

export type UpdateUserInput = {
  firstName?: Maybe<Scalars["String"]>
  lastName?: Maybe<Scalars["String"]>
  email?: Maybe<Scalars["String"]>
  password?: Maybe<Scalars["String"]>
  phone?: Maybe<Scalars["String"]>
  generationId?: Maybe<Scalars["Int"]>
  role?: Maybe<RoleUser>
  id: Scalars["Int"]
}
