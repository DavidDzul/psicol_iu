import * as yup from "yup"

import { optionalString } from "./shared"

export const firstName = () => yup.string().required().label("Nombre")
export const lastName = () => yup.string().concat(optionalString).min(3).label("Apellidos")

export const email = () => yup.string().email().required().label("Email")
export const password = () => yup.string().required().min(6).label("Contraseña")
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
export const planId = () =>
  yup
    .number()
    .nullable()
    .transform((curr, orig) => (!orig ? undefined : curr))
    .label("Plan")
