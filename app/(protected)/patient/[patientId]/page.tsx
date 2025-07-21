import { MedicalHistoryContainer } from "@/components/medical-history-container";
import { PatientRatingContainer } from "@/components/patient-rating-container";
import { ProfileImage } from "@/components/profile-image";
import { Card } from "@/components/ui/card";
import { getPatientFullDataById } from "@/utils/services/patient";
import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns";
import Link from "next/link";

interface ParamsProps {
  params: Promise<{ patientId: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

const PatientProfile = async (props: ParamsProps) => {
  const searchParams = await props.searchParams;
  const params = await props.params;

  let id = params.patientId;
  let patientId = params.patientId;
  const cat = searchParams?.cat || "medical-history";

  if (patientId === "self") {
    const { userId } = await auth();
    id = userId!;
  } else id = patientId;

  const { data } = await getPatientFullDataById(id);

  const SmallCard = ({ label, value }: { label: string; value: string }) => (
    <div className="w-full md:w-1/3">
      <span className="text-sm text-gray-500">{label}</span>
      <p className="text-sm md:text-base capitalize">{value}</p>
    </div>
  );

  return (
    <div className="bg-gray-100/60 h-full rounded-xl py-6 px-3 2xl:p-6 flex flex-col lg:flex-row gap-6">
      <div className="w-full xl:w-3/4">
        <div className="w-full flex flex-col lg:flex-row gap-4">
          <Card className="bg-white rounded-xl p-4 w-full lg:w-[30%] border-none flex flex-col items-center">
            <ProfileImage
              url={data?.img!}
              name={data?.first_name + " " + data?.last_name}
              className="h-20 w-20 md:flex"
              bgColor={data?.colorCode!}
              textClassName="text-3xl"
            />
            <h1 className="font-semibold text-2xl mt-2">
              {data?.first_name + " " + data?.last_name}
            </h1>
            <span className="text-sm text-gray-500">{data?.email}</span>

            <div className="w-full flex items-center justify-center gap-2 mt-4">
              <div className="w-1/2 space-y-1 text-center">
                <p className="text-xl font-medium">{data?.totalAppointments}</p>
                <span className="text-xs text-gray-500">Rendez-vous</span>
              </div>
            </div>
          </Card>

          <Card className="bg-white rounded-xl p-6 w-full lg:w-[70%] border-none space-y-6">
            <div className="flex flex-col md:flex-row md:flex-wrap md:items-center xl:justify-between gap-y-4 md:gap-x-0">
              <SmallCard label={"Genre"} value={data?.gender?.toLowerCase()!} />
              <SmallCard
                label="Date de naissance"
                value={format(data?.date_of_birth!, "yyyy-MM-dd")}
              />
              <SmallCard label={"Numéro de téléphone"} value={data?.phone!} />
            </div>

            <div className="flex flex-col md:flex-row md:flex-wrap md:items-center xl:justify-between gap-y-4 md:gap-x-0">
              <SmallCard label="Statut marital" value={data?.marital_status!} />
              <SmallCard label="Groupe sanguin" value={data?.blood_group!} />
              <SmallCard label="Adresse" value={data?.address!} />
            </div>

            <div className="flex flex-col md:flex-row md:flex-wrap md:items-center xl:justify-between gap-y-4 md:gap-x-0">
              <SmallCard
                label="Personne à contacter"
                value={data?.emergency_contact_name!}
              />
              <SmallCard
                label="Contact d'urgence"
                value={data?.emergency_contact_number!}
              />
              <SmallCard
                label="Dernière visite"
                value={
                  data?.lastVisit
                    ? format(data?.lastVisit!, "yyyy-MM-dd")
                    : "Aucune visite précédente"
                }
              />
            </div>
          </Card>
        </div>

        <div className="mt-10">
          {cat === "medical-history" && (
            <MedicalHistoryContainer patientId={id} />
          )}

          {/* {cat === "payments" && <Payments patientId={id!} />} */}
        </div>
      </div>

      <div className="w-full xl:w-1/3">
        <div className="bg-white p-4 rounded-md mb-8">
          <h1 className="text-xl font-semibold">Liens rapides</h1>

          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link
              className="p-3 rounded-md bg-yellow-50 hover:underline"
              href={`/record/appointments?id=${id}`}
            >
              Rendez-vous du patient
            </Link>
            <Link
              className="p-3 rounded-md bg-purple-50 hover:underline"
              href="?cat=medical-history"
            >
              Dossiers médicaux
            </Link>
            <Link
              className="p-3 rounded-md bg-violet-100"
              href={`?cat=payments`}
            >
              Factures médicales
            </Link>
            <Link className="p-3 rounded-md bg-pink-50" href={`/`}>
              Tableau de bord
            </Link>

            <Link className="p-3 rounded-md bg-rose-100" href={`#`}>
              Analyses & Résultats
            </Link>
            {patientId === "self" && (
              <Link
                className="p-3 rounded-md bg-black/10"
                href={`/patient/registration`}
              >
                Modifier les informations
              </Link>
            )}
          </div>
        </div>

        <PatientRatingContainer id={id!} />
      </div>
    </div>
  );
};

export default PatientProfile;
