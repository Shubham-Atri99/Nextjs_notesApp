"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-50 to-white">
      
      <div className="absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-200/40 blur-3xl" />

      
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex items-center justify-between px-10 py-6"
      >
        <div className="flex items-center gap-2 text-xl font-semibold">
          📘 <span>NotesApp</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/login" className="text-gray-600 hover:text-black">
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-blue-500 px-5 py-2 text-white shadow hover:bg-blue-600"
          >
            Get Started
          </Link>
        </div>
      </motion.nav>

      
      <section className="relative z-10 flex flex-col items-center px-6 pt-28 text-center">
        
        <motion.span
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 rounded-full bg-blue-100 px-5 py-1 text-sm font-medium text-blue-600"
        >
          ✨ Simple & Powerful Note Taking
        </motion.span>

        
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-5xl font-extrabold tracking-tight text-gray-900 md:text-6xl"
        >
          Organize Your Thoughts
          <br />
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
            Effortlessly
          </span>
        </motion.h1>

        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-6 max-w-2xl text-lg text-gray-600"
        >
          A modern note-taking app built for developers and professionals.
          Create, manage, and search your notes with speed and clarity.
        </motion.p>

        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Link
            href="/register"
            className="group flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-8 py-4 text-lg font-medium text-white shadow-lg transition hover:scale-105 hover:bg-blue-600"
          >
            Start Taking Notes
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>

          <button className="rounded-xl border border-gray-300 px-8 py-4 text-lg font-medium text-gray-700 transition hover:bg-gray-100 hover:shadow">
            View Demo Dashboard
          </button>
        </motion.div>

        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 p-5 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3"
        >
          {[
            {
              title: "Fast & Secure",
              desc: "Powered by Firebase with secure authentication.",
            },
            {
              title: "Search Instantly",
              desc: "Find notes instantly with smart search.",
            },
            {
              title: "Cloud Sync",
              desc: "Access notes anytime, anywhere.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </section>
    </main>
  );
}
