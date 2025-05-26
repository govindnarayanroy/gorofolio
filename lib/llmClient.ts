import OpenAI from "openai";
import { z } from "zod";
import {
  ChatCompletionMessageParam,
  ChatCompletionCreateParams,
} from "openai/resources/chat/completions";

const Msg = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string(),
});

export async function chatLLM(
  provider: "openai" | "groq",
  model: string,
  messages: ChatCompletionMessageParam[],
  opts: Partial<ChatCompletionCreateParams> = {}
) {
  Msg.array().parse(messages);

  const apiKey = provider === "groq" 
    ? process.env.GROQ_API_KEY 
    : process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(`Missing API key for ${provider}. Please set ${provider === "groq" ? "GROQ_API_KEY" : "OPENAI_API_KEY"} in your environment variables.`);
  }

  const client = new OpenAI({
    apiKey,
    baseURL:
      provider === "groq"
        ? "https://api.groq.com/openai/v1"
        : "https://api.openai.com/v1",
  });

  const safeOpts =
    provider === "groq"
      ? (({ logprobs, logit_bias, n, ...rest }) => rest)(opts as any)
      : opts;

  const res = await client.chat.completions.create({
    model,
    messages,
    ...safeOpts,
  });

  return res.choices[0].message; // { role, content }
}
