"use client";
import { supabase } from "./supabase";

// ============================================================================
// DATA MODELS
// ============================================================================

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: "upcoming" | "current" | "past";
  color: "sky" | "blue" | "cyan" | "indigo" | "purple" | "orange";
  image: string;
  description: string;
  registrationUrl?: string;
}

export interface TeamMemberItem {
  id: string;
  name: string;
  position: string;
  image: string;
  bio: string;
  skills: string[];
  branch?: string;
  level?: number;
  domain?: string;
  socials: {
    linkedin?: string;
    github?: string;
    email?: string;
  };
}

export interface LegacyHeadItem {
  id: string;
  name: string;
  role: string;
  tenure: string;
  placedAt?: string;
  bio: string;
  highlight: string;
  image?: string;
}

export interface SubTeamItem {
  id: string;
  title: string;
  category: string;
  color: "sky" | "purple" | "blue" | "indigo" | "cyan";
  frontDesc: string;
  backDesc: string;
  points: string[];
}

export interface CoreValueItem {
  id: string;
  title: string;
  category: string;
  color: "sky" | "blue" | "cyan" | "indigo" | "purple";
  frontDesc: string;
  backDesc: string;
  points: string[];
}

export interface NewsIssueItem {
  id: string;
  volume: string;
  month: string;
  year: string;
  title: string;
  description: string;
  coverImage: string;
  pdfUrl: string;
  fileSize: string;
  pageCount: number;
  topics: string[];
  isCurrent?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  detail: string;
  image: string;
  size: "small" | "large" | "wide" | "tall";
}

export interface ClubStats {
  eventsHosted: string;
  activeMembers: string;
  liveProjects: string;
  placementRate: string;
}

export interface WebsiteDataBackup {
  version: string;
  exportedAt: string;
  events: EventItem[];
  team: TeamMemberItem[];
  legacyHeads: LegacyHeadItem[];
  subTeams?: SubTeamItem[];
  coreValues?: CoreValueItem[];
  newsIssues: NewsIssueItem[];
  gallery: GalleryItem[];
  stats: ClubStats;
}

// ============================================================================
// OFFICIAL DEFAULT SEEDS
// ============================================================================

