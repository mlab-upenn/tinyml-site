// src/Lectures.jsx
import React from "react";

/* 0) CONFIG: Modules → Lectures → RTD URLs */
const MODULES = [
  {
    id: "module1",
    title: "Module 1 • Fundamentals of TinyML",
    lectures: [
      { id: "lec1", title: "Lecture 1 — Welcome to TinyML", url: "https://tinyml-readthedocs.readthedocs.io/en/latest/module1/Lecture1.html" },
      { id: "lec2", title: "Lecture 2", url: "https://tinyml-readthedocs.readthedocs.io/en/latest/module1/Lecture2.html" },
      { id: "lec3", title: "Lecture 3", url: "https://tinyml-readthedocs.readthedocs.io/en/latest/module1/Lecture3.html" },
      { id: "lec4", title: "Lecture 4", url: "https://tinyml-readthedocs.readthedocs.io/en/latest/module1/Lecture4.html" },
      { id: "lec5", title: "Lecture 5", url: "https://tinyml-readthedocs.readthedocs.io/en/latest/module1/Lecture5.html" },
      { id: "lec6", title: "Lecture 6", url: "https://tinyml-readthedocs.readthedocs.io/en/latest/module1/Lecture6.html" },
    ],
  },
  {
    id: "module2",
    title: "Module 2 • Applications of TinyML",
    lectures: [
      { id: "lec1", title: "Lecture 1", url: "https://tinyml-readthedocs.readthedocs.io/en/latest/module2/Lecture1.html" },
      { id: "lec2", title: "Lecture 2", url: "https://tinyml-readthedocs.readthedocs.io/en/latest/module2/Lecture2.html" },
      { id: "lec3", title: "Lecture 3", url: "https://tinyml-readthedocs.readthedocs.io/en/latest/module2/Lecture3.html" },
      { id: "lec4", title: "Lecture 4", url: "https://tinyml-readthedocs.readthedocs.io/en/latest/module2/Lecture4.html" },
      { id: "lec5", title: "Lecture 5", url: "https://tinyml-readthedocs.readthedocs.io/en/latest/module2/Lecture5.html" },
      { id: "lec6", title: "Lecture 6", url: "https://tinyml-readthedocs.readthedocs.io/en/latest/module2/Lecture6.html" },
      { id: "lec7", title: "Lecture 7", url: "https://tinyml-readthedocs.readthedocs.io/en/latest/module2/Lecture7.html" },
      { id: "lec8", title: "Lecture 8", url: "https://tinyml-readthedocs.readthedocs.io/en/latest/module2/Lecture8.html" },
    ],
  },
  {
    id: "module3",
    title: "Module 3 • Deploying on Embedded Hardware",
    lectures: [
      { id: "lec1", title: "Lecture 1", url: "https://tinyml-readthedocs.readthedocs.io/en/latest/module3/Lecture1.html" },
      { id: "lec2", title: "Lecture 2", url: "https://tinyml-readthedocs.readthedocs.io/en/latest/module3/Lecture2.html" },
      { id: "lec3", title: "Lecture 3", url: "https://tinyml-readthedocs.readthedocs.io/en/latest/module3/Lecture3.html" },
      { id: "lec4", title: "Lecture 4", url: "https://tinyml-readthedocs.readthedocs.io/en/latest/module3/Lecture4.html" },
      { id: "lec5", title: "Lecture 5", url: "https://tinyml-readthedocs.readthedocs.io/en/latest/module3/Lecture5.html" },
      { id: "lec6", title: "Lecture 6", url: "https://tinyml-readthedocs.readthedocs.io/en/latest/module3/Lecture6.html" },
    ],
  },
];

