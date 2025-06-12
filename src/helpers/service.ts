// npm
import { z } from "zod"

const responseDataSchema = z.object({
  taskId: z.string(),
})

function validateResponseData(responseData: unknown) {
  const result = responseDataSchema.safeParse(responseData)
  if (!result.success) {
    throw new Error("Invalid response data: " + result.error.message)
  }
  return result.data
}

export { validateResponseData }