export const defaultEvents: EventItem[] = [
  { 
    id: "evt-1", 
    title: "Introduction to Flutter", 
    date: "15 October 2022", 
    time: "7:00 PM",
    location: "Google Meet",
    category: "past", 
    color: "sky",
    image: "https://images.unsplash.com/photo-1617042375876-a13e36732a30?auto=format&fit=crop&q=80&w=800&h=400",
    description: "An introductory webinar covering the fundamentals of the Flutter framework for cross-platform app development. Speaker: Markandey Pathak.",
    registrationUrl: ""
  },
  { 
    id: "evt-2", 
    title: "Introduction to Python", 
    date: "04 November 2022", 
    time: "10:00 AM",
    location: "Seminar Hall, F-Block",
    category: "past", 
    color: "blue",
    image: "/events/pythonworkshop.jpg.jpeg",
    description: "A beginner-level session introducing students to Python programming fundamentals and its applications.",
    registrationUrl: ""
  },
  { 
    id: "evt-3", 
    title: "National Youth Day Celebration", 
    date: "16 January 2023", 
    time: "12:40 PM",
    location: "Seminar Hall, A-Block",
    category: "past", 
    color: "cyan",
    image: "/events/nationalyouthday.jpg.jpeg",
    description: "Tech talk featuring discussions on Smart India Hackathon, Innovation and Technology, GSoC, and insights of Hackathons.",
    registrationUrl: ""
  },
  { 
    id: "evt-4", 
    title: "IdeaFest 2024", 
    date: "29 April 2024", 
    time: "10:00 AM - 5:00 PM",
    location: "SRMCEM, Lucknow",
    category: "past", 
    color: "purple",
    image: "/events/ideafest.jpg.jpeg",
    description: "A competitive hackathon with cash prizes up to ₹8,000. Title Sponsor: Coding Blocks, Lucknow.",
    registrationUrl: ""
  },
  { 
    id: "evt-5", 
    title: "C++ Voyage: Rookie to Industry Ace", 
    date: "05 December 2024", 
    time: "1:00 PM",
    location: "SRMCEM Campus",
    category: "past", 
    color: "indigo",
    image: "/events/c++voyaoge.jpg.jpeg",
    description: "A programming workshop designed to take beginners through the fundamentals of C++ towards industry-level proficiency.",
    registrationUrl: ""
  },
  { 
    id: "evt-6", 
    title: "Cupid Coding: The Singles-Friendly DSA Contest", 
    date: "17 February 2026", 
    time: "11:00 AM",
    location: "G-607",
    category: "past", 
    color: "orange",
    image: "/events/cupidcoding.jpg.jpeg",
    description: "\"Commit to Code, NOT Chaos\" - a Valentine-themed Data Structures & Algorithms contest.",
    registrationUrl: ""
  },
  {
    id: "evt-7",
    title: "Codeshalla - 7-Day C++ Programming Bootcamp",
    date: "22 April onwards",
    time: "Flexible",
    location: "Discord Channel",
    category: "past",
    color: "sky",
    image: "/events/codeshalla.jpg.jpeg",
    description: "A 7-day online coding bootcamp covering C++ programming, conducted through interactive Discord sessions.",
    registrationUrl: ""
  },
  {
    id: "evt-8",
    title: "Web Shalla",
    date: "15 May onwards",
    time: "Flexible",
    location: "Discord Channel",
    category: "past",
    color: "indigo",
    image: "/events/webshalla.jpg.jpeg",
    description: "'Your Journey from User to Creator Starts Here' - a comprehensive web development series.",
    registrationUrl: ""
  },
  {
    id: "evt-9",
    title: "Byte Battle",
    date: "02 May 2025",
    time: "12:15 PM",
    location: "Seminar Hall, A-Block",
    category: "past",
    color: "cyan",
    image: "/events/bytebattle.jpg.jpeg",
    description: "Multi-language coding battle (C, Python, C++, Java, C#) with prizes for winners and certificates for all participants.",
    registrationUrl: ""
  },
  {
    id: "evt-10",
    title: "Explore Tech",
    date: "14 September 2025",
    time: "8:00 PM",
    location: "SRMCEM Campus",
    category: "past",
    color: "blue",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=800&h=400",
    description: "Workshop covering VS Code, GitHub, and LeetCode, mentored by 3rd-year student mentors.",
    registrationUrl: ""
  },
  {
    id: "evt-11",
    title: "Tech Talk: Dive into the World of AI",
    date: "13 November 2025",
    time: "11:00 AM",
    location: "Seminar Hall, A-Block",
    category: "past",
    color: "purple",
    image: "/events/techtalk.jpg.jpeg",
    description: "A session exploring the world of Artificial Intelligence by Arjit Verma. Certificates were provided to all attendees.",
    registrationUrl: ""
  },
  {
    id: "evt-12",
    title: "SecOps - Ethical Hacking",
    date: "TBA",
    time: "Flexible",
    location: "SRMCEM Campus",
    category: "upcoming",
    color: "orange",
    image: "/events/ethicalhacking.jpg.jpeg",
    description: "Ethical hacking contest with cash prizes for the top 3 participants.",
    registrationUrl: ""
  }
];

