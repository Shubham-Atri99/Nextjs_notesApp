"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import AuthAwareCTA from "@/components/AuthAwareCTA";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-50 to-white">
      
      <div className="absolute -top-16 sm:-top-24 left-1/2 h-64 w-64 sm:h-96 sm:w-96 -translate-x-1/2 rounded-full bg-blue-200/40 blur-3xl" />

      
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full"
      >
        {/* Responsive Navbar component */}
        <Navbar />
      </motion.div>

      
      <section className="relative z-10 flex flex-col items-center px-4 sm:px-6 pt-20 sm:pt-28 text-center max-w-3xl mx-auto">
        
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
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900"
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
          className="mt-6 max-w-full sm:max-w-2xl text-base sm:text-lg text-gray-600"
        >
          A modern note-taking app built for developers and professionals.
          Create, manage, and search your notes with speed and clarity.
        </motion.p>

        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex w-full justify-center flex-col items-center gap-4 sm:flex-row"
        >
          <AuthAwareCTA />
        </motion.div>

        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 p-4 sm:p-5 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-3 mx-auto"
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
