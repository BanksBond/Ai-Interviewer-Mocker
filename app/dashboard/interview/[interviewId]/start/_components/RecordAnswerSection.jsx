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
    results.map((result) =>
      setUserAnswer((prev) => prev + " " + result.transcript)
    );
  }, [results]);

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
    <div className="flex  justify-center flex-col">
      {/* <div className="flex flex-col mt-20 items-center justify-center rounded-lg p-5 bg-black">
        <WebcamIcon className="absolute" width={200} height={200} />
        <Webcam
          mirrored
          color="white"
          style={{
            height: 300,
            width: "100%",
            zIndex: 10,
          }}
        />
      </div> */}
      {webCamEnabled ? (
        <>
          <Webcam
            onUserMedia={() => setWebCamEnabled(true)}
            onUserMediaError={() => setWebCamEnabled(false)}
            mirrored={true}
            audio={false}
            // height={720}
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
      <div>
        <ul>
          {results.map((result) => (
            <li key={result.timestamp}>{result.transcript}</li>
          ))}
          {interimResult && <li>{interimResult}</li>}
        </ul>
      </div>
    </div>
  );
}

export default RecordAnswerSection;
