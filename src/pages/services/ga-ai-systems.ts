const GA_SYSTEMS_BACK_END_URL = import.meta.env.VITE_GA_SYSTEMS_BACK_END_URL

interface ModuleSubmission {
  moduleTitle: string
  moduleTopic: string
  moduleMinutes: number
  learnerPersona: string
  learningObjectives: string[]
  tools: string
  finalFormat: "markdown" | "slides"
}

export const submitModule = async (data: ModuleSubmission) => {
  try {
    const response = await fetch(`${GA_SYSTEMS_BACK_END_URL}/api/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error submitting module:", error)
    throw error
  }
}
