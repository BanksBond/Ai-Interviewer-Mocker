"use client";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { ChevronsUpDown, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

function feedback({ params }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getFeedback();
  }, []);

  const getFeedback = async () => {
    setLoading(true);
    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, unwrappedParams.interviewId))
      .orderBy(UserAnswer.id);

    console.log({ result });
    setFeedbackList(result);
    setLoading(false);
  };

  const rating = feedbackList?.reduce((acc, item) => {
    return acc + +item.rating;
  }, 0);

  return (
    <div className="p-10">
      {feedbackList.length == 0 && !loading ? (
        <h2 className="font-bold text-xl text-gray-500">
          No Interview Record Found
        </h2>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-green-500 animate-bounce">
            Congratulation!
          </h2>
          <h2 className="font-bold text-2xl animate-fade-in">
            Here is your interview feedback
          </h2>
          <h2 className="text-primary text-lg my-3 animate-fade-in">
            Your overall interview rating: <strong>{rating}/5</strong>
          </h2>

          <h2 className="text-sm text-gray-500 animate-fade-in">
            Find below interview questions with <strong>Correct </strong>answer,
            <strong>Your </strong>answer and <strong>Feedback</strong> for
            improvement
          </h2>

          {feedbackList &&
            feedbackList.map((item, index) => (
              <Collapsible
                key={index}
                className="mt-5 transition-all duration-300 ease-in-out"
              >
                <CollapsibleTrigger className="p-2 bg-secondary rounded-lg my-2 text-left gap-7 w-full hover:scale-105 transition-transform">
                  <div className="flex gap-7 justify-between items-center">
                    <h2 className="text-md">{item.question}</h2>
                    <ChevronsUpDown />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="animate-slide-down">
                  <div className="flex flex-col gap-3">
                    <h2 className="text-sm p-2 red-500 p2 border rounded-lg">
                      <strong>Rating: </strong>
                      {item.rating}
                    </h2>
                    <h2 className="p-2 border rounded-lg bg-red-50 text-sm text-red-900">
                      <strong>Your Answer: </strong>
                      {item.userAns}
                    </h2>
                    <h2 className="p-2 border rounded-lg bg-green-50 text-sm text-green-900">
                      <strong>Correct Answer: </strong>
                      {item.correctAns}
                    </h2>
                    <h2 className="p-2 border rounded-lg bg-blue-50 text-sm text-primary">
                      <strong>Feedback: </strong>
                      {item.feedback}
                    </h2>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
        </>
      )}
      {loading && <Loader2Icon className="animate-spin" />}

      <Button
        onClick={() => {
          router.replace("/dashboard");
        }}
        className="mt-5 hover:scale-105 transition-transform"
      >
        Go Home
      </Button>
    </div>
  );
}

export default feedback;
