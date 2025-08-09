import Image from "next/image";
import Link from "next/link";
import { Instagram, Palette, Sprout, Zap, Globe, Facebook } from "lucide-react";

const founder = {
  id: 1,
  name: "Gold Nwaukwa",
  role: "Founder & Creative Director",
  image: "/images/profile/goldnwaukwa.jpg",
  bio: "The idea for Cherrylconcept was born from a personal struggle—a frustrating two hours spent trying to tie a Gele for a wedding. That moment sparked a powerful vision: to create beautiful, ready-to-wear headgear that saves time and empowers women to feel confident without the hassle.",
  social: {
    instagram: "https://www.instagram.com/nwaukwachiedozie",
    facebook: "https://www.facebook.com/Cherrylconcept",
  },
};

const values = [
  {
    icon: <Zap size={28} className="text-purple-600" />,
    title: "Effortless Elegance",
    description:
      "We eradicate the struggles of tying headgear. Our ready-to-wear designs ensure you look stunning in an instant, making life easier for women globally.",
  },
  {
    icon: <Sprout size={28} className="text-purple-600" />,
    title: "Cultural Heritage",
    description:
      "Our headgear does more than enhance beauty; it tells the great stories of African women's heritage, celebrating identity and tradition.",
  },
  {
    icon: <Palette size={28} className="text-purple-600" />,
    title: "Aesthetic Beauty",
    description:
      "With a wide range of colors and styles, our pieces are designed to suit your unique fashion desires and accentuate your beauty.",
  },
  {
    icon: <Globe size={28} className="text-purple-600" />,
    title: "Global Vision",
    description:
      "We are passionate about bringing African headgear to a global spotlight, meeting worldwide demand and celebrating diversity.",
  },
];

const visionMilestones = [
  {
    year: "2025",
    title: "The Beginning",
    description:
      "Cherrylconcept is born in Lagos, with a mission to share the beauty of African headwear with the world.",
  },
  {
    year: "2026",
    title: "Artisan Collaborations",
    description:
      "We aim to partner with local textile artists to create exclusive, limited-edition collections that tell a deeper story.",
  },
  {
    year: "2027",
    title: "A Global Community",
    description:
      "Fostering a worldwide community of women connected by a shared love for style, culture, and self-expression.",
  },
];

const SectionHeader = ({ eyebrow, title, description }) => (
  <div className="max-w-3xl mx-auto text-center">
    {eyebrow && (
      <p className="text-sm font-semibold text-purple-600 uppercase tracking-wider mb-2">
        {eyebrow}
      </p>
    )}
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 text-balance">
      {title}
    </h2>
    {description && (
      <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto text-balance">
        {description}
      </p>
    )}
  </div>
);

const ValueCard = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300">
    <div className="bg-purple-50 inline-flex p-3 rounded-full mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600">{description}</p>
  </div>
);

export default function AboutUsPage() {
  return (
    <>
      <main className="bg-white">
        {/* === HERO SECTION === */}
        <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-white text-center px-4">
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <Image
            src="/images/hero/222.jpg"
            alt="Elegant headwear fabric detail"
            fill
            className="object-cover"
            priority
          />
          <div className="relative z-20">
            <p className="text-sm md:text-base font-semibold uppercase tracking-widest mb-2">
              Cherrylconcept
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-balance leading-tight">
              Elegance, Made Easy.
            </h1>
          </div>
        </section>

        {/* === THE SPARK OF AN IDEA === */}
        <section className="py-16 md:py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
              <div className="prose lg:prose-xl max-w-none text-slate-600">
                <h2 className="text-slate-900">
                  The Moment That Started It All.
                </h2>
                <p>
                  "The driving force was a wedding I had to attend with my
                  husband. I stood in front of the mirror for almost two hours
                  trying to tie my Gele, and I still couldn't get it right. We
                  arrived at the reception late."
                </p>
                <p>
                  "When we returned, I felt so bad. My husband said to me, ‘it
                  would be so nice if these Gele could be made ready for any
                  occasion to avoid this happening again.’ That idea grew into a
                  passion, and I decided to take the bull by the horn."
                </p>
              </div>
              <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-xl transform lg:rotate-2 transition hover:rotate-0 duration-300">
                <Image
                  src="/images/hero/333.jpg"
                  alt="A woman wearing a beautiful Cherryl Concept turban"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* === MEET THE FOUNDER === */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
              <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-xl transform lg:-rotate-2 transition hover:rotate-0 duration-300 lg:order-last">
                <Image
                  src={founder.image}
                  alt={founder.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="lg:order-first">
                <SectionHeader
                  eyebrow="The Visionary"
                  title={`Meet ${founder.name}`}
                />
                <p className="mt-6 text-lg text-slate-600 leading-relaxed text-center lg:text-left">
                  {founder.bio}
                </p>
                <div className="mt-6 flex justify-center lg:justify-start space-x-4">
                  <a
                    href={founder.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-purple-600 transition-colors"
                  >
                    <Instagram size={24} />
                  </a>
                  <a
                    href={founder.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-purple-600 transition-colors"
                  >
                    <Facebook size={24} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* === WHAT DRIVES US (OUR VALUES) === */}
        <section className="py-16 md:py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            <SectionHeader
              eyebrow="Our Principles"
              title="What Drives Us"
              description="These core values are at the heart of every piece we create and every decision we make."
            />
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value) => (
                <ValueCard key={value.title} {...value} />
              ))}
            </div>
          </div>
        </section>

        {/* === OUR VISION FOR THE FUTURE === */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <SectionHeader
              eyebrow="The Journey Ahead"
              title="Our Vision for the Future"
              description="Our story is just beginning. We're excited for what's next."
            />
            <div className="relative mt-16 max-w-3xl mx-auto">
              <div
                className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-slate-200"
                aria-hidden="true"
              ></div>
              {visionMilestones.map((milestone, index) => (
                <div
                  key={index}
                  className="relative pl-8 md:pl-0 mb-12 last:mb-0"
                >
                  <div
                    className="md:flex items-center"
                    style={{
                      flexDirection: index % 2 === 0 ? "row" : "row-reverse",
                    }}
                  >
                    <div className="hidden md:block w-5/12"></div>
                    <div className="hidden md:block w-2/12 text-center">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-purple-600 rounded-full border-4 border-white shadow-md"></div>
                    </div>
                    <div className="md:w-5/12 p-6 bg-white rounded-xl shadow-md border border-slate-100">
                      <p className="text-lg font-bold text-purple-600">
                        {milestone.year}
                      </p>
                      <h3 className="text-xl font-bold text-slate-800 mt-1">
                        {milestone.title}
                      </h3>
                      <p className="text-slate-600 mt-2">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                  <div className="md:hidden absolute -left-1.5 top-1 w-4 h-4 bg-purple-600 rounded-full border-4 border-white"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === CTA SECTION === */}
        <section className="bg-slate-800 text-white">
          <div className="container mx-auto px-4 py-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              End the Struggle. Find Your Style.
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto text-balance">
              Explore our collection of ready-to-wear headgear and become part
              of our story.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-purple-600 text-white px-10 py-4 text-lg font-semibold rounded-full hover:bg-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              Shop The Collection
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
