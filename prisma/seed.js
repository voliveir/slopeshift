const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Create modules
  const modules = [
    { name: 'Staff', description: 'Manage staff' },
    { name: 'Housing', description: 'Manage housing' },
    { name: 'Shifts', description: 'Manage shifts' },
    { name: 'Forms', description: 'Manage forms' },
    { name: 'Assets', description: 'Manage assets' },
    { name: 'Tickets', description: 'Manage tickets' },
  ];
  for (const mod of modules) {
    await prisma.module.upsert({
      where: { name: mod.name },
      update: {},
      create: {
        id: mod.name.toLowerCase(),
        name: mod.name,
        description: mod.description,
      },
    });
  }

  // Create clients
  const clients = [
    { id: 'client1', name: 'Acme Ski Resort' },
    { id: 'client2', name: 'Snowy Peaks' },
    { id: 'client3', name: 'Frosty Hills' },
  ];
  for (const client of clients) {
    await prisma.client.upsert({
      where: { id: client.id },
      update: {},
      create: client,
    });
  }

  // Assign modules to clients
  const clientModules = [
    { clientId: 'client1', moduleNames: ['Staff', 'Housing', 'Shifts'] },
    { clientId: 'client2', moduleNames: ['Forms', 'Assets', 'Tickets'] },
    { clientId: 'client3', moduleNames: ['Staff', 'Forms', 'Assets', 'Tickets'] },
  ];
  for (const cm of clientModules) {
    const clientId = cm.clientId;
    for (const moduleName of cm.moduleNames) {
      const module = await prisma.module.findUnique({ where: { name: moduleName } });
      if (module) {
        const exists = await prisma.clientModule.findFirst({
          where: { clientId, moduleId: module.id }
        });
        if (!exists) {
          await prisma.clientModule.create({
            data: { clientId, moduleId: module.id }
          });
        }
      }
    }
  }

  console.log('Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 