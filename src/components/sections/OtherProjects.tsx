import Image from "next/image";
import Link from "next/link";

type ProjectId = "grove" | "ecommerce" | "sea-sky" | "tidehaus" | "selah" | "ziplearn" | "mood-tracker";

type OtherProjectsProps = {
  currentProject: ProjectId;
  theme?: "light" | "dark";
};

const PROJECTS = [
  {
    id: "grove",
    title: "Grove",
    href: "/projects/grove",
    image: "/images/featured-work/grove-garden-screen.png",
    bg: "#a4cd18",
  },
  {
    id: "ecommerce",
    title: "Samples Store",
    href: "/projects/ecommerce",
    image: "/images/featured-work/samples-materials.png",
    bg: "#000",
  },
  {
    id: "sea-sky",
    title: "Sea & Sky",
    href: "/projects/sea-and-sky",
    image: "/images/case-studies/seaSky-caseStudy.png",
    bg: "#0B53CD",
  },
  {
    id: "tidehaus",
    title: "Tidehaus",
    href: "/projects/tidehaus",
    image: "/images/case-studies/tidehaus-caseStudy.png",
    bg: "#07131D",
  },
  {
    id: "selah",
    title: "Selah",
    href: "/projects/selah-reflect",
    image: "/images/case-studies/selah-caseStudy.png",
    bg: "#1f3a3d",
  },
  {
    id: "ziplearn",
    title: "ZipLearn",
    href: "/projects/ziplearn",
    image: "/images/case-studies/ziplearn-caseStudy.png",
    bg: "#6A32F9",
  },
  {
    id: "mood-tracker",
    title: "Mood Tracker",
    href: "/projects/mood-tracker",
    image: "/images/case-studies/mood-tracker-caseStudy.png",
    bg: "#F6C22B",
  },
] satisfies Array<{
  id: ProjectId;
  title: string;
  href: string;
  image: string;
  bg: string;
}>;

// The picture on each card. Grove and the Samples Store reuse the home page artwork;
// the others show their whole phone screen, centred on a panel in the project's colour.
function Preview({ project }: { project: (typeof PROJECTS)[number] }) {
  const alt = `${project.title} project preview`;
  if (project.id === "grove") {
    return (
      <>
        <div className="absolute left-[22%] top-[22%] h-[100%] w-[38%] -rotate-[11deg] overflow-hidden rounded-[14px]">
          <Image src="/images/featured-work/grove-habit-progress.png" alt="" fill sizes="160px" className="object-cover object-top" />
        </div>
        <div className="absolute right-0 top-[18%] h-[100%] w-[39%] overflow-hidden rounded-tl-[14px]">
          <Image src={project.image} alt={alt} fill sizes="180px" className="object-cover object-left-top" />
        </div>
      </>
    );
  }
  if (project.id === "ecommerce") {
    return <Image src={project.image} alt={alt} fill sizes="(min-width: 1024px) 360px, 90vw" className="object-cover" />;
  }
  return (
    <div className="absolute inset-x-0 bottom-0 top-[8%]">
      <Image src={project.image} alt={alt} fill sizes="(min-width: 1024px) 360px, 90vw" className="object-contain object-bottom" />
    </div>
  );
}

export default function OtherProjects({ currentProject, theme = "light" }: OtherProjectsProps) {
  const projects = PROJECTS.filter((project) => project.id !== currentProject);
  const isDark = theme === "dark";

  return (
    <section className={`relative py-16 sm:py-20 ${isDark ? "bg-black" : "bg-white"}`}>
      <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-8 min-[1400px]:px-0">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className={`font-mono text-[12px] font-medium uppercase tracking-[0.08em] ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
              More Work
            </p>
            <h2 className={`mt-2 text-[30px] font-semibold leading-[38px] tracking-[-0.9px] sm:text-[36px] sm:leading-[44px] ${isDark ? "text-white" : "text-black"}`}>
              View Other Projects
            </h2>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={project.href}
              className={`group rounded-[24px] p-3 outline-none transition-transform focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 duration-300 hover:-translate-y-1 ${
                isDark ? "bg-white/5 hover:bg-white/10" : "bg-zinc-50 hover:bg-zinc-100"
              }`}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[16px]" style={{ background: project.bg }}>
                <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                  <Preview project={project} />
                </div>
              </div>
              <h3 className={`mt-3 px-1 text-[15px] font-semibold ${isDark ? "text-white" : "text-zinc-900"}`}>{project.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
