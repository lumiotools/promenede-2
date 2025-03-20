"use client";

import { qaData } from "./qadata";

export default function QAComponent() {
  // Using the first question from the qaData array as the main question
  const mainQuestion = qaData[0].question;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 bg-white">
      <h2 className="text-[#445963] text-2xl font-normal mb-4">Q&A</h2>
      <div className="border-t border-[#ced7db] mb-12"></div>

      <h3 className="text-[#35454c] text-2xl font-normal mb-8">
        {mainQuestion}
      </h3>

      <ul className="space-y-6">
        {qaData.map((item, index) => (
          <li key={index} className="flex gap-3">
            <div className="flex-shrink-0 mt-1">
              <span className="inline-block w-1.5 h-1.5 bg-[#35454c] rounded-full"></span>
            </div>
            <div>
              <span className="text-[#35454c] font-semibold">
                End-to-End Automation:{" "}
              </span>
              <span className="text-[#445963]">{item.answer}</span>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-16 text-[#57727e] text-sm">
        Source: 1.PromenadeAI, 2.Crunchbase
      </div>
    </div>
  );
}
