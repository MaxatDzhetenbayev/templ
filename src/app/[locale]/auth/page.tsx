import { AuthForm } from "@/shared/components/auth-form";


export default function AuthPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10
    bg-gradient-to-b from-neutral-900 via-neutral-950 to-black text-white">
      <div className="w-full max-w-sm">
            <AuthForm />
      </div>
    </div>

  )
}
