"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import AppSidebar from "@/components/AppSidebar";
import { supabase } from "@/lib/supabase";
import { Subscription, getCurrentSubscription } from "@/lib/dashboardData";

type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  subscription_plan: string | null;
  account_role: "student" | "teacher" | null;
};

export default function SettingsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadSettings() {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        router.push("/login");
        return;
      }

      const user = sessionData.session.user;

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error(profileError.message);
        setErrorMessage("Could not load profile.");
      }

      if (profileData) {
        const loadedProfile = profileData as Profile;

        setProfile(loadedProfile);
        setFullName(loadedProfile.full_name || "");
        setAvatarUrl(loadedProfile.avatar_url || "");
      }

      const { data: subscriptionData, error: subscriptionError } =
        await getCurrentSubscription();

      if (subscriptionError) {
        console.error(subscriptionError.message);
      }

      setSubscription(subscriptionData as Subscription | null);
      setLoading(false);
    }

    loadSettings();
  }, [router]);

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!profile) return;

    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    const { data, error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        avatar_url: avatarUrl.trim() || null,
      })
      .eq("id", profile.id)
      .select("*")
      .single();

    if (error) {
      console.error(error.message);
      setErrorMessage("Could not save profile changes.");
      setSaving(false);
      return;
    }

    setProfile(data as Profile);
    setSuccessMessage("Profile updated successfully.");
    setSaving(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <AppSidebar />

        <section className="ml-[270px] flex min-h-screen items-center justify-center">
          <div className="rounded-2xl border border-slate-200 bg-white px-8 py-6 shadow-sm">
            <p className="text-sm font-medium text-slate-600">
              Loading settings...
            </p>
          </div>
        </section>
      </main>
    );
  }

  const currentPlanRaw = subscription?.plans;
  const currentPlan = Array.isArray(currentPlanRaw)
    ? currentPlanRaw[0]
    : currentPlanRaw;

  const planName = currentPlan?.display_name || "Free";
  const accountRole = profile?.account_role || "student";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <AppSidebar />

      <section className="ml-[270px] min-h-screen px-10 py-10">
        <div className="mb-10 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="mt-2 text-slate-500">
              Manage your profile and account information.
            </p>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-[1fr_360px] gap-10">
          <form
            onSubmit={handleSave}
            className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
          >
            <h2 className="text-xl font-bold">Profile Information</h2>
            <p className="mt-2 text-sm text-slate-500">
              You can update your name and avatar URL. Email, role, and plan are
              controlled by the system.
            </p>

            <div className="mt-8 space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Full name
                </label>

                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Avatar URL
                </label>

                <input
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/avatar.png"
                />

                <p className="mt-2 text-xs text-slate-500">
                  File upload is not connected yet. Use an image URL for now.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>

                <input
                  value={profile?.email || ""}
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Account role
                  </label>

                  <input
                    value={accountRole}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm capitalize text-slate-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Current plan
                  </label>

                  <input
                    value={planName}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
                  />
                </div>
              </div>
            </div>

            {successMessage && (
              <div className="mt-6 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-600">
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {errorMessage}
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold">Account Summary</h3>

              <div className="mt-6 flex items-center gap-4">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                    {fullName
                      ? fullName
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()
                      : "ST"}
                  </div>
                )}

                <div>
                  <p className="font-bold">{fullName || "Student"}</p>
                  <p className="text-sm capitalize text-slate-500">
                    {accountRole}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Plan</span>
                  <span className="font-semibold">{planName}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Status</span>
                  <span className="font-semibold capitalize">
                    {subscription?.status || "active"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Email</span>
                  <span className="max-w-[180px] truncate font-semibold">
                    {profile?.email || "-"}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
              <h3 className="font-bold text-blue-700">Note</h3>
              <p className="mt-2 text-sm leading-6 text-blue-700">
                Role and subscription cannot be changed from settings. They are
                managed by the backend and billing logic.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}