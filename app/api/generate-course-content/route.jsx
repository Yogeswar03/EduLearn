import { NextResponse } from "next/server";
import { GoogleGenAI } from '@google/genai';
import axios from "axios";
import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { eq } from "drizzle-orm";

// -------------------------- PROMPT --------------------------
const PROMPT = `
Generate educational content in HTML format for each topic under the given chapter.
Return ONLY a valid JSON response without markdown formatting.
Schema:
{
  "chapterName": "string",
  "topics": [
    {
      "topic": "string",
      "content": "HTML string"
    }
  ]
}
User Input:
`;

// ----------------------- MAIN HANDLER -----------------------
export async function POST(req) {
  try {
    const { courseJson, courseTitle, courseId } = await req.json();

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const promises = courseJson?.chapters?.map(async (chapter) => {
      const contents = [
        {
          role: 'user',
          parts: [
            {
              text: PROMPT + JSON.stringify(chapter),
            },
          ],
        },
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        config: {
          thinkingConfig: {
            thinkingBudget: -1,
          },
          tools: [{ googleSearch: {} }],
          responseMimeType: 'text/plain',
        },
        contents,
      });

      const output = response?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!output) {
        throw new Error('No output from AI model');
      }

      // Clean the output to remove triple backticks
      const cleanedOutput = output
        .replace(/```json/, '')
        .replace(/```/, '')
        .trim();

      // Try parsing JSON
      let parsedOutput;
      try {
        parsedOutput = JSON.parse(cleanedOutput);
      } catch (e) {
        console.error('❌ JSON Parsing Error:\n', cleanedOutput);
        throw new Error('AI response is not valid JSON');
      }

      const youtubeData = await getYoutubeVideo(chapter?.chapterName);

      return {
        youtubeVideo: youtubeData,
        CourseContent: parsedOutput
      };
    });

    const CourseContent = await Promise.all(promises);

//saving videos to database
const dbResponse = await db.update(coursesTable).set({
 courseContent:CourseContent
}).where(eq(coursesTable.cid,courseId))

    return NextResponse.json({
      courseName: courseTitle,
      CourseContent,
    });

  } catch (err) {
    console.error(' Server Error:', err);

    if (
      err?.message?.includes('RESOURCE_EXHAUSTED') ||
      err?.message?.includes('quota') ||
      err?.response?.data?.error?.code === 429
    ) {
      return NextResponse.json({
        error: "Gemini API rate limit exceeded. Please wait and try again later.",
        alert: "Gemini API rate limit exceeded. Please wait and try again later."
      }, { status: 429 });
    }

    return NextResponse.json({
      error: err.message || 'Internal Server Error'
    }, { status: 500 });
  }
}

const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

const getYoutubeVideo = async (topic) => {
  const params = {
    part: 'snippet',
    q: topic,
    maxResults: 4,
    type: 'video',
    key: process.env.YOUTUBE_API_KEY
  };

  const response = await axios.get(YOUTUBE_BASE_URL, { params });
  const youtubeVideoList = response.data.items.map(item => ({
    videoId: item?.id?.videoId,
    title: item?.snippet?.title
  }));

  return youtubeVideoList;
};
