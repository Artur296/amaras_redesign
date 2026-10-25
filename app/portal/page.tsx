import { redirect } from "next/navigation";
import { getPortalSession } from "@/lib/portal-auth";
import PortalClient from "@/components/portal/PortalClient";

export const metadata = {
  title: "Портал сотрудников | AMARAS TOUR",
  robots: { index: false, follow: false },
};

export default async function PortalPage() {
  const session = await getPortalSession();
  if (!session) {
    redirect("/portal/login");
  }

  return <PortalClient sessionUser={session} />;
}
