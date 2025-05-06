// npm
import { z } from "zod"

// helpers
import { tryCatch } from "../helpers/try-catch.js"
import { useWs } from "../services-ws/module-outline.js"

// types
import type {
  GenerateModuleOutline,
  ModuleOutline,
} from "../types/module-outline.js"
import type { Module } from "../types/module.js"

// module constants
const GA_SYSTEMS_BACK_END_URL = import.meta.env.VITE_GAIA_BACK_END_URL

// zod
const microlessonSchema = z.object({
  title: z.string(),
  id: z.coerce.number(),
  minutes: z.coerce.number(),
  learningObjective: z.string(),
  outline: z.array(z.string()),
  ledResponse: z.string(),
  smeResponse: z.string(),
})

const moduleSchema = z.object({
  title: z.string(),
  about: z.string(),
  learnerPersona: z.string(),
  prerequisites: z.array(z.string()),
  tools: z.array(z.string()),
  microlessons: z.array(microlessonSchema),
})

async function submitModuleOutlineData(
  data: ModuleOutline,
  onProgress: (progress: number) => void,
) {
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
    throw new Error(`HTTP error - status code: ${response.status}`)
  }

  const responseData = await response.json()

  return new Promise<Module>((resolve, reject) => {
    let hasResolved = false

    useWs(responseData.taskId, "module", "subscribe", {
      onProgress: (progress) => onProgress(progress),
      onComplete: async (result) => {
        if (hasResolved) return
        hasResolved = true

        const { error } = moduleSchema.safeParse(result)
        if (error) {
          reject(new Error(`Received invalid module: ${error.message}`))
          return
        }

        resolve(result as Module)
      },
      onError: (error) => {
        if (hasResolved) return
        hasResolved = true
        reject(error)
      },
    })
  })
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
    throw new Error(`HTTP error - status code: ${response.status}`)
  }

  const generatedModule = await response.json()

  const { error } = moduleSchema.safeParse(generatedModule)

  if (error) {
    console.error(error)
    throw new Error(`Received invalid module: ${error.message}`)
  }

  return generatedModule as Module
}

export { submitModuleOutlineData, submitModuleDataCrew }
