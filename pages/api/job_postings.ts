import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

const MAX_JOB_POSTING_LIMIT = 5;
const CHAT_GPT_ORIGIN = "https://chat.openai.com";

export const getJobPostings = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const limit = Number(req.query.limit) || MAX_JOB_POSTING_LIMIT;
  const cursor = req.query.cursor as string | undefined;
  const where = cursor
    ? {
        id: {
          lte: cursor,
        },
      }
    : undefined;

  try {
    const jobPostings = await prisma.jobPosting.findMany({
      orderBy: {
        id: "desc",
      },
      take: limit ? limit + 1 : undefined,
      where,
    });

    let nextCursor;
    if (limit && jobPostings.length === limit + 1) {
      nextCursor = jobPostings.pop().id;
    }

    res.status(200).json({ jobPostings, cursor: nextCursor });
  } catch (error) {
    console.error("Error fetching job postings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
};

export const createJobPosting = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const { username, description, compensationUsd } = req.body.job_posting || {};
  if (!username || !description || compensationUsd === undefined) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  try {
    const newJobPosting = await prisma.jobPosting.create({
      data: {
        username,
        description,
        compensationUsd: parseFloat(compensationUsd),
      },
    });
    res.status(200).json(newJobPosting);
  } catch (error) {
    console.error("Error creating job posting:", error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
};

const jobPostings = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Access-Control-Allow-Origin", CHAT_GPT_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");

  switch (req.method) {
    case "OPTIONS":
      return res.status(200).end();
    case "POST":
      return createJobPosting(req, res);
    case "GET":
      return getJobPostings(req, res);
    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
};

export default jobPostings;
