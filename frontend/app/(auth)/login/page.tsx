import { Card } from "@/components/ui/card";
import { AuthTabs } from "@/components/domain/auth-tabs";

interface Props {
  searchParams: Promise<{ error?: string; reset?: string; verify?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const { error, reset, verify } = await searchParams;

  const notice =
    reset === "1"
      ? "הסיסמה עודכנה בהצלחה! אפשר להתחבר עכשיו."
      : verify === "1"
        ? "📧 נרשמת בהצלחה! שלחנו לך מייל אימות — אשר אותו ואז התחבר."
        : undefined;

  return (
    <Card className="p-6 md:p-8">
      <AuthTabs defaultTab="login" error={error} notice={notice} />
    </Card>
  );
}
