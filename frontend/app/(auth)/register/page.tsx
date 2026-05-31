import { Card } from "@/components/ui/card";
import { AuthTabs } from "@/components/domain/auth-tabs";

interface Props {
  searchParams: Promise<{ error?: string }>;
}

export default async function RegisterPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <Card className="p-6 md:p-8">
      <AuthTabs defaultTab="register" error={error} />
    </Card>
  );
}
