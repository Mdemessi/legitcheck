"use client";
import { useState, useEffect } from "react";

const BRAND_CATEGORIES = {
  "Streetwear": ["Supreme","Off-White","Stüssy","Palace","BAPE","Fear of God","Essentials","Kith","Carhartt WIP","CDG / Comme des Garçons"],
  "Sneakers":   ["Nike","Air Jordan","Yeezy / Adidas","New Balance","Salomon","Asics","Converse","Vans","Reebok","Puma","On Running"],
  "Lujo":       ["Louis Vuitton","Gucci","Balenciaga","Prada","Dior","Burberry","Versace","Fendi","Moncler","Stone Island","Bottega Veneta","Alexander McQueen","Celine","Loewe"],
  "Sport & Outdoor": ["The North Face","Arc'teryx","Patagonia","Lululemon","Under Armour","Columbia","Mammut"],
  "Fútbol ⚽":  ["Real Madrid","Barcelona","Manchester United","Manchester City","PSG","Liverpool","Juventus","Bayern Munich","Inter Milan","Chelsea","Arsenal","Ajax","Borussia Dortmund","Atlético de Madrid","Selección Argentina","Selección Brasil","Selección México","Selección Francia","Selección Portugal","Selección Colombia","Selección Uruguay","Selección Alemania"],
  "Basketball 🏀": ["Los Angeles Lakers","Chicago Bulls","Golden State Warriors","Boston Celtics","Miami Heat","Brooklyn Nets","New York Knicks","Dallas Mavericks","Phoenix Suns","Milwaukee Bucks","Toronto Raptors","Philadelphia 76ers"],
  "Americano 🏈": ["Dallas Cowboys","New England Patriots","Kansas City Chiefs","San Francisco 49ers","Green Bay Packers","Chicago Bears","Las Vegas Raiders","Buffalo Bills"],
  "Zapatos Deportivos 👟": ["Nike Mercurial","Nike Tiempo","Nike Phantom","Adidas Predator","Adidas Copa","Adidas X Speedflow","Puma King","Puma Future","New Balance Furon","Under Armour Magnetico"],
  "Otra marca": ["Otra marca"],
};

const ALL_BRANDS = Object.values(BRAND_CATEGORIES).flat();
const jerseyBrands = [...BRAND_CATEGORIES["Fútbol ⚽"],...BRAND_CATEGORIES["Basketball 🏀"],...BRAND_CATEGORIES["Americano 🏈"]];
const shoeBrands = BRAND_CATEGORIES["Zapatos Deportivos 👟"];

const PHOTO_CONFIG = {
  default: [
    { label:"Etiqueta interior", hint:"Tag con talla, composición y país de fabricación", icon:"🏷", example:"Busca el tag cosido en el cuello o costado interior" },
    { label:"Logo / Branding", hint:"Logo principal, parches o gráficos de la prenda", icon:"◎", example:"Fotografía el logo de frente, bien iluminado y enfocado" },
    { label:"Construcción", hint:"Costuras, cremalleras, botones o suela", icon:"⌇", example:"Muestra la calidad de costuras o acabados internos" },
  ],
  jersey: [
    { label:"Etiqueta oficial", hint:"Tag con número de licencia y fabricante oficial", icon:"🏷", example:"Busca el tag con código de liga (UEFA/FIFA/NBA/NFL) y fabricante" },
    { label:"Escudo / Logo", hint:"Escudo del equipo y logo del fabricante", icon:"◎", example:"Fotografía el escudo bordado de cerca, bien iluminado" },
    { label:"Numeración / Nombre", hint:"Dorsal y nombre del jugador si aplica", icon:"⌇", example:"Muestra la tipografía y método de impresión del número" },
  ],
  shoes: [
    { label:"Etiqueta interior", hint:"SKU completo y país de fabricación en la plantilla", icon:"🏷", example:"Saca la plantilla o fotografía el interior de la lengüeta" },
    { label:"Logo y upper", hint:"Logo en lengüeta, lateral y punta del zapato", icon:"◎", example:"Fotografía el lateral completo con logo visible" },
    { label:"Suela y base", hint:"Patrón de tacos o amortiguación desde abajo", icon:"⌇", example:"Voltea el zapato y fotografía la suela completa" },
  ],
};

const getPhotoConfig = (b) =>
  jerseyBrands.includes(b) ? PHOTO_CONFIG.jersey :
  shoeBrands.includes(b) ? PHOTO_CONFIG.shoes : PHOTO_CONFIG.default;

