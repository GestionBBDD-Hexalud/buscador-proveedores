import Airtable from 'airtable';


const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
.base(process.env.AIRTABLE_BASE_ID!);


const TABLE = process.env.AIRTABLE_TABLE_NAME!;


export type Provider = {
id: string;
nombre: string;
direccion: string;
municipio: string;
estado: string;
lat: number;
lng: number;
campañas: string[];
tipo: 'Crédito' | 'Referencia' | string;
costoPublico?: number;
costoHexalud?: number;
telefono?: string;
email?: string;
especialidad?: string | string[];
};


export async function listProviders({ campañas }: { campañas?: string[] } = {}): Promise<Provider[]> {
const filters: string[] = ["{Activo} = 1"]; // Checkbox marcado
if (campañas && campañas.length > 0) {
const or = campañas.map(c => `FIND('${c}', ARRAYJOIN({Campañas}))`);
filters.push(`OR(${or.join(',')})`);
}
const filterByFormula = filters.length ? `AND(${filters.join(',')})` : '';


const records = await base(TABLE).select({ filterByFormula, maxRecords: 2000 }).all();


return records.map(r => ({
id: r.id,
nombre: (r.get('Nombre') as string) || '',
direccion: (r.get('Direccion') as string) || '',
municipio: (r.get('Municipio') as string) || '',
estado: (r.get('Estado') as string) || '',
lat: Number(r.get('Lat')),
lng: Number(r.get('Lng')),
campañas: (r.get('Campañas') as string[]) || [],
tipo: (r.get('TipoProveedor') as string) || '',
costoPublico: r.get('CostoPublico') as number | undefined,
costoHexalud: r.get('CostoHexalud') as number | undefined,
telefono: r.get('Telefono') as string | undefined,
email: r.get('Email') as string | undefined,
especialidad: r.get('Especialidad') as string | string[] | undefined,
}));
}
