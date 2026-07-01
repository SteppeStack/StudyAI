"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type AuthGuardProps = {
  children: ReactNode;
};

const publicRoutes = ["/", "/login", "/register"];

function isPublicRoute(pathname: string) {
  return publicRoutes.includes(pathname);
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [isChecking, setIsChecking] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkAuth() {
      if (!supabase) {
        if (isPublicRoute(pathname)) {
          setIsAllowed(true);
          setIsChecking(false);
          return;
        }

        router.replace("/login");
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!active) return;

      const loggedIn = Boolean(session?.user);
      const publicPage = isPublicRoute(pathname);

      if (!loggedIn && !publicPage) {
        router.replace("/login");
        return;
      }

      if (loggedIn && (pathname === "/login" || pathname === "/register")) {
        router.replace("/dashboard");
        return;
      }

      setIsAllowed(true);
      setIsChecking(false);
    }

    checkAuth();

    const { data } =
      supabase?.auth.onAuthStateChange((_event, session) => {
        const loggedIn = Boolean(session?.user);
        const publicPage = isPublicRoute(pathname);

        if (!loggedIn && !publicPage) {
          router.replace("/login");
          return;
        }

        if (loggedIn && (pathname === "/login" || pathname === "/register")) {
          router.replace("/dashboard");
          return;
        }

        setIsAllowed(true);
        setIsChecking(false);
      }) ?? { data: { subscription: null } };

    return () => {
      active = false;
      data.subscription?.unsubscribe();
    };
  }, [pathname, router]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-xl font-black">
            S
          </div>

          <p className="mt-5 text-lg font-black">StudyAI</p>
          <p className="mt-2 text-sm text-slate-400">Checking session...</p>
        </div>
      </div>
    );
  }

  if (!isAllowed) {
    return null;
  }

  return <>{children}</>;
}