import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.producto.deleteMany(); // Limpia la tabla antes de insertar

  await prisma.producto.createMany({
    data: [
      // INVENTARIO
      { nombre: "Arroz Dorado", cantidad: 35, categoria: "Inventario", unidad: "unid." },
      { nombre: "Azúcar Itamarati", cantidad: 35, categoria: "Inventario", unidad: "unid." },
      { nombre: "Aceite Soya", cantidad: 28, categoria: "Inventario", unidad: "unid." },
      { nombre: "Soda Victoria (unid.)", cantidad: 4, categoria: "Inventario", unidad: "unid." },
      { nombre: "Vinagre Italo", cantidad: 0, categoria: "Inventario", unidad: "" },
      { nombre: "Sal", cantidad: 4, categoria: "Inventario", unidad: "unid." },
      { nombre: "Lejia Margot", cantidad: 26, categoria: "Inventario", unidad: "unid." },
      { nombre: "Detergente", cantidad: 74, categoria: "Inventario", unidad: "unid." },
      { nombre: "Lavavajilla Lesly", cantidad: 3, categoria: "Inventario", unidad: "unid." },
      { nombre: "Doña Gusta Carne", cantidad: 1, categoria: "Inventario", unidad: "tira" },
      { nombre: "Doña Gusta Gallina", cantidad: 2, categoria: "Inventario", unidad: "unid." },
      { nombre: "Ajinomoto", cantidad: 1, categoria: "Inventario", unidad: "unid." },
      { nombre: "Chuño", cantidad: 1520, categoria: "Inventario", unidad: "g" },
      { nombre: "Harina", cantidad: 2, categoria: "Inventario", unidad: "unid." },
      { nombre: "Mantequilla", cantidad: 1.03, categoria: "Inventario", unidad: "kg" },
      { nombre: "Huevo", cantidad: 58, categoria: "Inventario", unidad: "unid." },
      { nombre: "Salsa Ostion Galón", cantidad: 4, categoria: "Inventario", unidad: "galón" },
      { nombre: "Aceite Ajonjolí", cantidad: 1, categoria: "Inventario", unidad: "galón" },
      { nombre: "Fósforo x 10 cubos", cantidad: 4, categoria: "Inventario", unidad: "cubos" },
      { nombre: "Champiñón lata 425 gr", cantidad: 18, categoria: "Inventario", unidad: "unid." },
      { nombre: "Cebada x 01 kg", cantidad: 0.5, categoria: "Inventario", unidad: "kg" },
      { nombre: "Frejol Canario", cantidad: 27.5, categoria: "Inventario", unidad: "kg" },
      { nombre: "Quinua", cantidad: 1.035, categoria: "Inventario", unidad: "kg" },
      { nombre: "Sillao galón", cantidad: 0, categoria: "Inventario", unidad: "galón" },
      { nombre: "Pan Molido", cantidad: 1, categoria: "Inventario", unidad: "kg" },

      // DISTRIBUIDORA CSM
      { nombre: "Molitalia Spaguetti", cantidad: 12, categoria: "Distribuidora CSM", unidad: "unid." },
      { nombre: "Molitalia Cabello Angel", cantidad: 27, categoria: "Distribuidora CSM", unidad: "unid." },
      { nombre: "Molitalia Macarrón", cantidad: 0, categoria: "Distribuidora CSM", unidad: "" },
      { nombre: "Pomodoro Salsa Clásica", cantidad: 30, categoria: "Distribuidora CSM", unidad: "unid." },
      { nombre: "Caramelo Full Limón", cantidad: 9, categoria: "Distribuidora CSM", unidad: "pack" },
      { nombre: "Leche Gloria", cantidad: 20, categoria: "Distribuidora CSM", unidad: "unid." },
      { nombre: "Leche Gloria (cajas)", cantidad: 4, categoria: "Distribuidora CSM", unidad: "caja" },
      { nombre: "Durazno A-1 820 gr.", cantidad: 3, categoria: "Distribuidora CSM", unidad: "unid." },
      { nombre: "Filete Fanny", cantidad: 0, categoria: "Distribuidora CSM", unidad: "" },
      { nombre: "Leche Gloria Slim", cantidad: 0, categoria: "Distribuidora CSM", unidad: "" },

      // MANTARO
      { nombre: "Tomate", cantidad: 12.315, categoria: "Mantaro", unidad: "kg" },
      { nombre: "Tomate", cantidad: 1.675, categoria: "Mantaro", unidad: "kg" },
      { nombre: "Mirasol", cantidad: 0, categoria: "Mantaro", unidad: "" },
      { nombre: "Maracuyá", cantidad: 0, categoria: "Mantaro", unidad: "" },
      { nombre: "Beterraga", cantidad: 1.265, categoria: "Mantaro", unidad: "kg" },
      { nombre: "Zanahoria", cantidad: 20.1, categoria: "Mantaro", unidad: "kg" },
      { nombre: "Limón", cantidad: 3.175, categoria: "Mantaro", unidad: "kg" },
      { nombre: "Pepino", cantidad: 0, categoria: "Mantaro", unidad: "" },
      { nombre: "Palta", cantidad: 6.885, categoria: "Mantaro", unidad: "kg" },
    ]
  });
  console.log('Seed completado');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });