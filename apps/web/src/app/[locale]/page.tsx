import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations();

  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-3xl font-semibold">
        {t("common.appName")}
      </h1>
    
    <p>
      {t("auth.loginDescription")}
    </p>
     
      
    </main>
  );
}