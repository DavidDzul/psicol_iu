import * as yup from "yup"

export const generation = () =>
  yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required()
    .label("Generación")
export const active = () => yup.boolean().label("Activo").default(true)
