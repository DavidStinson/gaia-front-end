interface GenerateModuleOutline {
  title: string
  about: string
  minutes: string
  learnerPersona: string
  learningObjectives: string[]
  tools: string[]
}

interface Microlesson {
  id: number
  title: string
  learningObjective: string
  minutes: string
  outline: string[]
}

interface ModuleOutline {
  title: string
  about: string
  tools: string[]
  learnerPersona: string
  prerequisites: string[]
  microlessons: Microlesson[]
}

export type { GenerateModuleOutline, Microlesson, ModuleOutline }
