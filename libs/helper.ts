import axios from 'axios'
import * as FileSystem from 'expo-file-system';
import Environment from "../config/environment";
import Toast from 'react-native-root-toast';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path'
import { google } from '@ai-sdk/google'

type ResponseType =
    | { success: false; error: string | undefined }
    | { success: true; data: string };


const getMimeType = (uri: string) => {
    const extension = uri.split('.').pop();
    switch (extension?.toLowerCase()) {
        case 'jpg':
        case 'jpeg':
        return 'image/jpeg';
        case 'png':
        return 'image/png';
        case 'gif':
        return 'image/gif';
        case 'bmp':
        return 'image/bmp';
        case 'webp':
        return 'image/webp';
        default:
        return 'application/octet-stream'; // Default MIME type
    }
};


export async function analyzeImage(imageUri: string | undefined): Promise<ResponseType> {

    
    const GOOGLE_GEMINI_API_KEY = "AIzaSyAgkw1weC737q56Ach54Y5cwBk3JimufQ4"
    const genAI = new GoogleGenerativeAI(GOOGLE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analyze the image and provide the following information in a valid JSON format:
    {
      "equipmentName": "",
      "location": "",
      "manufacturer": "",
      "model": "",
      "serialNumber": "",
      "equipmentType": "",
      "size": "",
      "age": "",
      "material": "",
      "condition": "",
      "surveyorComments": ""
    }
    Ensure that the response is a properly formatted JSON object. Do not include any text before or after the JSON object.`;
    // const imagePath = path.join(process.cwd(), "assets/pictures/20200124_092048.jpg");
    try {
        if (!imageUri) {
            return {
                success: false,
                error: "Please Select an image First"
            };
        }

        const base64imageData = await FileSystem.readAsStringAsync(imageUri as string, {
            encoding: FileSystem.EncodingType.Base64
        });

        if (!base64imageData) {
            throw new Error('Failed to convert image to base64');
        }

        const imagePart = {
            inlineData: {
              data: base64imageData,
              mimeType: getMimeType(imageUri),
            },
          };
        const result = await model.generateContent([prompt, imagePart]);
        const jsonResult = JSON.parse(result.response.text());
        if (jsonResult) {
            return {
                success: true,
                data: jsonResult
            }
        } else {
            return {
                success: false,
                error: "No response from Google Gemini API"
            }
        }
    } catch (error: any) {
        console.log(error)
        return {
            success: false,
            error: error?.message
        }
    }
}

export const extractLastSerialNumber = (text: string | null): string[] => {
    const regex = /Serial No\. \d+[- ](\w+)/g;
    const matches = [];
    let match;
    while ((match = regex.exec(text as string)) !== null) {
        matches.push(match[1]);
    }
    console.log("Matchs", matches)
    return matches;
};

export const extractData = (db: any, lastSerialNumber: any, setValue: any)=> {
    db.withTransactionAsync(async () => {
        await getData()
    }) 

    const getData = async () => {
        try {
            const result = await db.getFirstAsync(`SELECT * FROM test_results WHERE serial_number = (?)`, lastSerialNumber);
            if (result) {
                setValue(result)
                console.log(result)
            }
        } catch (error: any) {
            Toast.show(error.message, {
                duration: Toast.durations.LONG,
                position: Toast.positions.TOP,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
            });
        }
    }
}

export const capitalize = (word: string) =>{
    return word[0].toUpperCase() + word.slice(1)

}