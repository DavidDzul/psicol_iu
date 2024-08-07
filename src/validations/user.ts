import * as yup from "yup"

import { CampusEnum, RoleUser } from "@/grapqhl"

import { optionalString } from "./shared"

export const firstName = () => yup.string().required().label("Nombre")
export const lastName = () => yup.string().concat(optionalString).min(3).label("Apellidos")

export const email = () => yup.string().email().required().label("Email")
export const password = () => yup.string().required().min(6).label("Contraseña")
export const enrollment = () => yup.string().required().min(9).max(9).label("Matrícula")
export const updatePassword = () => yup.string().concat(optionalString).min(6).label("Contraseña")
export const confirmation = () =>
  yup
    .string()
    .transform((curr, orig) => (orig === "" ? undefined : curr))
    .when("password", {
      is: (val: string) => !!val,
      then: (schema) => schema.required(),
    })
    .oneOf([yup.ref("password")], "Las contraseñas deben coincidir")
    .label("Confirmar Contraseña")
export const phone = () => yup.string().concat(optionalString).length(13, "").label("Teléfono")
export const campus = () => yup.mixed<CampusEnum>().oneOf(Object.values(CampusEnum)).required().label("Sede")
export const role = () => yup.mixed<RoleUser>().oneOf(Object.values(RoleUser)).required().label("Tipo de usuario")
export const userActive = () =>
  yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .notRequired()
    .label("Activo")
