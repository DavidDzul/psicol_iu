import * as yup from "yup"

export const optionalString = yup
  .string()
  .nullable()
  .transform((curr, orig) => (orig === "" ? undefined : curr))

export const optionalNumber = yup
  .number()
  .nullable()
  .transform((curr, orig) => (orig === "" ? undefined : curr))
