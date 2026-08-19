import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "./db.js";

const DEMO_EMAIL = "demo@cunycompass.edu";
const DEMO_PASSWORD = "password";

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

  const brooklyn = await prisma.college.upsert({
    where: { code: "BROOKLYN" },
    update: {},
    create: { code: "BROOKLYN", name: "Brooklyn College" },
  });

  const johnjay = await prisma.college.upsert({
    where: { code: "JOHNJAY" },
    update: {},
    create: { code: "JOHNJAY", name: "John Jay College of Criminal Justice" },
  });

  const colleges: Record<string, { id: string }> = {
    CCNY: ccny,
    BROOKLYN: brooklyn,
    JOHNJAY: johnjay,
  };

  // Demo data across math, science, accounting, history, and physics.
  // Modeled on real NYCCT/CCNY/Brooklyn/John Jay course numbering styles,
  // but not verified against T-Rex — treat as realistic demo data, not
  // confirmed articulations.
  const rules: {
    toCollege: "CCNY" | "BROOKLYN" | "JOHNJAY";
    fromCourseCode: string;
    fromCourseName: string;
    fromCredits: number;
    toCourseCode: string | null;
    toCourseName: string | null;
    toCredits: number;
    transferType: "DIRECT" | "ELECTIVE" | "NO_CREDIT";
    notes?: string;
  }[] = [
    // ── CCNY: MATH ──────────────────────────────────────────────────────
    {
      toCollege: "CCNY", fromCourseCode: "MAT 1275", fromCourseName: "College Algebra and Trigonometry", fromCredits: 4,
      toCourseCode: "MATH 19000", toCourseName: "College Algebra and Trigonometry", toCredits: 3,
      transferType: "DIRECT",
      notes: "Credit reduction: 4 credits at NYCCT transfer as 3 at CCNY",
    },
    {
      toCollege: "CCNY", fromCourseCode: "MAT 1375", fromCourseName: "Precalculus", fromCredits: 4,
      toCourseCode: "MATH 19500", toCourseName: "Precalculus", toCredits: 4,
      transferType: "DIRECT",
    },
    {
      toCollege: "CCNY", fromCourseCode: "MAT 1475", fromCourseName: "Calculus I", fromCredits: 4,
      toCourseCode: "MATH 20100", toCourseName: "Calculus I", toCredits: 4,
      transferType: "DIRECT",
    },
    {
      toCollege: "CCNY", fromCourseCode: "MAT 1575", fromCourseName: "Calculus II", fromCredits: 4,
      toCourseCode: "MATH 21200", toCourseName: "Calculus II", toCredits: 4,
      transferType: "DIRECT",
    },
    {
      toCollege: "CCNY", fromCourseCode: "MAT 2675", fromCourseName: "Calculus III", fromCredits: 4,
      toCourseCode: "MATH 21300", toCourseName: "Calculus III (Multivariable)", toCredits: 4,
      transferType: "DIRECT",
    },
    {
      toCollege: "CCNY", fromCourseCode: "MAT 2680", fromCourseName: "Linear Algebra", fromCredits: 3,
      toCourseCode: "MATH 34600", toCourseName: "Linear Algebra", toCredits: 3,
      transferType: "DIRECT",
    },
    {
      toCollege: "CCNY", fromCourseCode: "MAT 1272", fromCourseName: "Statistics", fromCredits: 3,
      toCourseCode: null, toCourseName: "Elective Credit — Liberal Arts", toCredits: 3,
      transferType: "ELECTIVE",
      notes: "No direct statistics equivalent; awarded as liberal arts elective credit",
    },

    // ── SCIENCE (Biology / Chemistry) ──────────────────────────────────
    {
      toCollege: "CCNY", fromCourseCode: "BIO 1101", fromCourseName: "Biology I", fromCredits: 4,
      toCourseCode: "BIO 10100", toCourseName: "Biology Foundations I", toCredits: 4,
      transferType: "DIRECT",
    },
    {
      toCollege: "CCNY", fromCourseCode: "BIO 1201", fromCourseName: "Biology II", fromCredits: 4,
      toCourseCode: "BIO 10200", toCourseName: "Biology Foundations II", toCredits: 4,
      transferType: "DIRECT",
    },
    {
      toCollege: "CCNY", fromCourseCode: "CHEM 1110", fromCourseName: "General Chemistry I", fromCredits: 4,
      toCourseCode: "CHEM 10301", toCourseName: "General Chemistry I", toCredits: 4,
      transferType: "DIRECT",
    },
    {
      toCollege: "CCNY", fromCourseCode: "CHEM 1210", fromCourseName: "General Chemistry II", fromCredits: 4,
      toCourseCode: "CHEM 10401", toCourseName: "General Chemistry II", toCredits: 4,
      transferType: "DIRECT",
    },
    {
      toCollege: "CCNY", fromCourseCode: "BIO 2311", fromCourseName: "Anatomy and Physiology I", fromCredits: 4,
      toCourseCode: null, toCourseName: "Elective Credit — Science", toCredits: 4,
      transferType: "ELECTIVE",
      notes: "CCNY has no direct A&P equivalent in the biology major sequence",
    },
    {
      toCollege: "CCNY", fromCourseCode: "BIO 3302", fromCourseName: "Microbiology", fromCredits: 4,
      toCourseCode: "BIO 21100", toCourseName: "Microbiology", toCredits: 4,
      transferType: "DIRECT",
    },

    // ── ACCOUNTING ──────────────────────────────────────────────────────
    {
      toCollege: "CCNY", fromCourseCode: "ACC 1101", fromCourseName: "Principles of Accounting I", fromCredits: 4,
      toCourseCode: "ECO 20100", toCourseName: "Principles of Accounting I", toCredits: 3,
      transferType: "DIRECT",
      notes: "Credit reduction: 4 credits at NYCCT transfer as 3 at CCNY",
    },
    {
      toCollege: "CCNY", fromCourseCode: "ACC 1201", fromCourseName: "Principles of Accounting II", fromCredits: 4,
      toCourseCode: "ECO 20200", toCourseName: "Principles of Accounting II", toCredits: 3,
      transferType: "DIRECT",
      notes: "Credit reduction: 4 credits at NYCCT transfer as 3 at CCNY",
    },
    {
      toCollege: "CCNY", fromCourseCode: "ACC 2101", fromCourseName: "Intermediate Accounting I", fromCredits: 4,
      toCourseCode: null, toCourseName: "Elective Credit — Business", toCredits: 4,
      transferType: "ELECTIVE",
      notes: "No direct intermediate accounting match in CCNY sequence",
    },
    {
      toCollege: "CCNY", fromCourseCode: "ACC 2402", fromCourseName: "Taxation", fromCredits: 4,
      toCourseCode: null, toCourseName: null, toCredits: 0,
      transferType: "NO_CREDIT",
      notes: "Specialized career course; no CCNY equivalent, does not transfer",
    },

    // ── HISTORY ─────────────────────────────────────────────────────────
    {
      toCollege: "CCNY", fromCourseCode: "HIS 1101", fromCourseName: "History of Western Civilization to 1500", fromCredits: 3,
      toCourseCode: "HIST 20300", toCourseName: "Early Western Civilization", toCredits: 3,
      transferType: "DIRECT",
    },
    {
      toCollege: "CCNY", fromCourseCode: "HIS 1201", fromCourseName: "History of Western Civilization Since 1500", fromCredits: 3,
      toCourseCode: "HIST 20400", toCourseName: "Modern Western Civilization", toCredits: 3,
      transferType: "DIRECT",
    },
    {
      toCollege: "CCNY", fromCourseCode: "HIS 2402", fromCourseName: "United States History to 1865", fromCredits: 3,
      toCourseCode: "HIST 10900", toCourseName: "United States History I", toCredits: 3,
      transferType: "DIRECT",
    },
    {
      toCollege: "CCNY", fromCourseCode: "HIS 3208", fromCourseName: "History of New York City", fromCredits: 3,
      toCourseCode: null, toCourseName: "Elective Credit — Liberal Arts", toCredits: 3,
      transferType: "ELECTIVE",
      notes: "No direct NYC-history equivalent; transfers as liberal arts elective",
    },

    // ── PHYSICS ─────────────────────────────────────────────────────────
    {
      toCollege: "CCNY", fromCourseCode: "PHYS 1433", fromCourseName: "General Physics I (Algebra-Based)", fromCredits: 4,
      toCourseCode: "PHYS 20300", toCourseName: "General Physics I", toCredits: 4,
      transferType: "DIRECT",
    },
    {
      toCollege: "CCNY", fromCourseCode: "PHYS 1434", fromCourseName: "General Physics II (Algebra-Based)", fromCredits: 4,
      toCourseCode: "PHYS 20400", toCourseName: "General Physics II", toCredits: 4,
      transferType: "DIRECT",
    },
    {
      toCollege: "CCNY", fromCourseCode: "PHYS 1441", fromCourseName: "Physics I (Calculus-Based)", fromCredits: 5,
      toCourseCode: "PHYS 20700", toCourseName: "University Physics I", toCredits: 4,
      transferType: "DIRECT",
      notes: "Credit reduction: 5 credits at NYCCT transfer as 4 at CCNY",
    },
    {
      toCollege: "CCNY", fromCourseCode: "PHYS 1442", fromCourseName: "Physics II (Calculus-Based)", fromCredits: 5,
      toCourseCode: "PHYS 20800", toCourseName: "University Physics II", toCredits: 4,
      transferType: "DIRECT",
      notes: "Credit reduction: 5 credits at NYCCT transfer as 4 at CCNY",
    },
    {
      toCollege: "CCNY", fromCourseCode: "PHYS 2601", fromCourseName: "Physics of Sound Technology", fromCredits: 3,
      toCourseCode: null, toCourseName: null, toCredits: 0,
      transferType: "NO_CREDIT",
      notes: "Career-specific technology course; does not transfer to CCNY",
    },

    // ── BROOKLYN COLLEGE ────────────────────────────────────────────────
    {
      toCollege: "BROOKLYN", fromCourseCode: "MAT 1275", fromCourseName: "College Algebra and Trigonometry", fromCredits: 4,
      toCourseCode: "MATH 1006", toCourseName: "College Algebra", toCredits: 3,
      transferType: "DIRECT",
      notes: "Credit reduction: 4 credits at NYCCT transfer as 3 at Brooklyn",
    },
    {
      toCollege: "BROOKLYN", fromCourseCode: "MAT 1475", fromCourseName: "Calculus I", fromCredits: 4,
      toCourseCode: "MATH 1201", toCourseName: "Calculus I", toCredits: 4,
      transferType: "DIRECT",
    },
    {
      toCollege: "BROOKLYN", fromCourseCode: "BIO 1101", fromCourseName: "Biology I", fromCredits: 4,
      toCourseCode: "BIOL 1000", toCourseName: "General Biology I", toCredits: 4,
      transferType: "DIRECT",
    },
    {
      toCollege: "BROOKLYN", fromCourseCode: "CHEM 1110", fromCourseName: "General Chemistry I", fromCredits: 4,
      toCourseCode: "CHEM 1100", toCourseName: "General Chemistry I", toCredits: 4,
      transferType: "DIRECT",
    },
    {
      toCollege: "BROOKLYN", fromCourseCode: "ACC 1101", fromCourseName: "Principles of Accounting I", fromCredits: 4,
      toCourseCode: null, toCourseName: "Elective Credit — Business", toCredits: 4,
      transferType: "ELECTIVE",
      notes: "No direct accounting-principles equivalent in Brooklyn's business sequence",
    },
    {
      toCollege: "BROOKLYN", fromCourseCode: "HIS 2402", fromCourseName: "United States History to 1865", fromCredits: 3,
      toCourseCode: "HIST 1130", toCourseName: "United States History to 1877", toCredits: 3,
      transferType: "DIRECT",
    },
    {
      toCollege: "BROOKLYN", fromCourseCode: "ACC 2402", fromCourseName: "Taxation", fromCredits: 4,
      toCourseCode: null, toCourseName: null, toCredits: 0,
      transferType: "NO_CREDIT",
      notes: "Specialized career course; no Brooklyn equivalent, does not transfer",
    },

    // ── JOHN JAY COLLEGE ────────────────────────────────────────────────
    {
      toCollege: "JOHNJAY", fromCourseCode: "MAT 1275", fromCourseName: "College Algebra and Trigonometry", fromCredits: 4,
      toCourseCode: "MAT 108", toCourseName: "College Algebra", toCredits: 3,
      transferType: "DIRECT",
      notes: "Credit reduction: 4 credits at NYCCT transfer as 3 at John Jay",
    },
    {
      toCollege: "JOHNJAY", fromCourseCode: "MAT 1272", fromCourseName: "Statistics", fromCredits: 3,
      toCourseCode: "MAT 141", toCourseName: "Statistics I", toCredits: 3,
      transferType: "DIRECT",
    },
    {
      toCollege: "JOHNJAY", fromCourseCode: "HIS 2402", fromCourseName: "United States History to 1865", fromCredits: 3,
      toCourseCode: "HIS 231", toCourseName: "United States History I", toCredits: 3,
      transferType: "DIRECT",
    },
    {
      toCollege: "JOHNJAY", fromCourseCode: "HIS 3208", fromCourseName: "History of New York City", fromCredits: 3,
      toCourseCode: null, toCourseName: "Elective Credit — Liberal Arts", toCredits: 3,
      transferType: "ELECTIVE",
      notes: "No direct NYC-history equivalent; transfers as liberal arts elective",
    },
    {
      toCollege: "JOHNJAY", fromCourseCode: "ACC 1101", fromCourseName: "Principles of Accounting I", fromCredits: 4,
      toCourseCode: null, toCourseName: null, toCredits: 0,
      transferType: "NO_CREDIT",
      notes: "John Jay does not offer an accounting sequence; course does not transfer",
    },
    {
      toCollege: "JOHNJAY", fromCourseCode: "BIO 1101", fromCourseName: "Biology I", fromCredits: 4,
      toCourseCode: "SCI 102", toCourseName: "General Biology", toCredits: 4,
      transferType: "DIRECT",
    },
  ];

  for (const r of rules) {
    const toCollege = colleges[r.toCollege];
    await prisma.transferCredit.upsert({
      where: {
        fromCollegeId_fromCourseCode_toCollegeId: {
          fromCollegeId: citytech.id,
          fromCourseCode: r.fromCourseCode,
          toCollegeId: toCollege.id,
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
        toCollegeId: toCollege.id,
        toCourseCode: r.toCourseCode,
        toCourseName: r.toCourseName,
        toCredits: r.toCredits,
        transferType: r.transferType,
        notes: r.notes ?? null,
      },
    });
  }

  // Demo user so the "My Transfers" / "View My Courses" screens aren't empty
  // during a walkthrough. Safe to re-run — upserted by email.
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const demoUser = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: { passwordHash },
    create: { fullName: "Demo Student", email: DEMO_EMAIL, passwordHash },
  });

  // Courses the demo user has already taken at City Tech, mirroring some of
  // the rules above so a search against them shows real transfer results.
  const courses: {
    campus: string;
    department: string;
    courseCode: string;
    courseName: string;
    credits: string;
    grade: string;
  }[] = [
    { campus: "CITYTECH", department: "MAT", courseCode: "MAT 1275", courseName: "College Algebra and Trigonometry", credits: "4", grade: "A" },
    { campus: "CITYTECH", department: "MAT", courseCode: "MAT 1475", courseName: "Calculus I", credits: "4", grade: "B+" },
    { campus: "CITYTECH", department: "BIO", courseCode: "BIO 1101", courseName: "Biology I", credits: "4", grade: "A-" },
    { campus: "CITYTECH", department: "CHEM", courseCode: "CHEM 1110", courseName: "General Chemistry I", credits: "4", grade: "B" },
    { campus: "CITYTECH", department: "ACC", courseCode: "ACC 1101", courseName: "Principles of Accounting I", credits: "4", grade: "A" },
    { campus: "CITYTECH", department: "HIS", courseCode: "HIS 2402", courseName: "United States History to 1865", credits: "3", grade: "B" },
  ];

  for (const c of courses) {
    await prisma.course.upsert({
      where: {
        user_id_campus_courseCode: {
          user_id: demoUser.id,
          campus: c.campus,
          courseCode: c.courseCode,
        },
      },
      update: {
        department: c.department,
        courseName: c.courseName,
        credits: c.credits,
        grade: c.grade,
      },
      create: {
        user_id: demoUser.id,
        campus: c.campus,
        department: c.department,
        courseCode: c.courseCode,
        courseName: c.courseName,
        credits: c.credits,
        grade: c.grade,
      },
    });
  }

  console.log(`✓ Wiped old rules and seeded ${rules.length} rule(s) — City Tech → CCNY / Brooklyn / John Jay`);
  console.log(`✓ Seeded demo user (${DEMO_EMAIL} / ${DEMO_PASSWORD}) with ${courses.length} course(s)`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());