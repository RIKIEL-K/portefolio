"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const info = [
  { icon: <FaPhoneAlt />, title: "Phone", description: "(+1) 514-574-8516" },
  {
    icon: <FaEnvelope />,
    title: "Email",
    description: "krikielyounda@gmail.com",
  },
  {
    icon: <FaMapMarkerAlt />,
    title: "Address",
    description: "Montreal, Canada",
  },
];

export default function Contact() {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Erreur serveur");
      setStatus({ ok: true, message: "Message envoyé — merci !" });
      setForm({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        service: "",
        message: "",
      });
    } catch (err) {
      setStatus({ ok: false, message: err.message || "Échec de l'envoi" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2, duration: 0.4 } }}
      className="py-6"
    >
      <div className="container mx-auto">
        <div className="flex flex-col xl:flex-row gap-[30px]">
          <div className="xl:w-[54%] order-2 xl:order-none">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-6 p-10 bg-[#27272c] rounded-xl"
            >
              <h3 className="text-4xl text-accent">Let's work together</h3>
              <p className="text-white/60">
                Feel free to reach out for collaborations or just a friendly
                hello!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  name="firstname"
                  value={form.firstname}
                  onChange={onChange}
                  placeholder="Firstname"
                />
                <Input
                  name="lastname"
                  value={form.lastname}
                  onChange={onChange}
                  placeholder="Lastname"
                />
                <Input
                  name="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="Email address"
                />
                <Input
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  placeholder="Phone number"
                />
              </div>

              <select
                name="service"
                value={form.service}
                onChange={onChange}
                className="w-full p-2 rounded bg-transparent border border-zinc-700"
              >
                <option value="">Select a service</option>
                <option value="web">Web Development</option>
                <option value="devops">DevOps</option>
                <option value="uiux">UI/UX design</option>
                <option value="mobile">Mobile Development</option>
                <option value="other">Other</option>
              </select>

              <Textarea
                name="message"
                className="h-[200px]"
                placeholder="Type your message here."
                value={form.message}
                onChange={onChange}
              />

              <Button
                type="submit"
                size="md"
                className="max-w-40"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send message"}
              </Button>

              {status && (
                <p
                  className={`mt-2 ${
                    status.ok ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {status.message}
                </p>
              )}
            </form>
          </div>

          <div className="flex-1 flex items-center xl:justify-end order-1 xl:order-none mb-8 xl:mb-0">
            <ul className="flex flex-col gap-10">
              {info.map((item, i) => (
                <li key={i} className="flex items-center gap-6">
                  <div className="w-[52px] h-[52px] xl:w-[72px] xl:h-[72px] bg-[#27272c] text-accent rounded-md flex items-center justify-center">
                    <div className="text-[28px]">{item.icon}</div>
                  </div>
                  <div className="flex-1">
                    <p className="text-white/60">{item.title}</p>
                    <h3 className="text-xl">{item.description}</h3>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
