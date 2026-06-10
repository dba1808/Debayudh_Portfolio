import { memo, useCallback } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { motion } from "framer-motion";
import "react-vertical-timeline-component/style.min.css";
import { styles } from "../styles";
import { practicalExperiences, education } from "../constants";
import { SectionWrapper } from "../hoc";
import { textVariant, fadeIn, staggerFadeIn } from "../utils/motion";
import NeuralNetworkCanvas from "./canvas/NeuralNetworkCanvas";

/* ===== Practical Experience Card ===== */
const PracticalExperienceCard = memo(({ experience, index }) => {
  return (
    <motion.div
      variants={staggerFadeIn}
      custom={index}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="glass-card rounded-2xl p-6 sm:p-8 flex-1 min-w-[280px] max-w-[400px] relative overflow-hidden group"
    >
      {/* Ambient glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-violet-accent/8 rounded-full blur-[50px] pointer-events-none group-hover:bg-violet-accent/15 transition-all duration-700" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[#00cea8]/6 rounded-full blur-[40px] pointer-events-none group-hover:bg-[#00cea8]/12 transition-all duration-700" />

      {/* Icon */}
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-accent/20 to-[#00cea8]/15 flex items-center justify-center mb-5 border border-white/10 shadow-lg shadow-violet-accent/5">
        <span className="text-2xl">{experience.icon}</span>
      </div>

      {/* Title */}
      <h3 className="text-white font-bold text-[20px] leading-tight mb-3">
        {experience.title}
      </h3>

      {/* Description */}
      <p className="text-secondary text-[14px] leading-[24px]">
        {experience.description}
      </p>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-violet-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
});

const EducationCard = memo(({ entry, index }) => {
  const isGlowing = entry.glow;

  const handleMouseEnter = useCallback(() => {
    const cluster = entry.title.includes("CST") ? "cst" : "cs";
    window.dispatchEvent(new CustomEvent("neuron-hover", { detail: { cluster } }));
  }, [entry.title]);

  const handleMouseLeave = useCallback(() => {
    window.dispatchEvent(new CustomEvent("neuron-hover", { detail: { cluster: null } }));
  }, []);

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="w-full">
      <VerticalTimelineElement
        contentStyle={{
          background: isGlowing ? "#1a1245" : "#1d1836",
          color: "#fff",
          boxShadow: isGlowing
            ? "0 3px 0 #915eff, 0 0 30px rgba(145, 94, 255, 0.15)"
            : "0 3px 0 rgba(145, 94, 255, 0.3)",
          borderRadius: "16px",
          border: isGlowing ? "1px solid rgba(145, 94, 255, 0.2)" : "1px solid rgba(255, 255, 255, 0.05)",
          // Prevent overlap/bleed on small screens
          padding: "18px 16px",
        }}
        contentArrowStyle={{
          borderRight: isGlowing
            ? "7px solid #1a1245"
            : "7px solid #1d1836",
        }}
        date={entry.date}
        dateClassName="education-date"
        iconStyle={{
          background: entry.iconBg,
          boxShadow: isGlowing
            ? "0 0 0 4px #050816, 0 0 20px rgba(145, 94, 255, 0.6), 0 0 40px rgba(145, 94, 255, 0.3)"
            : "0 0 0 4px #050816",
        }}
        icon={
          <div className='flex justify-center items-center w-full h-full'>
            <span className={`text-xl ${isGlowing ? "drop-shadow-lg" : ""}`}>
              {entry.icon}
            </span>
          </div>
        }
        position={index % 2 === 0 ? "left" : "right"}
      >
        <div className="education-card-body">
          <h3 className={`text-white text-[22px] font-bold ${isGlowing ? "glow-text" : ""}`}>
            {entry.title}
          </h3>
          <p
            className='text-secondary text-[15px] font-semibold'
            style={{ margin: 0 }}
          >
            {entry.institution}
          </p>
        </div>

        <ul className='mt-5 list-disc ml-5 space-y-2 education-card-points'>
          {entry.points.map((point, idx) => (
            <li
              key={`education-point-${idx}`}
              className='text-white-100 text-[14px] pl-1 tracking-wider'
            >
              {point}
            </li>
          ))}
        </ul>

        {isGlowing && (
          <div className="mt-4 h-[2px] w-full bg-gradient-to-r from-violet-accent via-[#00cea8] to-transparent rounded-full opacity-60" />
        )}
      </VerticalTimelineElement>
    </div>
  );
});


const Experience = () => {
  return (
    <>
      {/* ===== PRACTICAL EXPERIENCE SECTION ===== */}
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>
          My journey so far
        </p>
        <h2 className={`${styles.sectionHeadText} text-center`}>
          Experience.
        </h2>
      </motion.div>

      {/* Practical Experience subtitle */}
      <motion.p
        variants={fadeIn("", "", 0.15, 1)}
        className="text-center text-secondary text-[16px] mt-4 mb-2"
      >
        Practical Experience
      </motion.p>

      <div className="mt-12 flex flex-wrap justify-center gap-6">
        {practicalExperiences.map((exp, index) => (
          <PracticalExperienceCard
            key={`practical-${index}`}
            experience={exp}
            index={index}
          />
        ))}
      </div>

      {/* ===== EDUCATION SECTION ===== */}
      <div className="relative mt-12 sm:mt-24 w-full rounded-3xl overflow-hidden py-8 sm:py-12 px-4 md:px-10 border border-white/5" style={{ background: "rgba(3, 0, 30, 0.15)" }}>
        {/* Background dark gradient overlay and 3D Canvas */}
        <div className="absolute inset-0 pointer-events-none z-0" style={{ background: "linear-gradient(180deg, #020015 0%, #050816 50%, #020015 100%)" }} />
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <NeuralNetworkCanvas />
        </div>

        <div className="relative z-10 pointer-events-auto">
          <motion.div variants={textVariant()}>
            <p className={`${styles.sectionSubText} text-center`}>
              My academic journey
            </p>
            <h2 className={`${styles.sectionHeadText} text-center`}>
              Education.
            </h2>
          </motion.div>

          <div className='mt-10 sm:mt-20 flex flex-col'>
            <VerticalTimeline layout="2-columns" lineColor="rgba(145, 94, 255, 0.3)">
              {education.map((entry, index) => (
                <EducationCard
                  key={`education-${index}`}
                  entry={entry}
                  index={index}
                />
              ))}
            </VerticalTimeline>
          </div>
        </div>
      </div>
    </>
  );
};

export default SectionWrapper(memo(Experience), "work");
