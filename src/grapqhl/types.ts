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
  generationId: Scalars["Int"]
  role: RoleUser
  createdAt: Scalars["String"]
  updatedAt: Scalars["String"]
  generation: Generation
  attendances?: Maybe<Attendance>
  photos?: Maybe<Array<Photo>>
  constancy?: Maybe<Array<Constancy>>
  autorization?: Maybe<Array<Autorization>>
  attendanceMap?: Maybe<Array<Attendance>>
  images: Array<Photo>
  documents: Array<Constancy>
  lastConstancy?: Maybe<Constancy>
  autorizationMonth?: Maybe<Array<Autorization>>
}

export type UserAutorizationMonthArgs = {
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
  entryName: Scalars["Int"]
  campus: CampusEnum
  inProgress: Scalars["Boolean"]
  createdAt: Scalars["String"]
  updatedAt: Scalars["String"]
  users: Array<User>
  calendar: Array<Calendar>
}

export type Attendance = {
  __typename?: "Attendance"
  id: Scalars["Int"]
  userId: Scalars["Int"]
  checkIn: Scalars["String"]
  checkOut?: Maybe<Scalars["String"]>
  recordDate: Scalars["String"]
  delay: Scalars["Boolean"]
  justifiedDelay: Scalars["Boolean"]
  justifiedAbsence: Scalars["Boolean"]
  reason?: Maybe<ReasonEmun>
  descripcion?: Maybe<Scalars["String"]>
  createdAt: Scalars["String"]
  updatedAt: Scalars["String"]
  user: User
  userAttendance: User
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

export type Autorization = {
  __typename?: "Autorization"
  id: Scalars["Int"]
  userId: Scalars["Int"]
  status: StatusAutorizationEmun
  percentage?: Maybe<Scalars["Int"]>
  previousPayment: Scalars["Boolean"]
  numberMonths?: Maybe<Scalars["Int"]>
  previousMonths?: Maybe<Scalars["String"]>
  cause?: Maybe<CauseEmun>
  otherCause?: Maybe<Scalars["String"]>
  date: Scalars["String"]
  createdAt: Scalars["String"]
  updatedAt: Scalars["String"]
  user: User
}

export enum StatusAutorizationEmun {
  Active = "ACTIVE",
  Suspended = "SUSPENDED",
  Graduate = "GRADUATE",
  Detained = "DETAINED",
}

export enum CauseEmun {
  FaultsFi = "FAULTS_FI",
  NotConstancy = "NOT_CONSTANCY",
  ProvisionalesGrades = "PROVISIONALES_GRADES",
  OriginalGrades = "ORIGINAL_GRADES",
  LowAverage = "LOW_AVERAGE",
  Extraordinary = "EXTRAORDINARY",
  PersonalProblemsSchool = "PERSONAL_PROBLEMS_SCHOOL",
  VocationalProblemsSchool = "VOCATIONAL_PROBLEMS_SCHOOL",
  Missing = "MISSING",
  BreakRules = "BREAK_RULES",
  Other = "OTHER",
}

export type Calendar = {
  __typename?: "Calendar"
  id: Scalars["Int"]
  name: Scalars["String"]
  generationId: Scalars["Int"]
  date: Scalars["String"]
  campus: CampusEnum
  createdAt: Scalars["String"]
  updatedAt: Scalars["String"]
  generation: Generation
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
  findAllCalendar: Array<Calendar>
  findAllGenerations: Array<Generation>
  findOneUser: User
  findAllUsers: Array<User>
  profile: Admin
}

export type QueryFindOneUserArgs = {
  id: Scalars["Int"]
}

export type Mutation = {
  __typename?: "Mutation"
  createCalendar: Calendar
  updateCalendar: Calendar
  removeCalendar: SuccessMessage
  createAutorization: Autorization
  createConstancy: Constancy
  removeConstancy: SuccessMessage
  createPhoto: Photo
  removePhoto: SuccessMessage
  generateAttendance: User
  createAttendance: Attendance
  updateAttendance: Attendance
  findAttendanceUsers: Array<Attendance>
  createGeneration: Generation
  updateGeneration: Generation
  searchAllUsers: Array<User>
  createUser: User
  updateUser: User
  login: Token
}

export type MutationCreateCalendarArgs = {
  createCalendarInput: CreateCalendarInput
}

export type MutationUpdateCalendarArgs = {
  updateCalendarInput: UpdateCalendarInput
}

export type MutationRemoveCalendarArgs = {
  id: Scalars["Int"]
}

export type MutationCreateAutorizationArgs = {
  createAutorizationInput: CreateAutorizationInput
}

export type MutationCreateConstancyArgs = {
  userId: Scalars["Int"]
  recordFile: Scalars["Upload"]
  startDate: Scalars["String"]
  endDate: Scalars["String"]
}

export type MutationRemoveConstancyArgs = {
  id: Scalars["Int"]
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

export type MutationSearchAllUsersArgs = {
  campus: CampusEnum
  generation: Scalars["Int"]
  date?: Maybe<Scalars["String"]>
}

export type MutationCreateUserArgs = {
  createUserInput: CreateUserInput
}

export type MutationUpdateUserArgs = {
  updateUserInput: UpdateUserInput
}

export type MutationLoginArgs = {
  email: Scalars["String"]
  password: Scalars["String"]
}

export type CreateCalendarInput = {
  name: Scalars["String"]
  generationId: Scalars["Int"]
  date: Scalars["String"]
}

export type UpdateCalendarInput = {
  name?: Maybe<Scalars["String"]>
  generationId?: Maybe<Scalars["Int"]>
  date?: Maybe<Scalars["String"]>
  id: Scalars["Int"]
}

export type CreateAutorizationInput = {
  userId: Scalars["Int"]
  percentage: Scalars["Int"]
  status: StatusAutorizationEmun
  previousPayment?: Maybe<Scalars["Boolean"]>
  numberMonths?: Maybe<Scalars["Int"]>
  previousMonths?: Maybe<Scalars["String"]>
  cause?: Maybe<CauseEmun>
  otherCause?: Maybe<Scalars["String"]>
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
  entryName: Scalars["Int"]
  inProgress: Scalars["Boolean"]
  campus: CampusEnum
}

export type UpdateGenerationInput = {
  entryName?: Maybe<Scalars["Int"]>
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
  active?: Maybe<Scalars["Boolean"]>
}
