import { tool } from "ai";
import z from "zod";

export default tool({
  description: "Fallback tool when the request cannot be handled",
  inputSchema: z.object({
    reason: z.string().describe("Why the request could not be fulfilled"),
  }),
  async execute({ reason }) {
    return {
      success: false,
      message: reason,
    };
  },
});