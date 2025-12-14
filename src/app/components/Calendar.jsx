"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./calendar.css";

/*
  Calendar.jsx
  - renderiza mês / semana / dia
  - botão CRIAR+ (abre popup)
  - popup cria evento com: nome, data, hora, local, categoria, grupo, periodicidade
  - eventos persistidos em state e renderizados com periodicidade aplicada
*/

export default function Calendar({ view = "mês", setView }) {
  const [date, setDate] = useState(new Date());
  const [showPopup, setShowPopup] = useState(false);
  const [events, setEvents] = useState([]); // eventos originais salvos
  const [mode, setMode] = useState(view); // controle interno de view
  const [loading, setLoading] = useState(false);

  // Carregar eventos ao montar o componente
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');
        
        if (!token) {
          return;
        }
        
        const response = await fetch('https://api.uecehit.com.br/api/events/', {
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          // Converter formato da API para formato interno
          const formattedEvents = data.map(evt => ({
            id: evt.id,
            nome: evt.titulo,
            data: evt.data_inicio.split('T')[0], // extrair YYYY-MM-DD
            hora: evt.data_inicio.split('T')[1]?.substring(0, 5) || '', // extrair HH:MM
            local: evt.local,
            categoria: evt.categoria,
            grupo: evt.grupo_id,
            periodicidade: evt.tipo_evento === 'evento_unico' ? 'Evento Único' : evt.recorrencia || '',
            descricao: evt.descricao
          }));
          setEvents(formattedEvents);
        }
      } catch (error) {
        console.error('Erro ao carregar eventos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadEvents();
  }, []);

  useEffect(() => {
  setMode(view);
  }, [view]);

  const monthNames = [
    "JANEIRO","FEVEREIRO","MARÇO","ABRIL","MAIO","JUNHO",
    "JULHO","AGOSTO","SETEMBRO","OUTUBRO","NOVEMBRO","DEZEMBRO"
  ];

  // helpers data
  function cloneDate(d){ return new Date(d.getTime()); }

  // avançar / retroceder conforme modo (dia: +-1 dia, semana: +-7 dias, mês: +-1 mês)
  function prev() {
    if (mode === "dia") setDate(d => new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1));
    else if (mode === "semana") setDate(d => new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7));
    else setDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }
  function next() {
    if (mode === "dia") setDate(d => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1));
    else if (mode === "semana") setDate(d => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7));
    else setDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  // cálculo do mês
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const adjustedFirstWeekday = firstWeekday === 0 ? 6 : firstWeekday - 1; // começa segunda
  const lastDay = new Date(year, month + 1, 0).getDate();

  // grade dias do mês (strings ou número)
  const daysMonth = [];
  for (let i = 0; i < adjustedFirstWeekday; i++) daysMonth.push("");
  for (let i = 1; i <= lastDay; i++) daysMonth.push(i);

  // semana atual (monday..sunday)
  function getCurrentWeek() {
    const current = new Date(date);
    const weekday = (current.getDay() === 0 ? 6 : current.getDay() - 1);
    const monday = new Date(current); monday.setDate(current.getDate() - weekday);
    const week = [];
    for (let i = 0; i < 7; i++) { const d = new Date(monday); d.setDate(monday.getDate() + i); week.push(d); }
    return week;
  }
  const week = getCurrentWeek();

  // horas para view DIA/SEMANA (6..21)
  const hours = [];
  for (let h = 6; h <= 21; h++) hours.push(h); // números (usamos para calcular posição)

  // --- transformar events salvos em "ocorrências" no intervalo visível ---
  // definimos rangeStart / rangeEnd dependendo de mode
  const occurrences = useMemo(() => {
    // determine visible range
    let rangeStart, rangeEnd;
    if (mode === "mês") {
      rangeStart = new Date(year, month, 1);
      rangeEnd = new Date(year, month, lastDay, 23, 59, 59);
    } else if (mode === "semana") {
      rangeStart = cloneDate(week[0]); rangeStart.setHours(0,0,0,0);
      rangeEnd = cloneDate(week[6]); rangeEnd.setHours(23,59,59,999);
    } else { // dia
      rangeStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0,0,0);
      rangeEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23,59,59,999);
    }

    const out = [];

    // for each saved event, generate occurrences in range according to periodicidade
    events.forEach((evt, idx) => {
      // evt.data stored as YYYY-MM-DD from input (HTML date)
      if (!evt.data) return;
      const [y,mn,day] = evt.data.split("-").map(Number);
      if (!y) return;
      const evtDate = new Date(y, (mn-1), day);

      // helper to push occurrence object
      const pushOcc = (d) => {
        out.push({
          id: `${idx}-${d.toISOString()}`,
          name: evt.nome,
          date: new Date(d.getFullYear(), d.getMonth(), d.getDate()),
          time: evt.hora || null, // format HH:MM
          local: evt.local,
          categoria: evt.categoria,
          grupo: evt.grupo,
          periodicidade: evt.periodicidade
        });
      };

      const pd = (evt.periodicidade || "").toLowerCase();

      // Evento Único
      if (pd === "" || pd === "evento único" || pd === "evento unico") {
        if (evtDate >= rangeStart && evtDate <= rangeEnd) pushOcc(evtDate);
      } else if (pd === "diário" || pd === "diario") {
        // every day: iterate days between rangeStart..rangeEnd
        const cur = new Date(rangeStart);
        while (cur <= rangeEnd) {
          pushOcc(cur);
          cur.setDate(cur.getDate() + 1);
        }
      } else if (pd === "semanal") {
        // occurs on same weekday as evtDate within range
        const targetWeekday = (evtDate.getDay() === 0 ? 6 : evtDate.getDay()-1); // 0..6 Mon..Sun
        const cur = new Date(rangeStart);
        while (cur <= rangeEnd) {
          const curWeekday = (cur.getDay() === 0 ? 6 : cur.getDay()-1);
          if (curWeekday === targetWeekday) pushOcc(new Date(cur));
          cur.setDate(cur.getDate() + 1);
        }
      } else if (pd === "mensal") {
        // same day-of-month in each month inside range
        const targetDay = evtDate.getDate();
        let cur = new Date(rangeStart);
        while (cur <= rangeEnd) {
          const daysInCurMonth = new Date(cur.getFullYear(), cur.getMonth()+1, 0).getDate();
          if (targetDay <= daysInCurMonth) {
            const candidate = new Date(cur.getFullYear(), cur.getMonth(), targetDay);
            if (candidate >= rangeStart && candidate <= rangeEnd) pushOcc(candidate);
          }
          cur.setMonth(cur.getMonth() + 1);
        }
      } else {
        // fallback: single occurrence
        if (evtDate >= rangeStart && evtDate <= rangeEnd) pushOcc(evtDate);
      }
    });

    return out;
  }, [events, mode, date, year, month, lastDay, week]);

  // helper format YYYY-MM-DD
  function toYYYYMMDD(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth()+1).padStart(2,"0");
    const day = String(d.getDate()).padStart(2,"0");
    return `${y}-${m}-${day}`;
  }

  // --- popup form component (inline) ---
  function PopupCriarEvento() {
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [dataInput, setDataInput] = useState(() => {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    });
    const [hora, setHora] = useState("");
    const [horaFim, setHoraFim] = useState("");
    const [local, setLocal] = useState("");
    const [categoria, setCategoria] = useState("");
    const [grupo, setGrupo] = useState("");
    const [turma, setTurma] = useState("");
    const [periodicidade, setPeriodicidade] = useState("Evento Único");
    const [salvando, setSalvando] = useState(false);

    async function salvar() {
      if (!nome || !dataInput) { 
        return; 
      }

      setSalvando(true);
      
      try {
        const token = localStorage.getItem('access_token');
        
        if (!token) {
          console.error('Token não encontrado');
          setSalvando(false);
          return;
        }
        
        // Construir data_inicio e data_fim no formato ISO
        const horaInicio = hora || "00:00";
        const horaFinal = horaFim || (hora ? `${String(Number(hora.split(':')[0]) + 1).padStart(2, '0')}:${hora.split(':')[1]}` : "23:59");
        const data_inicio = `${dataInput}T${horaInicio}:00`;
        const data_fim = `${dataInput}T${horaFinal}:00`;

        // Mapear periodicidade para tipo_evento e recorrencia
        let tipo_evento = "evento_unico";
        let recorrencia = null;
        
        if (periodicidade.toLowerCase() === "diário" || periodicidade.toLowerCase() === "diario") {
          tipo_evento = "evento_recorrente";
          recorrencia = "diaria";
        } else if (periodicidade.toLowerCase() === "semanal") {
          tipo_evento = "evento_recorrente";
          recorrencia = "semanal";
        } else if (periodicidade.toLowerCase() === "mensal") {
          tipo_evento = "evento_recorrente";
          recorrencia = "mensal";
        }

        const body = {
          titulo: nome,
          descricao: descricao || "",
          data_inicio,
          data_fim,
          categoria: categoria.toLowerCase() || "pessoal",
          local: local || "",
          tipo_evento,
          recorrencia,
          grupo_id: grupo ? Number(grupo) : null,
          turma_id: turma ? Number(turma) : null
        };

        console.log('Enviando evento para API:', body);

        const response = await fetch('https://api.uecehit.com.br/api/events/', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });

        console.log('Status resposta:', response.status);

        if (response.ok) {
          const novoEvento = await response.json();
          console.log('Evento criado com sucesso:', novoEvento);
          
          // Adicionar ao state local no formato interno
          setEvents(prev => [...prev, {
            id: novoEvento.id,
            nome: novoEvento.titulo,
            data: dataInput,
            hora: horaInicio,
            local: novoEvento.local,
            categoria: novoEvento.categoria,
            grupo: novoEvento.grupo_id,
            periodicidade,
            descricao: novoEvento.descricao
          }]);
          
          setShowPopup(false);
        } else {
          const errorText = await response.text();
          console.error('Erro ao criar evento - Status:', response.status);
          console.error('Resposta do servidor:', errorText);
          try {
            const errorJson = JSON.parse(errorText);
            console.error('Detalhes do erro:', errorJson);
          } catch (e) {
            console.error('Erro não é JSON:', errorText);
          }
        }
      } catch (error) {
        console.error('Erro ao salvar evento:', error);
      } finally {
        setSalvando(false);
      }
    }

    return (
      <div className="popup-overlay">
        <div className="popup-card" role="dialog" aria-modal="true">
          <button className="popup-close" onClick={() => setShowPopup(false)}>✕</button>
          <h2 className="popup-title">Criar Evento</h2>

          <input className="popup-input" placeholder="Nome do Evento:" value={nome} onChange={e=>setNome(e.target.value)} />

          <textarea 
            className="popup-input" 
            placeholder="Descrição (opcional):" 
            value={descricao} 
            onChange={e=>setDescricao(e.target.value)}
            style={{minHeight: 60, resize: 'vertical'}}
          />

          <div style={{display:"flex", gap:12, marginTop:12}}>
            <input type="date" className="popup-input" value={dataInput} onChange={e=>setDataInput(e.target.value)} />
            <input type="time" className="popup-input" placeholder="Início" value={hora} onChange={e=>setHora(e.target.value)} style={{width:150}} />
            <input type="time" className="popup-input" placeholder="Fim" value={horaFim} onChange={e=>setHoraFim(e.target.value)} style={{width:150}} />
          </div>

          <input className="popup-input" placeholder="Local:" value={local} onChange={e=>setLocal(e.target.value)} />

          <div style={{display:"flex", gap:12}}>
            <select className="popup-input" value={categoria} onChange={e=>setCategoria(e.target.value)}>
              <option value="">Selecione uma categoria</option>
              <option value="pessoal">Pessoal</option>
              <option value="reuniao">Reunião</option>
              <option value="provas">Provas</option>
              <option value="atividades_academicas">Atividades Acadêmicas</option>
            </select>
            <input 
              className="popup-input" 
              type="number" 
              placeholder="ID do Grupo (opcional)" 
              value={grupo} 
              onChange={e=>setGrupo(e.target.value)} 
            />
            <input 
              className="popup-input" 
              type="number" 
              placeholder="ID da Turma (opcional)" 
              value={turma} 
              onChange={e=>setTurma(e.target.value)} 
            />
          </div>

          <select className="popup-input" value={periodicidade} onChange={e=>setPeriodicidade(e.target.value)}>
            <option>Evento Único</option>
            <option>Diário</option>
            <option>Semanal</option>
            <option>Mensal</option>
          </select>

          <div style={{display:"flex", justifyContent:"flex-end", marginTop:14}}>
            <button className="btn-cancel" onClick={()=>setShowPopup(false)} disabled={salvando}>Cancelar</button>
            <button className="btn-save" onClick={salvar} disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER helpers for event pill ---
  function EventPill({occ}) {
    // occ: { name, time (HH:MM|null), date: Date }
    return (
      <div className="event-pill">
        <span className="event-dot" />
        <span className="event-text">{occ.name}</span>
      </div>
    );
  }

  // --- month view event lookup by day ---
  function eventsForDay(dayNumber) {
    const d = new Date(year, month, dayNumber);
    const key = toYYYYMMDD(d);
    return occurrences.filter(o => toYYYYMMDD(o.date) === key);
  }

  // --- week view events per day (and vertical positioning if time provided) ---
  function eventsForDate(dateObj) {
    const key = toYYYYMMDD(dateObj);
    return occurrences.filter(o => toYYYYMMDD(o.date) === key);
  }

  // --- day view events (all occurrences for that date) ---
  const occurrencesForCurrentDay = occurrences.filter(o => toYYYYMMDD(o.date) === toYYYYMMDD(date));

  return (
    <div className="calendar-wrapper">

      {showPopup && <PopupCriarEvento />}

      {/* Botão CRIAR + (direita acima do switch) */}
      <div style={{width:"100%", display:"flex", justifyContent:"flex-end", marginBottom:12}}>
        <button className="create-btn" onClick={()=>setShowPopup(true)}>CRIAR +</button>
      </div>


      {/* header */}
      <div className="calendar-header" style={{flexDirection:"column", gap:4, textAlign:"center"}}>
        <div style={{display:"flex", alignItems:"center", gap:40, justifyContent:"center"}}>
          <button className="arrow-btn" onClick={prev}><ChevronLeft size={30} strokeWidth={1.5} /></button>
          <h2 style={{fontWeight:700}}>{monthNames[month]} {year}</h2>
          <button className="arrow-btn" onClick={next}><ChevronRight size={30} strokeWidth={1.5} /></button>
        </div>

        {mode==="dia" && (
          <div style={{fontFamily:"Noto Sans Gujarati", fontSize:28, fontWeight:600, color:"#424040", marginTop:-6}}>
            {String(date.getDate()).padStart(2,"0")}
          </div>
        )}
      </div>

      <div
          style={{
            position: "absolute",
            top: "40px",
            right: "40px",
            display: "flex",
            background: "#F3F1F1",
            padding: "6px 10px",
            borderRadius: "10px",
            gap: "8px",
          }}
        >
          <button
            onClick={() => setView("dia")}
            style={{
              border: "none",
              background: view === "dia" ? "#FFFFFF" : "transparent",
              padding: "8px 14px",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: view === "dia" ? "0 4px 10px rgba(0,0,0,0.12)" : "none",
            }}
          >
            Dia
          </button>

          <button
            onClick={() => setView("semana")}
            style={{
              border: "none",
              background: view === "semana" ? "#FFFFFF" : "transparent",
              padding: "8px 14px",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: view === "semana" ? "0 4px 10px rgba(0,0,0,0.12)" : "none",
            }}
          >
            Semana
          </button>

          <button
            onClick={() => setView("mes")}
            style={{
              border: "none",
              background: view === "mes" ? "#FFFFFF" : "transparent",
              padding: "8px 14px",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: view === "mes" ? "0 4px 10px rgba(0,0,0,0.12)" : "none",
            }}
          >
            Mês
          </button>
        </div>


      {/* MÊS */}
      {view==="mês" && (
        <>
          <div className="calendar-weekdays">
            {["SEG","TER","QUA","QUI","SEX","SÁB","DOM"].map((w,i)=> <span key={i}>{w}</span>)}
          </div>

          <div className="calendar-grid">
            {daysMonth.map((day,i)=> (
              <div key={i} className="calendar-cell">
                {day ? (
                  <>
                    <div className="day-number">{String(day).padStart(2,"0")}</div>

                    <div className="day-events">
                      {eventsForDay(day).map((occ, idx) => (
                        <div key={occ.id || idx} className="month-event-wrap">
                          <EventPill occ={occ} />
                        </div>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            ))}
          </div>
        </>
      )}

      {/* SEMANA */}
      {view==="semana" && (
        <div style={{width:"100%", height:"100%"}}>
          {/* header row with empty column for times */}
          <div style={{display:"grid", gridTemplateColumns:"120px repeat(7, 1fr)", gap:0, marginBottom:10, alignItems:"center"}}>
            <div></div>
            {week.map((d,i)=> (
              <div key={i} style={{textAlign:"center", color:"#424040"}}>
                <div style={{fontFamily:"Nova Flat", fontSize:24}}>{["SEG","TER","QUA","QUI","SEX","SÁB","DOM"][i]}</div>
                <div style={{fontFamily:"Noto Sans Gujarati", fontSize:16, fontWeight:600, marginTop:-4}}>{String(d.getDate()).padStart(2,"0")}</div>
              </div>
            ))}
          </div>

          <div style={{display:"flex", width:"100%"}}>
            {/* times column */}
            <div style={{width:120, paddingRight:10}}>
              {hours.map((h, idx)=> (
                <div key={idx} style={{height:50, display:"flex", alignItems:"center", fontSize:14, color:"#424040"}}>{String(h).padStart(2,"0")}:00</div>
              ))}
            </div>

            {/* columns */}
            <div style={{flex:1, display:"grid", gridTemplateColumns:"repeat(7, 1fr)", position:"relative"}}>
              {week.map((d, colIndex)=> {
                const occs = eventsForDate(d);
                return (
                  <div key={colIndex} className="week-column">
                    {/* place events: if have time position by hour, else top */}
                    {occs.map((occ, k)=> {
                      if (occ.time) {
                        // position by hour: hour:minute -> compute top
                        const [hh,mm] = occ.time.split(":").map(Number);
                        const top = ( (hh - 6) * 50 ) + (mm? (mm/60)*50 : 0);
                        return (
                          <div key={k} className="week-event" style={{ top: top }}>
                            <EventPill occ={occ} />
                          </div>
                        );
                      } else {
                        return (
                          <div key={k} className="week-event" style={{ top: 6 }}>
                            <EventPill occ={occ} />
                          </div>
                        );
                      }
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* DIA */}
      {view==="dia" && (
        <div style={{width:"100%", paddingLeft:10, position:"relative", fontFamily:"Noto Sans Gujarati"}}>
          {hours.map((h, idx) => {
            const label = `${String(h).padStart(2,"0")}:00`;
            // events at this day that match this hour (or without time)
            const hourEvents = occurrencesForCurrentDay.filter(o => {
              if (!o.time) return false;
              const hh = Number(o.time.split(":")[0]);
              return hh === h;
            });
            const noTimeEvents = occurrencesForCurrentDay.filter(o => !o.time);
            return (
              <div key={idx} style={{height:50, display:"flex", alignItems:"center", position:"relative"}}>
                <span style={{width:60, fontSize:14, color:"#424040", fontWeight:600}}>{label}</span>
                <div style={{flex:1, height:1, backgroundColor:"#d9d9d9", marginLeft:10}} />
                {/* place events for this exact hour */}
                {hourEvents.map((occ, k) => (
                  <div key={k} style={{position:"absolute", left:120 + 12 + (k*8), top: idx*50 + 6, zIndex:10}}>
                    <EventPill occ={occ} />
                  </div>
                ))}
                {/* place no-time events at top only once */}
                {idx===0 && noTimeEvents.map((occ,k)=>(
                  <div key={k} style={{position:"absolute", left:120 + 12, top:6}}>
                    <EventPill occ={occ} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}




