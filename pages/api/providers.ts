import type { NextApiRequest, NextApiResponse } from 'next';
import { listProviders } from '../../lib/airtable';
import { geocodeAddress, getMatrix, km, min } from '../../lib/geo';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
try {
const { address, campañas } = req.query as { address?: string; campañas?: string };
if (!address) return res.status(400).json({ error: 'Falta parámetro address' });
const campañasArr = campañas ? campañas.split(',').map(s => s.trim()) : [];


const origin = await geocodeAddress(address);
const providers = await listProviders({ campañas: campañasArr });


if (!providers.length) return res.json({ origin, results: [] });


const batchSize = 24; // límite práctico del endpoint
const results: any[] = [];


for (let i = 0; i < providers.length; i += batchSize) {
const batch = providers.slice(i, i + batchSize);
const matrix = await getMatrix(origin, batch.map(p => ({ lat: p.lat, lng: p.lng })));
matrix.forEach((m, idx) => {
const p = batch[idx];
results.push({
...p,
distance_m: m.distance_m,
duration_s: m.duration_s,
});
});
}


results.sort((a, b) => a.duration_s - b.duration_s);
const limit = Number(req.query.limit || 3);


const top = results.slice(0, limit).map(r => ({
id: r.id,
nombre: r.nombre,
direccion: r.direccion,
municipio: r.municipio,
estado: r.estado,
campañas: r.campañas,
tipo: r.tipo,
costoPublico: r.costoPublico,
costoHexalud: r.costoHexalud,
telefono: r.telefono,
email: r.email,
especialidad: r.especialidad,
distance_km: km(r.distance_m),
duration_min: min(r.duration_s),
mapUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(r.lat + ',' + r.lng)}`,
}));


res.json({ origin, count: results.length, results: top });
} catch (e: any) {
console.error(e);
res.status(500).json({ error: e.message || 'Error interno' });
}
}
