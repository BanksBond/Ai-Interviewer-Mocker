"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Lightbulb, Loader2, WebcamIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, use, useState } from "react";
import Webcam from "react-webcam";

function Interview({ params }) {
  const [interviewData, setInterviewData] = useState([]);
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const unwrappedParams = use(params);

  useEffect(() => {
    console.log(unwrappedParams.interviewId);
    GetInterviewDetails();
  }, [unwrappedParams]);

  //Used to get Interview details by MockID/Interview Id
  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, unwrappedParams.interviewId));

    setInterviewData(result);
  };

  return (
    <div className="my-10 flex flex-col ">
      <h2 className="font-bold text-2xl">Let's Get Started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col my-5  gap-5 ">
          <div className="flex flex-col gap-5 p-5 rounded-lg border">
            <h2 className="text-lg flex gap-2">
              <strong>Job Role / Position: </strong>
              {interviewData[0]?.jobPosition ? (
                interviewData[0].jobPosition
              ) : (
                <Skeleton className="h-8 w-1/2" />
              )}
            </h2>
            <h2 className="text-lg flex gap-2">
              <strong>Job Description: </strong>
              {interviewData[0]?.jobDesc ? (
                interviewData[0].jobDesc
              ) : (
                <Skeleton className="h-8 w-1/2" />
              )}
            </h2>
            <h2 className="text-lg flex gap-2">
              <strong>Years of Experience: </strong>
              {interviewData[0]?.jobExperience ? (
                interviewData[0].jobExperience
              ) : (
                <Skeleton className="h-8 w-1/2" />
              )}
            </h2>
          </div>
          <div className="p-5 border rounded-lg border-yellow-300 bg bg-yellow-100">
            <h2 className="flex gap-2 items-center text-yellow-500">
              <Lightbulb />
              <strong>Information</strong>
            </h2>
            <h2 className="mt-2 text-yellow-500">
              Enable Video Web Cam and Microphone to start your AI Generated
              Mock Interview, It has 5 question which you can answer and at the
              last you will get the report on the basis of your answer. NOTE: We
              never record your video, Web cam access you can disable at any
              time if you want.
            </h2>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          {webCamEnabled ? (
            <Webcam
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={() => setWebCamEnabled(false)}
              mirrored={true}
              audio={false}
              width={720}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                facingMode: "user",
              }}
            />
          ) : (
            <>
              <WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary rounded-lg border " />

              <Button
                variant="ghost"
                onClick={() => setWebCamEnabled(true)}
                className="w-full text-base"
              >
                Enable Webcam and Microphone
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-end items-end my-4">
        <Link
          href={
            "/dashboard/interview/" + unwrappedParams.interviewId + "/start"
          }
          onClick={() => {
            setLoading(true);
          }}
        >
          <Button>
            {loading && <Loader2 className="animate-spin" />}
            Start Interview
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Interview;