export const defaultTeam: TeamMemberItem[] = [
  { 
    id: "team-1", 
    name: "Abhay Shanker Tiwari", 
    position: "FOUNDER & CEO", 
    image: "/team/abhay.jpg.jpeg", 
    bio: "Visionary leader driving the club's mission to foster technological excellence and innovation.", 
    skills: ["Leadership", "Vision", "Strategy"], 
    socials: { linkedin: "https://linkedin.com", github: "https://github.com", email: "ceo@csisrmcem.org" } 
  },
  { 
    id: "team-2", 
    name: "Abhishek Soni", 
    position: "CO-FOUNDER & COO", 
    image: "/team/abhishek.jpg.jpeg", 
    bio: "Co-Founder & COO directing operations, business strategy, engineering workflows, and team execution.", 
    skills: ["Operations", "Strategy", "Execution"], 
    socials: { linkedin: "https://www.linkedin.com/in/abhishek-soni-06725326b/", github: "https://github.com/akaabhi2005", email: "abhishek@csisrmcem.org" } 
  },
  { 
    id: "team-3", 
    name: "Mugdh Mohan", 
    position: "WEB DOMAIN HEAD", 
    image: "/team/mugdh.jpg.jpeg", 
    bio: "Leading the web development domain, architecture, and frontend excellence.", 
    skills: ["React", "Next.js", "Architecture"], 
    branch: "IT",
    socials: { linkedin: "https://linkedin.com" } 
  },
  { 
    id: "team-4", 
    name: "Supriya Singh", 
    position: "WEB DOMAIN CO-HEAD", 
    image: "/team/supriya.jpg.jpeg", 
    bio: "Managing full-stack projects, mentorship, and web infrastructure.", 
    skills: ["Node.js", "Backend", "Leadership"], 
    branch: "IT",
    socials: { linkedin: "https://linkedin.com" } 
  },
  { 
    id: "team-5", 
    name: "Shriyansh Verma", 
    position: "APP DOMAIN HEAD", 
    image: "/team/shriyansh.jpg.jpeg", 
    bio: "Guiding the mobile application development team using Flutter and React Native.", 
    skills: ["Flutter", "Mobile", "UI/UX"], 
    branch: "DS",
    socials: { linkedin: "https://linkedin.com" } 
  },
  { 
    id: "team-6", 
    name: "Priyanshi Jain", 
    position: "DESIGN DOMAIN HEAD", 
    image: "/team/priyanshi.jpg.jpeg", 
    bio: "Spearheading the creative design, UI/UX, and branding initiatives of the club.", 
    skills: ["Figma", "UI/UX", "Branding"], 
    branch: "DS",
    socials: { linkedin: "https://linkedin.com" } 
  },
  { 
    id: "team-7", 
    name: "Disha Yadav", 
    position: "DESIGN DOMAIN CO-HEAD", 
    image: "/team/disha.jpg.jpeg", 
    bio: "Assisting in the club's digital aesthetics, illustrations, and event designs.", 
    skills: ["Illustrator", "Visual Design"], 
    branch: "DS",
    socials: { linkedin: "https://linkedin.com" } 
  },
  { 
    id: "team-8", 
    name: "Naman Pandey", 
    position: "DESIGN DOMAIN CO-HEAD", 
    image: "/team/naman.jpg.jpeg", 
    bio: "Co-leading graphic design operations for club events and social media presence.", 
    skills: ["Photoshop", "Graphics", "Creative"], 
    branch: "CSE",
    socials: { linkedin: "https://linkedin.com" } 
  },
  { 
    id: "team-9", 
    name: "Nainsi Verma", 
    position: "CONTENT DOMAIN HEAD", 
    image: "/team/nainsi.jpg.jpeg", 
    bio: "Leading content creation, technical writing, and communication strategies.", 
    skills: ["Content Strategy", "Writing", "SEO"], 
    branch: "DS",
    socials: { linkedin: "https://linkedin.com" } 
  },
  { 
    id: "team-10", 
    name: "Aditi Mishra", 
    position: "PR DOMAIN HEAD", 
    image: "/team/aditi.jpg.jpeg", 
    bio: "Managing public relations, outreach, and external communications.", 
    skills: ["Public Relations", "Outreach", "Communication"], 
    branch: "AL",
    socials: { linkedin: "https://linkedin.com" } 
  },
  { 
    id: "team-11", 
    name: "Akhand Pande", 
    position: "AI/ML DOMAIN HEAD", 
    image: "/team/akhand.jpg.jpeg", 
    bio: "Guiding research and development in Artificial Intelligence and Machine Learning.", 
    skills: ["Python", "Machine Learning", "Data Science"], 
    branch: "AL",
    socials: { linkedin: "https://linkedin.com" } 
  },
  { 
    id: "team-12", 
    name: "Aniket Tiwari", 
    position: "AI/ML DOMAIN CO-HEAD", 
    image: "/team/aniket.jpg.jpeg", 
    bio: "Assisting in model training, deep learning projects, and AI workshops.", 
    skills: ["Deep Learning", "TensorFlow", "Neural Nets"], 
    branch: "DS",
    socials: { linkedin: "https://linkedin.com" } 
  },
  { 
    id: "team-13", 
    name: "Ayushman Pan", 
    position: "CYBER DOMAIN HEAD", 
    image: "/team/ayushman.jpg.jpeg", 
    bio: "Leading the cybersecurity division, focusing on ethical hacking and network security.", 
    skills: ["Security", "Ethical Hacking", "Networks"], 
    branch: "DS",
    socials: { linkedin: "https://linkedin.com" } 
  },
  { 
    id: "team-14", 
    name: "Satakshi Nigan", 
    position: "CYBER DOMAIN CO-HEAD", 
    image: "/team/satakshi.jpg.jpeg", 
    bio: "Assisting in managing security infrastructure and organizing CTF events.", 
    skills: ["CTF", "Security", "Analysis"], 
    branch: "IoT",
    socials: { linkedin: "https://linkedin.com" } 
  },
  { 
    id: "team-15", 
    name: "Pratik Sing", 
    position: "DSA DOMAIN HEAD", 
    image: "/team/pratik.jpg.jpeg", 
    bio: "Leading competitive programming sessions and data structures training.", 
    skills: ["Algorithms", "C++", "Competitive Programming"], 
    branch: "DS",
    socials: { linkedin: "https://linkedin.com" } 
  },
  { 
    id: "team-16", 
    name: "Ranjeet Kumar", 
    position: "DSA DOMAIN CO-HEAD", 
    image: "/team/ranjeet.jpg.jpeg", 
    bio: "Co-leading algorithm practice, problem solving, and LeetCode workshops.", 
    skills: ["Problem Solving", "Data Structures", "Java"], 
    branch: "AL",
    socials: { linkedin: "https://linkedin.com" } 
  },
  { 
    id: "team-17", 
    name: "Mahi Shukla", 
    position: "MARKETING DOMAIN HEAD", 
    image: "/team/mahi.jpg.jpeg", 
    bio: "Overseeing digital marketing, campaigns, and audience engagement.", 
    skills: ["Marketing", "Campaigns", "Strategy"], 
    branch: "DS",
    socials: { linkedin: "https://linkedin.com" } 
  },
  { 
    id: "team-18", 
    name: "Arushi Tiwari", 
    position: "MARKETING DOMAIN CO-HEAD", 
    image: "/team/arushi.jpg.jpeg", 
    bio: "Co-leading social media promotions and event marketing strategies.", 
    skills: ["Social Media", "Promotions", "Engagement"], 
    branch: "IT",
    socials: { linkedin: "https://linkedin.com" } 
  },
  { 
    id: "team-19", 
    name: "Anjali Yadav", 
    position: "SOCIAL MEDIA HEAD", 
    image: "/team/anjali.jpg.jpeg", 
    bio: "Managing the club's online presence across all social media platforms.", 
    skills: ["Social Media", "Community", "Engagement"], 
    branch: "AL",
    socials: { linkedin: "https://linkedin.com" } 
  },
  { 
    id: "team-20", 
    name: "Aadya Srivasta", 
    position: "MANAGEMENT HEAD", 
    image: "/team/aadya.jpg.jpeg", 
    bio: "Leading event logistics, team coordination, and overall operations management.", 
    skills: ["Logistics", "Operations", "Coordination"], 
    branch: "CSE",
    socials: { linkedin: "https://linkedin.com" } 
  },
  { 
    id: "team-21", 
    name: "Naina misra", 
    position: "MANAGEMENT CO-HEAD", 
    image: "/team/naina.jpg.jpeg", 
    bio: "Assisting in managing club resources, event planning, and execution.", 
    skills: ["Event Planning", "Resource Management", "Execution"], 
    branch: "CSE",
    socials: { linkedin: "https://linkedin.com" } 
  },
  { 
    id: "team-22", 
    name: "Rajat Tripathi", 
    position: "TECHNICAL HEAD", 
    image: "/team/rajat.jpg.jpeg", 
    bio: "Overseeing technical infrastructure, server deployments, and cloud operations.", 
    skills: ["DevOps", "Cloud", "Infrastructure"], 
    branch: "AL",
    socials: { linkedin: "https://linkedin.com" } 
  },
  { 
    id: "team-23", 
    name: "Vashu Gupta", 
    position: "TECHNICAL CO-HEAD", 
    image: "/team/vashu.jpg.jpeg", 
    bio: "Assisting in technical problem solving and maintaining project repositories.", 
    skills: ["Git", "Backend", "Technical Support"], 
    branch: "CSE",
    socials: { linkedin: "https://linkedin.com" } 
  },
  { 
    id: "team-24", 
    name: "Vaishnavi Bajp", 
    position: "SPONSORSHIP HEAD", 
    image: "/team/vaishnavi.jpg.jpeg", 
    bio: "Leading outreach efforts to secure sponsorships and industry partnerships.", 
    skills: ["Sponsorship", "Negotiation", "Partnerships"], 
    branch: "DS",
    socials: { linkedin: "https://linkedin.com" } 
  },
  { 
    id: "team-25", 
    name: "Prashant Jaisw", 
    position: "SPONSORSHIP CO-HEAD", 
    image: "/team/prashant.jpg.jpeg", 
    bio: "Assisting in pitching to potential sponsors and managing financial relations.", 
    skills: ["Pitching", "Finance", "Relations"], 
    branch: "AIML",
    socials: { linkedin: "https://linkedin.com" } 
  },
  { 
    id: "team-26", 
    name: "Aditya maddesiya", 
    position: "VIDEO EDITING HEAD", 
    image: "/team/aditya.jpg.jpeg", 
    bio: "Leading video production, editing, and multimedia content creation.", 
    skills: ["Premiere Pro", "Video Editing", "Multimedia"], 
    branch: "",
    socials: { linkedin: "https://linkedin.com" } 
  }
];

