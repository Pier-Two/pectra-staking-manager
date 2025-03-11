import { redirect } from "next/navigation";

export default async function Home() {
  // TODO: Check for an active user/session and if there is, redirect to the dashboard
  // Otherwise, redirect to the login page
  redirect("/dashboard");
}
