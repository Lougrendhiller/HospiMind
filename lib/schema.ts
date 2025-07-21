import { z } from "zod";

export const PatientFormSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(2, "Le prénom doit comporter au moins 2 caractères")
    .max(30, "Le prénom ne peut pas dépasser 50 caractères"),
  last_name: z
    .string()
    .trim()
    .min(2, "Le nom doit comporter au moins 2 caractères")
    .max(30, "Le prénom ne peut pas dépasser 50 caractères"),
  // On utilise z.coerce.date() pour garantir que le champ soit bien typé Date côté React Hook Form
  date_of_birth: z.coerce.date(),
  gender: z.enum(["MALE", "FEMALE"], { message: "Le genre est requis" }),

  phone: z
    .string()
    .min(10, "Saisissez un numéro de téléphone")
    .max(10, "Saisissez un numéro de téléphone"),
  email: z.string().email("Adresse e-mail invalide"),
  address: z
    .string()
    .min(5, "L'adresse doit comporter au moins 5 caractères")
    .max(500, "L'adresse ne doit pas dépasser 500 caractères"),
  marital_status: z.enum(
    ["married", "single", "divorced", "widowed", "separated"],
    { message: "L’état civil est requis" }
  ),
  emergency_contact_name: z
    .string()
    .min(2, "Le nom du contact d'urgence est requis")
    .max(50, "Le nom du contact d'urgence ne doit pas dépasser 50 caractères"),
  emergency_contact_number: z
    .string()
    .min(10, "Saisissez un numéro de téléphone")
    .max(10, "Saisissez un numéro de téléphone"),
  relation: z.enum(["mother", "father", "husband", "wife", "other"], {
    message: "La relation avec le contact est requise",
  }),
  blood_group: z.string().optional(),
  allergies: z.string().optional(),
  medical_conditions: z.string().optional(),
  medical_history: z.string().optional(),
  insurance_provider: z.string().optional(),
  insurance_number: z.string().optional(),
  privacy_consent: z
    .boolean()
    .default(false)
    .refine((val) => val === true, {
      message: "Vous devez accepter la politique de confidentialité",
    }),
  service_consent: z
    .boolean()
    .default(false)
    .refine((val) => val === true, {
      message: "Vous devez accepter les conditions d’utilisation",
    }),
  medical_consent: z
    .boolean()
    .default(false)
    .refine((val) => val === true, {
      message: "Vous devez accepter les conditions de traitement médical",
    }),
  img: z.string().optional(),
});

export const AppointmentSchema = z.object({
  doctor_id: z.string().min(1, "Select physician"),
  type: z.string().min(1, "Select type of appointment"),
  appointment_date: z.string().min(1, "Select appointment date"),
  time: z.string().min(1, "Select appointment time"),
  note: z.string().optional(),
});

export const DoctorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom doit comporter au moins 2 caractères")
    .max(50, "Le nom ne doit pas dépasser 50 caractères"),
  phone: z
    .string()
    .min(10, "Saisissez un numéro de téléphone")
    .max(10, "Saisissez un numéro de téléphone"),
  email: z.string().email("Adresse e-mail invalide"),
  address: z
    .string()
    .min(5, "L'adresse doit comporter au moins 5 caractères")
    .max(500, "L'adresse ne doit pas dépasser 500 caractères"),
  specialization: z.string().min(2, "La spécialisation est requise"),
  license_number: z.string().min(2, "Le numéro de licence est requis"),
  type: z.enum(["FULL", "PART"], { message: "Le type est requis" }),
  department: z.string().min(2, "Le département est requis"),
  img: z.string().optional(),
  password: z
    .string()
    .min(8, { message: "Le mot de passe doit comporter au moins 8 caractères" })
    .optional()
    .or(z.literal("")),
});

export const workingDaySchema = z.object({
  day: z.enum([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ]),
  start_time: z.string(),
  close_time: z.string(),
});
export const WorkingDaysSchema = z.array(workingDaySchema).optional();

export const StaffSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom doit comporter au moins 2 caractères")
    .max(50, "Le nom ne doit pas dépasser 50 caractères"),
  role: z.enum(["NURSE", "LAB_TECHNICIAN"], { message: "Le rôle est requis" }),
  phone: z
    .string()
    .min(10, "Le numéro de contact doit comporter 10 chiffres")
    .max(10, "Le numéro de contact doit comporter 10 chiffres"),
  email: z.string().email("Adresse e-mail invalide"),
  address: z
    .string()
    .min(5, "L'adresse doit comporter au moins 5 caractères")
    .max(500, "L'adresse ne doit pas dépasser 500 caractères"),
  license_number: z.string().optional(),
  department: z.string().optional(),
  img: z.string().optional(),
  password: z
    .string()
    .min(8, { message: "Le mot de passe doit comporter au moins 8 caractères" })
    .optional()
    .or(z.literal("")),
});

export const VitalSignsSchema = z.object({
  patient_id: z.string(),
  medical_id: z.string(),
  body_temperature: z.coerce.number({
    message: "Saisissez la température corporelle mesurée",
  }),
  heartRate: z.string({ message: "Saisissez la fréquence cardiaque mesurée" }),
  systolic: z.coerce.number({
    message: "Saisissez la pression artérielle systolique mesurée",
  }),
  diastolic: z.coerce.number({
    message: "Saisissez la pression artérielle diastolique mesurée",
  }),
  respiratory_rate: z.coerce.number().optional(),
  oxygen_saturation: z.coerce.number().optional(),
  weight: z.coerce.number({ message: "Saisissez le poids mesuré (Kg)" }),
  height: z.coerce.number({ message: "Saisissez la taille mesurée (cm)" }),
});

export const DiagnosisSchema = z.object({
  patient_id: z.string(),
  medical_id: z.string(),
  doctor_id: z.string(),
  symptoms: z.string({ message: "Les symptômes sont requis" }),
  diagnosis: z.string({ message: "Le diagnostic est requis" }),
  notes: z.string().optional(),
  prescribed_medications: z.string().optional(),
  follow_up_plan: z.string().optional(),
});

export const PaymentSchema = z.object({
  id: z.string(),
  // patient_id: z.string(),
  // appointment_id: z.string(),
  bill_date: z.coerce.date(),
  // payment_date: z.string(),
  discount: z.string({ message: "remise" }),
  total_amount: z.string(),
  // amount_paid: z.string(),
});

export const PatientBillSchema = z.object({
  bill_id: z.string(),
  service_id: z.string(),
  service_date: z.string(),
  appointment_id: z.string(),
  quantity: z.string({ message: "La quantité est requise" }),
  unit_cost: z.string({ message: "Le coût unitaire est requis" }),
  total_cost: z.string({ message: "Le coût total est requis" }),
});

export const ServicesSchema = z.object({
  service_name: z.string({ message: "Le nom du service est requis" }),
  price: z.string({ message: "Le prix du service est requis" }),
  description: z.string({ message: "La description du service est requise" }),
});
