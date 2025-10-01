import { useState } from 'react';
<div className="max-w-3xl mx-auto p-6">
<h1 className="text-3xl font-bold mb-4">Buscador de Proveedores</h1>
<div className="bg-white p-4 rounded-2xl shadow mb-4">
<label className="block text-sm font-medium">Dirección del paciente</label>
<input
className="w-full border rounded-xl p-3 mt-1"
placeholder="Ej. Av Paseo La Niña 150, Boca del Río, Ver"
value={address}
onChange={e => setAddress(e.target.value)}
/>


<div className="mt-4">
<label className="block text-sm font-medium mb-1">Vista por campaña</label>
<div className="flex gap-2 flex-wrap">
{options.map(op => (
<button
key={op}
onClick={() => setCampañas(prev => prev.includes(op) ? prev.filter(x => x!==op) : [...prev, op])}
className={`px-3 py-2 rounded-xl border ${campañas.includes(op) ? 'bg-black text-white' : 'bg-white'}`}
>{op}</button>
))}
</div>
</div>


<button
onClick={search}
className="mt-4 px-4 py-3 rounded-2xl bg-emerald-600 text-white font-semibold w-full"
disabled={loading || !address}
>{loading ? 'Buscando…' : 'Buscar'}</button>
</div>


{error && (
<div className="bg-amber-50 text-amber-900 p-3 rounded-xl mb-4 border border-amber-200">{error}</div>
)}


<ul className="space-y-3">
{results.map(r => (
<li key={r.id} className="bg-white p-4 rounded-2xl shadow">
<div className="flex items-start justify-between gap-4">
<div>
<h3 className="text-lg font-semibold">{r.nombre}</h3>
<p className="text-sm text-gray-600">{r.direccion} · {r.municipio}, {r.estado}</p>
<p className="text-sm mt-1">{r.tipo} · {r.campañas?.join(', ')}</p>
<p className="text-sm mt-1">
{r.costoHexalud ? `Costo Hexalud: $${r.costoHexalud}` : ''}
{r.costoPublico ? ` · Público: $${r.costoPublico}` : ''}
</p>
<p className="text-sm mt-1">{r.email || ''} {r.telefono ? ` · ${r.telefono}` : ''}</p>
</div>
<div className="text-right min-w-[140px]">
<div className="text-2xl font-bold">{r.duration_min} min</div>
<div className="text-sm text-gray-500">{r.distance_km} km</div>
<a className="inline-block mt-2 text-emerald-700 underline" href={r.mapUrl} target="_blank" rel="noreferrer">Ir en Maps</a>
</div>
</div>
</li>
))}
</ul>
</div>
</div>
);
}
