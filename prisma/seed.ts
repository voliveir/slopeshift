const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

async function main() {
  console.log('Seeding started');
  // --- Modules ---
  const moduleNames = [
    'Shifts', 'Staff', 'Housing', 'Certifications', 'Assets', 'Incidents',
    'Tickets', 'Passes', 'Guests', 'Rentals', 'Lessons', 'Forms', 'Dashboard', 'Forecasting', 'Telemetry'
  ]
  const modules = await Promise.all(
    moduleNames.map(name =>
      prisma.module.upsert({
        where: { name },
        update: {},
        create: { name, description: `${name} module` },
      })
    )
  )
  console.log('Modules seeded');

  // --- Clients ---
  // Find or create client by name (since only 'id' is unique)
  let client = await prisma.client.findFirst({ where: { name: 'Demo Resort' } });
  if (!client) {
    client = await prisma.client.create({ data: { name: 'Demo Resort' } });
  }
  console.log('Client seeded:', client.id);

  // --- Test Insert ---
  const testStaff = await prisma.staff.create({
    data: {
      clientId: client.id,
      name: 'Test User',
      email: 'testuser@example.com',
      position: 'Tester',
      status: 'active',
    }
  });
  console.log('Inserted test user:', testStaff.id);

  // --- Assign Modules to Client ---
  for (const mod of modules) {
    const existing = await prisma.clientModule.findFirst({ where: { clientId: client.id, moduleId: mod.id } });
    if (!existing) {
      await prisma.clientModule.create({ data: { clientId: client.id, moduleId: mod.id } });
    }
  }
  console.log('Client modules assigned');

  // --- Staff ---
  const positions = ['Lift Operator', 'Rental Tech', 'Ski Patrol', 'Instructor', 'Manager', 'Cook', 'Housekeeper']
  const staff = []
  for (let i = 0; i < 15; i++) {
    staff.push(await prisma.staff.create({
      data: {
        clientId: client.id,
        name: `Staff Member ${i + 1}`,
        email: `staff${i + 1}@demo.com`,
        position: randomFrom(positions),
        status: randomFrom(['active', 'inactive', 'on_leave']),
      },
    }))
  }

  // --- Shifts ---
  const shifts = []
  for (let i = 0; i < 10; i++) {
    const assignedStaff = staff.slice(i % staff.length, (i % staff.length) + 3).map(s => ({ id: s.id }))
    shifts.push(await prisma.shift.create({
      data: {
        clientId: client.id,
        title: `Shift ${i + 1}`,
        start: randomDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()),
        end: randomDate(new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
        staff: { connect: assignedStaff },
      },
    }))
  }

  // --- TimeEntries ---
  for (let i = 0; i < 30; i++) {
    await prisma.timeEntry.create({
      data: {
        clientId: client.id,
        staffId: randomFrom(staff).id,
        shiftId: randomFrom(shifts).id,
        clockIn: randomDate(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), new Date()),
        clockOut: null,
        source: randomFrom(['mobile', 'kiosk', 'web']),
      },
    })
  }

  // --- Housing ---
  const housingUnits = []
  for (let i = 0; i < 8; i++) {
    housingUnits.push(await prisma.housing.create({
      data: {
        clientId: client.id,
        address: `${100 + i} Alpine Way`,
        unit: String.fromCharCode(65 + i),
        beds: randomFrom([2, 4, 6]),
        residents: { connect: staff.slice(i, i + 2).map(s => ({ id: s.id })) },
      },
    }))
  }

  // --- Certifications ---
  for (let i = 0; i < 20; i++) {
    await prisma.certification.create({
      data: {
        clientId: client.id,
        name: `Certification ${i + 1}`,
        staffId: randomFrom(staff).id,
        issueDate: randomDate(new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), new Date()),
        expiryDate: randomDate(new Date(), new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)),
        authority: randomFrom(['NSAA', 'PSIA', 'AASI', 'Demo Authority']),
      },
    })
  }

  // --- Assets & MaintenanceLogs ---
  const assetTypes = ['snowcat', 'lift', 'vehicle', 'snowmobile']
  const assets = []
  for (let i = 0; i < 10; i++) {
    assets.push(await prisma.asset.create({
      data: {
        clientId: client.id,
        name: `Asset ${i + 1}`,
        type: randomFrom(assetTypes),
        serial: `ASSET-${i + 1}`,
        nextServiceDate: randomDate(new Date(), new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)),
      },
    }))
  }
  for (let i = 0; i < 20; i++) {
    await prisma.maintenanceLog.create({
      data: {
        clientId: client.id,
        assetId: randomFrom(assets).id,
        performedAt: randomDate(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), new Date()),
        description: `Maintenance log ${i + 1}`,
      },
    })
  }

  // --- Incidents ---
  for (let i = 0; i < 10; i++) {
    await prisma.incidentReport.create({
      data: {
        clientId: client.id,
        type: randomFrom(['injury', 'equipment', 'safety']),
        description: `Incident ${i + 1}`,
        location: randomFrom(['Green Circle', 'Blue Square', 'Black Diamond']),
        staffRefs: { connect: [randomFrom(staff)].map(s => ({ id: s.id })) },
        attachments: [],
        validated: Math.random() > 0.5,
      },
    })
  }

  // --- Guests, Passes, Tickets ---
  const guests = []
  for (let i = 0; i < 12; i++) {
    guests.push(await prisma.guest.create({
      data: {
        clientId: client.id,
        name: `Guest ${i + 1}`,
        email: `guest${i + 1}@demo.com`,
        phone: `555-12${100 + i}`,
      },
    }))
  }
  const passes = []
  for (let i = 0; i < 10; i++) {
    passes.push(await prisma.pass.create({
      data: {
        clientId: client.id,
        code: `PASS-${i + 1}`,
        guestId: randomFrom(guests).id,
        validFrom: randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()),
        validTo: randomDate(new Date(), new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)),
      },
    }))
  }
  for (let i = 0; i < 20; i++) {
    await prisma.ticket.create({
      data: {
        clientId: client.id,
        code: `TICKET-${i + 1}`,
        guestId: randomFrom(guests).id,
        passId: randomFrom(passes).id,
        status: randomFrom(['active', 'voided', 'used']),
        issuedAt: randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()),
      },
    })
  }

  // --- RentalItems & RentalTransactions ---
  const rentalTypes = ['ski', 'board', 'helmet', 'boots']
  const rentalItems = []
  for (let i = 0; i < 10; i++) {
    rentalItems.push(await prisma.rentalItem.create({
      data: {
        clientId: client.id,
        name: `Rental Item ${i + 1}`,
        type: randomFrom(rentalTypes),
        serial: `RENTAL-${i + 1}`,
        status: randomFrom(['available', 'rented', 'maintenance']),
      },
    }))
  }
  for (let i = 0; i < 15; i++) {
    await prisma.rentalTransaction.create({
      data: {
        clientId: client.id,
        guestId: randomFrom(guests).id,
        itemId: randomFrom(rentalItems).id,
        staffId: randomFrom(staff).id,
        rentedAt: randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()),
        returnedAt: Math.random() > 0.5 ? randomDate(new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), new Date()) : null,
      },
    })
  }

  // --- Lessons, InstructorProfiles, GroupBookings ---
  const instructors = []
  for (let i = 0; i < 5; i++) {
    instructors.push(await prisma.instructorProfile.create({
      data: {
        clientId: client.id,
        staffId: staff[i].id,
        skills: ['ski', 'snowboard'],
      },
    }))
  }
  const groups = []
  for (let i = 0; i < 5; i++) {
    groups.push(await prisma.groupBooking.create({
      data: {
        clientId: client.id,
        name: `Group ${i + 1}`,
        guests: { connect: guests.slice(i, i + 2).map(g => ({ id: g.id })) },
      },
    }))
  }
  for (let i = 0; i < 10; i++) {
    await prisma.lesson.create({
      data: {
        clientId: client.id,
        title: `Lesson ${i + 1}`,
        instructorId: randomFrom(instructors).id,
        groupId: randomFrom(groups).id,
        start: randomDate(new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
        end: randomDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)),
      },
    })
  }

  // --- Forms & FormResponses ---
  const formTemplates = []
  for (let i = 0; i < 5; i++) {
    formTemplates.push(await prisma.formTemplate.create({
      data: {
        clientId: client.id,
        name: `Form Template ${i + 1}`,
        fields: ['name', 'signature', 'date'],
      },
    }))
  }
  for (let i = 0; i < 15; i++) {
    await prisma.formResponse.create({
      data: {
        clientId: client.id,
        templateId: randomFrom(formTemplates).id,
        guestId: randomFrom(guests).id,
        data: JSON.stringify({ name: randomFrom(guests).name, signature: 'Signature', date: new Date().toISOString() }),
        submittedAt: randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()),
      },
    })
  }

  // --- Intelligence Layer ---
  for (let i = 0; i < 5; i++) {
    await prisma.opsDashboardSnapshot.create({
      data: {
        clientId: client.id,
        data: JSON.stringify({ laborCost: Math.random() * 1000, revenue: Math.random() * 5000, margin: Math.random() * 2000 }),
        createdAt: randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()),
      },
    })
    await prisma.forecastingSuggestion.create({
      data: {
        clientId: client.id,
        data: JSON.stringify({ staffNeeded: Math.floor(Math.random() * 20), reason: 'Random event' }),
        createdAt: randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()),
      },
    })
    await prisma.telemetryPing.create({
      data: {
        clientId: client.id,
        assetId: randomFrom(assets).id,
        data: JSON.stringify({ systemHealth: 'Good', responseTime: Math.floor(Math.random() * 100), activeUsers: Math.floor(Math.random() * 10), errorRate: Math.random() }),
        pingedAt: randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()),
        createdAt: randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()),
      },
    })
  }
  console.log('Intelligence layer seeded');
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

module.exports = { main } 