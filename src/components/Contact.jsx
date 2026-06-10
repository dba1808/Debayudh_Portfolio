import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { styles } from "../styles";
import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";
import { ToastContainer } from "./Toast";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

// ─── Sanitization helper ───
const sanitize = (str) =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");

// ─── Validation schemas ───
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const validate = (form) => {
  const errors = {};
  if (!form.name || form.name.trim().length <= 2) {
    errors.name = "Name must be longer than 2 characters.";
  }
  if (!form.email || !EMAIL_REGEX.test(form.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  if (!form.message || form.message.trim().length === 0) {
    errors.message = "Message cannot be empty.";
  }
  return errors;
};

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const field = name === "from_name" ? "name" : name === "from_email" ? "email" : name;
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error on edit
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const dismissToast = useCallback(() => setToast(null), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Live Firestore Cloud Database Write (100% Free Core Logging)
    try {
      await addDoc(collection(db, "mail"), {
        name: form.name,
        email: form.email,
        message: form.message,
        timestamp: new Date()
      });
      console.log("Firestore cloud database updated successfully.");
    } catch (dbError) {
      console.error("Firestore database write exception caught: ", dbError);
    }

    // 2. Direct Explicit EmailJS Transmission (100% Free Inbox Delivery)
    try {
      const routingPayload = {
        from_name: form.name,
        to_name: "Debayudh",
        from_email: form.email,
        to_email: "bhattacharyadebayudh13@gmail.com",
        message: form.message,
      };

      await emailjs.send(
        "service_yvx1vht",     // Fixed Service ID
        "template_pfde6nn",    // Fixed Custom Template ID
        routingPayload,        // Direct Parameter Mapping Array
        "I2j1gnKZ3mW5hT8uT"    // Fixed True Public Key
      );
      console.log("EmailJS payload sent to target recipient inbox.");
    } catch (emailError) {
      console.error("EmailJS network channel communication error: ", emailError);
    }

    // 3. Clean UI State Reset Chain
    setLoading(false);
    setForm({ name: "", email: "", message: "" });
  };

  const isDisabled = loading;

  return (
    <>
      <div
        className={`xl:mt-12 flex xl:flex-row flex-col-reverse gap-10 overflow-hidden`}
      >
        <motion.div
          variants={slideIn("left", "tween", 0.2, 1)}
          className='flex-[0.75] bg-gradient-to-br from-white/[0.03] via-[#151030]/40 to-purple-500/[0.02] backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(3,0,20,0.37)] rounded-2xl p-8 anti-aliased-text'
        >
          <p className={styles.sectionSubText}>Get in touch</p>
          <h3 className={styles.sectionHeadText}>Contact.</h3>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className='mt-12 flex flex-col gap-8'
          >
            {/* Name field */}
            <label className='flex flex-col'>
              <span className='text-white font-medium mb-4'>Your Name</span>
              <input
                type='text'
                name='from_name'
                value={form.name}
                onChange={handleChange}
                disabled={isDisabled}
                placeholder="What's your good name?"
                className={`bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none font-medium focus:ring-2 focus:ring-violet-accent transition-all ${errors.name
                  ? "border border-red-500/60 ring-1 ring-red-500/40"
                  : "border-none"
                  } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
              />
              {errors.name && (
                <span className="text-red-400 text-[12px] mt-1.5 ml-1">
                  {errors.name}
                </span>
              )}
            </label>

            {/* Email field */}
            <label className='flex flex-col'>
              <span className='text-white font-medium mb-4'>Your email</span>
              <input
                type='email'
                name='from_email'
                value={form.email}
                onChange={handleChange}
                disabled={isDisabled}
                placeholder="What's your email address?"
                className={`bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none font-medium focus:ring-2 focus:ring-violet-accent transition-all ${errors.email
                  ? "border border-red-500/60 ring-1 ring-red-500/40"
                  : "border-none"
                  } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
              />
              {errors.email && (
                <span className="text-red-400 text-[12px] mt-1.5 ml-1">
                  {errors.email}
                </span>
              )}
            </label>

            {/* Message field */}
            <label className='flex flex-col'>
              <span className='text-white font-medium mb-4'>Your Message</span>
              <textarea
                rows={7}
                name='message'
                value={form.message}
                onChange={handleChange}
                disabled={isDisabled}
                placeholder='What you want to say?'
                className={`bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none font-medium focus:ring-2 focus:ring-violet-accent transition-all resize-none ${errors.message
                  ? "border border-red-500/60 ring-1 ring-red-500/40"
                  : "border-none"
                  } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
              />
              {errors.message && (
                <span className="text-red-400 text-[12px] mt-1.5 ml-1">
                  {errors.message}
                </span>
              )}
            </label>

            <button
              type='submit'
              disabled={isDisabled}
              className={`relative overflow-hidden bg-gradient-to-r from-[#1d1836] to-[#915eff]/20 border border-[#915eff]/50 px-8 py-3 rounded-xl font-medium tracking-wider text-white transition-all duration-500 shadow-[0_0_15px_rgba(145,94,255,0.1)] hover:from-[#915eff] hover:to-[#aa77ff] hover:shadow-[0_0_25px_rgba(145,94,255,0.6)] hover:scale-[1.03] active:scale-[0.98] animate-shimmer ${isDisabled
                ? "opacity-60 cursor-not-allowed"
                : "cursor-pointer"
                }`}
            >
              {loading ? "Securing Cloud Link..." : "Send"}
            </button>
          </form>
        </motion.div>

        <motion.div
          variants={slideIn("right", "tween", 0.2, 1)}
          className='xl:flex-1 xl:h-auto md:h-[550px] h-[350px]'
        >
          <EarthCanvas />
        </motion.div>
      </div>

      {/* Toast notification overlay */}
      <ToastContainer toast={toast} onDismiss={dismissToast} />
    </>
  );
};

export default SectionWrapper(Contact, "contact");
