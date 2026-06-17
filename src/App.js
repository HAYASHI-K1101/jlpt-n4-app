import { useState } from "react";

const CODES = {
  "ADMIN-9999": { role: "admin" },
  "JLPT-2024": { role: "member" },
  "JLPT-ABCD": { role: "member" },
  "JLPT-XY12": { role: "member" },
};

const initMembers = [
  { id:1, name:"田中 太郎", bg:"#EEEDFE", tc:"#534AB7", init:"田", active:true, days:14, words:312, sc:68, vp:52, gp:38, rp:25, cp:60, last:"今日", sess:42 },
  { id:2, name:"Kim Jiyeon", bg:"#E1F5EE", tc:"#0F6E56", init:"K", active:true, days:21, words:390, sc:74, vp:65, gp:55, rp:42, cp:72, last:"昨日", sess:58 },
  { id:3, name:"Chen Wei", bg:"#FAECE7", tc:"#993C1D", init:"C", active:false, days:7, words:210, sc:55, vp:35, gp:20, rp:18, cp:40, last:"3日前", sess:21 },
];

const initInvites = [
  { code:"JLPT-2024", used:true, by:"田中 太郎", dt:"2024-01-10" },
  { code:"JLPT-ABCD", used:true, by:"Kim Jiyeon", dt:"2024-01-12" },
  { code:"JLPT-XY12", used:true, by:"Chen Wei", dt:"2024-01-15" },
  { code:"JLPT-NEW1", used:false, by:null, dt:"2024-01-20" },
];

const chatReplies = [
  "いいですね！「〜てから」を使った例文を作ってみましょう。",
  "上手です！「〜なければならない」も練習してみてください。",
  "すばらしい！文法も正確です。続けましょう！",
  "「〜ている」と「〜ていた」の違いはわかりますか？",
];

const KANJI = [
  ["食","た.べる","食べる"],["飲","の.む","飲む"],["行","い.く","行く"],
  ["来","く.る","来る"],["見","み.る","見る"],["聞","き.く","聞く"],
  ["書","か.く","書く"],["読","よ.む","読む"],
];

const GRAMMAR = [
  ["〜ている","進行・継続","今、ごはんを食べています。","#E1F5EE","#0F6E56","習得済み"],
  ["〜てから","〜した後に","宿題をしてから、テレビを見ます。","#EEEDFE","#534AB7","復習中"],
  ["〜なければならない","義務・必要","薬を飲まなければなりません。","#F1EFE8","#444441","未学習"],
];

function ProgressBar({ pct, color }) {
  return (
    <div style={{ background:"#f3f3f3", borderRadius:4, height:6 }}>
      <div style={{ width:`${pct}%`, height:6, borderRadius:4, background:color, transition:"width 0.4s" }} />
    </div>
  );
}

function Avatar({ m, size=32 }) {
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:m.bg, color:m.tc,
      display:"flex", alignItems:"center", justifyContent:"center", fontSize:size<28?10:11, fontWeight:500, flexShrink:0 }}>
      {m.init}
    </div>
  );
}

function Tag({ label, bg, color }) {
  return <span style={{ fontSize:10, padding:"1px 7px", borderRadius:20, fontWeight:500, background:bg, color }}>{label}</span>;
}

function Metric({ label, value, sub }) {
  return (
    <div style={{ background:"#f7f7f7", borderRadius:8, padding:"12px 14px" }}>
      <div style={{ fontSize:11, color:"#888", marginBottom:3 }}>{label}</div>
      <div style={{ fontSize:22, fontWeight:600, color:"#111" }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:"#888", marginTop:2 }}>{sub}</div>}
    </div>
  );
}

function SectionBar({ sections }) {
  return (
    <div>
      {sections.map(([l,p,c]) => (
        <div key={l} style={{ marginBottom:8 }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:3 }}>
            <span style={{ color:"#777" }}>{l}</span>
            <span style={{ color:"#333" }}>{p}%</span>
          </div>
          <ProgressBar pct={p} color={c} />
        </div>
      ))}
    </div>
  );
}

// ── Pages ─────────────────────────────────────────────────────────────────────

