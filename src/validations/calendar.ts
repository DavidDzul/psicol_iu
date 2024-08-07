import * as yup from "yup"

export const calendarName = () => yup.string().required().label("Nombre del evento")
export const calendarGenerationId = () =>
  yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required()
    .label("Generación")
export const calendarDate = () => yup.string().required().label("Fecha")
