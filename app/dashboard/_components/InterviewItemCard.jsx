"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

function InterviewItemCard({ item }) {
  const router = useRouter();

  const onStart = () => {
    router.push(`/dashboard/interview/${item.mockId}`);
  };

  const onFeedback = () => {
    router.push(`/dashboard/interview/${item.mockId}/feedback`);
  };
  return (
    <div className="p-3 border shadow-sm rounded-lg border-gray-300">
      <h2 className="font-bold text-primary">
        <strong>Job Role / Position: </strong>
        {item.jobPosition}
      </h2>
      <h2 className="text-sm text-gray-600 my-1">
        <strong>{item.jobExperience} Year(s) of Experience</strong>
      </h2>

      <h2 className="text-xs text-gray-500">Created At: {item.createdAt}</h2>

      <div className="flex justify-between gap-4 mt-2 ">
        <Button
          onClick={onFeedback}
          size="sm"
          variant="outline"
          className="w-full font-bold"
        >
          Feedback
        </Button>
        <Button
          onClick={onStart}
          size="sm"
          variant="default"
          className="w-full font-bold"
        >
          Start
        </Button>
      </div>
    </div>
  );
}

export default InterviewItemCard;