/* 1) URL-hash helpers (#moduleId/lectureId) */
function readHash() {
  const h = (window.location.hash || "").replace(/^#/, "");
  const [moduleId, lectureId] = h.split("/");
  return { moduleId, lectureId };
}
function writeHash(moduleId, lectureId) {
  const next = `#${moduleId || ""}${lectureId ? `/${lectureId}` : ""}`;
  if (window.location.hash !== next) window.location.hash = next;
}

/* 2) Fetch + sanitize RTD page */
function useRtdPage(url) {
  const [html, setHtml] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!url) { setHtml(""); setError(""); setLoading(false); return; }
    let alive = true;
    const bust = `?v=${Math.floor(Date.now() / (5 * 60 * 1000))}`; // 5-min cache bust
    setLoading(true);
    fetch(url + bust, { cache: "no-store", credentials: "omit", mode: "cors" })
      .then(r => { if (!r.ok) throw new Error(`Fetch ${r.status}`); return r.text(); })
      .then(raw => { if (!alive) return; setHtml(sanitizeRtdHTML(raw)); setError(""); setLoading(false); })
      .catch(e => { if (!alive) return; setError(String(e)); setLoading(false); });
    return () => { alive = false; };
  }, [url]);

  return { html, loading, error };
}

function sanitizeRtdHTML(rawHtml) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, "text/html");
  let main =
    doc.querySelector('div[role="main"] .document') ||
    doc.querySelector('div[role="main"]') ||
    doc.querySelector(".document") ||
    doc.body;

  // Remove RTD chrome / extras
  main.querySelectorAll("nav,header,footer,.sphinxsidebar,.wy-nav-side,.toc,.related").forEach(n => n.remove());
  main.querySelectorAll("a.headerlink,[title^='Permalink']").forEach(n => n.remove());
  main.querySelectorAll("script,style").forEach(n => n.remove());

  // Allowlist filter
  const ALLOW = new Set("section article p br strong b em u s span h1 h2 h3 h4 h5 h6 ul ol li a img blockquote hr table thead tbody tr th td pre code figure figcaption div iframe".split(" "));
  const ALLOW_ATTR = new Set("href src alt title colspan rowspan allow allowfullscreen frameborder loading referrerpolicy width height".split(" "));
  const walker = doc.createTreeWalker(main, NodeFilter.SHOW_ELEMENT);
  const rm = [];
  while (walker.nextNode()) {
    const el = walker.currentNode;
    if (!ALLOW.has(el.tagName.toLowerCase())) { rm.push(el); continue; }
    [...el.attributes].forEach(a => { if (!ALLOW_ATTR.has(a.name.toLowerCase())) el.removeAttribute(a.name); });
  }
  rm.forEach(n => n.replaceWith(...n.childNodes));

  // Tailwindish classes
  main.querySelectorAll("h1").forEach(h => h.className = "text-3xl font-semibold mt-6 mb-3 text-slate-900 dark:text-white");
  main.querySelectorAll("h2").forEach(h => h.className = "text-2xl font-semibold mt-6 mb-3 text-slate-900 dark:text-white");
  main.querySelectorAll("h3").forEach(h => h.className = "text-xl font-bold mt-5 mb-2.5 text-slate-900 dark:text-white");
  main.querySelectorAll("h4,h5,h6").forEach(h => h.className = "text-lg font-semibold mt-4 mb-2 text-slate-900 dark:text-white");

  main.querySelectorAll("p,li,figcaption").forEach(p => {
    p.classList.add("text-[15px]","leading-7","text-slate-800","dark:text-white/90");
    if (p.tagName.toLowerCase()==="p") p.classList.add("my-3");
  });
  main.querySelectorAll("ul").forEach(ul => ul.className = "list-disc pl-6 my-3 space-y-1");
  main.querySelectorAll("ol").forEach(ol => ol.className = "list-decimal pl-6 my-3 space-y-1");

  main.querySelectorAll("a[href]").forEach(a => {
    a.target = "_blank"; a.rel = "noreferrer";
    a.className = "underline decoration-slate-400/50 underline-offset-2 hover:text-slate-900 dark:decoration-white/40 dark:hover:text-white";
  });
  main.querySelectorAll("img[src]").forEach(img => img.className = "max-w-full h-auto rounded-xl border border-black/10 dark:border-white/10 my-3");

  // Responsive YouTube iframes
  main.querySelectorAll("iframe[src*='youtube.com'],iframe[src*='youtu.be']").forEach(ifr => {
    const wrap = doc.createElement("div");
    wrap.className = "relative w-full overflow-hidden rounded-xl border border-black/10 dark:border-white/10 my-4";
    wrap.style.paddingTop = "56.25%";
    ifr.className = "absolute left-0 top-0 h-full w-full";
    ifr.setAttribute("allowfullscreen","");
    ifr.setAttribute("loading","lazy");
    ifr.removeAttribute("width");
    ifr.removeAttribute("height");
    ifr.parentNode?.insertBefore(wrap, ifr);
    wrap.appendChild(ifr);
  });

  main.querySelectorAll("code").forEach(c => c.classList.add("px-1.5","py-0.5","rounded","bg-black/5","dark:bg-white/10"));
  main.querySelectorAll("pre").forEach(pre => pre.className = "my-4 p-3 rounded-xl overflow-auto bg-black/5 dark:bg-white/10");
  main.querySelectorAll("table").forEach(t => {
    t.className = "w-full text-sm border-collapse";
    t.querySelectorAll("th").forEach(th => th.classList.add("text-left","font-semibold","px-3","py-2","bg-black/5","dark:bg-white/10","text-slate-800","dark:text-white"));
    t.querySelectorAll("td").forEach(td => td.classList.add("px-3","py-2","align-top","text-slate-800","dark:text-white/90","border-t","border-black/10","dark:border-white/10"));
    const wrap = doc.createElement("div");
    wrap.className = "overflow-x-auto rounded-xl border border-black/10 dark:border-white/10 my-4";
    t.parentNode?.insertBefore(wrap, t);
    wrap.appendChild(t);
  });

  const container = doc.createElement("div");
  container.append(...main.childNodes);
  return container.innerHTML;
}

