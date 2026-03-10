import { motion } from "framer-motion";

const skills = [
  "devicon-django-plain",
  "devicon-python-plain colored",
  "devicon-git-plain colored",
  "devicon-github-original",
  "devicon-postman-plain",
  "devicon-vscode-plain colored",
  "devicon-mysql-plain colored",
  "devicon-sqlite-plain",
];

const random = (min, max) => Math.random() * (max - min) + min;

export default function SkillsCarousel() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">

      {skills.map((icon, i) => (
        <motion.div
          key={i}
          className="
            absolute
            flex items-center justify-center
            w-20 h-20
            rounded-full
            border border-red-500/20
            bg-black/20
            backdrop-blur-sm
            shadow-[0_0_20px_rgba(255,0,0,0.2)]
          "
          style={{
            left: `${random(0, 100)}%`,
            top: `${random(0, 100)}%`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, 20, -20, 0],
          }}
          transition={{
            duration: random(10, 20),
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <i className={`${icon} text-3xl opacity-70`} />
        </motion.div>
      ))}

    </div>
  );
}