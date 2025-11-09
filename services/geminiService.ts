import { GoogleGenAI, Type, Chat, GenerateContentResponse } from "@google/genai";
import { CurriculumNode } from "../types";

let ai: GoogleGenAI | null = null;

// Lazily initialize the AI client on first use to prevent startup errors.
function getAiClient(): GoogleGenAI {
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
}

const curriculumNodeSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "A unique identifier for the node (e.g., '1.1')." },
        topic: { type: Type.STRING, description: "The specific topic for this learning module." },
        summary: { type: Type.STRING, description: "A brief, one-sentence summary of the topic." },
        parentId: { type: Type.STRING, description: "The ID of the parent node. Use 'root' for top-level nodes." }
    },
    required: ['id', 'topic', 'summary', 'parentId']
};

const curriculumSchema = {
    type: Type.ARRAY,
    description: "A flat list of all nodes in the learning path.",
    items: curriculumNodeSchema
};

export const generateCurriculum = async (
  topic: string,
  level: string,
  image?: { data: string; mimeType: string }
): Promise<CurriculumNode[]> => {
  const aiClient = getAiClient();
  const model = 'gemini-2.5-flash';
  
  const textPart = {
      text: `Generate a structured learning path for the topic: "${topic}". The target audience is at a ${level} level. 
      The path should be a tree of topics and sub-topics, but I need you to represent it as a flat list.
      Each item in the list should be an object with a unique 'id', a 'topic' name, a brief one-sentence 'summary', and a 'parentId'. 
      For top-level nodes, the 'parentId' should be 'root'. For child nodes, 'parentId' should be the 'id' of their parent.
      Use a hierarchical ID structure (e.g., '1', '1.1', '1.2', '2').
      The root should have about 3 main topics. Each main topic can have a few sub-topics, but do not nest any deeper. The maximum depth should be 2 levels (main topics and their direct children).
      Provide the output in the specified JSON format.`
  };

  const contents: any = { parts: [textPart] };

  if (image) {
      const imagePart = {
          inlineData: {
              data: image.data,
              mimeType: image.mimeType,
          },
      };
      contents.parts.unshift(imagePart);
      contents.parts[1].text = `Analyze the provided image and generate a structured learning path about its content. ${contents.parts[1].text.substring(contents.parts[1].text.indexOf('The target audience'))}`
  }

  try {
    const response = await aiClient.models.generateContent({
        model,
        contents,
        config: {
            responseMimeType: "application/json",
            responseSchema: curriculumSchema,
        },
    });

    const jsonText = response.text.trim();
    const flatNodes: {id: string, topic: string, summary: string, parentId: string}[] = JSON.parse(jsonText);

    if (!Array.isArray(flatNodes)) {
        throw new Error("Invalid curriculum structure received from API.");
    }
    
    // Reconstruct the tree
    const buildTree = (nodes: any[]): CurriculumNode[] => {
        const nodeMap = new Map<string, CurriculumNode>();
        const tree: CurriculumNode[] = [];

        nodes.forEach(node => {
            nodeMap.set(node.id, {
                ...node,
                isCompleted: false,
                children: []
            });
        });

        nodes.forEach(node => {
            if (node.parentId === 'root') {
                tree.push(nodeMap.get(node.id)!);
            } else {
                const parent = nodeMap.get(node.parentId);
                if (parent) {
                    parent.children.push(nodeMap.get(node.id)!);
                }
            }
        });

        return tree;
    };

    return buildTree(flatNodes);

  } catch (error) {
    console.error("Error generating curriculum:", error);
    throw new Error("Failed to generate learning path. Please try again with a clearer topic.");
  }
};


export const generateNotesForTopic = async (topic: string, subTopic: string): Promise<string> => {
    const aiClient = getAiClient();
    const model = 'gemini-2.5-flash';
    const prompt = `Provide concise, easy-to-understand notes for a beginner on the topic of "${subTopic}" within the broader subject of "${topic}". 
    Use markdown for formatting. Include key concepts, simple examples, and a brief summary.`;

    try {
        const response = await aiClient.models.generateContent({
            model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating notes:", error);
        throw new Error("Failed to generate notes for the topic.");
    }
};

export const generateMathExplanation = async (mathTopic: string): Promise<string> => {
    const aiClient = getAiClient();
    const model = 'gemini-2.5-pro'; // Using pro for better reasoning
    const prompt = `Explain the mathematical concept of "${mathTopic}" as if you were tutoring a high school student. 
    Break it down into simple steps. Provide a clear definition, the relevant formulas (if any), and a step-by-step example. Use markdown for formatting.`;
    
    try {
        const response = await aiClient.models.generateContent({
            model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating math explanation:", error);
        throw new Error("Failed to generate math explanation.");
    }
};

let miaChat: Chat | null = null;

export const startMiaChat = () => {
    const aiClient = getAiClient();
    miaChat = aiClient.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: "You are Mia, a friendly and supportive AI learning assistant. Your goal is to help users with their questions in a concise, encouraging, and easy-to-understand way. You are part of an application called Unpackd."
        }
    });
};

export const sendMessageToMia = async (message: string): Promise<GenerateContentResponse> => {
    if (!miaChat) {
        startMiaChat();
    }
    const response = await miaChat!.sendMessage({ message });
    return response;
};