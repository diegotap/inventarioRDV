import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/mysql';

function isoToMySQLDatetime(isoString: string) {
  const date = new Date(isoString);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export async function GET() {
  const connection = await getConnection();
  const [rows] = await connection.query('SELECT * FROM reporte ORDER BY fecha DESC');
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const { fecha, nombreArchivo, usuario } = await req.json();
  const connection = await getConnection();
  const fechaMySQL = isoToMySQLDatetime(fecha);
  await connection.query(
    'INSERT INTO reporte (fecha, nombreArchivo, usuario) VALUES (?, ?, ?)',
    [fechaMySQL, nombreArchivo, usuario]
  );
  return NextResponse.json({ message: 'Reporte guardado' }, { status: 201 });
}