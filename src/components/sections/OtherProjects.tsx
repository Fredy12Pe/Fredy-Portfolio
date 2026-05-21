import Link from "next/link";

type ProjectId = "grove" | "ecommerce" | "sea-sky" | "tidehaus" | "selah" | "ziplearn";

type OtherProjectsProps = {
  currentProject: ProjectId;
  theme?: "light" | "dark";
};

const PROJECTS = [
  {
    id: "grove",
    title: "Grove",
    href: "/projects/grove",
    image: "/images/projects-section/caseStudies/case-Studies/Grove-caseStudy.png",
  },
  {
    id: "ecommerce",
    title: "E-Commerce",
    href: "/projects/ecommerce",
    image: "/images/projects-section/caseStudies/case-Studies/Ecommerce-caseStudy.png",
  },
  {
    id: "sea-sky",
    title: "Sea & Sky",
    href: "/projects/sea-and-sky",
    image: "/images/projects-section/caseStudies/case-Studies/seaSky-caseStudy.png",
  },
  {
    id: "tidehaus",
    title: "Tidehaus",
    href: "/projects/tidehaus",
    image: "/images/projects-section/caseStudies/case-Studies/tidehaus-caseStudy.png",
  },
  {
    id: "selah",
    title: "Selah",
    href: "/projects/selah-reflect",
    image: "/images/projects-section/caseStudies/case-Studies/selah-caseStudy.png",
  },
  {
    id: "ziplearn",
    title: "ZipLearn",
    href: "/projects/ziplearn",
    image: "/images/projects-section/caseStudies/case-Studies/ziplearn-caseStudy.png",
  },
] satisfies Array<{
  id: ProjectId;
  title: string;
  href: string;
  image: string;
}>;

export default function OtherProjects({ currentProject, theme = "light" }: OtherProjectsProps) {
  const projects = PROJECTS.filter((project) => project.id !== currentProject);
  const isDark = theme === "dark";

  return (
    <section className={`relative py-16 sm:py-20 ${isDark ? "bg-black" : "bg-white"}`}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
              More Work
            </p>
            <h2 className={`mt-2 text-2xl font-bold tracking-tight sm:text-3xl ${isDark ? "text-white" : "text-black"}`}>
              View Other Projects
            </h2>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={project.href}
              className={`group rounded-2xl p-3 transition-transform duration-300 hover:-translate-y-1 ${
                isDark ? "bg-white/5 hover:bg-white/10" : "bg-zinc-50 hover:bg-zinc-100"
              }`}
            >
              <div
                role="img"
                aria-label={`${project.title} project preview`}
                className="aspect-[4/3] overflow-hidden rounded-xl bg-zinc-200 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${project.image})` }}
              >
                <span className="sr-only">{project.title} project preview</span>
              </div>
              <h3 className={`mt-3 text-sm font-semibold ${isDark ? "text-white" : "text-zinc-900"}`}>{project.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
