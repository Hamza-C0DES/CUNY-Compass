import "dotenv/config";
import { prisma } from "./db.js";

async function main() {
  // Wipe existing transfer rules first so re-running this file always
  // produces exactly the rows listed below — nothing stale left over from
  // previous seed runs. Colleges are left alone (other rows may reference
  // them), only TransferCredit is cleared.
  await prisma.transferCredit.deleteMany({});

  // upsert = create if not exists, update if it does. Safe to re-run.
  const citytech = await prisma.college.upsert({
    where: { code: "CITYTECH" },
    update: {},
    create: { code: "CITYTECH", name: "New York City College of Technology" },
  });

  const ccny = await prisma.college.upsert({
    where: { code: "CCNY" },
    update: {},
    create: { code: "CCNY", name: "The City College of New York" },
  });

  // Controlled test data — deliberately fake course codes/names so you know
  // exactly what should show up in MyTransfers.tsx when you add matching
  // courses via /api/courses. Not real CUNY data — safe to fully trust for
  // testing without needing to verify against T-Rex.
  const rules: {
    fromCourseCode: string;
    fromCourseName: string;
    fromCredits: number;
    toCourseCode: string | null;
    toCourseName: string | null;
    toCredits: number;
    transferType: "DIRECT" | "ELECTIVE" | "NO_CREDIT";
    notes?: string;
  }[] = [
    {
      fromCourseCode: "TEST 101", fromCourseName: "Intro to Testing", fromCredits: 3,
      toCourseCode: "TEST 201", toCourseName: "Intro to Testing", toCredits: 3,
      transferType: "DIRECT",
    },
    {
      fromCourseCode: "TEST 102", fromCourseName: "Testing II", fromCredits: 4,
      toCourseCode: "TEST 202", toCourseName: "Advanced Testing", toCredits: 3,
      transferType: "DIRECT",
      notes: "Deliberate 4 -> 3 credit mismatch for testing display",
    },
    {
      fromCourseCode: "TEST 103", fromCourseName: "Elective Testing Topics", fromCredits: 3,
      toCourseCode: null, toCourseName: "Elective Credit Liberal Arts", toCredits: 3,
      transferType: "ELECTIVE",
    },
    {
      fromCourseCode: "TEST 104", fromCourseName: "Non-Transferable Testing", fromCredits: 3,
      toCourseCode: null, toCourseName: null, toCredits: 0,
      transferType: "NO_CREDIT",
    },
  ];

  for (const r of rules) {
    await prisma.transferCredit.upsert({
      where: {
        fromCollegeId_fromCourseCode_toCollegeId: {
          fromCollegeId: citytech.id,
          fromCourseCode: r.fromCourseCode,
          toCollegeId: ccny.id,
        },
      },
      update: {
        fromCourseName: r.fromCourseName,
        fromCredits: r.fromCredits,
        toCourseCode: r.toCourseCode,
        toCourseName: r.toCourseName,
        toCredits: r.toCredits,
        transferType: r.transferType,
        notes: r.notes ?? null,
      },
      create: {
        fromCollegeId: citytech.id,
        fromCourseCode: r.fromCourseCode,
        fromCourseName: r.fromCourseName,
        fromCredits: r.fromCredits,
        toCollegeId: ccny.id,
        toCourseCode: r.toCourseCode,
        toCourseName: r.toCourseName,
        toCredits: r.toCredits,
        transferType: r.transferType,
        notes: r.notes ?? null,
      },
    });
  }

  console.log(`✓ Wiped old rules and seeded ${rules.length} clean test rule(s) — City Tech → CCNY`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());