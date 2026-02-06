// src/ProjectsPage.jsx
import React from "react";

/** Small helper to embed YouTube nicely */
function YouTubeEmbed({ url }) {
  // supports youtube.com
  let embed = url;

  try {
    const u = new URL(url);

    // youtu.be/<id>
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      embed = `https://www.youtube.com/embed/${id}`;
    }

    // youtube.com/watch?v=<id>
    if (u.hostname.includes("youtube.com") && u.pathname === "/watch") {
      const id = u.searchParams.get("v");
      if (id) embed = `https://www.youtube.com/embed/${id}`;
    }

    // youtube.com/shorts/<id>
    if (u.hostname.includes("youtube.com") && u.pathname.startsWith("/shorts/")) {
      const id = u.pathname.split("/shorts/")[1]?.split("/")[0];
      if (id) embed = `https://www.youtube.com/embed/${id}`;
    }
  } catch {
    // leave as-is
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-2xl border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5">
      <iframe
        className="h-full w-full"
        src={embed}
        title="Project video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}

function Card({ title, subtitle, children, links = [] }) {
  return (
    <article className="rounded-2xl border border-black/10 bg-white/70 p-6 shadow-sm shadow-black/5 dark:border-white/10 dark:bg-slate-800/60">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
        {subtitle && <p className="text-sm text-slate-600 dark:text-white/60">{subtitle}</p>}
      </div>

      <div className="mt-4">{children}</div>

      {links.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          {links.map((l, i) => (
            <a
              key={i}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-slate-400/50 underline-offset-2 hover:text-slate-900 dark:hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </article>
  );
}

export default function ProjectsPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs text-slate-700 dark:border-white/15 dark:bg-white/5 dark:text-white/80">
          Student work
        </div>
        <h2 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">Projects</h2>
        <p className="mt-2 text-slate-700 dark:text-white/70">
          A few highlights from TinyML @ Penn.
        </p>
      </div>

      {/* Grid of projects */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title="Revolutionizing Bee Keeping"
          links={[
            { label: "Watch on YouTube", href: "https://youtu.be/F19m0aMfIKU?si=McJMQiCr5ZmzV7z7" },
          ]}
        >
          <YouTubeEmbed url="https://youtu.be/F19m0aMfIKU?si=McJMQiCr5ZmzV7z7" />
        </Card>

        <Card
          title="DND Dice Reader"
          subtitle="Josh Ludan"
          links={[
            { label: "Watch on YouTube", href: "https://www.youtube.com/watch?v=c7OoO8QS2fg" },
          ]}
        >
          <YouTubeEmbed url="https://www.youtube.com/watch?v=c7OoO8QS2fg" />
        </Card>

        <Card
          title="Intelligent Pedestrian Light Detection"
          subtitle="Dhruv Agarwal"
          links={[
            { label: "Watch on YouTube", href: "https://www.youtube.com/watch?v=e5NfGWAu06Q" },
            { label: "Project website", href: "https://dhruvagrawal.org/posts/tiny-ml-and-solving-problems/" },
          ]}
        >
          <YouTubeEmbed url="https://www.youtube.com/watch?v=e5NfGWAu06Q" />
        </Card>

        <Card
          title="Real-Time Gaze Tracking"
          subtitle="Riju Datta"
          links={[
            { label: "Up direction", href: "https://youtube.com/shorts/tlFbsTMf3QI" },
            { label: "Right direction", href: "https://youtube.com/shorts/d0XcqP7OmrA" },
            { label: "Left direction", href: "https://youtube.com/shorts/6IStzLdUOYM" },
          ]}
        >
          {/* one row: 3 embeds */}
          <div className="grid gap-4 sm:grid-cols-3">
            <YouTubeEmbed url="https://youtube.com/shorts/tlFbsTMf3QI" />
            <YouTubeEmbed url="https://youtube.com/shorts/d0XcqP7OmrA" />
            <YouTubeEmbed url="https://youtube.com/shorts/6IStzLdUOYM" />
          </div>
        </Card>
      </div>

      {/* Slides embed */}
      <div className="mt-10 rounded-2xl border border-black/10 bg-white/70 p-6 shadow-sm shadow-black/5 dark:border-white/10 dark:bg-slate-800/60">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Watch them all!</h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-white/60">
          Embedded slide deck
        </p>

        <div className="mt-4 aspect-video w-full overflow-hidden rounded-2xl border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5">
          <iframe
            className="h-full w-full"
            // IMPORTANT: use /embed
            src="https://docs.google.com/presentation/d/1R4UXCtfYixrwvjRThlOGbe1MC8m4JMacbH_wBNhqihY/embed?start=false&loop=false&delayms=3000"
            title="Projects slide deck"
            allowFullScreen
          />
        </div>

        <div className="mt-3 text-sm">
          <a
            href="https://docs.google.com/presentation/d/1R4UXCtfYixrwvjRThlOGbe1MC8m4JMacbH_wBNhqihY/edit?usp=sharing"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-slate-400/50 underline-offset-2 hover:text-slate-900 dark:hover:text-white"
          >
            Open slides in a new tab
          </a>
        </div>
      </div>
    </section>
  );
}