const BRAND_TIPS = {
  "Supreme":"Revisa la costura del box logo, fuente Futura Bold y etiqueta interior roja con código de temporada.",
  "Louis Vuitton":"El monograma LV debe ser simétrico en todo el tejido, costuras perfectamente alineadas y hardware muy pesado.",
  "Air Jordan":"Verifica el Jumpman en la lengüeta, etiqueta con número de estilo completo y caja original con etiqueta lateral.",
  "Yeezy / Adidas":"Revisa la textura boost, el patrón de la suela y el SKU en caja que debe coincidir con la etiqueta interior.",
  "Balenciaga":"La tipografía del logo debe ser perfecta, cuero de alta densidad y costuras internas sin hilos sueltos.",
  "Off-White":"La zip-tie, etiquetas industriales con tipografía específica y las comillas en los gráficos son clave.",
  "Real Madrid":"Verifica el holográfico UEFA, escudo bordado con hilo dorado y etiqueta Adidas con código de licencia.",
  "Barcelona":"Comprueba etiqueta Nike con número de licencia, escudo bordado y tejido Dri-FIT auténtico.",
  "PSG":"Revisa el holográfico Ligue 1, escudo bordado y los logos Nike y Jordan si aplica a la edición.",
  "Selección Argentina":"El escudo AFA debe ser bordado en hilo dorado, etiqueta Adidas con código de autenticidad y rayas azul exacto.",
  "Selección Brasil":"Escudo CBF bordado, etiqueta Nike con licencia y amarillo correcto — las réplicas suelen ser más naranja.",
  "Los Angeles Lakers":"Etiqueta Nike con licencia NBA, tipografía Lakers oficial y color púrpura Pantone exacto.",
  "Chicago Bulls":"Licencia NBA visible, rojo correcto (no naranja) y numeración en tipografía oficial.",
  "Nike Mercurial":"SKU en la plantilla, patrón de tacos específico del modelo y Swoosh lateral en ángulo exacto.",
  "Adidas Predator":"Tres bandas paralelas perfectas, patrón de grip en la zona de contacto y etiqueta interior con SKU.",
  "default":"Presta atención a las etiquetas, el logo y la calidad de acabados y materiales.",
};
const getTip = (b) => BRAND_TIPS[b] || BRAND_TIPS["default"];

const EXPERT_PROMPT = (brand, lang) => {
  const isJersey = jerseyBrands.includes(brand);
  const isShoe = shoeBrands.includes(brand);
  const specific = isJersey ? `
JERSEY ANALYSIS for ${brand}:
1. LABEL: official license number (UEFA/FIFA/NBA/NFL), authorized manufacturer, country of origin, fabric composition
2. CREST/LOGOS: application method (embroidery vs heat-transfer vs screen print), exact Pantone colors, proportions
3. NUMBERING: official team typography, print method, color and thickness, player name if present
4. FABRIC: official tech (Dri-FIT, Climacool), texture, breathability, weight
5. HOLOGRAMS: authenticity sticker, QR codes, official league seal
6. SPONSORS: exact position, size and application method` :
  isShoe ? `
SHOE ANALYSIS for ${brand}:
1. INNER LABEL: full SKU (10-13 chars), country of manufacture, size in multiple measurements
2. LOGO/UPPER: exact logo position, application method, swoosh/stripes angle, upper materials
3. OUTSOLE: exact stud or cushioning pattern, material hardness, color and finish, molded codes
4. STITCHING: thread, stitches per inch, reinforcements at stress zones, glue quality
5. HARDWARE: laces, eyelets, tongue, heel — materials and finish` : `
APPAREL ANALYSIS for ${brand}:
1. LABELS: exact typography, font, spacing, colors, country of origin, style code/SKU
2. LOGO/BRANDING: exact proportions, line weight, Pantone colors, positioning
3. CONSTRUCTION: stitch type (overlock, chain, French), thread quality, hardware (YKK zippers, metal buttons)
4. BRAND-SPECIFIC DETAILS: unique features only found on authentic ${brand} items
5. INCONSISTENCIES: any detail that doesn't match authentic ${brand} product`;

  return `You are a professional authenticator with 15 years of experience specializing in ${brand}. Identify counterfeits with surgical precision.
The user sends 3 photos for authentication.
${specific}
Be extremely specific and technical. ${lang === "en" ? "Respond in English." : "Responde en español."}
Respond ONLY with this exact JSON, no markdown, no backticks:
{
  "veredicto": "AUTÉNTICO" or "FALSO" or "DUDOSO",
  "confianza": number 0-100,
  "resumen": "technical precise diagnosis in one sentence",
  "analisis": {
    "etiqueta": "specific technical analysis of the label",
    "logo": "specific technical analysis of logo/crest/branding",
    "construccion": "specific analysis of stitching, materials, sole or fabric"
  },
  "puntos_positivos": ["specific authentic indicator 1","indicator 2","indicator 3"],
  "puntos_negativos": ["specific red flag 1","red flag 2","red flag 3"],
  "nivel_riesgo": "BAJO" or "MEDIO" or "ALTO",
  "recomendacion": "specific actionable final advice",
  "foto_calidad": "BUENA" or "MEJORABLE" or "INSUFICIENTE"
}`;
};

