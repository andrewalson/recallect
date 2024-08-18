import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `
    You are a flashcard creator. You have a list of questions and answers that you want to turn into flashcards for your students. 
    Your goal is to create flashcards that are clear, concise, and easy to read. 
    Only generate 10 flashcards.
    Return the flashcards in the following JSON format without any additional text or formatting:
    {
        "flashcards":[{ 
            "front": "string",
            "back": "string"
        }]
    }
    Ensure the JSON is valid and does not include any backticks or markdown formatting.
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

        // Get the response content
        let responseContent = completion.choices[0].message.content;

        // Strip out any unwanted characters like backticks or code blocks
        responseContent = responseContent.replace(/```json/g, '').replace(/```/g, '').trim();

        let flashcards;
        try {
            flashcards = JSON.parse(responseContent);
        } catch (jsonParseError) {
            console.error("Error parsing JSON response:", jsonParseError);
            return NextResponse.json({ error: "Failed to parse flashcards from the response." }, { status: 500 });
        }

        // Validate if the flashcards structure is as expected
        if (flashcards && Array.isArray(flashcards.flashcards)) {
            return NextResponse.json(flashcards.flashcards);
        } else {
            console.error("Unexpected response format:", flashcards);
            return NextResponse.json({ error: "Unexpected response format." }, { status: 500 });
        }
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