export const defaultLegacyHeads: LegacyHeadItem[] = [
  {
    id: "legacy-1",
    name: "Shraddha Singhdal",
    role: "Lead (AIML)",
    tenure: "2023-Present",
    placedAt: "TBA",
    image: "/team/shraddha.jpg",
    bio: "Lead at CSI SRMCEM. Driving technical excellence in Artificial Intelligence and Machine Learning.",
    highlight: "AIML Leadership"
  },
  {
    id: "legacy-2",
    name: "Aastha Prakash",
    role: "Chapter Lead",
    tenure: "2024-2025",
    placedAt: "Josh Technology Group",
    image: "/team/aastha.jpg",
    bio: "Former Chapter Lead at CSI SRMCEM. Currently working as a Software Quality Analyst at Josh Technology Group.",
    highlight: "SQA @ Josh Technology"
  },
  {
    id: "legacy-3",
    name: "Hall of Fame 3",
    role: "President",
    tenure: "2020-2021",
    placedAt: "TBA",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400",
    bio: "Details pending...",
    highlight: "Management"
  }
];

export const defaultSubTeams: SubTeamItem[] = [
  {
    id: "subteam-1",
    title: "Technical Team",
    category: "Core Engineering",
    color: "sky",
    frontDesc: "Full-stack development, AI/ML, and open-source software.",
    backDesc: "Our core engineering wing powering club web platforms, competitive tools, AI workflows, and automated judge systems.",
    points: ["Next.js & Cloud Deployments", "AI/ML Model Pipelines", "Open Source Repositories"]
  },
  {
    id: "subteam-2",
    title: "Design & Media",
    category: "UI/UX & Branding",
    color: "purple",
    frontDesc: "Visual aesthetics, interactive design & creative direction.",
    backDesc: "From Figma wireframes to sleek 3D motion graphics and brand identity, we ensure every digital asset touches a world-class standard.",
    points: ["Figma UI/UX & Prototypes", "3D Graphics & Animations", "Visual Brand Identity"]
  },
  {
    id: "subteam-3",
    title: "Event Management",
    category: "Logistics & Hackathons",
    color: "blue",
    frontDesc: "Managing 48h hackathons, workshops & speaker logistics.",
    backDesc: "We oversee end-to-end event execution, speaker hosting, platform judging setups, and physical venue coordination for 500+ attendees.",
    points: ["48h Hackathon Operations", "Speaker Accommodations", "Live Bootcamp Coordination"]
  },
  {
    id: "subteam-4",
    title: "PR & Outreach",
    category: "Sponsorships & Connect",
    color: "indigo",
    frontDesc: "Handling sponsorships, institutional partnerships & reach.",
    backDesc: "We are the public ambassadors of the chapter. We secure corporate sponsorships, collaborate with top tech communities, and expand alumni networks.",
    points: ["Corporate Sponsorships", "Inter-College Outreach", "Alumni Career Guidance"]
  },
  {
    id: "subteam-5",
    title: "Photography & Socials",
    category: "Media & Social Channels",
    color: "cyan",
    frontDesc: "Capturing moments & managing our digital social presence.",
    backDesc: "We capture high-octane moments from our tech events, produce cinematic recaps, and manage high-engagement channels on LinkedIn, Instagram & YouTube.",
    points: ["Cinematic Event Shoots", "Social Media Campaigns", "Post-Event Video Recaps"]
  }
];

