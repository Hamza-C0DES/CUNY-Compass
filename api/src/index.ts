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

// Health check - confirms the server is running.
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});


// authentication middleware mount
app.use("/api/auth", authRouter);


// courses route create operation
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
        credits,
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

// courses route read operation
app.get("/api/courses", requireAuth, async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      where: { user_id: req.userId! }
    });

    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch courses" });
  }
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});


// transfer route
app.get("/transfer", async (req, res) => {
  const { searchCourses } = req.query;

  if (!searchCourses) {
    res.status(400).json({error: "Search a course is required"})
    return;
  }

  const courseTransferRules = await prisma.transferCredit.findMany({
    where: {
      OR: [
        {
          fromCourseCode: {
            contains: searchCourses as string,
            mode: "insensitive",
          }
        },
        {
          fromCourseName: {
            contains: searchCourses as string,
            mode: "insensitive",
          },
        },
      ]
    },
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

// port
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});

// TODO: AI disclosure