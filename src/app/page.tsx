"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FiArrowDown } from "react-icons/fi";

import { IProject } from "../../types/projects";
import Navbar from "../../components/Navbar";
import Light from "../../components/Light";
import ChromaGrid from "../../components/ProjectCardHome";
import ProfileCard from "../../components/ProfileCrad";
import SkillsGrid from "../../components/SkillSection";
import ContactSection from "../../components/ContactSection";


export default function HomePage() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects');
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      };

      const data = await response.json();
      const filterDataShowOnlyTrue = data.filter((project: IProject) => project.statusShow);

      setProjects(filterDataShowOnlyTrue);
    } catch (error) {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Navbar />

      {/* Hero Section */}
      <section id="hero" className="w-full h-full -mt-16 pt-40 pb-32">
        <div className="max-w-7xl flex justify-between gap-4 mx-auto px-4 xl:px-0">
          {/* Left Section */}
          <div className="hidden md:flex w-full flex-col justify-center gap-10">
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold">
                  <em>
                    Zidan <span className="text-red-700">/</span> Amar
                  </em>
                </h3>
                <h2 className="text-5xl font-bold">
                  Know me <span className="text-red-700">&amp;</span> <br /> Connect
                  with me
                </h2>
              </div>
              <p className="text-lg text-gray-700">
                I am with skills in web development, specializing in front-end technologies such as React, Next, JS/TS, Tailwind, Bootstrap &amp; Another framework/library. 
                I am also actively exploring in UX/UI Design.
              </p>
            </div>
            <Link
              href="#skills"
              className="group flex gap-2 items-center text-center bg-blue-950 w-fit px-4 py-3 rounded-lg text-white"
            >
              Explore more
              <FiArrowDown className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-all ease-in" />
            </Link>
          </div>
          {/* Right Section */}
          <div className="w-full h-full flex items-center justify-center">
            <ProfileCard
              name="Javi A. Torres"
              title="Software Engineer"
              handle="javicodes"
              status="Online"
              contactText="Contact Me"
              avatarUrl="/assets/images/pp_hero.webp"
              showUserInfo={true}
              enableTilt={true}
              enableMobileTilt={false}
              onContactClick={() => console.log("Contact clicked")}
            />
          </div>
        </div>
      </section>

      <section id="skills" className="py-32 bg-transparent transition-colors">
        <div className="max-w-7xl flex flex-col justify-between gap-4 mx-auto px-4 xl:px-0 space-y-10 sm:space-y-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-200 sm:text-4xl">
              My Skills
            </h2>
            <p className="mt-4 text-base sm:text-xl text-gray-600 dark:text-gray-300 lg:mx-auto">
              Languages, Technologies, & tools I work with to build any applications
            </p>
          </div>
          <SkillsGrid />
        </div>
      </section>

      {/* <div className='mx-auto -mt-16 w-full h-full flex items-center justify-center relative'>
        <Light
          raysOrigin="top-center"
          raysColor="#00ffff"
          raysSpeed={1.5}
          lightSpread={1}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
          className="custom-rays"
        />
        <div className="absolute top-40 left-0 right-0 z-10">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              Welcome to <span className="text-blue-600 dark:text-blue-400">My Portfolio</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Fullstack Developer specializing in modern web technologies. Building innovative solutions with Next.js, PostgreSQL, and cutting-edge tools.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <button
                  // onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 md:py-4 md:text-lg md:px-10 transition-colors"
                >
                  View Projects
                </button>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <button
                  // onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 md:py-4 md:text-lg md:px-10 transition-colors"
                >
                  Get In Touch
                </button>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Project Section */}
      <section id="projects" className="py-32 bg-transparent flex flex-col items-center relative">
        <div className="max-w-7xl px-4 xl:px-0 space-y-10 sm:space-y-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-200 sm:text-4xl">
              My Projects
            </h2>
            <p className="mt-4 text-base sm:text-xl text-gray-600 dark:text-gray-300 lg:mx-auto">
              A showcase of my recent work and personal projects
            </p>
          </div>
          <ChromaGrid
            items={projects}
            radius={300}
            damping={0.45}
            fadeOut={0.6}
            ease="power3.out"
            className="bg-transparent"
          />
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-32 bg-transparent"
      >
        <div className="max-w-7xl mx-auto px-4 xl:px-0 space-y-10 sm:space-y-16">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-black dark:text-white sm:text-4xl">
              Get In Touch
            </h2>
            <p className="mt-4 max-w-3xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
              Have a project in mind? Let&apos;s work together to bring your ideas to
              life.
            </p>
          </div>
          <ContactSection />
        </div>
      </section>
    </div>
  );
};