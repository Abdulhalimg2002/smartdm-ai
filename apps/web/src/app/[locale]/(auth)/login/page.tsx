import { LoginForm } from "@/modules/iam/components/login-form";
import Image from "next/image";

const LoginPage = () => {
  return (
    <div className="grid min-h-svh grid-cols-1 gap-0 xl:grid-cols-2">
      {/* Login Section */}
      <div className="flex min-h-svh flex-col bg-background p-5 sm:p-8 md:p-10 xl:p-12">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md rounded-2xl border border-border/70 bg-card p-6 shadow-sm sm:p-8">
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Illustration — Desktop only */}
<div className="relative hidden min-h-svh overflow-hidden rounded-2xl border border-border/70 bg-[#F8F9FC] xl:block">
  <Image
    src="/log.jpg.png"
    alt="SmartDM AI — Connected Conversations"
    fill
    priority
    sizes="(min-width: 1280px) 50vw, 100vw"
    className="object-cover object-right"
  />
</div>
    </div>
  );
};

export default LoginPage;