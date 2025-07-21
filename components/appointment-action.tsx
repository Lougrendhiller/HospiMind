"use client";

import { AppointmentStatus } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useRouter } from "next/navigation";
import { appointmentAction } from "@/app/actions/appointment";

interface ActionProps {
  id: string | number;
  status: string;
}
export const AppointmentAction = ({ id, status }: ActionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState("");
  const [reason, setReason] = useState("");
  const router = useRouter();

  const handleAction = async () => {
    try {
      setIsLoading(true);
      const newReason =
        reason ||
        `Le rendez-vous a été ${selected.toLowerCase()} le ${new Date()}`;

      const resp = await appointmentAction(
        id,
        selected as AppointmentStatus,
        newReason
      );

      if (resp.success) {
        toast.success(resp.msg);

        router.refresh();
      } else if (resp.error) {
        toast.error(resp.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error("Une erreur est survenue. Veuillez réessayer plus tard.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          disabled={status === "PENDING" || isLoading || status === "COMPLETED"}
          className="bg-yellow-200 text-black"
          onClick={() => setSelected("PENDING")}
        >
          En attente
        </Button>
        <Button
          variant="outline"
          disabled={
            status === "SCHEDULED" || isLoading || status === "COMPLETED"
          }
          className="bg-blue-200 text-black"
          onClick={() => setSelected("SCHEDULED")}
        >
          Approuver
        </Button>
        <Button
          variant="outline"
          disabled={
            status === "COMPLETED" || isLoading || status === "COMPLETED"
          }
          className="bg-emerald-200 text-black"
          onClick={() => setSelected("COMPLETED")}
        >
          Terminé
        </Button>
        <Button
          variant="outline"
          disabled={
            status === "CANCELLED" || isLoading || status === "COMPLETED"
          }
          className="bg-red-200 text-black"
          onClick={() => setSelected("CANCELLED")}
        >
          Annuler
        </Button>
      </div>
      {selected === "CANCELLED" && (
        <>
          <Textarea
            disabled={isLoading}
            className="mt-4"
            placeholder="Saisissez le motif..."
            onChange={(e) => setReason(e.target.value)}
          ></Textarea>
        </>
      )}

      {selected && (
        <div className="flex items-center justify-between mt-6 bg-red-100 p-4 rounded">
          <p className="">
            Êtes-vous sûr de vouloir effectuer cette action&nbsp;?
          </p>
          <Button disabled={isLoading} type="button" onClick={handleAction}>
            Oui
          </Button>
        </div>
      )}
    </div>
  );
};
