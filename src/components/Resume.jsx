import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { certifications } from "../constants";

/* ─────────── Proficiency Indicator ─────────── */
const ProficiencyDots = ({ level }) => {
  // level: 1 = Learning, 2 = Intermediate, 3 = Advanced
  return (
    <div className="flex gap-1" aria-label={`Proficiency: ${level} of 3`}>
      {[1, 2, 3].map((dot) => (
        <div
          key={dot}
          className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${dot <= level
            ? "bg-violet-accent"
            : "bg-white/10"
            }`}
        />
      ))}
    </div>
  );
};

/* ─────────── Skill Chip ─────────── */
const SkillChip = ({ name, level }) => (
  <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-xl px-3.5 py-2 hover:bg-violet-accent/[0.06] hover:border-violet-accent/15 transition-all duration-300 group hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(145,94,255,0.15)]">
    <span className="text-secondary text-[13px] font-medium group-hover:text-white/80 transition-colors duration-300">
      {name}
    </span>
    <ProficiencyDots level={level} />
  </div>
);

/* ─────────── Certificate Mini Card ─────────── */
const CertMiniCard = ({ cert }) => (
  <div className="bg-black-100 p-5 rounded-2xl border border-white/5 flex flex-col justify-between group hover:border-violet-accent/30 transition-all duration-300">
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="bg-violet-accent/10 text-violet-accent border border-violet-accent/20 text-[11px] font-bold px-2.5 py-1 rounded-full">
          {cert.date}
        </span>
        <span className="text-secondary/50 text-[11px] font-medium uppercase tracking-wider">
          {cert.category}
        </span>
      </div>
      <h4 className="text-white font-bold text-[15px] leading-snug group-hover:text-violet-accent transition-colors duration-300">
        {cert.title}
      </h4>
      <p className="text-secondary text-[13px] font-medium mt-1">
        {cert.organization}
      </p>
      {cert.subtitle && (
        <p className="text-secondary/70 text-[12px] mt-0.5">
          {cert.subtitle}
        </p>
      )}
    </div>
    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
      <span className="text-secondary/60 text-[12px]">{cert.duration}</span>
      <a
        href={cert.file}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[12px] text-violet-accent hover:text-white font-bold flex items-center gap-1 transition-colors duration-200"
      >
        View File
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
      </a>
    </div>
  </div>
);

/* ─────────── Journey Timeline ─────────── */
const JourneyTimeline = () => {
  const realms = [
    {
      number: 1,
      title: "The Beginning",
      subtitle: "CS Foundations",
      status: "completed",
      description: "Education, Java & Python foundations, starting the coding journey.",
      icon: "🎓",
    },
    {
      number: 2,
      title: "Algorithm Forest",
      subtitle: "DSA & Problem Solving",
      status: "completed",
      description: "Data Structures, algorithms, sorting visualization, core logic.",
      icon: "🌳",
    },
    {
      number: 3,
      title: "Builder City",
      subtitle: "Full Stack Projects",
      status: "completed",
      description: "Building software, web apps, and databases, mapping ideas to code.",
      icon: "🏢",
    },
    {
      number: 4,
      title: "Knowledge Nexus",
      subtitle: "Credentials & Learning",
      status: "completed",
      description: "Pursuing certifications in Python, Django, SAP, and AI events.",
      icon: "✨",
    },
    {
      number: 5,
      title: "AI Command Center",
      subtitle: "Agentic AI Engineering",
      status: "active",
      description: "Building systems with LLMs, autonomous workflows, and tool calling.",
      icon: "🧠",
    },
    {
      number: 6,
      title: "Future Vision",
      subtitle: "Next-Gen AI Systems",
      status: "upcoming",
      description: "Researching advanced reasoning, memory architectures, and safety.",
      icon: "🚀",
    },
  ];

  const [hoveredRealm, setHoveredRealm] = useState(null);

  return (
    <div className="w-full flex flex-col gap-8 py-4">
      {/* Horizontal timeline line and dots */}
      <div className="relative w-full flex items-center justify-between px-4 md:px-8 mt-6 overflow-x-auto pb-4 md:pb-0 scrollbar-thin">
        {/* Connection Line */}
        <div className="absolute left-10 right-10 h-0.5 bg-white/10 top-5 -z-10" />
        <div 
          className="absolute left-10 h-0.5 top-5 -z-10 transition-all duration-1000 timeline-pulse-gradient" 
          style={{ width: '75%' }}
        />

        {realms.map((realm, index) => (
          <div 
            key={realm.number} 
            className="flex flex-col items-center relative cursor-pointer group px-4 min-w-[100px]"
            onMouseEnter={() => setHoveredRealm(index)}
            onMouseLeave={() => setHoveredRealm(null)}
          >
            {/* Dot/Node */}
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold text-[14px] transition-all duration-300 ${
                realm.status === "completed"
                  ? "bg-[#050816] border-violet-accent text-violet-accent shadow-lg shadow-violet-accent/25 scale-105"
                  : realm.status === "active"
                  ? "bg-violet-accent border-violet-accent text-white shadow-lg shadow-violet-accent/40 scale-110"
                  : "bg-[#050816] border-white/20 text-secondary"
              } group-hover:scale-110 group-hover:border-violet-accent`}
            >
              {realm.status === "completed" ? "✓" : realm.number}
            </div>

            {/* Title / Info underneath node */}
            <span className="text-[12px] font-bold text-white mt-3 text-center whitespace-nowrap">
              {realm.title}
            </span>
            <span className={`text-[10px] font-semibold mt-1 ${
              realm.status === "completed" ? "text-violet-accent" : realm.status === "active" ? "text-[#00cea8]" : "text-secondary/50"
            }`}>
              {realm.status === "completed" ? "Completed" : realm.status === "active" ? "Active" : "Upcoming"}
            </span>
          </div>
        ))}
      </div>

      {/* Detail panel for active/hovered realm */}
      <div className="bg-black-100 p-6 rounded-2xl border border-white/5 mt-4 min-h-[140px] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden transition-all duration-300">
        <div className="absolute -right-10 -bottom-10 text-[100px] opacity-[0.03] select-none pointer-events-none">
          {realms[hoveredRealm !== null ? hoveredRealm : 4].icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="bg-violet-accent/10 text-violet-accent border border-violet-accent/20 text-[12px] font-extrabold px-3 py-1 rounded-full">
              Realm {realms[hoveredRealm !== null ? hoveredRealm : 4].number}
            </span>
            <span className="text-secondary text-[12px] font-bold uppercase tracking-widest">
              {realms[hoveredRealm !== null ? hoveredRealm : 4].subtitle}
            </span>
          </div>
          <h3 className="text-white font-extrabold text-[22px] mt-2">
            {realms[hoveredRealm !== null ? hoveredRealm : 4].title}
          </h3>
          <p className="text-secondary text-[14px] leading-relaxed mt-2 max-w-2xl">
            {realms[hoveredRealm !== null ? hoveredRealm : 4].description}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className={`px-4 py-2 rounded-xl text-[12px] font-bold border ${
            realms[hoveredRealm !== null ? hoveredRealm : 4].status === "completed"
              ? "bg-violet-accent/10 text-violet-accent border-violet-accent/20"
              : realms[hoveredRealm !== null ? hoveredRealm : 4].status === "active"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-white/5 text-secondary border-white/10"
          }`}>
            Status: {realms[hoveredRealm !== null ? hoveredRealm : 4].status.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};

const IS_RESUME_UPLOADED = false; // Set to true when the resume PDF is ready

const Resume = () => {
  const [activeTab, setActiveTab] = useState("skills");
  const [showToast, setShowToast] = useState(false);

  React.useEffect(() => {
    const handleTabEvent = (e) => {
      if (e.detail && ["skills", "certifications", "journey"].includes(e.detail)) {
        setActiveTab(e.detail);
      }
    };
    window.addEventListener("set-resume-tab", handleTabEvent);
    return () => window.removeEventListener("set-resume-tab", handleTabEvent);
  }, []);

  const handleDownloadClick = (e) => {
    if (!IS_RESUME_UPLOADED) {
      e.preventDefault();
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
  };

  const tabs = [
    { id: "skills", label: "Core Skills" },
    { id: "certifications", label: "Certifications" },
    { id: "journey", label: "Journey Progress" },
  ];

  const skillsData = {
    aiml: {
      title: "AI & Machine Learning",
      icon: "🧠",
      gradient: "from-violet-accent to-indigo-500",
      skills: [
        { name: "Machine Learning", level: 3 },
        { name: "Generative AI", level: 3 },
        { name: "Agentic AI", level: 2 },
        { name: "Prompt Engineering", level: 3 },
        { name: "LLM Applications", level: 2 },
        { name: "AI Workflow Automation", level: 2 },
        { name: "NLP Fundamentals", level: 2 },
        { name: "Data Analytics", level: 3 },
        { name: "Pandas", level: 3 },
        { name: "NumPy", level: 3 },
        { name: "Scikit-Learn", level: 2 },
      ],
    },
    programming: {
      title: "Programming & Problem Solving",
      icon: "💻",
      gradient: "from-violet-accent to-pink-500",
      skills: [
        { name: "Python", level: 3 },
        { name: "Java", level: 3 },
        { name: "Data Structures", level: 3 },
        { name: "Algorithms", level: 3 },
        { name: "OOP", level: 3 },
        { name: "Problem Solving", level: 3 },
        { name: "Competitive Programming", level: 3 },
        { name: "SQL", level: 2 },
      ],
    },
    tools: {
      title: "Tools & Technologies",
      icon: "🔧",
      gradient: "from-violet-accent to-emerald-500",
      skills: [
        { name: "Git & GitHub", level: 3 },
        { name: "VS Code", level: 3 },
        { name: "FastAPI", level: 2 },
        { name: "Streamlit", level: 2 },
        { name: "n8n", level: 2 },
        { name: "REST APIs", level: 2 },
        { name: "Docker", level: 1 },
        { name: "Linux Fundamentals", level: 1 },
      ],
    },
  };



  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>My Credentials</p>
        <h2 className={styles.sectionHeadText}>Resume.</h2>
      </motion.div>

      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 mt-4 mb-10 text-center md:text-left">
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className="text-secondary text-[17px] max-w-3xl leading-[30px]"
        >
          Explore my technical capabilities and academic qualifications below.
          You can also download a comprehensive, print-ready PDF copy of my
          resume.
        </motion.p>

        <motion.a
          variants={fadeIn("left", "spring", 0.2, 0.75)}
          href={IS_RESUME_UPLOADED ? "/debayudh_resume.pdf" : "#"}
          download={IS_RESUME_UPLOADED ? "Debayudh_Bhattacharya_Resume.pdf" : undefined}
          onClick={handleDownloadClick}
          className="bg-gradient-to-r from-violet-accent to-indigo-600 hover:from-violet-accent hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-violet-accent/30 transition-all flex items-center gap-2 max-w-fit cursor-pointer border border-white/10 hover:scale-[1.02] animate-shimmer"
        >
          <svg
            className="w-5 h-5 text-white animate-bounce"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download PDF Resume
        </motion.a>
      </div>

      <div className="mt-8 bg-tertiary rounded-2xl p-6 sm:p-8 border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-[100px] -right-[100px] w-[250px] h-[250px] bg-violet-accent/5 rounded-full blur-[80px]" />

        {/* Tab Selection */}
        <div className="flex border-b border-white/10 gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-6 font-semibold text-[16px] rounded-t-xl transition-all relative whitespace-nowrap cursor-pointer ${activeTab === tab.id
                ? "text-white bg-white/5"
                : "text-secondary hover:text-white"
                }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-violet-accent"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content Panels */}
        <div className="mt-8 min-h-[350px]">
          <AnimatePresence mode="wait">
            {activeTab === "skills" && (
              <motion.div
                key="skills"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {Object.entries(skillsData).map(([key, category]) => (
                  <div
                    key={key}
                    className="bg-black-100 p-5 rounded-2xl border border-white/5"
                  >
                    <h3 className="text-white font-bold text-[18px] mb-2 flex items-center gap-2">
                      <span>{category.icon}</span> {category.title}
                    </h3>

                    {/* Proficiency legend */}
                    <div className="flex items-center gap-4 mb-5 pb-3 border-b border-white/5">
                      <div className="flex items-center gap-1.5">
                        <ProficiencyDots level={1} />
                        <span className="text-secondary/50 text-[10px]">
                          Learning
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ProficiencyDots level={2} />
                        <span className="text-secondary/50 text-[10px]">
                          Intermediate
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ProficiencyDots level={3} />
                        <span className="text-secondary/50 text-[10px]">
                          Proficient
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill) => (
                        <SkillChip
                          key={skill.name}
                          name={skill.name}
                          level={skill.level}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "certifications" && (
              <motion.div
                key="certifications"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {certifications.map((cert, index) => (
                  <CertMiniCard key={`cert-mini-${index}`} cert={cert} />
                ))}
              </motion.div>
            )}

            {activeTab === "journey" && (
              <motion.div
                key="journey"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <JourneyTimeline />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Premium Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="fixed bottom-5 right-5 z-[9999] flex items-center gap-3 bg-tertiary/90 backdrop-blur-md border border-violet-accent/30 text-white px-5 py-3.5 rounded-xl shadow-[0_0_30px_rgba(145,94,255,0.25)] min-w-[280px]"
          >
            <div className="w-8 h-8 rounded-full bg-violet-accent/20 flex items-center justify-center text-violet-accent flex-shrink-0">
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-[14px] leading-tight">Resume will be available soon</p>
              <p className="text-secondary text-[11px] mt-0.5">The document has not been uploaded yet.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SectionWrapper(Resume, "resume");
