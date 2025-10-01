import axios from 'axios';


export type Coord = { lat: number; lng: number };


export async function geocodeAddress(address: string): Promise<Coord> {
const token = process.env.MAPBOX_TOKEN!;
const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`;
const { data } = await axios.get(url, { params: { access_token: token, limit: 1, language: 'es' } });
if (!data.features?.length) throw new Error('No se pudo geocodificar la dirección');
const [lng, lat] = data.features[0].center;
return { lat, lng };
}


export type MatrixResult = { distance_m: number; duration_s: number }[];


export async function getMatrix(origin: Coord, targets: Coord[]): Promise<MatrixResult> {
const token = process.env.MAPBOX_TOKEN!;
const coords = [origin, ...targets];
const coordStr = coords.map(c => `${c.lng},${c.lat}`).join(';');
const url = `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${coordStr}`;
const { data } = await axios.get(url, { params: { access_token: token, annotations: 'distance,duration' } });
const distances: number[] = data.distances[0].slice(1);
const durations: number[] = data.durations[0].slice(1);
return distances.map((d, i) => ({ distance_m: d, duration_s: durations[i] }));
}


export function km(m: number) { return Math.round((m / 1000) * 10) / 10; }
export function min(s: number) { return Math.round(s / 60); }
