// npm
import { z } from "zod"

// types
import type {
  GenerateModuleOutline,
  ModuleOutline,
} from "../types/module-outline.js"

// helpers
import { tryCatch } from "../helpers/try-catch.js"

// module constants
const GA_SYSTEMS_BACK_END_URL = import.meta.env.VITE_GAIA_BACK_END_URL

// zod
const microlessonSchema = z.object({
  title: z.string(),
  id: z.coerce.number(),
  minutes: z.coerce.number(),
  learningObjective: z.string(),
  outline: z.array(z.string()),
})

const moduleOutlineSchema = z.object({
  title: z.string(),
  about: z.string(),
  tools: z.array(z.string()),
  learnerPersona: z.string(),
  prerequisites: z.array(z.string()),
  microlessons: z.array(microlessonSchema),
})

// services
async function submitModuleData(data: GenerateModuleOutline) {
  const [response, responseError] = await tryCatch(
    fetch(`${GA_SYSTEMS_BACK_END_URL}/api/v1/module-outline/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }),
  )

  if (responseError) {
    throw new Error(`Issue building module outline: ${responseError.message}`)
  }

  if (!response.ok) {
    throw new Error(`HTTP error - status code: ${response.status}`)
  }

  const generatedModuleOutline = await response.json()

  const { error: zodError } = moduleOutlineSchema.safeParse(
    generatedModuleOutline,
  )

  if (zodError) {
    throw new Error(`Received invalid module outline: ${zodError.message}`)
  }

  return generatedModuleOutline as ModuleOutline

}

export { submitModuleData }
