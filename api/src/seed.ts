import "dotenv/config";
import { prisma } from "./db.js";

async function main() {
  // upsert = create if not exists, skip if already there.
  const citytech = await prisma.college.upsert({
    where:  { code: "CITYTECH" },
    update: {},
    create: { code: "CITYTECH", name: "New York City College of Technology" },
  });

  const ccny = await prisma.college.upsert({
    where:  { code: "CCNY" },
    update: {},
    create: { code: "CCNY", name: "The City College of New York" },
  });

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
      fromCourseCode: "MAT 1475", fromCourseName: "Calculus I",    fromCredits: 4,
      toCourseCode: "MATH 20100", toCourseName:   "Calculus I",    toCredits:   4,
      transferType: "DIRECT",
    }
  ];

  for (const r of rules) {
    await prisma.transferCredit.upsert({
      where: {
        fromCollegeId_fromCourseCode_toCollegeId: {
          fromCollegeId:  citytech.id,
          fromCourseCode: r.fromCourseCode,
          toCollegeId:    ccny.id,
        },
      },
      update: {
        fromCourseName: r.fromCourseName,
        fromCredits:    r.fromCredits,
        toCourseCode:   r.toCourseCode,
        toCourseName:   r.toCourseName,
        toCredits:      r.toCredits,
        transferType:   r.transferType,
        notes:          r.notes ?? null,
      },
      create: {
        fromCollegeId:  citytech.id,
        fromCourseCode: r.fromCourseCode,
        fromCourseName: r.fromCourseName,
        fromCredits:    r.fromCredits,
        toCollegeId:    ccny.id,
        toCourseCode:   r.toCourseCode,
        toCourseName:   r.toCourseName,
        toCredits:      r.toCredits,
        transferType:   r.transferType,
        notes:          r.notes ?? null,
      },
    });
  }

  console.log(`✓ Seeded ${rules.length} transfer rule(s) — City Tech → CCNY`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
