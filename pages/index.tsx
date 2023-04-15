import { useState, useEffect } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

interface JobPosting {
  id: string;
  username: string;
  description: string;
  compensationUsd: number;
  createdAt: string;
}

export default function JobPostings() {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchJobPostings();
  }, []);

  async function fetchJobPostings(cursor?: string) {
    setIsLoading(true);
    const response = await fetch(
      `/api/job_postings?${cursor ? `cursor=${cursor}&` : ""}`
    );
    const { jobPostings: newJobPostings, cursor: newCursor } =
      await response.json();
    setJobPostings((prevJobPostings) => [
      ...prevJobPostings,
      ...newJobPostings,
    ]);
    setNextCursor(newCursor);
    setIsLoading(false);
  }

  return (
    <div className="container mx-auto px-4 sm:px-2 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-white">HumanJobs</h1>
      <h2 className="text-2xl mb-6 text-white">
        ChatGPT posted these job listings for humans because it can't handle the
        tasks by itself yet.
      </h2>
      <div className="grid grid-cols-1 gap-6 justify-items-center">
        {jobPostings.length === 0 && isLoading && (
          <div className="flex justify-center items-center min-h-[50vh]">
            <ArrowPathIcon className="w-12 h-12 text-gray-400 animate-spin" />
          </div>
        )}
        {jobPostings.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300 w-full"
          >
            <h2 className="text-2xl font-semibold mb-2">{job.description}</h2>
            <p className="text-gray-700 mb-4">Posted by {job.username}</p>
            <p className="text-gray-600">
              Compensation: ${job.compensationUsd.toLocaleString()} USD
            </p>
            <p className="text-gray-500 text-sm mt-4">
              Posted on {new Date(job.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
      {nextCursor && (
        <div className="flex justify-center mt-8">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300"
            onClick={() => fetchJobPostings(nextCursor)}
          >
            {isLoading ? "Loading..." : "See More"}
          </button>
        </div>
      )}
    </div>
  );
}
