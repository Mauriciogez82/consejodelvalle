// Datos: editá acá para corregir nombres o fechas. Mes: 10 = noviembre, 11 = diciembre.
const G1 = [["Antorcha de Salvación","Carlos y Cristina Paniagua"],["Pueblo de Dios","Lucas y Eugenia Nievas"]];
const G2 = [["Cuenta Conmigo","Héctor y Mirta Medina"],["Catedral de Alabanza (Berrotarán)","Juan y Patricia Ghissi"]];
const G3 = [["Manantial de Vida","Hugo y Cristina Barbulo"],["Catedral de Alabanza (Río III)","Elvio y Roxana Pepino"],["Centro Familiar Mi Esperanza","Mirta Edith López"]];
const G4 = [["Centro Cristiano Río de los Sauces","José y Marta Torres"],["Catedral de Alabanza (Los Cóndores)","Mauricio y Ana Laura González"],["Centro Cristiano (Alta Gracia)","Sergio y Guzmán"]];

const MONTHS = [
  { id:"noviembre", name:"Noviembre 2026", m:10, weeks:[[2,8,G1],[9,15,G2],[16,22,G3],[23,29,G4]] },
  { id:"diciembre", name:"Diciembre 2026", m:11, weeks:[[1,6,G1],[7,13,G2],[14,20,G3],[21,31,G4]] }
];
const MN = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];

const today = new Date(); today.setHours(0,0,0,0);
const all = [];
MONTHS.forEach(mo => mo.weeks.forEach(([a,b,g]) => {
  all.push({ mo, a, b, g, start:new Date(2026,mo.m,a), end:new Date(2026,mo.m,b) });
}));
const status = w => today > w.end ? "past" : today >= w.start ? "current" : "next";
const label = w => `${w.a} al ${w.b}`;
const esc = s => s.replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

const live = all.find(w => status(w) === "current");
const upcoming = live || all.find(w => status(w) === "next");

// Destacado
const now = document.getElementById("now");
if (upcoming) {
  const days = Math.round((upcoming.start - today) / 864e5);
  const tag = live ? "Esta semana" : days === 1 ? "Empieza mañana" : `Empieza en ${days} días`;
  now.innerHTML = `<div class="tag">${tag}</div>
    <h2>Del ${label(upcoming)} de ${MN[upcoming.mo.m]}</h2>
    <ul>${upcoming.g.map(([c,p]) => `<li><b>${esc(c)}</b><span>${esc(p)}</span></li>`).join("")}</ul>`;
} else {
  now.innerHTML = `<h2>La cadena de ayuno terminó</h2><p>Gracias por orar y ayunar por todos.</p>`;
}

// Calendario
document.getElementById("calendar").innerHTML = MONTHS.map(mo => `
  <section class="month" id="${mo.id}"><h2>${mo.name}</h2>
  ${all.filter(w => w.mo === mo).map(w => {
    const s = status(w);
    return `<article class="week ${s}">
      <div class="when"><strong>${label(w)}</strong><small>${MN[w.mo.m]}</small>
        ${s === "current" ? '<br><span class="badge">En curso</span>' : s === "next" && w === upcoming ? '<br><span class="badge">Próxima</span>' : ""}</div>
      <ul class="churches">${w.g.map(([c,p]) =>
        `<li data-s="${esc((c+" "+p).toLowerCase())}"><b>${esc(c)}</b><span>${esc(p)}</span></li>`).join("")}</ul>
    </article>`;
  }).join("")}</section>`).join("");

// Buscador
document.getElementById("q").addEventListener("input", e => {
  const q = e.target.value.trim().toLowerCase();
  document.querySelectorAll(".week").forEach(wk => {
    let any = false;
    wk.querySelectorAll("li").forEach(li => {
      const ok = !q || li.dataset.s.includes(q);
      li.classList.toggle("hide", !ok);
      any = any || ok;
    });
    wk.classList.toggle("hide", !any);
  });
});
