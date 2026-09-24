import {redirect} from "next/navigation";
import {isOffice, isPartner} from "@/lib/core";
import {getStaff} from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** Canonical Clients list: /office/clients */
export default async function ClientsRedirectPage() {
  const staff = await getStaff();
  if (isOffice(staff.role) || isPartner(staff.role)) redirect("/office/clients");
  redirect("/today");
}