export const defaultCoreValues: CoreValueItem[] = [
  {
    id: "core-1",
    title: "Hackathons & Tech Talks",
    category: "Innovation & Build",
    color: "sky",
    frontDesc: "Workshops, Speaker Sessions & 48h Hackathons exploring cutting-edge technology.",
    backDesc: "We regularly organize 24-48 hour Hackathons and Tech Talks where students interact with experienced industry speakers, gain valuable real-world insights, and convert ambitious ideas into production-ready software.",
    points: ["24-48 Hour Code Sprints", "Industry Expert Speakers", "Hands-on Tech Workshops"]
  },
  {
    id: "core-2",
    title: "Daily DSA & Contests",
    category: "Algorithmic Excellence",
    color: "blue",
    frontDesc: "Daily Algorithm Practice & Live Coding Contests to sharpen problem solving under pressure.",
    backDesc: "Focusing heavily on coding excellence through Daily DSA sessions with guided explanations, discussions, and practice. Regular contests challenge students to improve their algorithmic reasoning in a healthy, competitive environment.",
    points: ["Daily Problem Practice", "Live Coding Contests", "Placement Interview Prep"]
  },
  {
    id: "core-3",
    title: "Real-World Projects",
    category: "Full-Stack & Systems",
    color: "cyan",
    frontDesc: "Hands-on Development & Industry Stacks across Web, AI/ML, Cloud & Cybersecurity.",
    backDesc: "Collaborative software development bridging the gap between classroom theory and production engineering. Students build scalable web platforms, machine learning models, and open-source tooling with senior mentorship.",
    points: ["Production-Grade Apps", "Open-Source Collaboration", "Mentorship from Seniors"]
  },
  {
    id: "core-4",
    title: "Leadership & Community",
    category: "Team & Growth",
    color: "indigo",
    frontDesc: "Teamwork, Content Creation & Growth cultivating the next generation of tech leaders.",
    backDesc: "Beyond technical learning, we promote teamwork, technical content creation, and community engagement, ensuring every member gets opportunities to lead initiatives, collaborate, and build enduring networks.",
    points: ["Peer Mentorship Network", "Technical Leadership Roles", "Alumni Career Guidance"]
  }
];

