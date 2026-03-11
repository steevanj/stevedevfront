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

export default function SkillsCarousel() {
  return (
    <div className="text-center">

      {/* Title */}
      <h2 className="text-3xl font-bold text-white mb-12">
        Skills & Technologies
      </h2>

      {/* Skills */}
      <div className="flex justify-center items-center gap-12 flex-wrap">

        {skills.map((icon, index) => (
          <div
            key={index}
            className="
              flex items-center justify-center
              w-20 h-20
              rounded-full
              border border-red-500/30
              bg-black/40
              backdrop-blur-sm
              shadow-[0_0_20px_rgba(255,0,0,0.25)]
              transition-transform
              hover:scale-110
            "
          >
            <i className={`${icon} text-3xl`} />
          </div>
        ))}

      </div>

    </div>
  );
}