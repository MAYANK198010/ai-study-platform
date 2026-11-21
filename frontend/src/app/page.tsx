"use client";

import { useState } from "react";
import { ArrowRight, AudioLines, BookOpen, BrainCircuit, FileUp, Headphones, Languages, Library, LoaderCircle, Music2, Sparkles } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const tools = [
  { icon: AudioLines, title: "Study songs", detail: "Turn chapter content into memorable vocal-song lyrics." },
  { icon: BookOpen, title: "Smart notes", detail: "Create structured summaries and exam-ready notes." },
  { icon: BrainCircuit, title: "Flashcards & quizzes", detail: "Practice concepts with questions generated from your PDF." },
  { icon: Library, title: "Study library", detail: "Keep your documents and generated learning resources together." },
];

type Uploaded = { document_id: string; filename: string; pages: number; text: string; truncated: boolean };
type Lyrics = { title?: string; sections?: { type: string; lyrics: string; source_concepts?: string[] }[]; covered_concepts?: string[]; review_required?: boolean };

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [uploaded, setUploaded] = useState<Uploaded | null>(null);
  const [language, setLanguage] = useState("english");
  const [genre, setGenre] = useState("pop");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [lyrics, setLyrics] = useState<Lyrics | null>(null);

  async function uploadPdf() {
    if (!file) return;
    setBusy(true); setError(""); setLyrics(null);
    try {
      if (!API) throw new Error("The study API is not connected yet. Configure NEXT_PUBLIC_API_BASE_URL after deploying the backend.");
      const body = new FormData(); body.append("file", file);
      const response = await fetch(API + "/documents", { method: "POST", body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "PDF upload failed");
      setUploaded(data);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not connect to the API"); }
    finally { setBusy(false); }
  }

  async function createLyrics() {
    if (!uploaded) return;
    setBusy(true); setError("");
    try {
      if (!API) throw new Error("The study API is not connected yet. Configure NEXT_PUBLIC_API_BASE_URL after deploying the backend.");
      const response = await fetch(API + "/songs/lyrics", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: uploaded.filename.replace(/\.pdf$/i, ""), source_text: uploaded.text.slice(0, 30000), language, genre }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Lyrics generation failed");
      setLyrics(data);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not generate lyrics"); }
    finally { setBusy(false); }
  }

  return <main className="min-h-screen">
    <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6"><a href="/" className="flex items-center gap-3 font-semibold"><span className="gradient rounded-xl p-2"><Headphones size={22}/></span>StudyWave AI</a><span className="muted text-sm">AI-powered learning workspace</span></header>
    <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-16 pt-12 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
      <div><div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-4 py-2 text-sm text-violet-200"><Sparkles size={15}/> Learn through sound, structure and practice</div><h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight md:text-6xl">Your study material. <span className="bg-gradient-to-r from-violet-300 to-blue-300 bg-clip-text text-transparent">A new way to learn.</span></h1><p className="muted mt-6 max-w-xl text-lg leading-8">Upload a chapter and create a learning workspace with AI-generated lyrics, vocal-song workflows, summaries and revision tools.</p><div className="mt-8 flex flex-wrap gap-5 text-sm muted"><span className="flex items-center gap-2"><Languages size={16}/> English · Hindi · Hinglish</span><span className="flex items-center gap-2"><Music2 size={16}/> Study songs and revision</span></div></div>
      <div id="create" className="glass p-6 shadow-2xl shadow-violet-950/30"><div className="flex items-center justify-between"><div><p className="text-sm muted">START A STUDY PROJECT</p><h2 className="mt-1 text-2xl font-semibold">Create from a PDF</h2></div><span className="rounded-xl bg-violet-400/10 p-3 text-violet-300"><FileUp/></span></div>
        <label className="mt-7 block cursor-pointer rounded-2xl border border-dashed border-slate-600 bg-slate-950/40 p-8 text-center hover:border-violet-400"><FileUp className="mx-auto text-violet-300" size={34}/><p className="mt-4 font-medium">{file ? file.name : "Choose a chapter PDF"}</p><p className="muted mt-2 text-sm">PDF only · Maximum size set by server</p><input className="sr-only" type="file" accept="application/pdf,.pdf" onChange={e => { setFile(e.target.files?.[0] || null); setUploaded(null); setLyrics(null); setError(""); }}/></label>
        <button disabled={!file || busy} onClick={uploadPdf} className="gradient mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-50">{busy ? <LoaderCircle className="animate-spin" size={18}/> : <FileUp size={18}/>} Upload and extract text</button>
        {uploaded && <div className="mt-5 rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-4"><p className="font-medium text-emerald-200">PDF processed: {uploaded.pages} pages</p><p className="muted mt-1 text-xs">{uploaded.truncated ? "Preview limited to first 100,000 characters." : "Text extraction complete."}</p><label className="mt-4 block text-xs muted">LANGUAGE<select className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-sm text-white" value={language} onChange={e=>setLanguage(e.target.value)}><option value="english">English</option><option value="hindi">Hindi</option><option value="hinglish">Hinglish</option></select></label><label className="mt-3 block text-xs muted">MUSIC STYLE<select className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-sm text-white" value={genre} onChange={e=>setGenre(e.target.value)}><option value="pop">Pop</option><option value="hip_hop">Hip-hop</option><option value="lofi">Lo-fi</option><option value="acoustic">Acoustic</option><option value="electronic">Electronic</option></select></label><button disabled={busy} onClick={createLyrics} className="gradient mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold disabled:opacity-50">{busy ? <LoaderCircle className="animate-spin" size={18}/> : <Sparkles size={18}/>} Generate study lyrics <ArrowRight size={16}/></button></div>}
        {error && <p role="alert" className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
      </div>
    </section>
    {lyrics && <section className="mx-auto max-w-7xl px-6 pb-12"><div className="glass p-6"><div className="flex items-center gap-2 text-violet-200"><AudioLines size={20}/> LYRICS PREVIEW</div><h2 className="mt-2 text-2xl font-semibold">{lyrics.title || "Your study song"}</h2><p className="muted mt-1 text-sm">Review educational accuracy before sending lyrics to a music provider.</p><div className="mt-5 grid gap-4 md:grid-cols-2">{(lyrics.sections || []).map((section,i)=><article key={i} className="rounded-xl bg-slate-900/80 p-4"><p className="text-xs font-semibold uppercase tracking-wider text-violet-300">{section.type}</p><p className="mt-3 whitespace-pre-wrap leading-7">{section.lyrics}</p>{section.source_concepts?.length ? <p className="muted mt-3 text-xs">Concepts: {section.source_concepts.join(", ")}</p> : null}</article>)}</div><p className="muted mt-5 text-xs">Covered concepts: {(lyrics.covered_concepts || []).join(" · ") || "Not supplied"}</p></div></section>}
    <section id="tools" className="mx-auto max-w-7xl px-6 pb-24"><div className="mb-8"><p className="text-sm font-semibold uppercase tracking-widest text-violet-300">One learning workspace</p><h2 className="mt-2 text-3xl font-bold">Study tools, connected to your source</h2></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{tools.map(({icon:Icon,title,detail})=><article key={title} className="glass p-5"><span className="inline-flex rounded-xl bg-violet-400/10 p-3 text-violet-300"><Icon size={22}/></span><h3 className="mt-4 font-semibold">{title}</h3><p className="muted mt-2 text-sm leading-6">{detail}</p></article>)}</div></section>
    <footer className="border-t border-slate-800 px-6 py-7 text-center text-sm muted">StudyWave AI · Build understanding, then revise with confidence.</footer>
  </main>;
}
