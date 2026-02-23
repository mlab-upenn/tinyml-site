// src/Lectures.jsx
import React from "react";

/* 0) CONFIG */
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

const TUTORIALS_SHEET_ID = "1L6WLGM4y5ixp6EG2TJ875FnBK7vz_sGov1brZ-8NcyA";
const TUTORIALS_TAB = "Tutorials";
const API_KEY = "AIzaSyCjjW3RjE6y026TTk3qLXDEs-i6RWor30g";

/* 1) URL-hash helpers */
function readHash() {
  const h = (window.location.hash || "").replace(/^#/, "");
  const [moduleId, lectureId] = h.split("/");
  return { moduleId, lectureId };
}
function writeHash(moduleId, lectureId) {
  const next = `#${moduleId || ""}${lectureId ? `/${lectureId}` : ""}`;
  if (window.location.hash !== next) window.location.hash = next;
}

/* 2) Fetch tutorials from Google Sheet */
function useTutorials() {
  const [tutorials, setTutorials] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  React.useEffect(() => {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${TUTORIALS_SHEET_ID}?includeGridData=true&ranges=${encodeURIComponent(TUTORIALS_TAB + "!A:C")}&key=${API_KEY}`;
    fetch(url)
      .then(r => r.json())
      .then(data => {
        const rows = data?.sheets?.[0]?.data?.[0]?.rowData || [];
        const headers = rows[0]?.values?.map(c => c?.formattedValue || "") || [];
        const items = rows.slice(1).map(row => {
          const vals = row?.values || [];
          const obj = {};
          headers.forEach((h, i) => {
            obj[h] = vals[i]?.hyperlink || vals[i]?.formattedValue || "";
          });
          return obj;
        }).filter(r => r.Name);
        setTutorials(items);
        setLoading(false);
      })
      .catch(e => { setError(String(e)); setLoading(false); });
  }, []);
  return { tutorials, loading, error };
}

/* 3) Fetch + sanitize RTD page */
function useRtdPage(url) {
  const [html, setHtml] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!url) { setHtml(""); setError(""); setLoading(false); return; }
    let alive = true;
    const bust = `?v=${Math.floor(Date.now() / (5 * 60 * 1000))}`;
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

  main.querySelectorAll("nav,header,footer,.sphinxsidebar,.wy-nav-side,.toc,.related").forEach(n => n.remove());
  main.querySelectorAll("a.headerlink,[title^='Permalink']").forEach(n => n.remove());
  main.querySelectorAll("script,style").forEach(n => n.remove());

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

/* 4) UI components */
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
  const getModuleNum = (id) => { const match = id.match(/\d+/); return match ? parseInt(match[0]) : 1; };
  const COLOR = {
    1: { base: "bg-[#F2FCF7] border-[#D2F1E4] text-slate-700", active: "bg-[#DFF7EC] border-[#81D7B5] text-slate-900" },
    2: { base: "bg-[#E6F7EC] border-[#C8EBDD] text-slate-700", active: "bg-[#CFF0DF] border-[#75CDA5] text-slate-900" },
    3: { base: "bg-[#D8F2E2] border-[#B6E1CB] text-slate-700", active: "bg-[#BFE9D2] border-[#5FC598] text-slate-900" },
  };
  return (
    <div className="flex flex-wrap gap-2">
      {modules.map((m) => {
        const num = getModuleNum(m.id);
        const palette = COLOR[num];
        return (
          <button key={m.id} onClick={() => onPick(m.id)}
            className={`rounded-xl px-4 py-1.5 text-sm border transition ${currentId === m.id ? palette.active : palette.base}`}>
            {m.title}
          </button>
        );
      })}
    </div>
  );
}

function LecturesGrid({ lectures, onOpen, currentLectureId, moduleId }) {
  const match = moduleId.match(/\d+/);
  const num = match ? parseInt(match[0]) : 1;
  const COLOR = {
    1: { base: "bg-[#F2FCF7] border-[#D2F1E4]", active: "bg-[#DFF7EC] border-[#81D7B5]" },
    2: { base: "bg-[#E6F7EC] border-[#C8EBDD]", active: "bg-[#CFF0DF] border-[#75CDA5]" },
    3: { base: "bg-[#D8F2E2] border-[#B6E1CB]", active: "bg-[#BFE9D2] border-[#5FC598]" },
  };
  const color = COLOR[num] || COLOR[1];
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {lectures.map(lec => (
        <button key={lec.id} onClick={() => onOpen(lec.id)}
          className={`rounded-xl p-4 text-left border transition ${currentLectureId === lec.id ? color.active : color.base}`}>
          <div className="text-sm text-slate-600">{lec.id.replace(/^lec/i, "Lecture ")}</div>
          <div className="mt-1 font-semibold text-slate-900">{lec.title}</div>
        </button>
      ))}
    </div>
  );
}

function LectureViewer({ title, url }) {
  const { html, loading, error } = useRtdPage(url);
  if (!url) {
    return (
      <div className="mt-8 rounded-xl border border-black/10 bg-black/5 p-6 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/80">
        This lecture's Read-the-Docs link isn't set yet. Add a <code>url</code> in <code>MODULES</code>.
      </div>
    );
  }
  if (loading) return <div className="mt-8 text-slate-600 dark:text-white/70">Loading "{title}"…</div>;
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

function TutorialsTab() {
  const { tutorials, loading, error } = useTutorials();
  if (loading) return <div className="mt-8 text-slate-600 dark:text-white/70">Loading tutorials…</div>;
  if (error) return <div className="mt-8 text-rose-600">Error: {error}</div>;
  if (!tutorials.length) return <div className="mt-8 text-slate-600 dark:text-white/70">No tutorials yet — add a row to the Tutorials sheet and it will appear here.</div>;
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {tutorials.map((t, i) => (
        <a key={i} href={t.URL} target="_blank" rel="noreferrer"
          className="rounded-xl p-4 border border-[#D2F1E4] bg-[#F2FCF7] hover:bg-[#DFF7EC] transition block">
          <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Tutorial</div>
          <div className="font-semibold text-slate-900">{t.Name}</div>
          {t.Description && <div className="mt-1 text-sm text-slate-600">{t.Description}</div>}
        </a>
      ))}
    </div>
  );
}

/* 5) Page component */
export default function Lectures() {
  const boot = readHash();
  const [tab, setTab] = React.useState("lectures");
  const [moduleId, setModuleId] = React.useState("module1");
  const activeModule = MODULES.find(m => m.id === moduleId) || MODULES[0];
  const [lectureId, setLectureId] = React.useState(
    activeModule.lectures.find(l => l.id === boot.lectureId)?.id || "lec1"
  );

  React.useEffect(() => { writeHash(moduleId, lectureId); }, [moduleId, lectureId]);

  React.useEffect(() => {
    function onHash() {
      const h = readHash();
      if (h.moduleId && h.moduleId !== moduleId) setModuleId(h.moduleId);
      if (h.lectureId && h.lectureId !== lectureId) setLectureId(h.lectureId);
    }
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [moduleId, lectureId]);

  React.useEffect(() => {
    const mod = MODULES.find(m => m.id === moduleId);
    if (!mod) return;
    if (!mod.lectures.some(l => l.id === lectureId)) setLectureId(mod.lectures[0]?.id);
  }, [moduleId]); // eslint-disable-line

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [lectureId]);

  const currentLecture = activeModule.lectures.find(l => l.id === lectureId);

  return (
    <Section eyebrow="Course Content" title="Lectures">
      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab("lectures")}
          className={`rounded-xl px-4 py-1.5 text-sm border transition ${tab === "lectures" ? "bg-[#DFF7EC] border-[#81D7B5] text-slate-900" : "bg-[#F2FCF7] border-[#D2F1E4] text-slate-700"}`}>
          Lectures
        </button>
        <button onClick={() => setTab("tutorials")}
          className={`rounded-xl px-4 py-1.5 text-sm border transition ${tab === "tutorials" ? "bg-[#DFF7EC] border-[#81D7B5] text-slate-900" : "bg-[#F2FCF7] border-[#D2F1E4] text-slate-700"}`}>
          Tutorials
        </button>
      </div>

      {tab === "lectures" && <>
        <ModulePicker modules={MODULES} currentId={moduleId} onPick={id => setModuleId(id)} />
        <LecturesGrid lectures={activeModule.lectures} onOpen={id => setLectureId(id)} currentLectureId={lectureId} moduleId={activeModule.id} />
        {currentLecture && <LectureViewer title={currentLecture.title} url={currentLecture.url} />}
      </>}

      {tab === "tutorials" && <TutorialsTab />}
    </Section>
  );
}
