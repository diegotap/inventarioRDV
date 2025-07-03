import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { nombre, cantidad, precio } = await request.json();
  const id = Number(params.id);
  const producto = await prisma.producto.update({
    where: { id },
    data: { nombre, cantidad},
  });
  return NextResponse.json(producto);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  await prisma.producto.delete({ where: { id } });
  return NextResponse.json({ message: 'Producto eliminado' }, { status: 204 });
}