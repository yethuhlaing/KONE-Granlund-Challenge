// import { GoogleGenerativeAI } from '@google/generative-ai';
// import fs from 'fs';
// import path from 'path'
// import { google } from '@ai-sdk/google'
// // import Environment from "../config/environment.js";

// // const api_key = Environment['GOOGLE_GEMINI_API_KEY']

// const GOOGLE_GEMINI_API_KEY = "AIzaSyAgkw1weC737q56Ach54Y5cwBk3JimufQ4"
// const genAI = new GoogleGenerativeAI(GOOGLE_GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


// const prompt = "Give me equipment name, location in the building, manufacturer, model, serial number, equipment type (e.g. structure, ventilation, electrical), size, age, type of material, condition as well as surveyor's free comments ";
// const imagePath = path.join(process.cwd(), "assets/pictures/20200124_092048.jpg");

// function fileToGenerativePart(path, mimeType) {
//     return {
//         inlineData: {
//             data: Buffer.from(fs.readFileSync(path)).toString("base64"),
//             mimeType,
//         },
//     };
//   }
// const image= fileToGenerativePart(
//     `${imagePath}`,
//     "image/jpg",
//   );

// try {
//     const result = await model.generateContent([prompt, image]);
//     console.log(result.response.text());
// } catch (error) {
//     console.error(error);
// }
