import { Card } from "@/components/ui/card";
import { AuthTabs } from "@/components/domain/auth-tabs";

interface Props {
  searchParams: Promise<{ error?: string; reset?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const { error, reset } = await searchParams;

  return (
    <Card className="p-6 md:p-8">
      <AuthTabs
        defaultTab="login"
        error={error}
        notice={reset === "1" ? "הסיסמה עודכנה בהצלחה! אפשר להתחבר עכשיו." : undefined}
      />
    </Card>
  );
}
