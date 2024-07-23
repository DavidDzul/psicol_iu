import { CampusEnum, ReasonEmun, RoleUser } from "./src/grapqhl"

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

export const RoleUserArray = [
  { value: RoleUser.Student, text: "Becario" },
  { value: RoleUser.Graduate, text: "Egresado" },
]

export const deletePhotoTitle = "Eliminar Usuario"
export const deletePhotoBody = (): string =>
  `¿Desea eliminar la foto de perfil de este usuario? Al realizar esta acción se eliminara la imagen seleccionada, y posteriormente podrá asignarle una nueva. ¿Desea continuar?`
export const deleteConstancyTitle = "Eliminar Constancia de Estudios"
export const deleteConstancyBody = (): string => `¿Desea eliminar la constancia de estudios seleccionada? Al realizar esta acción se eliminara el documento de manaera permanente. ¿Desea continuar?`