export const defaultNewsIssues: NewsIssueItem[] = [
  {
    id: "news-oct-2024",
    volume: "Vol. 08",
    month: "October",
    year: "2024",
    title: "CSI_SRMCEM X D'CODERS Monthly Gazette — Autumn 2024 Edition",
    description: "Featuring complete coverage of Hackathon Decoded 2024, deep dive into Agentic AI workflows, campus recruitment success stories, and our Daily DSA leaderboard champions.",
    coverImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800&h=1000",
    pdfUrl: "/documents/csi-gazette-october-2024.pdf",
    fileSize: "5.4 MB",
    pageCount: 16,
    topics: ["Hackathon Decoded 2024", "Agentic AI & LLMs", "100% Placement Record", "DSA Contest Champions"],
    isCurrent: true
  },
  {
    id: "news-sep-2024",
    volume: "Vol. 07",
    month: "September",
    year: "2024",
    title: "Web3 Protocols, Open Source Sprints & Freshers Induction",
    description: "Welcoming the incoming cohort of engineers, exploring decentralized systems, and recapping 500+ GitHub contributions.",
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600&h=800",
    pdfUrl: "/documents/csi-gazette-october-2024.pdf",
    fileSize: "4.8 MB",
    pageCount: 14,
    topics: ["Web3 Architecture", "Open Source Sprint", "Freshers Induction"],
    isCurrent: false
  },
  {
    id: "news-aug-2024",
    volume: "Vol. 06",
    month: "August",
    year: "2024",
    title: "AI & Neural Networks Bootcamp Special Gazette",
    description: "Student projects spotlight, building your first neural network from scratch, and hands-on PyTorch workshop recap.",
    coverImage: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=600&h=800",
    pdfUrl: "/documents/csi-gazette-october-2024.pdf",
    fileSize: "6.1 MB",
    pageCount: 18,
    topics: ["Neural Networks", "PyTorch Special", "Alumni Tech Talk"],
    isCurrent: false
  },
  {
    id: "news-jul-2024",
    volume: "Vol. 05",
    month: "July",
    year: "2024",
    title: "Cloud Infrastructure, DevOps & Containerization",
    description: "Deploying microservices with Docker and Kubernetes, cloud security fundamentals, and mid-year coding contest winners.",
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600&h=800",
    pdfUrl: "/documents/csi-gazette-october-2024.pdf",
    fileSize: "4.5 MB",
    pageCount: 12,
    topics: ["Docker & K8s", "DevOps Pipelines", "DSA Leaderboard"],
    isCurrent: false
  }
];

