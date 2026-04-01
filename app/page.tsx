import { redirect } from "next/navigation";

export default function Home() {
  // Redireciona imediatamente quem aceder à raiz (/) para (/posicione-se)
  redirect("/posicione-se");
}