const STORAGE_KEY = "legitcheck_history";
const CREDITS_KEY = "legitcheck_credits";
const FREE_CREDITS = 2;
const loadHistory = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]"); } catch { return []; } };
const saveHistory = (h) => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(h.slice(0,50))); } catch {} };
const loadCredits = () => { try { const v=localStorage.getItem(CREDITS_KEY); return v===null?FREE_CREDITS:parseInt(v); } catch { return FREE_CREDITS; } };
const saveCredits = (n) => { try { localStorage.setItem(CREDITS_KEY,String(n)); } catch {} };
const riskColor = { BAJO:"#2d6a4f", MEDIO:"#92620a", ALTO:"#b5142b" };
const verdictClr = (v) => v==="AUTÉNTICO"?"#2d6a4f":v==="FALSO"?"#b5142b":"#92620a";
const dateStr = (ts) => new Date(ts).toLocaleDateString("es-ES",{day:"2-digit",month:"short",year:"numeric"});
const shareText = (brand,result) => `✅ LegitCheck — ${brand}\n\nVeredicto: ${result.veredicto} (${result.confianza}% confianza)\n${result.resumen}\n\nwww.legitcheck.app`;
const Spinner = () => <div style={{width:28,height:28,border:"1px solid #e8e8e6",borderTop:"1px solid #1a1a1a",borderRadius:"50%",animation:"rot 0.9s linear infinite"}}/>;
const Tag = ({label,color="#bbb"}) => <span style={{fontSize:9,letterSpacing:3,color,border:`1px solid ${color}`,padding:"3px 8px",borderRadius:2}}>{label}</span>;
const CreditBadge = ({credits}) => (
  <div style={{display:"flex",alignItems:"center",gap:6}}>
    <div style={{width:6,height:6,borderRadius:"50%",background:credits>0?"#2d6a4f":"#b5142b"}}/>
    <span style={{fontSize:10,letterSpacing:2,color:"#bbb"}}>{credits} ANÁLISIS RESTANTE{credits!==1?"S":""}</span>
  </div>
);

