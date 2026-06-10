import { memo } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import FocusAreas from "./FocusAreas";

const About = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.sectionHeadText}>Overview.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
      >
        I'm a passionate developer focused on Machine Learning, Generative AI,
        and Agentic AI systems. I enjoy building intelligent applications,
        experimenting with AI agents, and exploring the latest advancements in
        artificial intelligence.
      </motion.p>

      <motion.p
        variants={fadeIn("", "", 0.2, 1)}
        className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
      >
        With experience in Python, Java, AI frameworks, and modern development
        tools, I combine strong problem-solving skills with a solid foundation
        in Data Structures and Algorithms. I'm constantly learning, building,
        and pushing my limits to create innovative AI-driven solutions.
      </motion.p>

      <motion.p
        variants={fadeIn("", "", 0.3, 1)}
        className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
      >
        My goal is to become an Agentic AI Engineer and contribute to the
        development of autonomous, intelligent systems that solve meaningful
        real-world problems.
      </motion.p>

      {/* Focus Areas Section */}
      <div className='mt-12 sm:mt-20'>
        <FocusAreas />
      </div>
    </>
  );
};

export default SectionWrapper(memo(About), "about");
