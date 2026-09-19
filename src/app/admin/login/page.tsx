"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ArrowRight, Lock, User } from "lucide-react";
import { loginAdmin } from "@/lib/api/admin";
import { getAdminAuth, saveAdminAuth } from "@/lib/auth/adminAuth";
import { SITE } from "@/lib/site";
import ShopMark from "@/components/ui/ShopMark";

type LoginForm = {
  username: string;
  password: string;
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  useEffect(() => {
    if (getAdminAuth()?.token) {
      router.replace("/admin");
    }
  }, [router]);

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);

    try {
      const result = await loginAdmin(data.username, data.password);
      saveAdminAuth({ token: result.token, username: result.username });
      toast.success("Welcome back!");
      router.replace("/admin");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <ShopMark size={44} className="mb-3 h-11 w-11" />
          <p className="text-lg font-bold text-slate-900">{SITE.name}</p>
          <p className="text-sm text-primary">Admin Console</p>
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Sign in</h1>
            <p className="mt-2 text-sm text-slate-500">
              Enter your admin credentials to access the dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Username
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  {...register("username", { required: "Username is required" })}
                  className="w-full rounded-md border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition-colors focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                  placeholder="admin"
                  autoComplete="username"
                />
              </div>
              {errors.username && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  {...register("password", { required: "Password is required" })}
                  className="w-full rounded-md border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition-colors focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-secondary disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in to Dashboard"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Authorized personnel only
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link href="/" className="font-medium text-primary hover:text-secondary">
            ← Back to website
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