export default function App() {
  const [screen,setScreen]=useState("home");
  const [lang,setLang]=useState("es");
  const [brand,setBrand]=useState("");
  const [photos,setPhotos]=useState([null,null,null]);
  const [previews,setPreviews]=useState([null,null,null]);
  const [result,setResult]=useState(null);
  const [error,setError]=useState(null);
  const [search,setSearch]=useState("");
  const [history,setHistory]=useState([]);
  const [credits,setCredits]=useState(FREE_CREDITS);
  const [guideIdx,setGuideIdx]=useState(0);
  const [feedback,setFeedback]=useState(null);
  const [copied,setCopied]=useState(false);

  useEffect(()=>{setHistory(loadHistory());setCredits(loadCredits());},[]);
  useEffect(()=>{saveHistory(history);},[history]);
  useEffect(()=>{saveCredits(credits);},[credits]);

  const allReady=photos.every(Boolean);
  const photoLabels=getPhotoConfig(brand);
  const filteredCats=search.trim()?{"Resultados":ALL_BRANDS.filter(b=>b.toLowerCase().includes(search.toLowerCase()))}:BRAND_CATEGORIES;

  const handlePhoto=(i,file)=>{
    if(!file)return;
    const reader=new FileReader();
    reader.onload=(e)=>{
      setPreviews(p=>{const n=[...p];n[i]=e.target.result;return n;});
      setPhotos(p=>{const n=[...p];n[i]=e.target.result.split(",")[1];return n;});
    };
    reader.readAsDataURL(file);
  };

  const analyze=async()=>{
    if(credits<=0){setScreen("credits");return;}
    setScreen("analyzing");setError(null);
    try{
      const res=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1500,messages:[{role:"user",content:[...photos.map(data=>({type:"image",source:{type:"base64",media_type:"image/jpeg",data}})),{type:"text",text:EXPERT_PROMPT(brand,lang)}]}]})});
      const data=await res.json();
      const text=data.content?.find(b=>b.type==="text")?.text||"";
      const parsed=JSON.parse(text.replace(/```json|```/g,"").trim());
      setResult(parsed);
      setHistory(h=>[{id:Date.now(),brand,result:parsed,preview:previews[0],ts:Date.now()},...h]);
      setCredits(c=>c-1);
      setFeedback(null);
      setScreen("result");
    }catch{
      setError("Error al analizar. Verifica las fotos e intenta de nuevo.");
      setScreen("upload");
    }
  };

  const reset=()=>{setBrand("");setPhotos([null,null,null]);setPreviews([null,null,null]);setResult(null);setError(null);setSearch("");setGuideIdx(0);setFeedback(null);setScreen("brand");};
  const doShare=()=>{const text=shareText(brand,result);if(navigator.share){navigator.share({text});}else{navigator.clipboard.writeText(text).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);});}};
  const vc=result?verdictClr(result.veredicto):"#1a1a1a";
  const S={
    page:{minHeight:"100vh",background:"#f8f8f7",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",display:"flex",flexDirection:"column",alignItems:"center",padding:"0 24px 80px"},
    hdr:{width:"100%",maxWidth:420,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"36px 0 32px"},
    lbl:{fontSize:10,letterSpacing:4,color:"#bbb",marginBottom:16},
    btn:(active=true,outline=false)=>({width:"100%",padding:"15px",background:outline?"none":active?"#1a1a1a":"#efefed",border:outline?"1px solid #e8e8e6":"none",color:outline?"#bbb":active?"#fff":"#ccc",fontSize:10,letterSpacing:5,cursor:active?"pointer":"not-allowed",fontFamily:"inherit",transition:"opacity 0.12s"}),
    card:{background:"#f2f2f0",padding:"16px",marginBottom:16},
    row:{display:"flex",alignItems:"center",gap:12,padding:"13px 8px",borderBottom:"1px solid #f0f0ee",cursor:"pointer",borderRadius:2},
  };

  return(
    <div style={S.page}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0;}button,input{font-family:inherit;}button:hover{opacity:0.65;}@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}.fade{animation:fadeUp 0.28s ease both}@keyframes rot{to{transform:rotate(360deg)}}.hrow:hover{background:#f2f2f0!important}::-webkit-scrollbar{width:0}`}</style>
      <div style={S.hdr}>
        <button onClick={()=>setScreen("home")} style={{background:"none",border:"none",cursor:"pointer",padding:0}}><span style={{fontSize:11,letterSpacing:6,color:"#1a1a1a",fontWeight:600}}>LEGITCHECK</span></button>
        <div style={{display:"flex",gap:16,alignItems:"center"}}>
          <button onClick={()=>setLang(l=>l==="es"?"en":"es")} style={{background:"none",border:"1px solid #e8e8e6",color:"#bbb",fontSize:10,letterSpacing:2,padding:"5px 10px",cursor:"pointer"}}>{lang==="es"?"EN":"ES"}</button>
          <button onClick={()=>setScreen("history")} style={{background:"none",border:"none",color:"#bbb",fontSize:18,cursor:"pointer",lineHeight:1}}>☰</button>
        </div>
      </div>
      <div className="fade" key={screen} style={{width:"100%",maxWidth:420}}>

        {screen==="home"&&<div>
          <div style={{marginBottom:48}}>
            <p style={{fontSize:"clamp(32px,9vw,52px)",fontWeight:200,color:"#1a1a1a",letterSpacing:-2,lineHeight:1.1,marginBottom:16}}>{lang==="es"?"¿Es real\no es falso?":"Real or\nfake?"}</p>
            <p style={{fontSize:13,color:"#888",lineHeight:1.75,marginBottom:32}}>{lang==="es"?"Sube 3 fotos y nuestra IA analiza tu prenda como un autenticador profesional en segundos.":"Upload 3 photos and our AI analyzes your item like a professional authenticator in seconds."}</p>
            <button onClick={()=>setScreen("brand")} style={{...S.btn(),marginBottom:12}}>{lang==="es"?"EMPEZAR VERIFICACIÓN":"START VERIFICATION"}</button>
            <CreditBadge credits={credits}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:40}}>
            {[["30+","Marcas"],["95%","Precisión"],["<30s","Por análisis"]].map(([v,l])=>(
              <div key={l} style={{background:"#f2f2f0",padding:"16px 12px",textAlign:"center"}}>
                <div style={{fontSize:20,fontWeight:200,color:"#1a1a1a",marginBottom:4}}>{v}</div>
                <div style={{fontSize:9,letterSpacing:3,color:"#bbb"}}>{l.toUpperCase()}</div>
              </div>
            ))}
          </div>
          {history.length>0&&<div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <p style={S.lbl}>{lang==="es"?"RECIENTES":"RECENT"}</p>
              <button onClick={()=>setScreen("history")} style={{background:"none",border:"none",fontSize:11,color:"#bbb",cursor:"pointer",letterSpacing:1}}>{lang==="es"?"VER TODO →":"SEE ALL →"}</button>
            </div>
            {history.slice(0,3).map(h=>(
              <div key={h.id} style={{...S.row}} className="hrow">
                {h.preview&&<img src={h.preview} alt="" style={{width:44,height:44,objectFit:"cover",borderRadius:2,flexShrink:0}}/>}
                <div style={{flex:1}}><div style={{fontSize:13,color:"#1a1a1a",marginBottom:2}}>{h.brand}</div><div style={{fontSize:10,letterSpacing:2,color:verdictClr(h.result.veredicto)}}>{h.result.veredicto}</div></div>
                <div style={{fontSize:10,color:"#ccc"}}>{dateStr(h.ts)}</div>
              </div>
            ))}
          </div>}
          {credits<=0&&<div style={{...S.card,borderLeft:"2px solid #b5142b",marginTop:24}}>
            <p style={{fontSize:10,letterSpacing:3,color:"#b5142b",marginBottom:8}}>SIN CRÉDITOS</p>
            <p style={{fontSize:12,color:"#888",lineHeight:1.6,marginBottom:12}}>{lang==="es"?"Has usado tus análisis gratuitos.":"You've used your free analyses."}</p>
            <button onClick={()=>setScreen("credits")} style={{...S.btn(),width:"auto",padding:"10px 20px"}}>{lang==="es"?"VER PLANES":"VIEW PLANS"}</button>
          </div>}
        </div>}

        {screen==="brand"&&<div>
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:28}}>
            <button onClick={()=>setScreen("home")} style={{background:"none",border:"none",color:"#bbb",fontSize:20,cursor:"pointer",padding:0,lineHeight:1}}>←</button>
            <p style={S.lbl}>{lang==="es"?"SELECCIONA MARCA":"SELECT BRAND"}</p>
          </div>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={lang==="es"?"Buscar marca o equipo...":"Search brand or team..."} style={{width:"100%",padding:"12px 0",background:"none",border:"none",borderBottom:"1px solid #e0e0e0",fontSize:14,color:"#1a1a1a",outline:"none",marginBottom:28}}/>
          {Object.entries(filteredCats).map(([cat,brands])=>(
            <div key={cat} style={{marginBottom:24}}>
              {!search&&<p style={{...S.lbl,marginBottom:8,fontSize:9}}>{cat.toUpperCase()}</p>}
              {brands.map(b=>(
                <button key={b} onClick={()=>{setBrand(b);setScreen("guide");setGuideIdx(0);}} className="hrow" style={{width:"100%",background:"none",border:"none",borderBottom:"1px solid #f0f0ee",padding:"13px 8px",textAlign:"left",fontSize:14,color:"#1a1a1a",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",borderRadius:2}}>
                  {b}<span style={{color:"#d0d0d0",fontSize:16}}>›</span>
                </button>
              ))}
            </div>
          ))}
        </div>}

        {screen==="guide"&&<div>
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:32}}>
            <button onClick={()=>setScreen("brand")} style={{background:"none",border:"none",color:"#bbb",fontSize:20,cursor:"pointer",padding:0,lineHeight:1}}>←</button>
            <div><p style={S.lbl}>{lang==="es"?"GUÍA DE FOTOS":"PHOTO GUIDE"}</p><p style={{fontSize:13,color:"#1a1a1a"}}>{brand}</p></div>
          </div>
          <div style={{display:"flex",gap:6,marginBottom:32}}>{[0,1,2].map(i=><div key={i} style={{flex:1,height:2,background:i===guideIdx?"#1a1a1a":i<guideIdx?"#bbb":"#efefed",transition:"background 0.3s"}}/>)}</div>
          <div style={{background:"#f2f2f0",padding:"32px 24px",marginBottom:24,textAlign:"center"}}>
            <div style={{fontSize:40,marginBottom:20}}>{photoLabels[guideIdx].icon}</div>
            <p style={{fontSize:16,color:"#1a1a1a",marginBottom:10}}>{photoLabels[guideIdx].label}</p>
            <p style={{fontSize:12,color:"#888",lineHeight:1.7,marginBottom:16}}>{photoLabels[guideIdx].hint}</p>
            <div style={{borderTop:"1px solid #e8e8e6",paddingTop:16}}>
              <p style={{fontSize:11,letterSpacing:2,color:"#bbb",marginBottom:6}}>CONSEJO</p>
              <p style={{fontSize:12,color:"#888",lineHeight:1.6}}>{photoLabels[guideIdx].example}</p>
            </div>
          </div>
          {guideIdx===0&&<div style={{...S.card,borderLeft:"2px solid #ddd",marginBottom:24}}>
            <p style={{fontSize:10,letterSpacing:2,color:"#bbb",marginBottom:6}}>SOBRE {brand.toUpperCase()}</p>
            <p style={{fontSize:12,color:"#888",lineHeight:1.6}}>{getTip(brand)}</p>
          </div>}
          <div style={{display:"flex",gap:10}}>
            {guideIdx>0&&<button onClick={()=>setGuideIdx(i=>i-1)} style={{...S.btn(true,true),flex:1}}>←</button>}
            <button onClick={()=>guideIdx<2?setGuideIdx(i=>i+1):setScreen("upload")} style={{...S.btn(),flex:2}}>
              {guideIdx<2?(lang==="es"?"SIGUIENTE →":"NEXT →"):(lang==="es"?"ENTENDIDO, SUBIR FOTOS":"GOT IT, UPLOAD")}
            </button>
          </div>
        </div>}

        {screen==="upload"&&<div>
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:28}}>
            <button onClick={()=>setScreen("guide")} style={{background:"none",border:"none",color:"#bbb",fontSize:20,cursor:"pointer",padding:0,lineHeight:1}}>←</button>
            <div><p style={S.lbl}>{lang==="es"?"SUBE TUS FOTOS":"UPLOAD PHOTOS"}</p><p style={{fontSize:13,color:"#1a1a1a"}}>{brand}</p></div>
          </div>
          <div style={{marginBottom:28}}>
            {photoLabels.map(({label,hint,icon},i)=>(
              <div key={i}>
                <label htmlFor={`photo-${i}`} className="hrow" style={{display:"flex",alignItems:"center",gap:16,padding:"16px 8px",borderBottom:"1px solid #f0f0ee",cursor:"pointer",borderRadius:2}}>
                  <input id={`photo-${i}`} type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={e=>handlePhoto(i,e.target.files[0])}/>
                  {previews[i]?<img src={previews[i]} alt="" style={{width:52,height:52,objectFit:"cover",borderRadius:2,flexShrink:0}}/>:<div style={{width:52,height:52,background:"#efefed",borderRadius:2,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:"#ccc"}}>{icon}</div>}
                  <div style={{flex:1}}><div style={{fontSize:13,color:"#1a1a1a",marginBottom:3}}>{label}</div><div style={{fontSize:11,color:"#bbb"}}>{hint}</div></div>
                  <div style={{fontSize:13,color:previews[i]?"#2d6a4f":"#ddd"}}>{previews[i]?"✓":"○"}</div>
                </label>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:4,marginBottom:8}}>{[0,1,2].map(i=><div key={i} style={{flex:1,height:2,background:previews[i]?"#1a1a1a":"#e8e8e6",transition:"background 0.3s"}}/>)}</div>
          <p style={{fontSize:11,color:"#bbb",marginBottom:20}}>{photos.filter(Boolean).length}/3 {lang==="es"?"fotos":"photos"}</p>
          {error&&<p style={{fontSize:12,color:"#b5142b",marginBottom:16}}>{error}</p>}
          <button onClick={analyze} disabled={!allReady||credits<=0} style={S.btn(allReady&&credits>0)}>{lang==="es"?"ANALIZAR":"ANALYZE"}</button>
          {allReady&&<p style={{fontSize:10,color:"#bbb",textAlign:"center",marginTop:12,letterSpacing:1}}>{lang==="es"?"Usará 1 crédito":"Will use 1 credit"}</p>}
        </div>}

        {screen==="analyzing"&&<div style={{textAlign:"center",padding:"72px 0"}}>
          <div style={{margin:"0 auto 28px"}}><Spinner/></div>
          <p style={{fontSize:10,letterSpacing:4,color:"#bbb",marginBottom:8}}>{lang==="es"?"ANALIZANDO":"ANALYZING"}</p>
          <p style={{fontSize:12,color:"#ccc",marginBottom:24}}>{brand}</p>
          <p style={{fontSize:11,color:"#ddd",lineHeight:1.7,maxWidth:280,margin:"0 auto"}}>{lang==="es"?"Revisando etiquetas, logos y construcción como un experto...":"Reviewing labels, logos and construction like an expert..."}</p>
        </div>}

        {screen==="result"&&result&&<div>
          {result.foto_calidad==="INSUFICIENTE"&&<div style={{...S.card,borderLeft:"2px solid #92620a",marginBottom:24}}><p style={{fontSize:10,letterSpacing:3,color:"#92620a",marginBottom:6}}>⚠ FOTOS INSUFICIENTES</p><p style={{fontSize:12,color:"#888",lineHeight:1.6}}>{lang==="es"?"Calidad insuficiente. Intenta con mejores fotos.":"Insufficient quality. Try with better photos."}</p></div>}
          {result.foto_calidad==="MEJORABLE"&&<div style={{...S.card,borderLeft:"2px solid #ddd",marginBottom:24}}><p style={{fontSize:10,letterSpacing:3,color:"#bbb",marginBottom:6}}>FOTOS MEJORABLES</p><p style={{fontSize:12,color:"#888",lineHeight:1.6}}>{lang==="es"?"Fotos más nítidas mejorarían el análisis.":"Sharper photos would improve the analysis."}</p></div>}
          <div style={{marginBottom:36}}>
            <p style={S.lbl}>{lang==="es"?"VEREDICTO":"VERDICT"}</p>
            <div style={{fontSize:"clamp(44px,13vw,80px)",fontWeight:200,color:vc,letterSpacing:-3,lineHeight:1,marginBottom:14}}>{result.veredicto}</div>
            <p style={{fontSize:13,color:"#888",lineHeight:1.75,marginBottom:20}}>{result.resumen}</p>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:12}}>
              <div style={{flex:1,height:1,background:"#eee",position:"relative"}}><div style={{position:"absolute",top:0,left:0,height:"100%",width:`${result.confianza}%`,background:vc,transition:"width 1.2s ease"}}/></div>
              <span style={{fontSize:11,color:"#bbb",whiteSpace:"nowrap"}}>{result.confianza}% {lang==="es"?"confianza":"confidence"}</span>
            </div>
            {result.confianza<60&&<div style={{background:"#fff8f0",border:"1px solid #f0e0c0",padding:"10px 14px",marginTop:12}}><p style={{fontSize:11,color:"#92620a",lineHeight:1.6}}>{lang==="es"?"⚠ Confianza baja — mejor iluminación ayudaría.":"⚠ Low confidence — better lighting would help."}</p></div>}
            {result.nivel_riesgo&&<div style={{display:"flex",alignItems:"center",gap:8,marginTop:12}}><div style={{width:6,height:6,borderRadius:"50%",background:riskColor[result.nivel_riesgo]||"#bbb"}}/><span style={{fontSize:10,letterSpacing:3,color:riskColor[result.nivel_riesgo]||"#bbb"}}>{lang==="es"?"RIESGO":"RISK"} {result.nivel_riesgo}</span></div>}
          </div>
          {result.analisis&&<div style={{marginBottom:28}}>
            <p style={S.lbl}>{lang==="es"?"ANÁLISIS DETALLADO":"DETAILED ANALYSIS"}</p>
            {[{key:"etiqueta",label:lang==="es"?"Etiqueta":"Label",icon:"🏷"},{key:"logo",label:"Logo",icon:"◎"},{key:"construccion",label:lang==="es"?"Construcción":"Construction",icon:"⌇"}].map(({key,label,icon})=>result.analisis[key]&&(
              <div key={key} style={{padding:"14px 0",borderBottom:"1px solid #f0f0ee"}}>
                <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                  <span style={{fontSize:14,marginTop:1,flexShrink:0}}>{icon}</span>
                  <div><p style={{fontSize:10,letterSpacing:2,color:"#bbb",marginBottom:5}}>{label.toUpperCase()}</p><p style={{fontSize:12,color:"#666",lineHeight:1.7}}>{result.analisis[key]}</p></div>
                </div>
              </div>
            ))}
          </div>}
          {result.puntos_positivos?.filter(Boolean).length>0&&<div style={{marginBottom:24}}>
            <p style={S.lbl}>{lang==="es"?"A FAVOR":"IN FAVOR"}</p>
            {result.puntos_positivos.filter(Boolean).map((p,i)=>(
              <div key={i} style={{display:"flex",gap:12,padding:"9px 0",borderBottom:"1px solid #f5f5f3"}}><span style={{color:"#2d6a4f",fontSize:10,marginTop:3,flexShrink:0}}>✓</span><span style={{fontSize:12,color:"#555",lineHeight:1.65}}>{p}</span></div>
            ))}
          </div>}
          {result.puntos_negativos?.filter(Boolean).length>0&&<div style={{marginBottom:24}}>
            <p style={S.lbl}>{lang==="es"?"ALERTAS":"RED FLAGS"}</p>
            {result.puntos_negativos.filter(Boolean).map((p,i)=>(
              <div key={i} style={{display:"flex",gap:12,padding:"9px 0",borderBottom:"1px solid #f5f5f3"}}><span style={{color:"#b5142b",fontSize:10,marginTop:3,flexShrink:0}}>✗</span><span style={{fontSize:12,color:"#555",lineHeight:1.65}}>{p}</span></div>
            ))}
          </div>}
          <div style={{...S.card,marginBottom:28}}><p style={{fontSize:10,letterSpacing:3,color:"#bbb",marginBottom:8}}>{lang==="es"?"RECOMENDACIÓN":"RECOMMENDATION"}</p><p style={{fontSize:12,color:"#555",lineHeight:1.75}}>{result.recomendacion}</p></div>
          {!feedback&&<div style={{marginBottom:28}}>
            <p style={S.lbl}>{lang==="es"?"¿FUE ÚTIL?":"WAS IT HELPFUL?"}</p>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setFeedback("correct")} style={{...S.btn(true,true),flex:1,padding:"12px"}}>👍 {lang==="es"?"Correcto":"Correct"}</button>
              <button onClick={()=>setFeedback("wrong")} style={{...S.btn(true,true),flex:1,padding:"12px"}}>👎 {lang==="es"?"Incorrecto":"Incorrect"}</button>
            </div>
          </div>}
          {feedback&&<div style={{...S.card,marginBottom:28,textAlign:"center"}}><p style={{fontSize:12,color:"#888"}}>{feedback==="correct"?(lang==="es"?"¡Gracias! 🎯":"Thanks! 🎯"):(lang==="es"?"Gracias, seguimos mejorando.":"Thanks, we keep improving.")}</p></div>}
          <button onClick={doShare} style={{...S.btn(true,true),marginBottom:10}}>{copied?(lang==="es"?"✓ COPIADO":"✓ COPIED"):(lang==="es"?"COMPARTIR RESULTADO":"SHARE RESULT")}</button>
          <button onClick={reset} style={{...S.btn(true,true)}}>{lang==="es"?"NUEVA VERIFICACIÓN":"NEW VERIFICATION"}</button>
          <div style={{marginTop:16}}><CreditBadge credits={credits}/></div>
        </div>}

        {screen==="history"&&<div>
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:28}}>
            <button onClick={()=>setScreen("home")} style={{background:"none",border:"none",color:"#bbb",fontSize:20,cursor:"pointer",padding:0,lineHeight:1}}>←</button>
            <p style={S.lbl}>{lang==="es"?"HISTORIAL":"HISTORY"}</p>
          </div>
          {history.length===0?<div style={{textAlign:"center",padding:"48px 0"}}><p style={{fontSize:13,color:"#ccc"}}>{lang==="es"?"Sin verificaciones aún":"No verifications yet"}</p></div>:<div>
            {history.map(h=>(
              <div key={h.id} style={{display:"flex",alignItems:"center",gap:16,padding:"16px 8px",borderBottom:"1px solid #f0f0ee"}} className="hrow">
                {h.preview?<img src={h.preview} alt="" style={{width:52,height:52,objectFit:"cover",borderRadius:2,flexShrink:0}}/>:<div style={{width:52,height:52,background:"#efefed",borderRadius:2,flexShrink:0}}/>}
                <div style={{flex:1}}><div style={{fontSize:13,color:"#1a1a1a",marginBottom:4}}>{h.brand}</div><div style={{display:"flex",gap:8,alignItems:"center"}}><Tag label={h.result.veredicto} color={verdictClr(h.result.veredicto)}/><span style={{fontSize:10,color:"#ccc"}}>{h.result.confianza}%</span></div></div>
                <div style={{fontSize:10,color:"#ccc"}}>{dateStr(h.ts)}</div>
              </div>
            ))}
            <button onClick={()=>setHistory([])} style={{...S.btn(true,true),marginTop:24,color:"#b5142b",borderColor:"#f0caca"}}>{lang==="es"?"LIMPIAR HISTORIAL":"CLEAR HISTORY"}</button>
          </div>}
        </div>}

        {screen==="credits"&&<div>
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:36}}>
            <button onClick={()=>setScreen("home")} style={{background:"none",border:"none",color:"#bbb",fontSize:20,cursor:"pointer",padding:0,lineHeight:1}}>←</button>
            <p style={S.lbl}>{lang==="es"?"PLANES":"PLANS"}</p>
          </div>
          <p style={{fontSize:"clamp(24px,7vw,36px)",fontWeight:200,color:"#1a1a1a",letterSpacing:-1,lineHeight:1.1,marginBottom:8}}>{lang==="es"?"Obtén más análisis":"Get more analyses"}</p>
          <p style={{fontSize:13,color:"#888",lineHeight:1.7,marginBottom:36}}>{lang==="es"?"Sin suscripción. Compra los créditos que necesitas.":"No subscription. Buy the credits you need."}</p>
          {[{c:3,price:"$2.99",label:"Starter",desc:lang==="es"?"Ideal para una compra puntual":"Perfect for a one-time purchase"},{c:10,price:"$7.99",label:"Popular",desc:lang==="es"?"El más elegido por revendedores":"Most chosen by resellers",highlight:true},{c:30,price:"$19.99",label:"Pro",desc:lang==="es"?"Para negocios de segunda mano":"For secondhand businesses"}].map(({c,price,label,desc,highlight})=>(
            <div key={label} style={{border:highlight?"1px solid #1a1a1a":"1px solid #e8e8e6",padding:"20px",marginBottom:12,background:highlight?"#1a1a1a":"none"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div><p style={{fontSize:13,color:highlight?"#fff":"#1a1a1a",marginBottom:4}}>{label}</p><p style={{fontSize:11,color:highlight?"#aaa":"#bbb"}}>{desc}</p></div>
                <div style={{textAlign:"right"}}><p style={{fontSize:20,fontWeight:200,color:highlight?"#fff":"#1a1a1a"}}>{price}</p><p style={{fontSize:10,color:highlight?"#aaa":"#bbb",letterSpacing:1}}>{c} {lang==="es"?"créditos":"credits"}</p></div>
              </div>
              <button onClick={()=>{setCredits(cr=>cr+c);alert(`Demo: +${c} créditos. Integra Stripe aquí.`);setScreen("home");}} style={{width:"100%",padding:"11px",marginTop:12,background:highlight?"#fff":"#1a1a1a",border:"none",color:highlight?"#1a1a1a":"#fff",fontSize:10,letterSpacing:4,cursor:"pointer",fontFamily:"inherit"}}>
                {lang==="es"?"COMPRAR":"BUY"} — {price}
              </button>
            </div>
          ))}
          <div style={{...S.card,marginTop:24}}>
            <p style={{fontSize:10,letterSpacing:3,color:"#bbb",marginBottom:8}}>{lang==="es"?"PLAN B2B":"B2B PLAN"}</p>
            <p style={{fontSize:13,color:"#1a1a1a",marginBottom:6}}>{lang==="es"?"$49/mes — Ilimitado":"$49/mo — Unlimited"}</p>
            <p style={{fontSize:12,color:"#888",lineHeight:1.6,marginBottom:12}}>{lang==="es"?"Para tiendas de segunda mano y revendedores profesionales.":"For secondhand stores and professional resellers."}</p>
            <button style={{...S.btn(),width:"auto",padding:"10px 20px"}}>{lang==="es"?"CONTACTAR":"CONTACT US"}</button>
          </div>
          <div style={{marginTop:24}}><CreditBadge credits={credits}/></div>
        </div>}

      </div>
      <div style={{marginTop:64,fontSize:9,letterSpacing:4,color:"#d8d8d6"}}>LEGITCHECK · POWERED BY CLAUDE AI</div>
    </div>
  );
  }
