import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const checklist = [
  {
    name: "Kondisi Ban",
    description: "Periksa kondisi dan tekanan ban kendaraan.",
    sortOrder: 1,
  },
  {
    name: "Sistem Pengereman",
    description: "Pastikan rem berfungsi dengan baik.",
    sortOrder: 2,
  },
  {
    name: "Lampu Kendaraan",
    description: "Periksa lampu utama, lampu sein, dan lampu rem.",
    sortOrder: 3,
  },
  {
    name: "Bahan Bakar",
    description: "Pastikan bahan bakar mencukupi untuk perjalanan.",
    sortOrder: 4,
  },
  {
    name: "Oli Mesin",
    description: "Periksa volume dan kondisi oli mesin.",
    sortOrder: 5,
  },
  {
    name: "Air Radiator",
    description: "Pastikan cairan pendingin mesin mencukupi.",
    sortOrder: 6,
  },
  {
    name: "Aki Kendaraan",
    description: "Periksa kondisi aki dan kelistrikan kendaraan.",
    sortOrder: 7,
  },
  {
    name: "Perlengkapan Keselamatan",
    description: "Pastikan perlengkapan keselamatan tersedia.",
    sortOrder: 8,
  },
];

async function main() {
  for (const item of checklist) {
    await prisma.inspectionTemplate.upsert({
      where: {
        id: `00000000-0000-4000-8000-${String(item.sortOrder).padStart(12, "0")}`,
      },
      update: {
        name: item.name,
        description: item.description,
        sortOrder: item.sortOrder,
        isActive: true,
      },
      create: {
        id: `00000000-0000-4000-8000-${String(item.sortOrder).padStart(12, "0")}`,
        ...item,
      },
    });
  }

  console.log("Checklist PUI berhasil dimasukkan.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