/* 3) UI bits */
function Section({ title, eyebrow, children }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="mb-6">
        {eyebrow && <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs text-slate-700 dark:border-white/15 dark:bg-white/5 dark:text-white/80">{eyebrow}</div>}
        {title && <h2 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{title}</h2>}
      </div>
      {children}
    </section>
  );
}

function ModulePicker({ modules, currentId, onPick }) {
  return (
    <div className="flex flex-wrap gap-2">
      {modules.map(m => (
        <button
          key={m.id}
          onClick={() => onPick(m.id)}
          className={`rounded-xl px-3 py-1.5 text-sm border transition ${
            currentId === m.id
              ? "border-black/20 bg-black/10 text-slate-900 dark:border-white/40 dark:bg-white/15 dark:text-white"
              : "border-black/10 bg-black/5 text-slate-700 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:text-white"
          }`}
        >
          {m.title}
        </button>
      ))}
    </div>
  );
}


function LecturesGrid({ lectures, onOpen, currentLectureId, moduleId }) {
  // Three shades of TinyML green
  const COLOR = {
    module1: {
      base: "bg-[#F2FCF7] border-[#D2F1E4]",
      active: "bg-[#DFF7EC] border-[#81D7B5]",
    },
    module2: {
      base: "bg-[#E6F7EC] border-[#C8EBDD]",
      active: "bg-[#CFF0DF] border-[#75CDA5]",
    },
    module3: {
      base: "bg-[#D8F2E2] border-[#B6E1CB]",
      active: "bg-[#BFE9D2] border-[#5FC598]",
    },
  };

  const color = COLOR[moduleId] || COLOR.module1;

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {lectures.map(lec => (
        <button
          key={lec.id}
          onClick={() => onOpen(lec.id)}
          className={`rounded-xl p-4 text-left border transition
            ${currentLectureId === lec.id ? color.active : color.base}
          `}
        >
          <div className="text-sm text-slate-600">
            {lec.id.replace(/^lec/i, "Lecture ")}
          </div>
          <div className="mt-1 font-semibold text-slate-900">
            {lec.title}
          </div>
        </button>
      ))}
    </div>
  );
}

