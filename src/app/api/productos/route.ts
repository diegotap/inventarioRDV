import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const productos = await prisma.producto.findMany();
  return NextResponse.json(productos);
}

export async function POST(request: NextRequest) {
  const { nombre, cantidad, categoria, unidad } = await request.json();
  const producto = await prisma.producto.create({
    data: { nombre, cantidad},
  });
  return NextResponse.json(producto, { status: 201 });
}