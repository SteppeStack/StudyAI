"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type AuthGuardProps = {
  children: ReactNode;
};

const publicRoutes = ["/", "/login", "/register"];
const protectedRoutes = [
  "/dashboard",
  "/files",
  "/settings",
  "/assignments",
  "/documents",
  "/exam-prep",
  "/diploma",
  "/subscription",
  "/payment",
  "/ai-tutor",
];
const authMarkerCookie = "studyai-authenticated";

function isPublicRoute(pathname: string) {
  return publicRoutes.includes(pathname);
}

function isProtectedRoute(pathname: string) {
  return protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

function setAuthMarkerCookie(loggedIn: boolean) {
  if (typeof document === "undefined") return;

  document.cookie = loggedIn
    ? `${authMarkerCookie}=1; Path=/; SameSite=Lax; Max-Age=2592000`
    : `${authMarkerCookie}=; Path=/; SameSite=Lax; Max-Age=0`;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [isChecking, setIsChecking] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);
  const [checkedPathname, setCheckedPathname] = useState("");

  useEffect(() => {
    let active = true;

    async function checkAuth() {
      setIsChecking(true);
      setIsAllowed(false);
      setCheckedPathname("");

      const publicPage = isPublicRoute(pathname);
      const protectedPage = isProtectedRoute(pathname);

      if (!supabase) {
        if (publicPage || !protectedPage) {
          if (!active) return;

          setAuthMarkerCookie(false);
          setIsAllowed(true);
          setCheckedPathname(pathname);
          setIsChecking(false);
          return;
        }

        if (!active) return;

        setAuthMarkerCookie(false);
        setCheckedPathname(pathname);
        router.replace("/login");
        setIsChecking(false);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!active) return;

      const loggedIn = Boolean(session?.user);
      setAuthMarkerCookie(loggedIn);

      if (!loggedIn && protectedPage) {
        setCheckedPathname(pathname);
        router.replace("/login");
        setIsChecking(false);
        return;
      }

      if (loggedIn && (pathname === "/login" || pathname === "/register")) {
        setCheckedPathname(pathname);
        router.replace("/dashboard");
        setIsChecking(false);
        return;
      }

      setIsAllowed(true);
      setCheckedPathname(pathname);
      setIsChecking(false);
    }

    checkAuth();

    const { data } =
      supabase?.auth.onAuthStateChange((_event, session) => {
        const loggedIn = Boolean(session?.user);
        const protectedPage = isProtectedRoute(pathname);

        setAuthMarkerCookie(loggedIn);

        if (!loggedIn && protectedPage) {
          setIsAllowed(false);
          setCheckedPathname(pathname);
          router.replace("/login");
          return;
        }

        if (loggedIn && (pathname === "/login" || pathname === "/register")) {
          setIsAllowed(false);
          setCheckedPathname(pathname);
          router.replace("/dashboard");
          return;
        }

        setIsAllowed(true);
        setCheckedPathname(pathname);
        setIsChecking(false);
      }) ?? { data: { subscription: null } };

    return () => {
      active = false;
      data.subscription?.unsubscribe();
    };
  }, [pathname, router]);

  const routeWasChecked = checkedPathname === pathname;

  if (isChecking || !routeWasChecked) {
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

  if (!isAllowed || !routeWasChecked) {
    return null;
  }

  return <>{children}</>;
}
