import { redirect } from "next/navigation";

export default function Home() {
  // "Will who?" is the default landing section.
  redirect("/who");
}
