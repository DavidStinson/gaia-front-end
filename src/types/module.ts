interface Module {
  title: string
  about: string
  tools: string[]
  learnerPersona: string
  prerequisites: string[]
  microlessons: {
    id: number
    title: string
    learningObjective: string
    minutes: string
    outline: string[]
    ledResponse: string
    smeResponse: string
  }[]
}

export type { Module }
