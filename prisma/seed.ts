import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // --- Staff ---
  const alice = await prisma.staff.create({
    data: {
      name: 'Alice Johnson',
      email: 'alice@slopeshift.com',
      position: 'Lift Operator',
      status: 'active',
    },
  })
  const bob = await prisma.staff.create({
    data: {
      name: 'Bob Smith',
      email: 'bob@slopeshift.com',
      position: 'Rental Tech',
      status: 'active',
    },
  })
  const carol = await prisma.staff.create({
    data: {
      name: 'Carol Lee',
      email: 'carol@slopeshift.com',
      position: 'Ski Patrol',
      status: 'on_leave',
    },
  })

  // --- Shifts ---
  const shift1 = await prisma.shift.create({
    data: {
      title: 'Morning Shift',
      start: new Date(Date.now() - 2 * 60 * 60 * 1000),
      end: new Date(Date.now() + 2 * 60 * 60 * 1000),
      staff: { connect: [{ id: alice.id }, { id: bob.id }] },
    },
  })

  // --- TimeEntry ---
  await prisma.timeEntry.createMany({
    data: [
      {
        staffId: alice.id,
        shiftId: shift1.id,
        clockIn: new Date(Date.now() - 2 * 60 * 60 * 1000),
        clockOut: null,
        source: 'mobile',
      },
      {
        staffId: bob.id,
        shiftId: shift1.id,
        clockIn: new Date(Date.now() - 2 * 60 * 60 * 1000),
        clockOut: null,
        source: 'kiosk',
      },
    ],
  })

  // --- Task ---
  await prisma.task.create({
    data: {
      title: 'Check Lift Safety',
      status: 'todo',
      assignedStaff: { connect: [{ id: alice.id }] },
      dueDate: new Date(Date.now() + 3 * 60 * 60 * 1000),
      checklist: ['Inspect cables', 'Test emergency stop'],
    },
  })

  // --- Asset & MaintenanceLog ---
  const snowcat = await prisma.asset.create({
    data: {
      name: 'Snowcat 3000',
      type: 'snowcat',
      serial: 'SNOW-3000-001',
      nextServiceDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  })
  await prisma.maintenanceLog.create({
    data: {
      assetId: snowcat.id,
      performedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      description: 'Oil change and inspection',
    },
  })

  // --- IncidentReport ---
  await prisma.incidentReport.create({
    data: {
      type: 'injury',
      description: 'Minor wrist sprain on beginner slope',
      location: 'Green Circle',
      staffRefs: { connect: [{ id: carol.id }] },
      attachments: [],
      validated: true,
    },
  })

  // --- Guest, Pass, Ticket ---
  const guest = await prisma.guest.create({
    data: {
      name: 'Derek Guest',
      email: 'derek@example.com',
      phone: '555-1234',
    },
  })
  const pass = await prisma.pass.create({
    data: {
      code: 'PASS-001',
      guestId: guest.id,
      validFrom: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      validTo: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000),
    },
  })
  await prisma.ticket.create({
    data: {
      code: 'TICKET-001',
      guestId: guest.id,
      passId: pass.id,
      status: 'active',
      issuedAt: new Date(),
    },
  })

  // --- RentalItem & RentalTransaction ---
  const skis = await prisma.rentalItem.create({
    data: {
      name: 'Atomic Redster',
      type: 'ski',
      serial: 'SKI-001',
      status: 'available',
    },
  })
  await prisma.rentalTransaction.create({
    data: {
      guestId: guest.id,
      itemId: skis.id,
      staffId: bob.id,
      rentedAt: new Date(Date.now() - 30 * 60 * 1000),
      returnedAt: null,
    },
  })

  // --- Lesson, InstructorProfile, GroupBooking ---
  const instructor = await prisma.instructorProfile.create({
    data: {
      staffId: alice.id,
      skills: ['ski', 'snowboard'],
    },
  })
  const group = await prisma.groupBooking.create({
    data: {
      name: 'Family Ski Lesson',
      guests: { connect: [{ id: guest.id }] },
    },
  })
  await prisma.lesson.create({
    data: {
      title: 'Beginner Group Lesson',
      instructorId: instructor.id,
      groupId: group.id,
      start: new Date(Date.now() + 1 * 60 * 60 * 1000),
      end: new Date(Date.now() + 2 * 60 * 60 * 1000),
    },
  })

  // --- Housing, MoveIn, MoveOut, HousingIssue ---
  const housing = await prisma.housing.create({
    data: {
      address: '123 Alpine Way',
      unit: 'A',
      beds: 4,
      residents: { connect: [{ id: alice.id }, { id: bob.id }] },
    },
  })
  await prisma.moveIn.create({
    data: {
      housingId: housing.id,
      staffId: alice.id,
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
  })
  await prisma.moveOut.create({
    data: {
      housingId: housing.id,
      staffId: bob.id,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  })
  await prisma.housingIssue.create({
    data: {
      housingId: housing.id,
      staffId: alice.id,
      description: 'Leaky faucet in kitchen',
      status: 'open',
    },
  })

  // --- FormTemplate & FormResponse ---
  const waiver = await prisma.formTemplate.create({
    data: {
      name: 'Liability Waiver',
      fields: ['name', 'signature', 'date'],
    },
  })
  await prisma.formResponse.create({
    data: {
      templateId: waiver.id,
      guestId: guest.id,
      responses: JSON.stringify({ name: 'Derek Guest', signature: 'D. Guest', date: new Date().toISOString() }),
      signedPdf: null,
    },
  })

  // --- Intelligence Layer ---
  await prisma.opsDashboardSnapshot.create({
    data: {
      timestamp: new Date(),
      laborCost: 320.5,
      revenue: 1200.0,
      margin: 879.5,
    },
  })
  await prisma.forecastingSuggestion.create({
    data: {
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      staffNeeded: 12,
      reason: 'Expected snowstorm and holiday weekend',
    },
  })
  await prisma.telemetryPing.create({
    data: {
      assetId: snowcat.id,
      runHours: 120.5,
      fuelUsed: 30.2,
      waterUsed: 500.0,
      pingedAt: new Date(),
    },
  })

  // TODO: Add more advanced seeding for certifications, checklists, attachments, etc.
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 