"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  resetSubmitState,
  submitSubscriber,
} from "@/store/slices/subscriberSlice";

const socialLinks = [
  {
    label: "TikTok",
    href: "#",
    path: "M20 8.5c-2.3 0-4.2-1.8-4.4-4.1h-2.7v11.1c0 2-1.6 3.6-3.6 3.6S5.7 17.5 5.7 15.6s1.6-3.6 3.6-3.6c.3 0 .6 0 .9.1V9c-.3 0-.6-.1-.9-.1-3.2 0-5.8 2.6-5.8 5.8S6 20.5 9.2 20.5s5.8-2.6 5.8-5.8V8.2c1.2 1.2 2.8 2 4.6 2v-1.7z",
  },
  {
    label: "Facebook",
    href: "#",
    path: "M13.5 20v-6h2.1l.3-2.4h-2.4V9.7c0-.7.2-1.2 1.2-1.2H16V6.3c-.2 0-.9-.1-1.7-.1-1.7 0-2.8 1-2.8 2.9v1.7H9.4V14h2.1v6h2z",
  },
  {
    label: "Instagram",
    href: "#",
    path: "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7zm5 3.2A4.8 4.8 0 1 1 7.2 13 4.8 4.8 0 0 1 12 8.2zm0 2A2.8 2.8 0 1 0 14.8 13 2.8 2.8 0 0 0 12 10.2zM17.5 7a1 1 0 1 1-1 1 1 1 0 0 1 1-1z",
  },
];

export default function HeroSection({ showBackToOffice = false }) {
  const [email, setEmail] = useState("");
  const dispatch = useAppDispatch();
  const { submitStatus, submitError, submitMessage } = useAppSelector(
    (state) => state.subscribers
  );

  useEffect(() => {
    if (submitStatus === "succeeded") {
      setEmail("");
    }
  }, [submitStatus]);

  useEffect(() => {
    if (submitStatus === "succeeded" || submitStatus === "failed") {
      const timeout = setTimeout(() => {
        dispatch(resetSubmitState());
      }, 4000);

      return () => clearTimeout(timeout);
    }

    return undefined;
  }, [submitStatus, dispatch]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email) {
      return;
    }

    dispatch(submitSubscriber({ email }));
  };

  return (
    <div className="relative w-full -mx-[calc((100vw-100%)/2)] overflow-hidden">
  <div className="relative w-full min-h-screen">
        <div className="flex absolute inset-0 w-full h-full overflow-hidden backdrop-brightness-110">
          <Image
            src="/assets/hero-banner.png"
            alt="Fashion Banner"
            fill
            className="object-cover hidden md:block"
            priority
            sizes="100vw"
          />
          <Image
            src="/assets/hero-3.png"
            alt="Fashion Banner"
            fill
            className="object-cover md:hidden"
            priority
            sizes="100vw"
          />
        </div>

        <div className="absolute inset-0 bg-black/40 md:bg-black/30 z-10" />

        <div className="absolute inset-0 z-20 flex items-center justify-center px-5 sm:px-8">
          <div className="w-full max-w-[900px] text-center">
            <h1 className="hero-title text-balance text-white font-semibold leading-[1.04] tracking-[-0.015em]">
              Snart lanseras Stilify – den
              <br className="hidden sm:block" />
              nya platsen för mode.
            </h1>

            <p className="hero-sub text-balance text-white/90 mt-4 md:mt-5 leading-relaxed max-w-[760px] mx-auto">
              Upptäck mode på ett ställe – sök med bild, jämför nytt och
              <br className="hidden md:block" />
              second hand och hitta din personliga stil. Signa upp för tidig
              <br className="hidden md:block" />
              tillgång och bli bland de första att prova Stilify •
            </p>

            <div className="mt-6 sm:mt-7 md:mt-8 flex flex-col items-center justify-center gap-2.5 sm:gap-3.5">
              <form
                onSubmit={handleSubmit}
                className="w-full max-w-[720px] mx-auto flex flex-col gap-2"
              >
                <label htmlFor="email" className="sr-only">
                  E-post
                </label>
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="E-post"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="field w-full px-4 sm:px-5 border border-solid border-white/80 bg-white/10 text-white placeholder-white/90 focus:bg-white/10 text-center"
                  required
                  disabled={submitStatus === "loading"}
                />
                <button
                  type="submit"
                  className="btn-cta px-6 sm:px-7 font-medium text-[#450A4A] bg-[#F4D8FF] hover:bg-[#b64cdf] transition-colors duration-200 w-full sm:w-[170px] mx-auto"
                  disabled={submitStatus === "loading"}
                >
                  {submitStatus === "loading" ? "Skickar…" : "Registrera dig"}
                </button>
              </form>

              {(submitMessage || submitError) && (
                <p
                  className={`text-sm sm:text-base ${
                    submitError ? "text-red-200" : "text-green-200"
                  }`}
                >
                  {submitError || submitMessage}
                </p>
              )}
            </div>

            <div className="mt-6 sm:mt-7 flex items-center justify-center gap-2.5 sm:gap-3.5">
              {socialLinks.map((icon) => (
                <a key={icon.label} href={icon.href} aria-label={icon.label} className="group">
                  <span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 text-black shadow-sm group-hover:bg-white transition">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
                      <path d={icon.path} />
                    </svg>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {showBackToOffice && (
          <div className="absolute inset-0 flex justify-center items-center top-[200px] sm:top-[300px]">
            <button className="border-2 border-black font-bold text-black hover:bg-white hover:text-black transition-all duration-300 w-28 sm:w-40 md:w-[237px] h-7 sm:h-12 md:h-[55px] text-xs sm:text-sm md:text-lg">
              Back to office
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
