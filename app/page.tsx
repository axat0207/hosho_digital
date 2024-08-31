"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import HeroSection from "@/components/students/HeroSection";
import AppLayout from "@/components/ui/layouts/AppLayout";
import { useUser, useAuth } from "@clerk/nextjs";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const {userId} = useAuth();
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const role = user?.unsafeMetadata?.role;

      if (role === "finance_head") {
        router.push("/admin/finance-head");
      } else if (role === "principal") {
        router.push("/admin/principal");
      } else if (role === "hod") {
        router.push("/admin/hod");
      }
    }
  }, [isLoaded, isSignedIn, user, router]);

  if (!isLoaded) {
    <main>
      <AppLayout>
        <h1>Loading...</h1>
      </AppLayout>
    </main>;
  }
  return (
    <main>
      <AppLayout>
        <HeroSection />
      </AppLayout>
    </main>
  );
}
