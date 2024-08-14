import { CampusEnum, CauseEmun, ReasonEmun, RoleUser, StatusAutorizationEmun } from "./src/grapqhl"

export const FILE_URL = import.meta.env.VITE_FILES_URL

export interface CampusOption {
  value: CampusEnum
  text: string
}

export const CampusTypeMap = new Map([
  [
    CampusEnum.Merida,
    {
      value: CampusEnum.Merida,
      text: "Mérida",
    },
  ],
  [
    CampusEnum.Valladolid,
    {
      value: CampusEnum.Valladolid,
      text: "Valladolid",
    },
  ],
  [
    CampusEnum.Tizimin,
    {
      value: CampusEnum.Tizimin,
      text: "Tizimín",
    },
  ],
  [
    CampusEnum.Oxkutzcab,
    {
      value: CampusEnum.Oxkutzcab,
      text: "Oxkutzcab",
    },
  ],
])

export const ReasonArray = [
  { value: ReasonEmun.Academic, text: "Motivo académicos" },
  { value: ReasonEmun.Personal, text: "Motivos personales" },
  { value: ReasonEmun.Other, text: "Otro" },
]

export const ReasonMap = new Map([
  [
    ReasonEmun.Academic,
    {
      value: ReasonEmun.Academic,
      text: "Motivo académicos",
    },
  ],
  [
    ReasonEmun.Personal,
    {
      value: ReasonEmun.Personal,
      text: "Motivo personales",
    },
  ],
  [
    ReasonEmun.Other,
    {
      value: ReasonEmun.Other,
      text: "Otro",
    },
  ],
])

export const statusAutorizationMap = new Map([
  [StatusAutorizationEmun.Active, { value: StatusAutorizationEmun.Active, text: "Activo" }],
  [StatusAutorizationEmun.Suspended, { value: StatusAutorizationEmun.Suspended, text: "Suspendido" }],
  [StatusAutorizationEmun.Graduate, { value: StatusAutorizationEmun.Graduate, text: "Egresado" }],
  [StatusAutorizationEmun.Detained, { value: StatusAutorizationEmun.Detained, text: "Beca Retenida" }],
])

export const RoleUserArray = [
  { value: RoleUser.Student, text: "Becario" },
  { value: RoleUser.Graduate, text: "Egresado" },
]

export const deletePhotoTitle = "Eliminar Usuario"
export const deletePhotoBody = (): string =>
  `¿Desea eliminar la foto de perfil de este usuario? Al realizar esta acción se eliminara la imagen seleccionada, y posteriormente podrá asignarle una nueva. ¿Desea continuar?`
export const deleteConstancyTitle = "Eliminar Constancia de Estudios"
export const deleteConstancyBody = (): string => `¿Desea eliminar la constancia de estudios seleccionada? Al realizar esta acción se eliminara el documento de manaera permanente. ¿Desea continuar?`
export const deleteCalendarTitle = "Eliminar Fecha"
export const deleteCalendarBody = (): string => `¿Desea eliminar la fecha seleccionada? Al realizar esta acción se eliminara de manaera permanente. ¿Desea continuar?`

export const statusAutorizationArray = [
  { value: StatusAutorizationEmun.Active, text: "Activo" },
  { value: StatusAutorizationEmun.Suspended, text: "Suspendido" },
  { value: StatusAutorizationEmun.Graduate, text: "Egresado" },
  { value: StatusAutorizationEmun.Detained, text: "Beca Retenida" },
]
export const causeArray = [
  { value: CauseEmun.Breakrules, text: "FALTAS AL REGLAMENTO AL NO COMENTAR UN ASPECTO TRASCENDENTAL" },
  { value: CauseEmun.Extraordinary, text: "POR LLEVARSE A EXTRAORDINARIO" },
  { value: CauseEmun.Faults, text: "FALTAS A F.I." },
  { value: CauseEmun.Lowaverage, text: "BAJO PROMEDIO" },
  { value: CauseEmun.Missing, text: "DESAPARECIÓ SIN AVISAR" },
  { value: CauseEmun.Notconstancy, text: "NO ENTREGÓ CONSTANCIA" },
  { value: CauseEmun.Origrades, text: "NO ENTREGÓ CALIFICACIONES ORIGINALES" },
  { value: CauseEmun.Personalschool, text: "DEJÓ LA ESCUELA POR PROBLEMAS PERSONALES" },
  { value: CauseEmun.Provgrades, text: "NO ENTREGÓ CALIFICACIONES PROVICIONALES" },
  { value: CauseEmun.Vocationalschool, text: "DEJÓ LA ESCUELA POR FALTA DE ORIENTACIÓN VOCACIONAL" },
  { value: CauseEmun.Other, text: "OTRO" },
]

export const causeMap = new Map([
  [CauseEmun.Breakrules, { value: CauseEmun.Breakrules, text: "FALTAS AL REGLAMENTO AL NO COMENTAR UN ASPECTO TRASCENDENTAL" }],
  [CauseEmun.Extraordinary, { value: CauseEmun.Extraordinary, text: "POR LLEVARSE A EXTRAORDINARIO" }],
  [CauseEmun.Faults, { value: CauseEmun.Faults, text: "FALTAS A F.I." }],
  [CauseEmun.Lowaverage, { value: CauseEmun.Lowaverage, text: "BAJO PROMEDIO" }],
  [CauseEmun.Missing, { value: CauseEmun.Missing, text: "DESAPARECIÓ SIN AVISAR" }],
  [CauseEmun.Notconstancy, { value: CauseEmun.Notconstancy, text: "NO ENTREGÓ CONSTANCIA" }],
  [CauseEmun.Origrades, { value: CauseEmun.Origrades, text: "NO ENTREGÓ CALIFICACIONES ORIGINALES" }],
  [CauseEmun.Personalschool, { value: CauseEmun.Personalschool, text: "DEJÓ LA ESCUELA POR PROBLEMAS PERSONALES" }],
  [CauseEmun.Provgrades, { value: CauseEmun.Provgrades, text: "NO ENTREGÓ CALIFICACIONES PROVICIONALES" }],
  [CauseEmun.Vocationalschool, { value: CauseEmun.Vocationalschool, text: "DEJÓ LA ESCUELA POR FALTA DE ORIENTACIÓN VOCACIONAL" }],
  [CauseEmun.Other, { value: CauseEmun.Other, text: "OTRO" }],
])

export const MonthsMap = new Map([
  [1, { value: 1, text: "ENERO" }],
  [2, { value: 2, text: "FEBRERO" }],
  [3, { value: 3, text: "MARZO" }],
  [4, { value: 4, text: "ABRIL" }],
  [5, { value: 5, text: "MAYO" }],
  [6, { value: 6, text: "JUNIO" }],
  [7, { value: 7, text: "JULIO" }],
  [8, { value: 8, text: "AGOSTO" }],
  [9, { value: 9, text: "SEPTIEMBRE" }],
  [10, { value: 10, text: "OCTUBRE" }],
  [11, { value: 11, text: "NOVIEMBRE" }],
  [12, { value: 12, text: "DICIEMBRE" }],
])
