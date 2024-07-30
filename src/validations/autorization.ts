import * as yup from "yup"

import { CauseEmun, StatusAutorizationEmun } from "@/grapqhl"

export const statusAutorization = () => yup.mixed<StatusAutorizationEmun>().oneOf(Object.values(StatusAutorizationEmun)).required().label("Estatus")
export const percentage = () => yup.string().notRequired().label("Porcentaje")
export const previousPayment = () => yup.boolean().label("Retardo").default(false)
export const numberMonths = () =>
  yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .notRequired()
    .label("Número de meses")
export const previousMonths = () => yup.string().notRequired().label("Especificar meses")
export const cause = () => yup.mixed<CauseEmun>().oneOf(Object.values(CauseEmun)).notRequired().label("Estatus")
export const otherCause = () => yup.string().notRequired().label("Especificar causa")
