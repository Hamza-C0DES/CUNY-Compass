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
    {
    fromCourseCode: "MAT 1190",  fromCourseName: "Quantitative Reasoning",                              fromCredits: 3,
    toCourseCode:   "MATH 15000", toCourseName:  "Mathematics for the Contemporary World",              toCredits:   3,
    transferType: "DIRECT",
  },
  {
    fromCourseCode: "MAT 1100CO", fromCourseName: "Quantitative Reasoning with Corequisite Support",   fromCredits: 4,
    toCourseCode:   null,         toCourseName:   "MATH 99902: Elective Credit Liberal Arts",          toCredits:   4,
    transferType: "ELECTIVE",
  },
  {
    fromCourseCode: "MAT 1272",  fromCourseName: "Statistics with Probability",                        fromCredits: 3,
    toCourseCode:   "CSC 21700", toCourseName:   "Probability and Statistics for Computer Science",    toCredits:   3,
    transferType: "DIRECT",
  },
  {
    fromCourseCode: "MAT 1275",   fromCourseName: "College Algebra and Trigonometry",                  fromCredits: 4,
    toCourseCode:   "MATH 19000", toCourseName:   "College Algebra and Trigonometry",                  toCredits:   3,
    transferType: "DIRECT",
  },
  {
    fromCourseCode: "MAT 1275CO", fromCourseName: "College Algebra and Trigonometry with Corequisite Support", fromCredits: 4,
    toCourseCode:   "MATH 19000", toCourseName:   "College Algebra and Trigonometry",                  toCredits:   3,
    transferType: "DIRECT",
  },
  {
    fromCourseCode: "MAT 1375",   fromCourseName: "Precalculus", fromCredits: 4,
    toCourseCode:   "MATH 19500", toCourseName:   "Precalculus", toCredits:   4,
    transferType: "DIRECT",
  },
  {
    fromCourseCode: "MAT 1475",   fromCourseName: "Calculus I", fromCredits: 4,
    toCourseCode:   "MATH 20100", toCourseName:   "Calculus I", toCredits:   4,
    transferType: "DIRECT",
  },
  {
    fromCourseCode: "MAT 1575",   fromCourseName: "Calculus II",                                       fromCredits: 4,
    toCourseCode:   "MATH 21200", toCourseName:   "Calculus II with Introduction to Multivariable Functions", toCredits: 4,
    transferType: "DIRECT",
  },
  {
    fromCourseCode: "MAT 1630",   fromCourseName: "Introduction to Computational Science",             fromCredits: 3,
    toCourseCode:   "MATH 36600", toCourseName:   "Introduction to Applied Mathematical Computation",  toCredits:   3,
    transferType: "DIRECT",
  },
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
