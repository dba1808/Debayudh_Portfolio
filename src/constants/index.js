import { techIcons } from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Experience",
  },
  {
    id: "projects",
    title: "Projects",
  },
  {
    id: "resume",
    title: "Resume",
  },
  {
    id: "certifications",
    title: "Certifications",
  },
  {
    id: "playground",
    title: "Journey",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "AI/ML Engineer",
    icon: "🧠",
  },
  {
    title: "Deep Learning Specialist",
    icon: "🔬",
  },
  {
    title: "Full Stack Developer",
    icon: "⚡",
  },
  {
    title: "Data Scientist",
    icon: "📊",
  },
];

const technologies = [
  {
    name: "HTML 5",
    icon: techIcons.html,
  },
  {
    name: "CSS 3",
    icon: techIcons.css,
  },
  {
    name: "JavaScript",
    icon: techIcons.javascript,
  },
  {
    name: "TypeScript",
    icon: techIcons.typescript,
  },
  {
    name: "React JS",
    icon: techIcons.react,
  },
  {
    name: "Redux Toolkit",
    icon: techIcons.redux,
  },
  {
    name: "Tailwind CSS",
    icon: techIcons.tailwind,
  },
  {
    name: "Node JS",
    icon: techIcons.nodejs,
  },
  {
    name: "MongoDB",
    icon: techIcons.mongodb,
  },
  {
    name: "Three JS",
    icon: techIcons.threejs,
  },
  {
    name: "Git",
    icon: techIcons.git,
  },
  {
    name: "Figma",
    icon: techIcons.figma,
  },
  {
    name: "Docker",
    icon: techIcons.docker,
  },
];

// Work experience — currently empty; DeveloperHoldCard renders the hold state
const experiences = [];

const practicalExperiences = [
  {
    icon: "🤖",
    title: "Agentic AI & Generative AI Exploration",
    description:
      "Actively building and experimenting with AI-powered applications focused on Large Language Models, Agentic AI systems, workflow automation, and intelligent assistants. Working with modern AI frameworks, APIs, and orchestration tools to create autonomous and task-driven solutions.",
  },
  {
    icon: "🧠",
    title: "Machine Learning Development",
    description:
      "Developing machine learning projects involving data preprocessing, model training, evaluation, and deployment. Exploring real-world applications of predictive analytics, recommendation systems, and AI-driven decision making.",
  },
  {
    icon: "💡",
    title: "Problem Solving & Data Structures",
    description:
      "Continuously strengthening problem-solving abilities through Data Structures and Algorithms. Practicing coding challenges and optimization techniques to improve software engineering fundamentals and analytical thinking.",
  },
];

const education = [
  {
    title: "B.Tech in Computer Science and Technology (CST)",
    institution: "JIS College of Engineering",
    icon: "🎓",
    iconBg: "#915eff",
    date: "2023 - 2027",
    points: [
      "Pursuing a Bachelor of Technology in Computer Science and Technology.",
      "Focused on Artificial Intelligence, Machine Learning, and Data Structures & Algorithms.",
      "Building projects in Generative AI, LLMs, and autonomous agent systems.",
      "Active participation in coding competitions and AI/ML research initiatives.",
    ],
    glow: true,
  },
  {
    title: "High School / Schooling",
    institution: "Sri Aurobindo Institute of Education, Kolkata",
    icon: "📚",
    iconBg: "#383E56",
    date: "Completed",
    points: [
      "Built a strong academic foundation in Mathematics, Science, and Computer Science.",
      "Developed core problem-solving skills and analytical thinking capabilities.",
    ],
    glow: false,
  },
];

const testimonials = [
  {
    testimonial:
      "I thought it was impossible to make a website as beautiful as our product, but they proved me wrong.",
    name: "Sara Lee",
    designation: "CFO",
    company: "Acme Co",
  },
  {
    testimonial:
      "I've never met a web developer who truly cares about their clients' success like this person does.",
    name: "Chris Brown",
    designation: "COO",
    company: "DEF Corp",
  },
  {
    testimonial:
      "After they optimized our website, our traffic increased by 50%. We can't thank them enough!",
    name: "Lisa Wang",
    designation: "CTO",
    company: "456 Enterprises",
  },
];

const projects = [
  {
    name: "News Generation Platform using RAG and Generative AI",
    description:
      "An advanced semantic extraction platform leveraging Retrieval-Augmented Generation workflows to synthesize, contextualize, and generate high-fidelity news reporting models based on dynamic real-world source vectors.",
    detailed_description:
      "This platform combines state-of-the-art Retrieval-Augmented Generation (RAG) pipelines with large language models to dynamically pull, verify, and synthesize news content from heterogeneous real-world data sources. The system performs semantic chunking, vector-based similarity retrieval, and context-aware generation to produce accurate, well-structured news articles with source attribution and confidence scoring.",
    features: [
      "RAG pipeline with vector database integration for semantic document retrieval.",
      "Real-time source ingestion and dynamic context window management.",
      "Confidence scoring and source attribution for generated content.",
      "Modular architecture supporting multiple LLM backends and embedding models.",
    ],
    tags: [
      {
        name: "rag",
        color: "blue-text-gradient",
      },
      {
        name: "generative-ai",
        color: "green-text-gradient",
      },
      {
        name: "python",
        color: "pink-text-gradient",
      },
    ],
    image: "🧬",
    source_code_link: null,
    live_demo_link: null,
  },
];

const certifications = [
  {
    title: "Data Analytics using Python",
    organization: "Euphoria GenX",
    duration: "30 Hours Training Programme",
    date: "5 August 2025",
    file: "/certificates/cert_data_analytics.jpg",
    icon: "📊",
    category: "Data Science & Analytics",
    type: "image",
  },
  {
    title: "Python with Django",
    organization: "Euphoria GenX",
    duration: "30 Hours Training Programme",
    date: "27 February 2025",
    file: "/certificates/cert_python_django.pdf",
    icon: "⚡",
    category: "Web Development",
    type: "pdf",
  },
  {
    title: "SAP S/4HANA Development",
    organization: "SAP University Alliances",
    subtitle: "Conducted by Narula Institute of Technology",
    duration: "Aug 2025 – Dec 2025",
    date: "2025",
    file: "/certificates/cert_sap.pdf",
    icon: "🏢",
    category: "Enterprise Systems",
    type: "pdf",
  },
  {
    title: "Lexicognition AI Participation",
    organization: "Kshitij IIT Kharagpur",
    duration: "Artificial Intelligence Event",
    date: "2025",
    file: "/certificates/cert_lexicognition.pdf",
    icon: "🧠",
    category: "Artificial Intelligence",
    type: "pdf",
  },
];

export {
  services,
  technologies,
  experiences,
  practicalExperiences,
  education,
  testimonials,
  projects,
  certifications,
};