function PageAdminDash({ members, onDetail }) {
  const ac = members.filter(m=>m.active).length;
  const avg = Math.round(members.reduce((s,m)=>s+m.sc,0)/members.length);
  return (
    <div>
      <div style={{ fontSize:14, fontWeight:600, marginBottom:12, display:"flex", alignItems:"center", gap:6 }}>
        ダッシュボード
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:14 }}>
        <Metric label="総メンバー" value={members.length} sub="招待済み" />
        <Metric label="アクティブ" value={ac} sub="今週" />
        <Metric label="平均スコア" value={`${avg}%`} sub="全体" />
      </div>
      <div style={{ background:"#fff", border:"0.5px solid #e0e0e0", borderRadius:12, padding:14 }}>
        <div style={{ fontSize:13, fontWeight:600, marginBottom:10, color:"#111" }}>メンバー進捗</div>
        {members.map(m => (
          <div key={m.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:"0.5px solid #eee" }}>
            <Avatar m={m} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                <span style={{ fontSize:13, fontWeight:500, color:"#111" }}>{m.name}</span>
                <span style={{ fontSize:12, color:"#777" }}>{m.sc}%</span>
              </div>
              <ProgressBar pct={m.sc} color={m.tc} />
            </div>
            <Tag label={m.active?"活動中":"未活動"} bg={m.active?"#E1F5EE":"#f1f1f1"} color={m.active?"#0F6E56":"#555"} />
            <button onClick={()=>onDetail(m.id)} style={{ fontSize:11, padding:"4px 10px", borderRadius:6, border:"0.5px solid #ccc", background:"none", cursor:"pointer" }}>詳細</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PageAdminMembers({ members, onDetail, onReset }) {
  return (
    <div>
      <div style={{ fontSize:14, fontWeight:600, marginBottom:12 }}>メンバー管理</div>
      <div style={{ background:"#fff", border:"0.5px solid #e0e0e0", borderRadius:12, padding:14 }}>
        {members.map(m => (
          <div key={m.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 0", borderBottom:"0.5px solid #eee" }}>
            <Avatar m={m} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:500, color:"#111" }}>{m.name}</div>
              <div style={{ fontSize:11, color:"#888" }}>最終: {m.last} / {m.words}語 / {m.sess}セッション</div>
            </div>
            <Tag label={m.active?"活動中":"未活動"} bg={m.active?"#E1F5EE":"#f1f1f1"} color={m.active?"#0F6E56":"#555"} />
            <button onClick={()=>onDetail(m.id)} style={{ fontSize:11, padding:"4px 10px", borderRadius:6, border:"0.5px solid #ccc", background:"none", cursor:"pointer", marginLeft:4 }}>詳細</button>
            <button onClick={()=>onReset(m.id)} style={{ fontSize:11, padding:"4px 10px", borderRadius:6, border:"0.5px solid #fca5a5", background:"none", cursor:"pointer", color:"#dc2626" }}>リセット</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PageAdminInvites({ invites, onGen }) {
  const unused = invites.filter(i=>!i.used).length;
  return (
    <div>
      <div style={{ fontSize:14, fontWeight:600, marginBottom:12 }}>招待コード管理</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
        <Metric label="発行済み" value={invites.length} />
        <Metric label="未使用" value={unused} />
      </div>
      <div style={{ background:"#fff", border:"0.5px solid #e0e0e0", borderRadius:12, padding:14 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <span style={{ fontSize:13, fontWeight:600, color:"#111" }}>コード一覧</span>
          <button onClick={onGen} style={{ fontSize:12, padding:"5px 12px", borderRadius:6, border:"0.5px solid #ccc", background:"none", cursor:"pointer" }}>+ 新規発行</button>
        </div>
        {invites.map(inv => (
          <div key={inv.code} style={{ display:"flex", alignItems:"center", padding:"9px 0", borderBottom:"0.5px solid #eee", fontSize:13 }}>
            <span style={{ fontFamily:"monospace", fontSize:13, letterSpacing:2, background:"#f5f5f5", padding:"4px 10px", borderRadius:6, color:"#111" }}>{inv.code}</span>
            <div style={{ flex:1, margin:"0 12px" }}>
              {inv.used
                ? <><Tag label="使用済み" bg="#E1F5EE" color="#0F6E56" /> <span style={{ fontSize:12, color:"#777", marginLeft:4 }}>{inv.by}</span></>
                : <Tag label="未使用" bg="#EEEDFE" color="#534AB7" />}
            </div>
            <span style={{ fontSize:11, color:"#aaa" }}>{inv.dt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PageMemberDetail({ member, onBack, onReset }) {
  return (
    <div>
      <div style={{ fontSize:14, fontWeight:600, marginBottom:12, display:"flex", alignItems:"center", gap:8 }}>
        <button onClick={onBack} style={{ fontSize:11, padding:"4px 8px", borderRadius:6, border:"0.5px solid #ccc", background:"none", cursor:"pointer" }}>← 戻る</button>
        <Avatar m={member} size={26} />
        {member.name} の詳細レポート
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
        <Metric label="総合スコア" value={`${member.sc}%`} />
        <Metric label="習得単語" value={`${member.words}語`} />
        <Metric label="学習日数" value={`${member.days}日`} />
        <Metric label="セッション" value={`${member.sess}回`} />
      </div>
      <div style={{ background:"#fff", border:"0.5px solid #e0e0e0", borderRadius:12, padding:14, marginBottom:12 }}>
        <div style={{ fontSize:13, fontWeight:600, marginBottom:10, color:"#111" }}>セクション別進捗</div>
        <SectionBar sections={[["単語・漢字",member.vp,"#7F77DD"],["文法",member.gp,"#1D9E75"],["読解",member.rp,"#D85A30"],["会話",member.cp,"#EF9F27"]]} />
      </div>
      <div style={{ background:"#fff", border:"0.5px solid #e0e0e0", borderRadius:12, padding:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:13, fontWeight:600, color:"#111" }}>学習データのリセット</div>
          <div style={{ fontSize:11, color:"#888", marginTop:2 }}>全進捗・スコアを初期化します</div>
        </div>
        <button onClick={()=>onReset(member.id)} style={{ fontSize:12, padding:"6px 12px", borderRadius:6, border:"0.5px solid #fca5a5", background:"none", cursor:"pointer", color:"#dc2626" }}>🗑 リセット</button>
      </div>
    </div>
  );
}

function PageMemberDash({ user }) {
  const u = user;
  return (
    <div>
      <div style={{ fontSize:14, fontWeight:600, marginBottom:12 }}>学習ダッシュボード</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:14 }}>
        <Metric label="学習日数" value={14} sub="連続" />
        <Metric label="習得単語" value={312} sub="/ 600語" />
        <Metric label="総合スコア" value="68%" sub="前回 +4%" />
      </div>
      <div style={{ background:"#fff", border:"0.5px solid #e0e0e0", borderRadius:12, padding:14 }}>
        <div style={{ fontSize:13, fontWeight:600, marginBottom:10, color:"#111" }}>セクション別進捗</div>
        <SectionBar sections={[["単語・漢字",52,"#7F77DD"],["文法",38,"#1D9E75"],["読解",25,"#D85A30"],["会話",60,"#EF9F27"]]} />
      </div>
    </div>
  );
}

function PageVocab() {
  const [revealed, setRevealed] = useState({});
  return (
    <div>
      <div style={{ fontSize:14, fontWeight:600, marginBottom:12 }}>単語・漢字</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
        {KANJI.map(([c,r,m],i) => (
          <div key={i} onClick={()=>setRevealed(prev=>({...prev,[i]:!prev[i]}))}
            style={{ background:"#fff", border:"0.5px solid #e0e0e0", borderRadius:12, padding:12, textAlign:"center", cursor:"pointer" }}>
            <div style={{ fontSize:28, color:"#111" }}>{c}</div>
            {revealed[i] && <>
              <div style={{ fontSize:11, color:"#534AB7", marginTop:4 }}>{r}</div>
              <div style={{ fontSize:11, color:"#888" }}>{m}</div>
            </>}
          </div>
        ))}
      </div>
      <div style={{ fontSize:11, color:"#aaa", marginTop:8, textAlign:"center" }}>タップして読み方を確認</div>
    </div>
  );
}

function PageGrammar() {
  return (
    <div>
      <div style={{ fontSize:14, fontWeight:600, marginBottom:12 }}>文法練習</div>
      {GRAMMAR.map(([p,d,e,bg,tc,l]) => (
        <div key={p} style={{ background:"#fff", border:"0.5px solid #e0e0e0", borderRadius:12, padding:14, marginBottom:8 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
            <span style={{ fontSize:15, fontWeight:600, color:"#534AB7" }}>{p}</span>
            <Tag label={l} bg={bg} color={tc} />
          </div>
          <div style={{ fontSize:12, color:"#888", marginBottom:6 }}>{d}</div>
          <div style={{ fontSize:13, background:"#f7f7f7", padding:"8px 10px", borderRadius:8, color:"#111" }}>{e}</div>
        </div>
      ))}
    </div>
  );
}

function PageReading() {
  const [chosen, setChosen] = useState(null);
  const opts = ["６時","７時半","８時","９時"];
  const correct = "７時半";
  return (
    <div>
      <div style={{ fontSize:14, fontWeight:600, marginBottom:12 }}>読解問題</div>
      <div style={{ background:"#fff", border:"0.5px solid #e0e0e0", borderRadius:12, padding:14 }}>
        <div style={{ background:"#f7f7f7", padding:12, borderRadius:8, fontSize:13, lineHeight:1.7, marginBottom:12 }}>
          田中さんは毎朝６時に起きます。朝ごはんを食べてから、７時半に家を出ます。電車で会社まで３０分かかります。
        </div>
        <div style={{ fontSize:14, fontWeight:500, marginBottom:10, color:"#111" }}>田中さんは何時に家を出ますか？</div>
        {opts.map(o => {
          const isChosen = chosen===o, isCorrect = o===correct;
          let bg="#f7f7f7", border="0.5px solid #e0e0e0", color="#111";
          if(chosen) { if(isChosen&&isCorrect){bg="#EAF3DE";border="0.5px solid #639922";color="#3B6D11";}
            else if(isChosen&&!isCorrect){bg="#FCEBEB";border="0.5px solid #A32D2D";color="#791F1F";} }
          return (
            <button key={o} disabled={!!chosen} onClick={()=>setChosen(o)}
              style={{ width:"100%", textAlign:"left", padding:"9px 12px", borderRadius:8, fontSize:13, marginBottom:6, cursor:chosen?"default":"pointer", background:bg, border, color }}>
              {o}
            </button>
          );
        })}
        {chosen && <div style={{ fontSize:13, padding:"8px 12px", borderRadius:8, marginTop:4,
          background:chosen===correct?"#EAF3DE":"#FCEBEB", color:chosen===correct?"#3B6D11":"#791F1F" }}>
          {chosen===correct?"✅ 正解！「７時半に家を出ます」が答えです。":"❌ 不正解。文章をもう一度読みましょう。"}
        </div>}
      </div>
    </div>
  );
}

function PageChat() {
  const [msgs, setMsgs] = useState([{ role:"ai", text:"こんにちは！今日は何を練習しますか？" }]);
  const [input, setInput] = useState("");
  const [idx, setIdx] = useState(0);
  const send = () => {
    if(!input.trim()) return;
    const userMsg = { role:"user", text:input };
    setMsgs(prev=>[...prev, userMsg]);
    setInput("");
    setTimeout(()=>{
      setMsgs(prev=>[...prev,{role:"ai",text:chatReplies[idx%chatReplies.length]}]);
      setIdx(i=>i+1);
    }, 500);
  };
  return (
    <div>
      <div style={{ fontSize:14, fontWeight:600, marginBottom:12 }}>AI会話練習</div>
      <div style={{ background:"#fff", border:"0.5px solid #e0e0e0", borderRadius:12, padding:14 }}>
        <div style={{ fontSize:11, color:"#aaa", marginBottom:8 }}>テーマ: 日常会話 / 旅行 / 買い物</div>
        <div style={{ maxHeight:200, overflowY:"auto", display:"flex", flexDirection:"column", gap:8, marginBottom:10 }}>
          {msgs.map((m,i)=>(
            <div key={i} style={{ maxWidth:"80%", padding:"8px 12px", borderRadius:12, fontSize:13, lineHeight:1.5,
              alignSelf:m.role==="ai"?"flex-start":"flex-end",
              background:m.role==="ai"?"#f5f5f5":"#7F77DD",
              color:m.role==="ai"?"#111":"#EEEDFE",
              borderBottomLeftRadius:m.role==="ai"?3:12,
              borderBottomRightRadius:m.role==="user"?3:12 }}>
              {m.text}
            </div>
          ))}
        </div>
        <div style={{ display:"flex", gap:8, paddingTop:8, borderTop:"0.5px solid #eee" }}>
          <input value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&send()}
            placeholder="日本語で入力..." style={{ flex:1, fontSize:13, padding:"7px 10px", border:"0.5px solid #ddd", borderRadius:6 }} />
          <button onClick={send} style={{ background:"#7F77DD", color:"white", border:"none", borderRadius:6, padding:"0 14px", cursor:"pointer" }}>送信</button>
        </div>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────

export default function App() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [page, setPage] = useState("dash");
  const [members, setMembers] = useState(initMembers);
  const [invites, setInvites] = useState(initInvites);
  const [detailId, setDetailId] = useState(null);
  const [resetId, setResetId] = useState(null);
  const [toast, setToast] = useState("");

  const login = () => {
    if(!name.trim()){setErr("名前を入力してください");return;}
    const c=code.trim().toUpperCase();
    if(!CODES[c]){setErr("招待コードが正しくありません");return;}
    setErr("");
    setUser({name:name.trim(),role:CODES[c].role,code:c});
    setPage(CODES[c].role==="admin"?"adash":"mdash");
  };

  const logout = () => {setUser(null);setName("");setCode("");setPage("dash");setDetailId(null);};

  const showToast = (msg) => {setToast(msg);setTimeout(()=>setToast(""),3000);};

  const doReset = (id) => {
    const m = members.find(x=>x.id===id);
    setMembers(prev=>prev.map(x=>x.id===id?{...x,sc:0,words:0,days:0,vp:0,gp:0,rp:0,cp:0,sess:0,active:false}:x));
    setResetId(null);setDetailId(null);
    setPage("amembers");
    showToast(`${m.name} のデータをリセットしました`);
  };

  const genCode = () => {
    const chars="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let cd="JLPT-";for(let i=0;i<4;i++)cd+=chars[Math.floor(Math.random()*chars.length)];
    setInvites(prev=>[...prev,{code:cd,used:false,by:null,dt:new Date().toISOString().slice(0,10)}]);
  };

  const adminNav = [
    {id:"adash",label:"ダッシュボード"},
    {id:"amembers",label:"メンバー管理"},
    {id:"ainvites",label:"招待コード"},
    {id:"sep"},
    {id:"mdash",label:"学習プレビュー"},
  ];
  const memberNav = [
    {id:"mdash",label:"ダッシュボード"},
    {id:"vocab",label:"単語・漢字"},
    {id:"grammar",label:"文法"},
    {id:"reading",label:"読解"},
    {id:"chat",label:"会話練習"},
  ];
  const navItems = user?.role==="admin" ? adminNav : memberNav;

  const renderPage = () => {
    if(detailId) {
      const m = members.find(x=>x.id===detailId);
      return <PageMemberDetail member={m} onBack={()=>setDetailId(null)} onReset={id=>{setResetId(id);}} />;
    }
    if(page==="adash") return <PageAdminDash members={members} onDetail={id=>{setDetailId(id);}} />;
    if(page==="amembers") return <PageAdminMembers members={members} onDetail={id=>{setDetailId(id);}} onReset={id=>setResetId(id)} />;
    if(page==="ainvites") return <PageAdminInvites invites={invites} onGen={genCode} />;
    if(page==="mdash") return <PageMemberDash user={user} />;
    if(page==="vocab") return <PageVocab />;
    if(page==="grammar") return <PageGrammar />;
    if(page==="reading") return <PageReading />;
    if(page==="chat") return <PageChat />;
    return null;
  };

  if(!user) return (
    <div style={{ minHeight:540, display:"flex", alignItems:"center", justifyContent:"center", background:"#f9f9f7", borderRadius:12, padding:20 }}>
      <div style={{ maxWidth:320, width:"100%", textAlign:"center" }}>
        <div style={{ fontSize:26, fontWeight:700, marginBottom:4 }}>JLPT N4</div>
        <div style={{ fontSize:13, color:"#888", marginBottom:24 }}>招待制学習プラットフォーム</div>
        <div style={{ background:"#fff", border:"0.5px solid #e0e0e0", borderRadius:12, padding:18, textAlign:"left" }}>
          <div style={{ fontSize:12, color:"#888", marginBottom:5 }}>お名前</div>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="例: 田中 太郎"
            style={{ width:"100%", marginBottom:12, padding:"8px 10px", border:"0.5px solid #ddd", borderRadius:6, fontSize:13 }} />
          <div style={{ fontSize:12, color:"#888", marginBottom:5 }}>招待コード</div>
          <input value={code} onChange={e=>setCode(e.target.value)} placeholder="例: JLPT-2024"
            onKeyDown={e=>e.key==="Enter"&&login()}
            style={{ width:"100%", marginBottom:4, padding:"8px 10px", border:"0.5px solid #ddd", borderRadius:6, fontSize:13, fontFamily:"monospace", letterSpacing:2 }} />
          {err && <div style={{ fontSize:11, color:"#dc2626", minHeight:16, marginBottom:4 }}>{err}</div>}
          <button onClick={login} style={{ width:"100%", padding:"10px", background:"#7F77DD", color:"white", border:"none", borderRadius:8, fontSize:14, cursor:"pointer", marginTop:4 }}>ログイン</button>
          <div style={{ textAlign:"center", marginTop:10, fontSize:11, color:"#bbb" }}>
            管理者: <code>ADMIN-9999</code> &nbsp;|&nbsp; 学習者: <code>JLPT-2024</code>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ background:"#f9f9f7", borderRadius:12, overflow:"hidden", minHeight:540, position:"relative" }}>
      {toast && <div style={{ position:"absolute", bottom:16, right:16, background:"#EAF3DE", color:"#3B6D11", border:"0.5px solid #639922", borderRadius:8, padding:"10px 16px", fontSize:13, zIndex:50 }}>{toast}</div>}
      {resetId && (
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.35)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:40, borderRadius:12 }}>
          <div style={{ background:"#fff", border:"0.5px solid #ddd", borderRadius:12, padding:22, maxWidth:280, width:"100%", textAlign:"center" }}>
            <div style={{ fontSize:28, marginBottom:8 }}>⚠️</div>
            <div style={{ fontSize:14, fontWeight:600, marginBottom:6 }}>{members.find(m=>m.id===resetId)?.name} のデータをリセット</div>
            <div style={{ fontSize:12, color:"#888", marginBottom:16 }}>全ての学習進捗が削除されます。この操作は取り消せません。</div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={()=>setResetId(null)} style={{ flex:1, padding:"8px", border:"0.5px solid #ddd", borderRadius:6, background:"none", cursor:"pointer" }}>キャンセル</button>
              <button onClick={()=>doReset(resetId)} style={{ flex:1, padding:"8px", border:"0.5px solid #fca5a5", borderRadius:6, background:"none", cursor:"pointer", color:"#dc2626" }}>実行</button>
            </div>
          </div>
        </div>
      )}
      <div style={{ background:"#fff", borderBottom:"0.5px solid #eee", padding:"10px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ fontSize:15, fontWeight:600, display:"flex", alignItems:"center", gap:8 }}>
          JLPT N4 学習アプリ
          <span style={{ background:"#AFA9EC", color:"#26215C", fontSize:10, fontWeight:500, padding:"2px 8px", borderRadius:20 }}>N4</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:13, color:"#888" }}>{user.name}</span>
          <span style={{ fontSize:11, padding:"2px 8px", borderRadius:20, fontWeight:500,
            background:user.role==="admin"?"#FAEEDA":"#E1F5EE",
            color:user.role==="admin"?"#633806":"#085041" }}>
            {user.role==="admin"?"管理者":"学習者"}
          </span>
          <button onClick={logout} style={{ fontSize:11, padding:"4px 10px", border:"0.5px solid #ddd", borderRadius:6, background:"none", cursor:"pointer" }}>ログアウト</button>
        </div>
      </div>
      <div style={{ display:"flex", minHeight:490 }}>
        <div style={{ width:168, background:"#fff", borderRight:"0.5px solid #eee", padding:"10px 8px", display:"flex", flexDirection:"column", gap:2 }}>
          {navItems.map(item=>item.id==="sep"
            ? <div key="sep" style={{ height:"0.5px", background:"#eee", margin:"6px 4px" }} />
            : <div key={item.id} onClick={()=>{setPage(item.id);setDetailId(null);}}
                style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:8, cursor:"pointer", fontSize:13,
                  background:page===item.id&&!detailId?"#EEEDFE":"none",
                  color:page===item.id&&!detailId?"#534AB7":"#666",
                  fontWeight:page===item.id&&!detailId?500:400 }}>
                {item.label}
              </div>
          )}
        </div>
        <div style={{ flex:1, padding:16, overflowY:"auto" }}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