export const defaultGallery: GalleryItem[] = [
  {
    id: "gal-1",
    image: "/events/ideafest.jpg.jpeg",
    title: "IdeaFest 2024",
    detail: "A competitive hackathon with cash prizes and intense coding sessions.",
    size: "large"
  },
  {
    id: "gal-2",
    image: "/events/bytebattle.jpg.jpeg",
    title: "Byte Battle",
    detail: "Multi-language coding battle featuring top programmers.",
    size: "small"
  },
  {
    id: "gal-3",
    image: "/events/nationalyouthday.jpg.jpeg",
    title: "National Youth Day",
    detail: "Tech talk on Smart India Hackathon and Innovation.",
    size: "small"
  },
  {
    id: "gal-4",
    image: "/events/cupidcoding.jpg.jpeg",
    title: "Cupid Coding Contest",
    detail: "\"Commit to Code, NOT Chaos\" - Our signature Valentine-themed DSA contest.",
    size: "wide"
  },
  {
    id: "gal-5",
    image: "/events/techtalk.jpg.jpeg",
    title: "AI Tech Talk",
    detail: "Deep dive into the world of Artificial Intelligence by Arjit Verma.",
    size: "small"
  },
  {
    id: "gal-6",
    image: "/events/codeshalla.jpg.jpeg",
    title: "Codeshalla Bootcamp",
    detail: "Interactive 7-day C++ programming bootcamp over Discord.",
    size: "tall"
  }
];

export const defaultStats: ClubStats = {
  eventsHosted: "50+",
  activeMembers: "1000+",
  liveProjects: "50+",
  placementRate: "100%"
};

// ============================================================================
// STORAGE HELPERS (SUPABASE)
// ============================================================================

// Helper: Fetch from Supabase with fallback
async function fetchFromSupabase<T>(table: string, fallback: T[]): Promise<T[]> {
  try {
    const { data, error } = await supabase.from(table).select('*');
    if (error) throw error;
    if (!data || data.length === 0) return fallback;
    return data as T[];
  } catch (error) {
    console.error(`Error fetching from ${table}:`, error);
    return fallback;
  }
}

// Helper: Save to Supabase
async function saveToSupabase<T extends { id: string }>(table: string, items: T[]): Promise<void> {
  try {
    // Delete existing rows to ensure clean upsert (if deleting is needed), 
    // but upsert should overwrite by ID. We use upsert.
    const { error } = await supabase.from(table).upsert(items);
    if (error) throw error;
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("csi_data_updated"));
    }
  } catch (error) {
    console.error(`Error saving to ${table}:`, error);
  }
}

