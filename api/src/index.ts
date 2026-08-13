import "dotenv/config";
import express from "express";
import type { NextFunction, Request, Response } from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.js";
import { prisma } from "./db.js";
import { requireAuth } from "./middleware/requireAuth.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT ?? 3000;

app.get('/', (req, res) => res.send('Root route working!')); 

// Health check — confirms the server is running.
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRouter);
app.post("/api/courses", requireAuth, async (req, res) => {
  const {campus, department, courseCode, courseName, credits, grade } = req.body;
  if (!campus || !department || !courseCode || !courseName){
    res.status(400).json({error: "Missing Campus and/or Department and/or Course-Code and/or Course-Name."});
    return;
  }
  const creditsNum = Number(credits);
  if (!Number.isInteger(creditsNum) || creditsNum < 0 || creditsNum > 12){
    res.status(400).json({error: "Credits Must Be A Whole Number, Between 0 And 12."});
    return;
  }
  try {
    const course = await prisma.course.create({
      data: {
        campus,
        department,
        courseCode: courseCode.toUpperCase(),
        courseName,
        credits: creditsNum,
        grade: grade || null,
        user_id: req.userId!,
      },
    });
    res.status(201).json({ course })
  } catch(err) {
    if(typeof err == "object" && err !== null && "code" in err && err.code === "P2002") {
      res.status(409).json({error: "You've already added this course"});
      return;
    }
    console.error(err);
    res.status(500).json({error: "Could not save course"})
  }

  
});

// TODO: implement the rest of the CUNY Compass routes.
// The capstone requires full CRUD (create, read, update, delete) on at least
// one core resource, plus a data model with relationships between tables.

// Catches errors passed via next(err) — including rejected promises from
// asyncHandler-wrapped routes — so a DB error returns 500 to one request
// instead of crashing the whole process. Must be registered last, and must
// keep all four parameters (that arity is how Express recognizes it as an
// error handler, even though `_next` is unused).
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

///transfer route
app.get("/transfer", async (req, res) => {
  const { fromCourseCode } = req.query;
  if (!fromCourseCode) {
    res.status(400).json({error: "fromCourseCode is required"})
    return;
  }

  const courseTransferRules = await prisma.transferCredit.findMany({
    where: { fromCourseCode: fromCourseCode as string },
    select: {
        // fromCollegeId: true,
        fromCollege: {
          select: { name: true }
          },
        fromCourseCode: true,
        fromCourseName: true,
        fromCredits: true,

        // toCollegeId: true,
        toCollege: {
          select: {name: true}
        },
        toCourseCode: true,
        toCourseName: true,
        toCredits: true
      }
  });
  
  res.json(courseTransferRules)
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
//AI use disclosure: Claude Code was used to generate much of this file, 
// including the auth route and all its associated middleware, JWT logic
