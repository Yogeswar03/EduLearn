"use client";

import { useEffect, useState } from "react";
import { useAuth, UserButton, SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Twitter, Linkedin, Mail, Menu, X } from "lucide-react";
import { motion } from "motion/react";

export default function Home() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <main className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="w-full px-6 py-4 bg-white text-black fixed top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between pr-10">
          <Image src={'/edu_logo.png'} width={120} height={30} />
          <div className="hidden md:flex space-x-6">
            {['home', 'about', 'features', 'contact'].map((section) => (
              <button key={section} onClick={() => scrollToSection(section)} className="hover:underline capitalize">
                {section}

              </button>
            ))}
             <UserButton />
          </div>
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden mt-4 flex flex-col space-y-2 bg-amber-700 p-4 rounded-lg">
            {['home', 'about', 'features', 'contact'].map((section) => (
              <button key={section} onClick={() => scrollToSection(section)} className="text-left w-full hover:underline capitalize">
                {section}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative w-full h-[90vh] flex flex-col justify-center items-center text-center px-6 pt-20">
        <div className="absolute inset-0 -z-10 mt-15  p-6">
          <Image src="/image.png" alt="Education Background" width={500} height={500} className="object-cover w-full h-full rounded-xl" />
        </div>
        <motion.h1 className="text-5xl md:text-6xl font-bold text-[#a218a0]" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          Welcome to Edulearn
        </motion.h1>
        <motion.p className="mt-4 text-lg md:text-xl max-w-2xl text-gray-300" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          Unlock your learning potential with interactive courses, progress tracking, and expert mentors.
        </motion.p>

        <div className="mt-8 flex gap-4 flex-wrap items-center justify-center">
          {!isSignedIn ? (
            <Link href="/sign-in">
              <Button className="text-lg px-6 py-4 bg-gray-800 hover:bg-gray-600">Get Started</Button>
            </Link>
          ) : (
            <>
              <Link href="/workspace">
                <Button className="text-lg px-6 py-4 bg-gray-900 hover:bg-gray-800">Go to Workspace</Button>
              </Link>
              <SignOutButton>
                <Button variant="outline" className="text-lg px-6 py-4 bg-white border border-gray-600 hover:bg-gray-200 text-black">Sign Out</Button>
              </SignOutButton>
             
            </>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className=" py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-[#7209b7] mb-6">About Us</h2>
          <p className="text-lg text-gray-800 leading-relaxed">
            At Edulearn, we believe that education is not just about gaining knowledge—it's about transforming lives. Our platform empowers learners from all backgrounds to pursue their goals through flexible, hands-on, and expertly crafted online courses. <br /><br />
            Whether you're a student seeking academic support, a working professional aiming to upskill, or someone passionate about lifelong learning, Edulearn is designed to help you succeed. With a wide range of subjects, personalized progress tracking, and direct access to industry experts, we make high-quality education accessible and engaging. <br /><br />
            Our mission is simple: to create a world where anyone, anywhere, can learn and grow. Join our growing community and take control of your future—one lesson at a time.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <h2 className="text-4xl font-bold text-center text-[#7209b7] mb-12">Why Choose Edulearn?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[{
            title: "Interactive Learning",
            desc: "Interactive Course Learning with AI",
            img: "/interactive.png"
          }, {
            title: "Track Your Progress",
            desc: "Get detailed analytics and progress insights.",
            img: "/track.png"
          }, {
            title: "AI Course Generation",
            desc: "Engage with Videos, Custom Input Courses.",
            img: "/expert.png"
          }].map((item, index) => (
            <motion.div key={index} className="bg-gray-50 rounded-xl shadow p-6 text-center hover:scale-105 transition" whileHover={{ scale: 1.05 }}>
              <Image src={item.img} alt={item.title} width={100} height={100} className="mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#7209b7]">{item.title}</h3>
              <p className="text-gray-600 mt-2">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#b596e5] text-white py-20 px-6 text-center m-5 rounded-xl">
        <h2 className="text-4xl font-bold mb-4">Join thousands of learners today</h2>
        <p className="text-lg mb-8">Start your journey with Edulearn and explore top courses tailored for you.</p>
        <Link href="/sign-in">
          <Button className="bg-gray-900 hover:bg-gray-700 text-white font-semibold text-lg px-6 py-4">Explore Courses</Button>
        </Link>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-100 py-16 px-6 text-gray-600">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <Image src={'/edu_logo.png'} width={120} height={30} />
            <p className="mt-2 text-sm">Edulearn is your one-stop learning platform to upskill with hands-on, expert-led courses.</p>
          </div>
          <div>
            <h3 className="font-semibold text-[#7209b7] mb-2">Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#home" className="hover:underline">Home</a></li>
              <li><a href="#about" className="hover:underline">About</a></li>
              <li><a href="#features" className="hover:underline">Features</a></li>
              <li><a href="#contact" className="hover:underline">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[#7209b7] mb-2">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">Blog</a></li>
              <li><a href="#" className="hover:underline">Support</a></li>
              <li><a href="#" className="hover:underline">Community</a></li>
              <li><a href="#" className="hover:underline">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[#7209b7] mb-2">Follow Us</h3>
            <div className="flex gap-4 mt-2">
              <a href="#"><Facebook className="w-5 h-5 hover:text-[#7209b7]" /></a>
              <a href="#"><Twitter className="w-5 h-5 hover:text-[#7209b7]" /></a>
              <a href="https://www.linkedin.com/in/yogeswar-reddy" target="_blank"><Linkedin className="w-5 h-5 hover:text-[#7209b7]" /></a>
              <a href="yogi122502@gmail.com"><Mail className="w-5 h-5 hover:text-[#7209b7]" /></a>
            </div>
          </div>
        </div>
        <div className="text-center text-xs mt-10 text-gray-500">
          © {new Date().getFullYear()} Edulearn. All rights reserved. Developed by Yogeswar
        </div>
      </footer>
    </main>
  );
}
