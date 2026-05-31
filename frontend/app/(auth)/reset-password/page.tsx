import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { resetPasswordAction } from "../actions";

interface Props {
  searchParams: Promise<{ error?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <Card className="p-6 md:p-8">
      <h1 className="text-2xl font-black text-center mb-2">בחירת סיסמה חדשה</h1>
      <p className="text-sm text-center text-[var(--color-text-subtle)] mb-6">
        הזן סיסמה חדשה לחשבון שלך
      </p>

      {error && (
        <p className="mb-4 rounded-lg bg-[var(--color-risk-high-bg)] border border-[var(--color-risk-high-border)] text-[var(--color-risk-high-text)] text-sm px-4 py-3 text-center">
          {decodeURIComponent(error)}
        </p>
      )}

      <form action={resetPasswordAction} className="space-y-4">
        <div>
          <label className="text-sm font-medium block mb-1.5">סיסמה חדשה</label>
          <Input
            type="password"
            name="password"
            placeholder="לפחות 8 תווים"
            minLength={8}
            required
          />
        </div>
        <Button type="submit" className="w-full" size="lg">
          עדכן סיסמה
        </Button>
      </form>
    </Card>
  );
}
