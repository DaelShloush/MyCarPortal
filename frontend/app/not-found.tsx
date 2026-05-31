import Link from "next/link";
import { Car, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary-700)] grid place-items-center text-white mb-6">
        <Car size={32} strokeWidth={2.5} />
      </div>
      <h1 className="text-5xl font-black text-[var(--color-gray-900)] mb-2">404</h1>
      <p className="text-lg font-bold text-[var(--color-gray-900)] mb-1">
        הדף לא נמצא
      </p>
      <p className="text-sm text-[var(--color-text-subtle)] mb-6 max-w-sm">
        הדף שחיפשת לא קיים או הוסר. אפשר לחזור לעמוד הבית ולחפש רכב.
      </p>
      <Link href="/">
        <Button variant="primary">
          <Home size={18} />
          חזרה לעמוד הבית
        </Button>
      </Link>
    </div>
  );
}
