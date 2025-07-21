"use server";

import db from "@/lib/db";
import {
  DoctorSchema,
  ServicesSchema,
  StaffSchema,
  WorkingDaysSchema,
} from "@/lib/schema";
import { generateRandomColor } from "@/utils";
import { checkRole } from "@/utils/roles";
import { auth, clerkClient } from "@clerk/nextjs/server";

// Fonction utilitaire pour extraire prénom et nom
function extractNames(fullName: string) {
  if (!fullName || typeof fullName !== "string")
    return { firstName: "", lastName: "" };
  const parts = fullName.trim().split(" ");
  return {
    firstName: parts[0] || "",
    lastName: parts.length > 1 ? parts.slice(1).join(" ") : "", // Gère les noms multiples
  };
}

export async function createNewStaff(data: any) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, msg: "Non autorisé" };
    }

    const isAdmin = await checkRole("ADMIN");
    if (!isAdmin) {
      return { success: false, msg: "Non autorisé" };
    }

    const values = StaffSchema.safeParse(data);
    if (!values.success) {
      return {
        success: false,
        errors: true,
        message: "Veuillez fournir toutes les informations requises",
      };
    }
    const validatedValues = values.data;

    // Extraction sécurisée prénom/nom
    const { firstName, lastName } = extractNames(validatedValues.name);

    // Vérification des champs obligatoires
    if (!validatedValues.email || !validatedValues.password || !firstName) {
      return {
        success: false,
        message: "Email, mot de passe et nom sont obligatoires",
        error: true,
      };
    }

    const client = await clerkClient();
    const user = await client.users.createUser({
      emailAddress: [validatedValues.email],
      password: validatedValues.password,
      firstName,
      lastName,
      username: validatedValues.email.split("@")[0], // ✅ Correction ici
      publicMetadata: { role: "staff" },
    });

    delete validatedValues["password"];

    await db.staff.create({
      data: {
        name: validatedValues.name,
        phone: validatedValues.phone,
        email: validatedValues.email,
        address: validatedValues.address,
        role: validatedValues.role,
        license_number: validatedValues.license_number,
        department: validatedValues.department,
        colorCode: generateRandomColor(),
        id: user.id,
        status: "ACTIVE",
      },
    });

    return {
      success: true,
      message: "Membre du staff ajouté avec succès",
      error: false,
    };
  } catch (error) {
    console.log(error);
    return { error: true, success: false, message: "Une erreur est survenue" };
  }
}

export async function createNewDoctor(data: any) {
  try {
    const values = DoctorSchema.safeParse(data);
    const workingDaysValues = WorkingDaysSchema.safeParse(data?.work_schedule);

    if (!values.success || !workingDaysValues.success) {
      return {
        success: false,
        errors: true,
        message: "Veuillez fournir toutes les informations requises",
      };
    }

    const validatedValues = values.data;
    const workingDayData = workingDaysValues.data!;

    const { firstName, lastName } = extractNames(validatedValues.name);

    // Vérifications supplémentaires
    if (
      !validatedValues.email ||
      typeof validatedValues.email !== "string" ||
      !validatedValues.email.includes("@")
    ) {
      return {
        success: false,
        message: "Email invalide",
        error: true,
      };
    }

    if (
      !validatedValues.password ||
      typeof validatedValues.password !== "string" ||
      validatedValues.password.length < 8
    ) {
      return {
        success: false,
        message: "Mot de passe invalide ou trop court (8 caractères min.)",
        error: true,
      };
    }

    if (!firstName) {
      return {
        success: false,
        message: "Le prénom est obligatoire",
        error: true,
      };
    }

    const client = await clerkClient();

    console.log("Envoi à Clerk =>", {
      email: validatedValues.email,
      password: validatedValues.password,
      firstName,
      lastName,
    });

    const user = await client.users.createUser({
      emailAddress: [validatedValues.email],
      password: validatedValues.password,
      firstName,
      lastName,
      username: validatedValues.email.split("@")[0],
      publicMetadata: { role: "doctor" },
    });

    delete validatedValues["password"];

    const doctor = await db.doctor.create({
      data: {
        ...validatedValues,
        id: user.id,
      },
    });

    await Promise.all(
      workingDayData?.map((el: any) =>
        db.workingDays.create({
          data: { ...el, doctor_id: doctor.id },
        })
      )
    );

    return {
      success: true,
      message: "Médecin ajouté avec succès",
      error: false,
    };
  } catch (error: any) {
    console.error("Erreur Clerk ou autre:", JSON.stringify(error, null, 2));
    return {
      error: true,
      success: false,
      message:
        error?.errors?.[0]?.message ||
        "Une erreur est survenue lors de la création du médecin",
    };
  }
}

export async function addNewService(data: any) {
  try {
    const isValidData = ServicesSchema.safeParse(data);
    if (!isValidData.success) {
      return {
        success: false,
        error: true,
        msg: "Veuillez fournir toutes les informations requises",
      };
    }
    const validatedData = isValidData.data;

    await db.services.create({
      data: { ...validatedData, price: Number(data.price!) },
    });

    return {
      success: true,
      error: false,
      msg: `Service ajouté avec succès`,
    };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Internal Server Error" };
  }
}
