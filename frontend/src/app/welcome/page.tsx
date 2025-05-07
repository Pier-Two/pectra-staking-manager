import { redirect } from "next/navigation";

/**
 * Redirects to the home page,
 * keeping for SEO purposes.
 */
export default function Welcome() {
  redirect("/");
}
