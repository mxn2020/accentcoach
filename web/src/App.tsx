import { useState, useCallback } from 'react';
import { useAction, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const ACCENTS = ['American', 'British', 'Australian', 'Irish', 'Scottish', 'Canadian', 'South African', 'Indian'];

function CoachPage() {
  const [accent, setAccent] = useState('American'); const [text, setText] = useState(''); const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false); const [result, setResult] = useState<any>(null);
  const assess = useAction(api.ai.assessAccent); const save = useMutation(api.functions.saveAssessment);

  const handleAssess = useCallback(async () => {
    if (!text.trim()) return; setLoading(true);
    try {
      const r = await assess({ targetAccent: accent, spokenText: text.trim(), userDescription: desc || undefined }); setResult(r); await save({ targetAccent: accent, spokenText: text, userDescription: desc || undefined, ...r });
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, [accent, text, desc, assess, save]);

  return (
    <div className="mc"><div className="pg">
      <h1 className="title">Master Any <span className="a">Accent</span></h1>
      <p className="sub">Select a target accent, paste the text you spoke, and get pronunciation feedback with exercises.</p>
      <div className="chips">{ACCENTS.map(a => <button key={a} className={`chip ${accent === a ? 'sel' : ''}`} onClick={() => setAccent(a)}>{a}</button>)}</div>
      <textarea className="ta" value={text} onChange={e => setText(e.target.value)} placeholder="Paste the text you spoke (e.g. 'The rain in Spain stays mainly in the plain')" rows={3} />
      <input className="inp" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe how you think you sound (optional)" />
      <button className="btn" disabled={!text.trim() || loading} onClick={handleAssess}>{loading ? '⏳ Assessing...' : '🎙️ Assess Accent'}</button>
      {loading && <div className="ld"><span /><span /><span /></div>}
      {result && !loading && <>
        <div className="scores">
          <div className="score-card"><div className="score-val">{result.overallScore}</div><div className="score-label">Overall</div></div>
          <div className="score-card"><div className="score-val">{result.clarity}</div><div className="score-label">Clarity</div></div>
          <div className="score-card"><div className="score-val">{result.naturalness}</div><div className="score-label">Naturalness</div></div>
        </div>
        {result.issues?.map((issue: any, i: number) => (
          <div key={i} className="issue-card"><div className="issue-sound">🔊 {issue.sound}</div><div className="issue-problem">{issue.problem}</div><div className="issue-exercise">🏋️ Exercise: {issue.exercise}</div></div>
        ))}
        {result.tips?.length > 0 && <div className="tips"><strong>💡 Tips:</strong><br />{result.tips.map((t: string, i: number) => <div key={i}>• {t}</div>)}</div>}
      </>}
    </div></div>
  );
}

function App() {
  return (<BrowserRouter><div className="app">
    <header className="hdr"><a href="/"><span style={{ fontSize: '1.5rem' }}>🎙️</span><div><h1>AccentCoach</h1></div></a></header>
    <Routes><Route path="/" element={<CoachPage />} /></Routes>
    <footer className="ftr">© {new Date().getFullYear()} AccentCoach — An AVS Media App.</footer>
  </div></BrowserRouter>);
}
export default App;
