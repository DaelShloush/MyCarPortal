import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { forgotPasswordAction } from "../actions";

interface Props {
  searchParams: Promise<{ error?: string; sent?: string }>;
}

export default async function ForgotPasswordPage({ searchParams }: Props) {
  const { error, sent } = await searchParams;

  return (
    <Card className="p-6 md:p-8">
      <h1 className="text-2xl font-black text-center mb-2">איפוס סיסמה</h1>
      <p className="text-sm text-center text-[var(--color-text-subtle)] mb-6">
        הזן את האימייל שלך ונשלח קישור לאיפוס הסיסמה
      </p>

      {sent ? (
        <div className="text-center space-y-4">
          <CheckCircle
            size={48}
            className="mx-auto text-[var(--color-success)]"
          />
          <p className="text-sm text-[var(--color-text)]">
            אם קיים חשבון עם האימייל הזה, נשלח אליו קישור לאיפוס הסיסמה. בדוק את
            תיבת הדואר (וגם את תיקיית הספאם).
          </p>
          <Link
            href="/login"
            className="inline-block text-sm text-[var(--color-primary-500)] font-medium hover:underline"
          >
            ← חזרה להתחברות
          </Link>
        </div>
      ) : (
        <>
          {error && (
            <p className="mb-4 rounded-lg bg-[var(--color-risk-high-bg)] border border-[var(--color-risk-high-border)] text-[var(--color-risk-high-text)] text-sm px-4 py-3 text-center">
              {decodeURIComponent(error)}
            </p>
          )}

          <form action={forgotPasswordAction} className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">אימייל</label>
              <Input
                type="email"
                name="email"
                placeholder="dael@example.com"
                required
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              שלח קישור לאיפוס
            </Button>
          </form>

          <p className="text-sm text-center mt-6 text-[var(--color-text-subtle)]">
            נזכרת בסיסמה?{" "}
            <Link
              href="/login"
              className="text-[var(--color-primary-500)] font-medium hover:underline"
            >
              התחבר
            </Link>
          </p>
        </>
      )}
    </Card>
  );
}
