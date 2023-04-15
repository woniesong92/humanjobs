import { NextApiRequest, NextApiResponse } from "next";
import { getJobPostings, createJobPosting } from "./job_postings";

jest.mock("../../lib/prisma", () => ({
  __esModule: true,
  default: {
    jobPosting: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    $disconnect: jest.fn(),
  },
}));

const mockFindMany =
  jest.requireMock("../../lib/prisma").default.jobPosting.findMany;
const mockCreate =
  jest.requireMock("../../lib/prisma").default.jobPosting.create;

describe("getJobPostings", () => {
  test("should return job postings and cursor when there are more results", async () => {
    // Mock request and response objects
    const req = {
      method: "GET",
      query: { limit: 2 },
    } as unknown as NextApiRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as NextApiResponse;

    // Mock job postings data
    const mockedJobPostings = [
      { id: "3", title: "Job 3" },
      { id: "2", title: "Job 2" },
      { id: "1", title: "Job 1" },
    ];

    mockFindMany.mockResolvedValue(mockedJobPostings);

    await getJobPostings(req, res);

    expect(mockFindMany).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      jobPostings: [
        { id: "3", title: "Job 3" },
        { id: "2", title: "Job 2" },
      ],
      cursor: "1",
    });
  });

  test("should return job postings without cursor when there are no more results", async () => {
    // Mock request and response objects
    const req = {
      method: "GET",
      query: { limit: 3 },
    } as unknown as NextApiRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as NextApiResponse;

    // Mock job postings data
    const mockedJobPostings = [
      { id: "3", title: "Job 3" },
      { id: "2", title: "Job 2" },
      { id: "1", title: "Job 1" },
    ];

    mockFindMany.mockResolvedValue(mockedJobPostings);

    await getJobPostings(req, res);

    expect(mockFindMany).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      jobPostings: mockedJobPostings,
      cursor: undefined,
    });
  });
});

describe("createJobPosting", () => {
  beforeEach(() => {
    mockCreate.mockReset();
  });

  test("should create a job posting and return the created object", async () => {
    // Mock request and response objects
    const req = {
      method: "POST",
      body: {
        job_posting: {
          username: "testuser",
          description: "Test job description",
          compensationUsd: "1000",
        },
      },
    } as unknown as NextApiRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as NextApiResponse;

    // Mock the created job posting data
    const mockedCreatedJobPosting = {
      id: "1",
      username: "testuser",
      description: "Test job description",
      compensationUsd: 1000,
      createdAt: new Date(),
    };

    mockCreate.mockResolvedValue(mockedCreatedJobPosting);

    await createJobPosting(req, res);

    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        username: "testuser",
        description: "Test job description",
        compensationUsd: 1000,
      },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockedCreatedJobPosting);
  });

  test("should return an error when required fields are missing", async () => {
    // Mock request and response objects with missing fields
    const req = {
      method: "POST",
      body: {
        job_posting: {
          username: "testuser",
          // Missing description and compensationUsd
        },
      },
    } as unknown as NextApiRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as NextApiResponse;

    await createJobPosting(req, res);

    expect(mockCreate).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Missing required fields",
    });
  });

  // Additional test cases...
});
