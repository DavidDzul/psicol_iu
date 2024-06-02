import "flag-icons/css/flag-icons.min.css"
import "v-phone-input/dist/v-phone-input.css"
import { createVPhoneInput } from "v-phone-input"

export default createVPhoneInput({
  countryIconMode: "svg",
  label: "Teléfono",
  countryLabel: "País",
  countryAriaLabel: ({ label }) => `País para ${label}`,
  invalidMessage: ({ label, example }) => `El ${label} debe tener un formato válido (ejemplo: ${example}).`,
  defaultCountry: "MX",
})
