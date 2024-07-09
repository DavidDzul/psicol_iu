import * as yup from "yup"

import { ReasonEmun } from "@/grapqhl"

export const userId = () =>
  yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required()
    .label("Usuario")
export const delay = () => yup.boolean().label("Retardo").default(false)
export const justifiedDelay = () => yup.boolean().label("Retardo justificado").default(false)
export const justifiedAbsence = () => yup.boolean().label("Falta justificada").default(false)
export const reason = () => yup.mixed<ReasonEmun>().oneOf(Object.values(ReasonEmun)).notRequired().label("Razón")
export const date = () => yup.string().required().label("Fecha")
export const descripcion = () => yup.string().notRequired().label("Descripción")
