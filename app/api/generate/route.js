import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `
    You are a flashcard creator. You have a list of questions and answers that you want to turn into flashcards for your students. 
    You want to generate flashcards for each question and answer pair. 
    Your goal is to create flashcards that are clear, concise, and easy to read. 
    You want to generate flashcards that are clear, concise, and easy to read. 
    You want to generate flashcards that are easy to print and share with your students. 
    You want to generate flashcards that are easy to read and understand. 
    You want to generate flashcards that are easy to use and study with. 
    You want to generate flashcards that are easy to review and memorize. 
    You want to generate flashcards that are easy to edit and update. 
    You want to generate flashcards that are easy to organize and manage. 
    You want to generate flashcards that are easy to customize and personalize. 
    You want to generate flashcards that are easy to print and share with your students. 
    You want to generate flashcards that are easy to read and understand. 
    You want to generate flashcards that are easy to use and study with. 
    You want to generate flashcards that are easy to review and memorize. 
    You want to generate flashcards that are easy to edit and update. 
    You want to generate flashcards that are easy to organize and manage. 
    You want to generate flashcards that are easy to customize and personalize. 
    You want to generate flashcards that are easy to print and share with your students. 
    You want to generate flashcards that are easy to read and understand. 
    You want to generate flashcards that are easy to use and study with. 
    You want to generate flashcards that are easy to review and memorize. 
    You want to generate flashcards that are easy to edit.
    Only generate 10 flashcards.
    Remember, the goal is to facilitate effective learning and retention of information through these flashcards.

    Return in the following JSON format
    {
        "flashcards":[{ 
            "front": "string",
            "back": "string"
        }]
    }
`;

export async function POST(req) {
    const openai = new OpenAI();
    const data = await req.text();

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: data,
                },
            ],
            model: "gpt-4o-mini",
        });

        const flashcards = JSON.parse(completion.choices[0].message.content);
        return NextResponse.json(flashcards.flashcards);
    } catch (error) {
        console.error("Error generating flashcards:", error);

        if (error.code === 'insufficient_quota') {
            return NextResponse.json({ error: "Quota exceeded. Please check your OpenAI plan and try again later." }, { status: 429 });
        } else if (error.code === 'model_not_found') {
            return NextResponse.json({ error: "The specified model was not found. Please check the model name." }, { status: 404 });
        } else {
            return NextResponse.json({ error: "An error occurred while generating flashcards." }, { status: 500 });
        }
    }
}