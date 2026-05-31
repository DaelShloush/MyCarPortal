import Link from "next/link";
import { Lock, ArrowRight, LogIn } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AuthRequiredProps {
  /** שם האזור שאליו ניסה המשתמש להיכנס, למשל "המועדפים שלך" */
  feature?: string;
}

/**
 * מסך "נדרשת התחברות" — מוצג במקום redirect חד לעמוד login.
 * שומר על ה-URL (אין מלכודת כפתור Back) ונותן ניווט ברור:
 * התחברות/הרשמה + חזרה לדף הבית, וגם ה-navbar למעלה.
 */
export function AuthRequired({ feature }: AuthRequiredProps) {
  return (
    <SiteShell>
      <div className="max-w-md mx-auto px-4 py-16">
        <Card className="p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary-50)] grid place-items-center mx-auto mb-4">
            <Lock size={28} className="text-[var(--color-primary-600)]" />
          </div>
          <h1 className="text-xl font-black text-[var(--color-gray-900)] mb-2">
            נדרשת התחברות
          </h1>
          <p className="text-sm text-[var(--color-text-subtle)] mb-6">
            כדי לגשת {feature ? `אל ${feature}` : "לעמוד הזה"} צריך חשבון.
            ההרשמה חינמית ולוקחת פחות מדקה.
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/login">
              <Button variant="primary" className="w-full">
                <LogIn size={18} className="ms-1" />
                התחברות / הרשמה
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="w-full">
                <ArrowRight size={18} className="ms-1" />
                חזרה לדף הבית
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </SiteShell>
  );
}
