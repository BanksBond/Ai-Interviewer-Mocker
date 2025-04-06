"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { chatSession } from "@/utils/GeminiAiModel";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { Loader2, Mic, StopCircle, WebcamIcon } from "lucide-react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import useSpeechToText from "react-hook-speech-to-text";
import Webcam from "react-webcam";
import { toast } from "sonner";

function RecordAnswerSection({
  mockInterviewQuestions,
  activeQuestion,
  interviewData,
}) {
  const [userAnswer, setUserAnswer] = React.useState("");
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });
  if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;

  useEffect(() => {
    if (results.length > 0) {
      const combinedResults = results
        .map((result) => result.transcript)
        .join(" ");
      setUserAnswer((prev) => prev + " " + combinedResults);
      setResults([]); // Clear results after processing
    }
  }, [results, setResults]);

  useEffect(() => {
    if (!isRecording && userAnswer?.length > 10) {
      updateUserAnswer();
    }
  }, [userAnswer]);

  const SaveUserAnswer = () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
      setLoading(false);
    }
  };

  const updateUserAnswer = async () => {
    setLoading(true);
    const feedbackPrompt =
      "Question:" +
      mockInterviewQuestions[activeQuestion]?.question +
      ", User answer: " +
      userAnswer +
      ", Depends on question and user answer for given interview question " +
      "please give us rating for answer and feedback as area of improvement if any " +
      "in just 3-5 lines to improve it in JSON format with rating and feedback field";

    const res = await chatSession.sendMessage(feedbackPrompt);

    const mockJsonResp = res.response
      .text()
      .replace("```json", "")
      .replace("```", "");

    const JsonFeedbackResp = JSON.parse(mockJsonResp);
    console.log(JsonFeedbackResp);

    const resp = await db.insert(UserAnswer).values({
      mockIdRef: interviewData.mockId,
      question: mockInterviewQuestions[activeQuestion].Question,
      correctAns: mockInterviewQuestions[activeQuestion].Answer,
      userAns: userAnswer,
      feedback: JsonFeedbackResp?.feedback,
      rating: JsonFeedbackResp?.rating,
      userEmail: user.primaryEmailAddress.emailAddress,
      createdAt: moment().format("DD-MM-YYYY"),
    });

    if (resp) {
      toast.success("Your answer has been saved successfully");
      setUserAnswer("");
      setResults([]);
    }

    setResults([]);
    setLoading(false);
  };

  return (
    <>
      <div className="flex justify-center flex-col relative">
        {webCamEnabled ? (
          <>
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
            <Button
              variant="outline"
              onClick={() => setWebCamEnabled(false)}
              className="w-full text-base mt-8"
            >
              Disable Webcam
            </Button>
          </>
        ) : (
          <>
            <WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary rounded-lg border " />

            <Button
              variant="outline"
              onClick={() => setWebCamEnabled(true)}
              className="w-full text-base"
            >
              Enable Webcam
            </Button>
          </>
        )}
        <Button
          disabled={loading}
          variant="outline"
          className="my-10"
          onClick={SaveUserAnswer}
        >
          {isRecording ? (
            <h2 className="flex gap-2 items-center animate-pulse text-red-600">
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <StopCircle />
                  Stop Recording
                </>
              )}
            </h2>
          ) : (
            <h2 className="flex gap-2 items-center text-primary">
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Mic />
                  Start Recording
                </>
              )}
            </h2>
          )}
        </Button>
        {/* Subtitles overlay */}
        {isRecording && (
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg text-center">
            {interimResult || userAnswer || "Listening..."}
          </div>
        )}
      </div>
    </>
  );
}

export default RecordAnswerSection;
