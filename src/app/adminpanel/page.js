"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LogIn,
  LogOut,
  Mail,
  RefreshCw,
  Shield,
  User,
  KeyRound,
  Trash2,
} from "lucide-react";
import {
  login,
  logout,
  setAuthenticated,
} from "@/store/slices/authSlice";
import { fetchSubscribers, deleteSubscriber } from "@/store/slices/subscriberSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function AdminPanel() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const subscribersState = useAppSelector((state) => state.subscribers);
  const [form, setForm] = useState({ username: "", password: "" });
  const [bootstrapChecked, setBootstrapChecked] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

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
    try {
      await dispatch(logout()).unwrap();
    } catch (error) {
      // Handle error silently or show message
    } finally {
      dispatch(setAuthenticated(false));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Är du säker på att du vill ta bort denna e-postadress?")) {
      return;
    }

    setDeletingId(id);
    try {
      await dispatch(deleteSubscriber({ id })).unwrap();
    } catch (error) {
      alert(error || "Kunde inte ta bort e-postadressen.");
    } finally {
      setDeletingId(null);
    }
  };

  const formattedSubscribers = useMemo(() => {
    return subscribersState.items.map((subscriber) => ({
      ...subscriber,
      createdAt: new Date(subscriber.createdAt).toLocaleString("sv-SE", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    }));
  }, [subscribersState.items]);

  if (!auth.isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-white px-6">
        <div className="w-full max-w-sm rounded-2xl bg-white/5 p-8 backdrop-blur-sm border border-white/10 shadow-2xl">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="p-3 bg-white/10 rounded-full border border-white/10 mb-3">
              <Shield size={28} className="text-white/80" />
            </div>
            <h1 className="text-2xl font-semibold text-center">
              Stilify Administratörspanel
            </h1>
          </div>
          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            <div className="relative flex items-center">
              <User
                size={20}
                className="absolute left-4 text-white/50"
                aria-hidden="true"
              />
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={form.username}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/20 bg-black/30 pl-12 pr-4 py-3 text-white focus:border-white/40 focus:outline-none transition-colors"
                placeholder="Användarnamn"
              />
            </div>
            <div className="relative flex items-center">
              <KeyRound
                size={20}
                className="absolute left-4 text-white/50"
                aria-hidden="true"
              />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/20 bg-black/30 pl-12 pr-4 py-3 text-white focus:border-white/40 focus:outline-none transition-colors"
                placeholder="Lösenord"
              />
            </div>
            <button
              type="submit"
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-lg bg-[#F4D8FF] py-3 font-semibold text-[#450A4A] transition-colors hover:bg-white/80 disabled:opacity-50"
              disabled={auth.loading}
            >
              {auth.loading ? (
                "Loggar in…"
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Logga in</span>
                </>
              )}
            </button>
            {auth.error && (
              <p className="text-center text-sm text-red-300">{auth.error}</p>
            )}
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-full border border-white/10">
              <Shield size={28} className="text-white/80" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Administratörsvy
              </h1>
              <p className="text-white/60">
                Hantera prenumeranter som registrerat sitt intresse för Stilify.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white/80 transition-colors hover:border-white hover:text-white cursor-pointer relative z-10"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span>Logga ut</span>
          </button>
        </header>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-semibold">
              Registrerade e-postadresser
            </h2>
            <button
              type="button"
              onClick={() => dispatch(fetchSubscribers())}
              className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/90 transition-colors hover:bg-white/20 disabled:opacity-50"
              disabled={subscribersState.fetchStatus === "loading"}
            >
              <RefreshCw
                size={16}
                className={
                  subscribersState.fetchStatus === "loading"
                    ? "animate-spin"
                    : ""
                }
              />
              <span>
                {subscribersState.fetchStatus === "loading"
                  ? "Uppdaterar…"
                  : "Uppdatera lista"}
              </span>
            </button>
          </div>

          {subscribersState.fetchError && (
            <p className="mb-4 rounded-lg border border-red-400/50 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {subscribersState.fetchError}
            </p>
          )}

          {formattedSubscribers.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              <Mail size={40} className="mx-auto mb-3" />
              <p>Inga registreringar ännu.</p>
            </div>
          ) : (
            <>
              {/* Mobile list view */}
              <div className="sm:hidden">
                <ul className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5">
                  {formattedSubscribers.map((subscriber) => (
                    <li
                      key={subscriber.id}
                      className="p-4 flex items-center justify-between gap-3"
                    >
                      <div className="text-left">
                        <p className="font-medium text-sm break-all">
                          {subscriber.email}
                        </p>
                        <p className="text-xs text-white/60 mt-0.5">
                          {subscriber.createdAt}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDelete(subscriber.id)}
                        disabled={deletingId === subscriber.id}
                        className="inline-flex items-center justify-center rounded-lg bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed border border-red-500/20"
                        aria-label={`Ta bort ${subscriber.email}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Desktop/tablet table view */}
              <div className="hidden sm:block overflow-x-auto -mx-8 px-8">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full text-left">
                    <thead>
                      <tr className="border-b border-white/10 text-sm text-white/60">
                        <th className="px-4 py-3 font-medium whitespace-nowrap">E-postadress</th>
                        <th className="px-4 py-3 font-medium whitespace-nowrap">
                          Registreringsdatum
                        </th>
                        <th className="px-4 py-3 font-medium text-right whitespace-nowrap">
                          Åtgärder
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {formattedSubscribers.map((subscriber) => (
                        <tr key={subscriber.id}>
                          <td className="px-4 py-4 font-medium text-base break-all">
                            {subscriber.email}
                          </td>
                          <td className="px-4 py-4 text-white/70 whitespace-nowrap">
                            {subscriber.createdAt}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleDelete(subscriber.id)}
                              disabled={deletingId === subscriber.id}
                              className="inline-flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed border border-red-500/20 whitespace-nowrap"
                              aria-label={`Ta bort ${subscriber.email}`}
                            >
                              <Trash2 size={16} className="w-4 h-4" />
                              <span>
                                {deletingId === subscriber.id ? "Tar bort…" : "Ta bort"}
                              </span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

