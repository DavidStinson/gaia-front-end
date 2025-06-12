// npm
import { z } from "zod"

// helpers
import { tryCatch } from "../helpers/try-catch.js"
import { validateResponseData } from "../helpers/service.js"

// services
import { wsService } from "../services-ws/module-outline.js"

// types
import type {
  GenerateModuleOutline,
  ModuleOutline,
} from "../types/module-outline.js"
import type { Module } from "../types/module.js"

// module constants
const GA_SYSTEMS_BACK_END_URL = import.meta.env.VITE_GAIA_BACK_END_URL as string

// zod
const microlessonSchema = z.object({
  title: z.string(),
  id: z.coerce.number(),
  minutes: z.coerce.number(),
  learningObjective: z.string(),
  outline: z.string().array(),
  ledResponse: z.string(),
  smeResponse: z.string(),
})

const moduleSchema = z.object({
  title: z.string(),
  about: z.string(),
  learnerPersona: z.string(),
  prerequisites: z.string().array(),
  tools: z.string().array(),
  microlessons: z.array(microlessonSchema),
})

async function submitModuleOutlineData(data: ModuleOutline) {
  const [response, responseError] = await tryCatch(
    fetch(`${GA_SYSTEMS_BACK_END_URL}/api/v1/module/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }),
  )

  if (responseError) {
    throw new Error(`Issue building module: ${responseError.message}`)
  }

  if (!response.ok) {
    throw new Error(`HTTP error - status code: ${response.status.toString()}`)
  }

  const responseData = (await response.json()) as unknown

  const { taskId } = validateResponseData(responseData)

  const generatedModule = await wsService(taskId, "module", "subscribe")

  const { error } = moduleSchema.safeParse(generatedModule)

  if (error) {
    throw new Error(`Received invalid module: ${error.message}`)
  }

  return generatedModule as Module
}

async function submitModuleDataCrew(data: GenerateModuleOutline) {
  const [response, responseError] = await tryCatch(
    fetch(`${GA_SYSTEMS_BACK_END_URL}/api/v1/crew/generate-module`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }),
  )

  if (responseError) {
    console.error(responseError)
    throw new Error(`Issue building module: ${responseError.message}`)
  }

  if (!response.ok) {
    console.error(response)
    throw new Error(`HTTP error - status code: ${response.status.toString()}`)
  }

  const responseData = (await response.json()) as unknown

  const { taskId } = validateResponseData(responseData)

  const generatedModule = await wsService(taskId, "module", "subscribe")

  console.log(generatedModule)

  const { error } = moduleSchema.safeParse(generatedModule)

  if (error) {
    console.error(error)
    throw new Error(`Received invalid module: ${error.message}`)
  }

  return generatedModule as Module
}

export { submitModuleOutlineData, submitModuleDataCrew }