/*
function LecturesGrid({ lectures, onOpen, currentLectureId }) {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {lectures.map(lec => (
        <button
          key={lec.id}
          onClick={() => onOpen(lec.id)}
          className={`rounded-xl p-4 text-left border transition ${
            currentLectureId === lec.id
              ? "border-emerald-300 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10"
              : "border-black/10 bg-black/5 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          }`}
        >
          <div className="text-sm text-slate-500 dark:text-white/60">{lec.id.replace(/^lec/i, "Lecture ")}</div>
          <div className="mt-1 font-semibold text-slate-900 dark:text-white">{lec.title}</div>
          {!lec.url && <div className="mt-1 text-xs text-slate-500 dark:text-white/50">Link coming soon</div>}
        </button>
      ))}
    </div>
  );
}
*/

function LectureViewer({ title, url }) {
  const { html, loading, error } = useRtdPage(url);

  if (!url) {
    return (
      <div className="mt-8 rounded-xl border border-black/10 bg-black/5 p-6 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/80">
        This lecture’s Read-the-Docs link isn’t set yet. Add a <code>url</code> in <code>MODULES</code>.
      </div>
    );
  }
  if (loading) return <div className="mt-8 text-slate-600 dark:text-white/70">Loading “{title}”…</div>;

  if (error || !html) {
    return (
      <div className="mt-8 rounded-xl overflow-hidden border border-black/10 dark:border-white/10">
        <iframe src={url} title={title} className="w-full" style={{ height: "calc(100vh - 180px)", border: 0 }} />
      </div>
    );
  }

  return (
    <div className="mt-8 mx-auto w-full max-w-5xl">
      <article className="prose prose-slate max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

/* 4) Page component */
export default function Lectures() {
  const boot = readHash();

  const [moduleId, setModuleId] = React.useState(
    MODULES.find(m => m.id === boot.moduleId)?.id || MODULES[0].id
  );

  const activeModule = MODULES.find(m => m.id === moduleId) || MODULES[0];

  const [lectureId, setLectureId] = React.useState(
    activeModule.lectures.find(l => l.id === boot.lectureId)?.id || activeModule.lectures[0]?.id
  );

  // keep hash synced
  React.useEffect(() => { writeHash(moduleId, lectureId); }, [moduleId, lectureId]);

  // react to browser back/forward
  React.useEffect(() => {
    function onHash() {
      const h = readHash();
      if (h.moduleId && h.moduleId !== moduleId) setModuleId(h.moduleId);
      if (h.lectureId && h.lectureId !== lectureId) setLectureId(h.lectureId);
    }
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [moduleId, lectureId]);

  // when module changes, default to its first lecture if current not present
  React.useEffect(() => {
    const mod = MODULES.find(m => m.id === moduleId);
    if (!mod) return;
    if (!mod.lectures.some(l => l.id === lectureId)) setLectureId(mod.lectures[0]?.id);
  }, [moduleId]); // eslint-disable-line

  // scroll to top on lecture change
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [lectureId]);

  const currentLecture = activeModule.lectures.find(l => l.id === lectureId);

  return (
    <Section eyebrow="Pick a Module" title="Lectures">
      <ModulePicker modules={MODULES} currentId={moduleId} onPick={id => setModuleId(id)} />
      <LecturesGrid lectures={activeModule.lectures} onOpen={id => setLectureId(id)} currentLectureId={lectureId} moduleId={module.id} />
      {currentLecture && <LectureViewer title={currentLecture.title} url={currentLecture.url} />}
    </Section>
  );
}
