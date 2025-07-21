"use client";

import { useUser } from "@clerk/nextjs";
import { Patient } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Form } from "./ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PatientFormSchema } from "@/lib/schema";
import { z } from "zod";
import { CustomInput } from "./custom-input";
import { GENDER, MARITAL_STATUS, RELATION } from "@/lib";
import { Button } from "./ui/button";
import { createNewPatient, updatePatient } from "@/app/actions/patient";
import { toast } from "sonner";

interface DataProps {
  data?: Patient;
  type: "create" | "update";
}
export const NewPatient = ({ data, type }: DataProps) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [imgURL, setImgURL] = useState<any>();
  const router = useRouter();

  const userData = {
    first_name: user?.firstName || "",
    last_name: user?.lastName || "",
    email: user?.emailAddresses[0].emailAddress || "",
    phone: user?.phoneNumbers?.toString() || "",
  };

  const userId = user?.id;
  const form = useForm<z.infer<typeof PatientFormSchema>>({
    resolver: zodResolver(PatientFormSchema),
    defaultValues: {
      ...userData,
      address: "",
      date_of_birth: new Date(),
      gender: "MALE",
      marital_status: "single",
      emergency_contact_name: "",
      emergency_contact_number: "",
      relation: "mother",
      blood_group: "",
      allergies: "",
      medical_conditions: "",
      insurance_number: "",
      insurance_provider: "",
      medical_history: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof PatientFormSchema>> = async (
    values
  ) => {
    setLoading(true);

    const res =
      type === "create"
        ? await createNewPatient(values, userId!)
        : await updatePatient(values, userId!);

    setLoading(false);

    if (res?.success) {
      toast.success(res.msg);
      form.reset();
      router.push("/patient");
    } else {
      console.log(res);
      toast.error("Échec de la création du patient");
    }
  };

  useEffect(() => {
    if (type === "create") {
      userData && form.reset({ ...userData });
    } else if (type === "update") {
      data &&
        form.reset({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
          date_of_birth: new Date(data.date_of_birth),
          gender: data.gender,
          marital_status: data.marital_status as
            | "married"
            | "single"
            | "divorced"
            | "widowed"
            | "separated",
          address: data.address,
          emergency_contact_name: data.emergency_contact_name,
          emergency_contact_number: data.emergency_contact_number,
          relation: data.relation as
            | "mother"
            | "father"
            | "husband"
            | "wife"
            | "other",
          blood_group: data?.blood_group!,
          allergies: data?.allergies! || "",
          medical_conditions: data?.medical_conditions! || "",
          medical_history: data?.medical_history! || "",
          insurance_number: data.insurance_number! || "",
          insurance_provider: data.insurance_provider! || "",
          medical_consent: data.medical_consent,
          privacy_consent: data.privacy_consent,
          service_consent: data.service_consent,
        });
    }
  }, [user]);

  return (
    <Card className="max-w-6xl w-full p-4 ">
      <CardHeader>
        <CardTitle>Enregistrement du patient</CardTitle>
        <CardDescription>
          Veuillez fournir toutes les informations ci-dessous pour nous aider à
          mieux vous comprendre et à vous offrir un service de qualité.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-5"
          >
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <>
              {/* PROFILE IMAGE */}

              {/* <ImageUploader
          
              /> */}
              <div className="flex flex-col lg:flex-row  gap-y-6 items-center gap-2 md:gap-x-4">
                <CustomInput
                  type="input"
                  control={form.control}
                  name="first_name"
                  placeholder="Jean"
                  label="Prénom"
                />
                <CustomInput
                  type="input"
                  control={form.control}
                  name="last_name"
                  placeholder="Dupont"
                  label="Nom"
                />
              </div>
              <CustomInput
                type="input"
                control={form.control}
                name="email"
                placeholder="jean@example.com"
                label="Adresse e-mail"
              />
              <div className="flex flex-col lg:flex-row  gap-y-6 items-center gap-2 md:gap-x-4">
                <CustomInput
                  type="select"
                  control={form.control}
                  name="gender"
                  placeholder="Sélectionner le genre"
                  label="Genre"
                  selectList={GENDER!}
                />
                <CustomInput
                  type="input"
                  control={form.control}
                  name="date_of_birth"
                  placeholder="01-05-2000"
                  label="Date de naissance"
                  inputType="date"
                />
              </div>
              <div className="flex flex-col lg:flex-row  gap-y-6 items-center gap-2 md:gap-x-4">
                <CustomInput
                  type="input"
                  control={form.control}
                  name="phone"
                  placeholder="0601020304"
                  label="Numéro de contact"
                />
                <CustomInput
                  type="select"
                  control={form.control}
                  name="marital_status"
                  placeholder="Sélectionner l’état civil"
                  label="État civil"
                  selectList={MARITAL_STATUS!}
                />
              </div>
              <CustomInput
                type="input"
                control={form.control}
                name="address"
                placeholder="12 rue de Paris, 75001 Paris"
                label="Adresse"
              />
            </>

            <div className="space-y-8">
              <h3 className="text-lg font-semibold">Informations familiales</h3>
              <CustomInput
                type="input"
                control={form.control}
                name="emergency_contact_name"
                placeholder="Anne Martin"
                label="Nom du contact d'urgence"
              />
              <CustomInput
                type="input"
                control={form.control}
                name="emergency_contact_number"
                placeholder="0605060708"
                label="Contact d'urgence"
              />
              <CustomInput
                type="select"
                control={form.control}
                name="relation"
                placeholder="Sélectionner la relation avec le contact"
                label="Relation"
                selectList={RELATION}
              />
            </div>

            <div className="space-y-8">
              <h3 className="text-lg font-semibold">Informations médicales</h3>

              <CustomInput
                type="input"
                control={form.control}
                name="blood_group"
                placeholder="A+"
                label="Groupe sanguin"
              />
              <CustomInput
                type="input"
                control={form.control}
                name="allergies"
                placeholder="Lait, pollen..."
                label="Allergies"
              />
              <CustomInput
                type="input"
                control={form.control}
                name="medical_conditions"
                placeholder="Antécédents médicaux"
                label="Antécédents médicaux"
              />
              <CustomInput
                type="input"
                control={form.control}
                name="medical_history"
                placeholder="Historique médical"
                label="Historique médical"
              />
              <div className="flex flex-col lg:flex-row  gap-y-6 items-center gap-2 md:gap-4">
                <CustomInput
                  type="input"
                  control={form.control}
                  name="insurance_provider"
                  placeholder="Fournisseur d'assurance"
                  label="Fournisseur d'assurance"
                />{" "}
                <CustomInput
                  type="input"
                  control={form.control}
                  name="insurance_number"
                  placeholder="Numéro d'assurance"
                  label="Numéro d'assurance"
                />
              </div>
            </div>

            {type !== "update" && (
              <div className="">
                <h3 className="text-lg font-semibold mb-2">Consentement</h3>

                <div className="space-y-6">
                  <CustomInput
                    name="privacy_consent"
                    label="J’accepte la politique de confidentialité"
                    placeholder="J’autorise la collecte, le stockage et l’utilisation de mes informations personnelles et de santé conformément à la politique de confidentialité. J’ai compris comment mes données seront utilisées, avec qui elles pourront être partagées, et mes droits d’accès, de rectification et de suppression."
                    type="checkbox"
                    control={form.control}
                  />

                  <CustomInput
                    control={form.control}
                    type="checkbox"
                    name="service_consent"
                    label="J’accepte les conditions d’utilisation"
                    placeholder="J’accepte les conditions d’utilisation, y compris mes responsabilités en tant qu’utilisateur de ce système, les limitations de responsabilité et le processus de résolution des litiges. J’ai compris que l’utilisation de ce service dépend du respect de ces conditions."
                  />

                  <CustomInput
                    control={form.control}
                    type="checkbox"
                    name="medical_consent"
                    label="J’autorise le traitement de mes données médicales"
                    placeholder="J’autorise la prise en charge médicale et la gestion de mes données de santé via ce système. J’ai été informé(e) de la nature, des risques, des bénéfices et des alternatives aux traitements proposés, et je sais que je peux poser des questions et obtenir des informations complémentaires."
                  />
                </div>
              </div>
            )}

            <Button
              disabled={loading}
              type="submit"
              className="w-full md:w-fit px-6"
            >
              {type === "create" ? "Valider" : "Mettre à jour"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
