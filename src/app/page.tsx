"use client";
import Link from "next/link";
import Image from "next/image";
import { FiArrowDown } from "react-icons/fi";
import { FaSquareInstagram } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { HiOutlineLocationMarker } from "react-icons/hi";

import Navbar from "../../components/Navbar";
import Light from "../../components/Light";
import ChromaGrid from "../../components/Project";
import ProfileCard from "../../components/ProfileCrad";


export default function HomePage() {
  const skills = [
    { name: "Next.js", level: 90, icon: "⚛️" },
    { name: "TypeScript", level: 85, icon: "📘" },
    { name: "Tailwind CSS", level: 95, icon: "🎨" },
    { name: "PostgreSQL", level: 80, icon: "🗄️" },
    { name: "Prisma", level: 85, icon: "💎" },
    { name: "Node.js", level: 88, icon: "🟢" },
    { name: "React", level: 92, icon: "⚛️" },
    { name: "JavaScript", level: 90, icon: "💛" },
  ];

  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description:
        "Full-stack e-commerce solution with admin dashboard, payment integration, and inventory management.",
      technologies: ["Next.js", "PostgreSQL", "Stripe", "Tailwind"],
      image:
        "https://i.ytimg.com/vi/XxPqTS9s200/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCRPlZEqJux4r-ypRBaHkPtA3OtcQ",
      link: "#",
      github: "#",
    },
    {
      id: 2,
      title: "Task Management App",
      description:
        "Collaborative task management application with real-time updates and team collaboration features.",
      technologies: ["React", "Node.js", "Socket.io", "MongoDB"],
      image:
        "https://i.ytimg.com/vi/XxPqTS9s200/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCRPlZEqJux4r-ypRBaHkPtA3OtcQ",
      link: "#",
      github: "#",
    },
    {
      id: 3,
      title: "Weather Dashboard",
      description:
        "Modern weather application with forecasts, interactive maps, and location-based insights.",
      technologies: ["Vue.js", "Weather API", "Chart.js", "CSS3"],
      image:
        "https://i.ytimg.com/vi/XxPqTS9s200/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCRPlZEqJux4r-ypRBaHkPtA3OtcQ",
      link: "#",
      github: "#",
    },
    {
      id: 4,
      title: "Social Media Platform",
      description:
        "Complete social networking platform with posts, comments, likes, and user authentication.",
      technologies: ["Next.js", "Prisma", "PostgreSQL", "NextAuth"],
      image:
        "https://i.ytimg.com/vi/XxPqTS9s200/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCRPlZEqJux4r-ypRBaHkPtA3OtcQ",
      link: "#",
      github: "#",
    },
    {
      id: 5,
      title: "Portfolio Website",
      description:
        "Responsive portfolio website showcasing projects and skills with modern design and animations.",
      technologies: ["Next.js", "Tailwind", "Framer Motion", "MDX"],
      image:
        "https://i.ytimg.com/vi/XxPqTS9s200/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCRPlZEqJux4r-ypRBaHkPtA3OtcQ",
      link: "#",
      github: "#",
    },
    {
      id: 6,
      title: "Blog Platform",
      description:
        "Content management system for blogging with markdown support and SEO optimization.",
      technologies: ["Next.js", "Sanity", "TypeScript", "Vercel"],
      image:
        "https://i.ytimg.com/vi/XxPqTS9s200/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCRPlZEqJux4r-ypRBaHkPtA3OtcQ",
      link: "#",
      github: "#",
    },
  ];

  const items = [
    {
      image: "/assets/images/land.jpg",
      title: "Sarah Johnson",
      subtitle: "Frontend Developer",
      handle: "@sarahjohnson",
      borderColor: "#3B82F6",
      gradient: "linear-gradient(145deg, #3B82F6, #000)",
      url: "https://github.com/sarahjohnson",
    },
    {
      image: "/assets/images/land.jpg",
      title: "Mike Chen",
      subtitle: "Backend Engineer",
      handle: "@mikechen",
      borderColor: "#10B981",
      gradient: "linear-gradient(180deg, #10B981, #000)",
      url: "https://linkedin.com/in/mikechen",
    },
    {
      image: "/assets/images/land.jpg",
      title: "Mike Chen",
      subtitle: "Backend Engineer",
      handle: "@mikechen",
      borderColor: "#A8CE00FF",
      gradient: "linear-gradient(180deg, #A8CE00FF, #000)",
      url: "https://linkedin.com/in/mikechen",
    },
    {
      image: "/assets/images/land.jpg",
      title: "Mike Chen",
      subtitle: "Backend Engineer",
      handle: "@mikechen",
      borderColor: "#921600FF",
      gradient: "linear-gradient(180deg, #921600FF, #000)",
      url: "https://linkedin.com/in/mikechen",
    },

    {
      image: "/assets/images/land.jpg",
      title: "Mike Chen",
      subtitle: "Backend Engineer",
      handle: "@mikechen",
      borderColor: "#4C00A3FF",
      gradient: "linear-gradient(180deg, #4C00A3FF, #000)",
      url: "https://linkedin.com/in/mikechen",
    },
    {
      image: "/assets/images/land.jpg",
      title: "Mike Chen",
      subtitle: "Backend Engineer",
      handle: "@mikechen",
      borderColor: "#A7005CFF",
      gradient: "linear-gradient(180deg, #A7005CFF, #000)",
      url: "https://linkedin.com/in/mikechen",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Navbar />

      {/* Hero Section */}
      <section className="w-full h-full -mt-16 pt-32 pb-36">
        <div className="max-w-7xl flex justify-between gap-4 mx-auto">
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

      {/* Skills Section */}
      <section
        id="skills"
        className="py-30 bg-white dark:bg-gray-800 transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              My Skills
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
              Technologies and tools I work with to build amazing applications
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 place-items-center lg:place-items-stretch">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center hover:shadow-lg dark:hover:shadow-2xl transition-shadow w-full max-w-sm lg:max-w-none"
              >
                <div className="text-4xl mb-4">{skill.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {skill.name}
                </h3>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                  <div
                    className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {skill.level}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Section */}
      <section id="projects" className="py-30 bg-white dark:bg-gray-800 transition-colos max-w-7xl mx-auto h-fit relative px-4 xl:px-0">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-black dark:text-white sm:text-4xl">
            My Projects
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
            A showcase of my recent work and personal projects
          </p>
        </div>
        <ChromaGrid
          items={items}
          radius={300}
          damping={0.45}
          fadeOut={0.6}
          ease="power3.out"
          className="bg-white"
        />
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-30 bg-white dark:bg-gray-900 transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 xl:px-0">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black dark:text-white sm:text-4xl">
              Get In Touch
            </h2>
            <p className="mt-4 max-w-3xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
              Have a project in mind? Let&apos;s work together to bring your ideas to
              life.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  Contact Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <HiOutlineMail className="w-6 h-6 text-blue-950 dark:text-blue-800" />
                    <span className="text-gray-700 dark:text-gray-300">
                      your.email@example.com
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <HiOutlineLocationMarker className="w-6 h-6 text-blue-950 dark:text-blue-800" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Bandung, Indonesia
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  Social Media
                </h3>
                <div className="flex flex-wrap">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex-1/4"
                  >
                    <FaSquareInstagram className="w-20 h-20" />
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-600 transition-colors flex-1/4"
                  >
                    <FaGithub className="w-20 h-20" />
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-600 transition-colors flex-1/4"
                  >
                    <FaLinkedin className="w-20 h-20" />
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-600 transition-colors flex-1/4"
                  >
                    <Image
                      src="/assets/icons/dribbble.png"
                      alt="Profile Picture"
                      width={80}
                      height={80}
                      className="rounded-full"
                    />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Send a Message
              </h3>
              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-900 focus:border-blue-900 dark:focus:border-blue-500"
                    placeholder="Input name here"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-900 focus:border-blue-900 dark:focus:border-blue-500"
                    placeholder="Input email here"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-900 focus:border-blue-900 dark:focus:border-blue-500"
                    placeholder="Input message here"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-950 dark:bg-blue-900 text-white py-3 cursor-pointer px-4 rounded-xl hover:bg-blue-900 dark:hover:bg-blue-600 transition-colors font-medium"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};