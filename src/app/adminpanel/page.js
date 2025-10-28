"use client";

import { useEffect, useMemo, useState } from "react";
import {
  login,
  logout,
  setAuthenticated,
} from "@/store/slices/authSlice";
import { fetchSubscribers } from "@/store/slices/subscriberSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function AdminPanel() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const subscribersState = useAppSelector((state) => state.subscribers);
  const [form, setForm] = useState({ username: "", password: "" });
  const [bootstrapChecked, setBootstrapChecked] = useState(false);

  useEffect(() => {
    if (bootstrapChecked) {
      return;
    }

    dispatch(fetchSubscribers())
      .unwrap()
      .then(() => {
        dispatch(setAuthenticated(true));
      })
      .catch(() => {
        dispatch(setAuthenticated(false));
      })
      .finally(() => {
        setBootstrapChecked(true);
      });
  }, [dispatch, bootstrapChecked]);

  useEffect(() => {
    if (auth.isAuthenticated && subscribersState.fetchStatus === "idle") {
      dispatch(fetchSubscribers());
    }
  }, [auth.isAuthenticated, dispatch, subscribersState.fetchStatus]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      await dispatch(login(form)).unwrap();
      dispatch(setAuthenticated(true));
      await dispatch(fetchSubscribers());
      setForm({ username: "", password: "" });
    } catch (error) {
      dispatch(setAuthenticated(false));
    }
  };

  const handleLogout = async () => {
    await dispatch(logout());
    dispatch(setAuthenticated(false));
  };

  const formattedSubscribers = useMemo(() => {
    return subscribersState.items.map((subscriber) => ({
      ...subscriber,
      createdAt: new Date(subscriber.createdAt).toLocaleString("sv-SE"),
    }));
  }, [subscribersState.items]);

  if (!auth.isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white px-6">
        <div className="w-full max-w-sm rounded-2xl bg-white/10 p-8 backdrop-blur-sm border border-white/20">
          <h1 className="text-2xl font-semibold text-center mb-6">
            Stilify Adminpanel
          </h1>
          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            <div className="flex flex-col gap-2">
              <label htmlFor="username" className="text-sm uppercase tracking-wide">
                Användarnamn
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={form.username}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/30 bg-black/40 px-4 py-3 text-white focus:border-white focus:outline-none"
                placeholder="stilify.se"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm uppercase tracking-wide">
                Lösenord
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/30 bg-black/40 px-4 py-3 text-white focus:border-white focus:outline-none"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="mt-2 w-full rounded-lg bg-[#F4D8FF] py-3 font-semibold text-[#450A4A] transition-colors hover:bg-[#b64cdf]"
              disabled={auth.loading}
            >
              {auth.loading ? "Loggar in…" : "Logga in"}
            </button>
            {auth.error && (
              <p className="text-center text-sm text-red-200">{auth.error}</p>
            )}
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Administratörsvy</h1>
            <p className="text-white/70">
              Hantera prenumeranter som registrerat sitt intresse för Stilify.
            </p>
          </div>
          <button
            type="button"
            className="self-start rounded-full border border-white/40 px-4 py-2 text-sm uppercase tracking-wide text-white/80 transition-colors hover:border-white hover:text-white"
            onClick={handleLogout}
          >
            Logga ut
          </button>
        </header>

        <section className="rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-semibold">Registrerade e-postadresser</h2>
            <button
              type="button"
              onClick={() => dispatch(fetchSubscribers())}
              className="rounded-full bg-white/15 px-4 py-2 text-sm text-white transition-colors hover:bg-white/30"
              disabled={subscribersState.fetchStatus === "loading"}
            >
              {subscribersState.fetchStatus === "loading"
                ? "Uppdaterar…"
                : "Uppdatera lista"}
            </button>
          </div>

          {subscribersState.fetchError && (
            <p className="mb-4 rounded-lg border border-red-400/50 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {subscribersState.fetchError}
            </p>
          )}

          {formattedSubscribers.length === 0 ? (
            <p className="text-white/70">Inga registreringar ännu.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-white/10">
              {formattedSubscribers.map((subscriber) => (
                <li
                  key={subscriber.id}
                  className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="font-medium">{subscriber.email}</span>
                  <span className="text-sm text-white/60">
                    {subscriber.createdAt}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
