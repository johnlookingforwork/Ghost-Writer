import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-sm w-full space-y-8">
        <div className="text-center">
          <h1 className="font-serif text-3xl tracking-tight">Ghost-Writer</h1>
          <p className="text-muted mt-2">Sign in to start writing</p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
