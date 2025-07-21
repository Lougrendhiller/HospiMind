export const GENDER = [
  { label: "Homme", value: "MALE" },
  { label: "Femme", value: "FEMALE" },
];

export const MARITAL_STATUS = [
  { label: "Célibataire", value: "single" },
  { label: "Marié(e)", value: "married" },
  { label: "Divorcé(e)", value: "divorced" },
  { label: "Veuf(ve)", value: "widowed" },
  { label: "Séparé(e)", value: "separated" },
];

export const RELATION = [
  { value: "mother", label: "Mère" },
  { value: "father", label: "Père" },
  { value: "husband", label: "Mari" },
  { value: "wife", label: "Femme" },
  { value: "other", label: "Autre" },
];

export const USER_ROLES = {
  ADMIN: "ADMIN" as string,
  DOCTOR: "DOCTOR",
  NURSE: "NURSE",
  LAB_TECHNICIAN: "LAB_TECHNICIAN",
  PATIENT: "PATIENT",
  CASHIER: "CASHIER",
};
