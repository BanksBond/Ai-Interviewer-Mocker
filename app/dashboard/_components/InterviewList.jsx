"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import InterviewItemCard from "./InterviewItemCard";

function InterviewList() {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    user && getInterviewList();
  }, [user]);

  const getInterviewList = async () => {
    setLoading(true);
    const result = await db
      .select()
      .from(MockInterview)
      .where(
        eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress)
      )
      .orderBy(desc(MockInterview.id));

    setInterviewList(result);
    setLoading(false);
  };

  return (
    <div>
      <h2 className="text-xl mt-4 font-semibold">Previous Interview List</h2>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-col-3 xl:grid-cols-3 gap-5 my-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-24 rounded-md">
              <Skeleton className="h-full w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-col-3 xl:grid-cols-3 gap-5 my-3">
          {interviewList &&
            interviewList.map((item, index) => (
              <InterviewItemCard key={index} item={item} />
            ))}
        </div>
      )}
    </div>
  );
}

export default InterviewList;
