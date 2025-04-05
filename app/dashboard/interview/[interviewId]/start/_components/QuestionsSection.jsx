import { Lightbulb, Volume2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

function QuestionsSection({ mockInterviewQuestions, activeQuestion }) {
  const textToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      if (!window.speechSynthesis.speaking) {
        const speech = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(speech);
      } else {
        toast.warning(
          "Speech synthesis is already speaking. Please wait until it finishes."
        );
      }
    } else {
      alert("Your browser does not support speech synthesis.");
    }
  };

  return (
    <div className="p-5 border rounded-lg my-10">
      <div className="grid grid-cols-2 md:grid-cols-3 ls:grid-cols-4 gap-5">
        {mockInterviewQuestions.map((question, index) => (
          <h2
            key={index}
            className={`p-2  rounded-full 
                text-sm md:text:md text-center cursor-pointer 
                 ${
                   activeQuestion == index
                     ? "bg-primary text-white"
                     : "bg-secondary"
                 }`}
          >
            Question #{index + 1}
          </h2>
        ))}
      </div>
      <h2 className="my-5 text-md md:text-lg">
        {mockInterviewQuestions[activeQuestion]?.Question}
      </h2>
      <Volume2
        className="h-5 w-5 cursor-pointer text-primary"
        onClick={() =>
          textToSpeech(mockInterviewQuestions[activeQuestion]?.Question)
        }
      />

      <div className="border rounded-lg p-5 bg-blue-100 mt-20">
        <h2 className="flex gap-2 items-center text-primary">
          <Lightbulb />
          <strong> Note: </strong>
        </h2>
        <h2 className="text-sm text-primary my-2">
          {process.env.NEXT_PUBLIC_QUESTION_NOTE}
        </h2>
      </div>
    </div>
  );
}

export default QuestionsSection;
