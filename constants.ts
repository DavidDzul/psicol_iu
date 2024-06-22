import { CampusEnum } from "./src/grapqhl"

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