// Public CMS Getters & Setters
export const DataStore = {
  // Events
  getEvents: async (): Promise<EventItem[]> => await fetchFromSupabase('events', defaultEvents),
  saveEvents: async (data: EventItem[]) => await saveToSupabase('events', data),

  // Team
  getTeam: async (): Promise<TeamMemberItem[]> => await fetchFromSupabase('team', defaultTeam),
  saveTeam: async (data: TeamMemberItem[]) => await saveToSupabase('team', data),

  // Legacy Heads
  getLegacyHeads: async (): Promise<LegacyHeadItem[]> => await fetchFromSupabase('legacy_heads', defaultLegacyHeads),
  saveLegacyHeads: async (data: LegacyHeadItem[]) => await saveToSupabase('legacy_heads', data),

  // Sub-Teams
  getSubTeams: async (): Promise<SubTeamItem[]> => await fetchFromSupabase('sub_teams', defaultSubTeams),
  saveSubTeams: async (data: SubTeamItem[]) => await saveToSupabase('sub_teams', data),

  // Core Values
  getCoreValues: async (): Promise<CoreValueItem[]> => await fetchFromSupabase('core_values', defaultCoreValues),
  saveCoreValues: async (data: CoreValueItem[]) => await saveToSupabase('core_values', data),

  // News Issues
  getNewsIssues: async (): Promise<NewsIssueItem[]> => {
    const issues = await fetchFromSupabase<NewsIssueItem>('news_issues', defaultNewsIssues);
    return issues.map(item => ({
      ...item,
      pdfUrl: item.pdfUrl && item.pdfUrl.includes("w3.org") ? "/documents/csi-gazette-october-2024.pdf" : item.pdfUrl
    }));
  },
  saveNewsIssues: async (data: NewsIssueItem[]) => await saveToSupabase('news_issues', data),

  // Gallery
  getGallery: async (): Promise<GalleryItem[]> => await fetchFromSupabase('gallery', defaultGallery),
  saveGallery: async (data: GalleryItem[]) => await saveToSupabase('gallery', data),

  // Stats
  getStats: async (): Promise<ClubStats> => {
    try {
      const { data, error } = await supabase.from('stats').select('*').eq('id', 'main').single();
      if (error) {
        if (error.code === 'PGRST116') return defaultStats; // Not found
        throw error;
      }
      return data as ClubStats;
    } catch (error) {
      console.error(`Error fetching stats:`, error);
      return defaultStats;
    }
  },
  saveStats: async (data: ClubStats) => {
    try {
      const { error } = await supabase.from('stats').upsert({ id: 'main', ...data });
      if (error) throw error;
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("csi_data_updated"));
      }
    } catch (error) {
      console.error(`Error saving stats:`, error);
    }
  },

  // Admin Password
  getAdminPassword: (): string => {
    if (typeof window === "undefined") return "admin123";
    return localStorage.getItem("csi_cms_admin_pwd") || "admin123";
  },
  saveAdminPassword: (pwd: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("csi_cms_admin_pwd", pwd);
  },

  // Export Complete Backup JSON
  exportBackup: async (): Promise<WebsiteDataBackup> => ({
    version: "3.0 (Supabase)",
    exportedAt: new Date().toISOString(),
    events: await DataStore.getEvents(),
    team: await DataStore.getTeam(),
    legacyHeads: await DataStore.getLegacyHeads(),
    subTeams: await DataStore.getSubTeams(),
    coreValues: await DataStore.getCoreValues(),
    newsIssues: await DataStore.getNewsIssues(),
    gallery: await DataStore.getGallery(),
    stats: await DataStore.getStats(),
  }),

  // Import Complete Backup JSON
  importBackup: async (backup: Partial<WebsiteDataBackup>): Promise<boolean> => {
    try {
      if (backup.events) await DataStore.saveEvents(backup.events);
      if (backup.team) await DataStore.saveTeam(backup.team);
      if (backup.legacyHeads) await DataStore.saveLegacyHeads(backup.legacyHeads);
      if (backup.subTeams) await DataStore.saveSubTeams(backup.subTeams);
      if (backup.coreValues) await DataStore.saveCoreValues(backup.coreValues);
      if (backup.newsIssues) await DataStore.saveNewsIssues(backup.newsIssues);
      if (backup.gallery) await DataStore.saveGallery(backup.gallery);
      if (backup.stats) await DataStore.saveStats(backup.stats);
      return true;
    } catch (e) {
      console.error("Failed to import backup", e);
      return false;
    }
  },

  // Reset Everything to Official Defaults
  resetToDefaults: async () => {
    await DataStore.saveEvents(defaultEvents);
    await DataStore.saveTeam(defaultTeam);
    await DataStore.saveLegacyHeads(defaultLegacyHeads);
    await DataStore.saveSubTeams(defaultSubTeams);
    await DataStore.saveCoreValues(defaultCoreValues);
    await DataStore.saveNewsIssues(defaultNewsIssues);
    await DataStore.saveGallery(defaultGallery);
    await DataStore.saveStats(defaultStats);
  }
};
