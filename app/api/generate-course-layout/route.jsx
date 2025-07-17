import { db } from '@/config/db';
import { coursesTable } from '@/config/schema';
import { auth, currentUser } from '@clerk/nextjs/server';
import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import axios from 'axios';
import { eq } from 'drizzle-orm';

const PROMPT = `
Generate a Learning Course based on the following details. Make sure to include:
- Course Name
- Description
- Course Banner Image Prompt (Create a modern, flat-style 2D digital illustration representing the user's topic. Include UI/UX elements such as mockup screens, text blocks, icons, buttons, and creative workspace tools. Add symbolic elements like sticky notes, design components, and visual aids. Use a vibrant color palette: blues, purples, oranges. The illustration should feel creative, tech-savvy, and educational, in 3D style.)
- Chapters: Each with chapterName, duration, and topics
Return in JSON format.
Schema:
"course": {
  "name": "string",
  "description": "string",
  "category": "string",
  "level": "string",
  "include Video": "boolean",
  "noOfChapters": "number",
  "bannerImagePrompt": "string",
  "chapters": [
    {
      "chapterName": "string",
      "duration": "string",
      "topics": ["string"]
    }
  ]
}
User Input:
`;

export async function POST(req) {
  try {
    const {courseId , ...formData} = await req.json();
    const user = await currentUser();
    const { has } = await auth()
    const hasPremiumAccess = has({ plan: 'starter' })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

  const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });


     // if user already created a course 
     if(!hasPremiumAccess){
         const result = await db.select().from(coursesTable)
         .where(eq(coursesTable.userEmail,user?.primaryEmailAddress.emailAddress));

         if(result?.length>=1){
          return NextResponse.json({'resp':'limit exceed'})
         }
     }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      config: {
        thinkingConfig: { thinkingBudget: -1 },
        tools: [{ googleSearch: {} }],
        responseMimeType: 'text/plain',
      },
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: PROMPT + JSON.stringify(formData),
            },
          ],
        },
      ],
    });

    const output = response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!output) {
      return NextResponse.json({ error: 'No response from AI model' }, { status: 500 });
    }


    const cleanedOutput = output
      .replace(/^```json/, '')
      .replace(/^```/, '')
      .replace(/```$/, '')
      .trim();

    let parsedOutput;
    try {
      parsedOutput = JSON.parse(cleanedOutput);
    } catch (e) {
      return NextResponse.json({ error: 'AI response is not valid JSON' }, { status: 500 });
    }
    
    const ImagePrompt = parsedOutput.course?.bannerImagePrompt;

    //generating images

    const bannerImageUrl = await generateImage(ImagePrompt)


    //saving to database
    await db.insert(coursesTable).values({
      ...formData,
      courseJson: parsedOutput,
      userEmail: user?.primaryEmailAddress?.emailAddress || '',
      cid:courseId,
      bannerImageUrl : bannerImageUrl
    });
    
    

    return NextResponse.json({ courseId });

  } catch (err) {
    
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}


const generateImage = async(imagePrompt)=>{
    const BASE_URL='https://aigurulab.tech';
const result = await axios.post(BASE_URL+'/api/generate-image',
        {
            width: 1024,
            height: 1024,
            input: imagePrompt ,
            model: 'flux',//'flux'
            aspectRatio:"16:9"//Applicable to Flux model only
        },
        {
            headers: {
                'x-api-key': process?.env?.IMAGE_GENERATION_API_KEY, // Your API Key
                'Content-Type': 'application/json', // Content Type
            },
        })
console.log(result.data.image)
return result.data.image
}