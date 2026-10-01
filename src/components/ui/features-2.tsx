import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BarChart3, Check, Shield, Users } from "lucide-react";
import Image from "next/image";

type IconProps = { className?: string; size?: number | string };

const rows = [
  {
    eyebrow: "Collaboration",
    Icon: (p: IconProps) => <Users className={p.className} size={p.size} />,
    title: "Work as one, ship faster together",
    body: "One shared workspace where roles, live presence, and threaded comments keep everyone aligned.",
    bullets: [
      "Granular roles: viewer, editor, admin",
      "Real-time presence and inline comments",
      "Version history with one-click restore",
      "Guest access with expiring links",
    ],
    cta: "Explore Collaboration",
    img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80",
    imgAlt: "Team working together around a table",
    avatars: [
      {
        name: "Sarah Kim",
        initials: "SK",
        src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Marcus Webb",
        initials: "MW",
        src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Priya Nair",
        initials: "PN",
        src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
      },
    ],
    stat: { value: "4.2×", label: "Faster Review Cycles" },
  },
  {
    eyebrow: "Analytics",
    Icon: (p: IconProps) => <BarChart3 className={p.className} size={p.size} />,
    title: "Decisions grounded in real data",
    body: "Turn raw events into clear, actionable dashboards in minutes, with no SQL or data-engineering bottleneck.",
    bullets: [
      "Sub-second query engine for large datasets",
      "Funnel, retention, and cohort views built-in",
      "Scheduled email and Slack reports",
      "CSV and REST API export",
    ],
    cta: "See Analytics In Action",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80",
    imgAlt: "Analytics dashboard on a laptop",
    avatars: [
      {
        name: "James Okafor",
        initials: "JO",
        src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Lena Strauss",
        initials: "LS",
        src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      },
    ],
    stat: { value: "98%", label: "Query Success Rate" },
  },
  {
    eyebrow: "Security",
    Icon: (p: IconProps) => <Shield className={p.className} size={p.size} />,
    title: "Enterprise-grade protection, zero friction",
    body: "Controls your compliance team will love and developers barely notice, with SSO, MFA, audit logs, and data residency built in.",
    bullets: [
      "SOC 2 Type II and ISO 27001 certified",
      "SSO via SAML 2.0 and OIDC",
      "Immutable audit log with SIEM export",
      "EU and US data-residency regions",
    ],
    cta: "Review Security Docs",
    img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1400&q=80",
    imgAlt: "Security operations workspace",
    avatars: [
      {
        name: "Diana Reyes",
        initials: "DR",
        src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Tom Eriksen",
        initials: "TE",
        src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Aiko Tanaka",
        initials: "AT",
        src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
      },
    ],
    stat: { value: "0", label: "Reported Breaches" },
  },
];

export default function FeaturesBlock() {
  return (
    <section className="bg-white px-6 py-20 text-black">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <Badge>Platform</Badge>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight">
            Built for every part of your workflow
          </h2>
          <p className="mt-4 text-black">
            Acme brings collaboration, analytics, and security into one cohesive
            platform, so nothing falls between the cracks.
          </p>
        </div>
        <div className="mt-14 flex flex-col gap-16">
          {rows.map((row, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={row.title}>
                <div className="grid items-center gap-10 lg:grid-cols-2">
                  <div className={isEven ? "" : "lg:order-2"}>
                    <div className="flex items-center gap-3">
                      <row.Icon className="text-black" size={18} />
                      <span className="text-xs uppercase tracking-[0.18em] text-black">
                        {row.eyebrow}
                      </span>
                    </div>
                    <h3 className="mt-4 text-3xl font-semibold">{row.title}</h3>
                    <p className="mt-3 text-black">{row.body}</p>
                    <ul className="mt-6 space-y-2">
                      {row.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2 text-sm">
                          <Check className="mt-0.5 text-black" size={16} />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 flex items-center gap-4">
                      <div className="flex -space-x-2">
                        {row.avatars.map((av) => (
                          <Avatar key={av.name}>
                            <AvatarImage src={av.src} alt={av.name} />
                            <AvatarFallback>{av.initials}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-black">{row.stat.value}</p>
                        <p className="text-xs text-black">{row.stat.label}</p>
                      </div>
                    </div>
                    <Button className="mt-6">{row.cta}</Button>
                  </div>
                  <div className={isEven ? "" : "lg:order-1"}>
                    <div className="relative h-72 border border-black bg-white">
                      <Image
                        src={row.img}
                        alt={row.imgAlt}
                        fill
                        className="object-cover grayscale"
                        sizes="(min-width: 1024px) 50vw, 100vw"
                      />
                    </div>
                    <p className="mt-3 text-xs uppercase tracking-[0.16em] text-black">
                      {row.eyebrow} Preview
                    </p>
                  </div>
                </div>
                {index < rows.length - 1 && <Separator className="mt-16" />}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
