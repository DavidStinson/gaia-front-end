import { useState } from "react"
import { submitModule } from "../services/ga-ai-systems"

interface FormData {
  moduleTitle: string
  moduleTopic: string
  moduleMinutes: string
  learnerPersona: string
  learningObjectives: string[]
  tools: string
  finalFormat: "markdown" | "slides"
}

function AppLanding() {
  const [formData, setFormData] = useState<FormData>({
    moduleTitle: "",
    moduleTopic: "",
    moduleMinutes: "",
    learnerPersona: "",
    learningObjectives: [""],
    tools: "",
    finalFormat: "markdown",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateLearningObjective = (index: number, value: string) => {
    const newObjectives = [...formData.learningObjectives]
    newObjectives[index] = value
    setFormData((prev) => ({ ...prev, learningObjectives: newObjectives }))
  }

  const addLearningObjective = () => {
    setFormData((prev) => ({
      ...prev,
      learningObjectives: [...prev.learningObjectives, ""],
    }))
  }

  const removeLearningObjective = (index: number) => {
    const newObjectives = [...formData.learningObjectives]
    newObjectives.splice(index, 1)
    setFormData((prev) => ({ ...prev, learningObjectives: newObjectives }))
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Filter out empty learning objectives
      const filteredObjectives = formData.learningObjectives.filter(
        (obj) => obj.trim() !== ""
      )

      const submissionData = {
        ...formData,
        learningObjectives: filteredObjectives,
        moduleMinutes: parseInt(formData.moduleMinutes) || 0,
      }

      await submitModule(submissionData)
      // Reset form after successful submission
      setFormData({
        moduleTitle: "",
        moduleTopic: "",
        moduleMinutes: "",
        learnerPersona: "",
        learningObjectives: [""],
        tools: "",
        finalFormat: "markdown",
      })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while submitting the form"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="moduleTitle" className="block text-sm font-medium">
            Module Title
          </label>
          <input
            type="text"
            id="moduleTitle"
            name="moduleTitle"
            value={formData.moduleTitle}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-background-subtle px-3 py-2"
            placeholder="Enter module title"
            required
          />
        </div>

        <div>
          <label htmlFor="moduleTopic" className="block text-sm font-medium">
            Module Topic
          </label>
          <input
            type="text"
            id="moduleTopic"
            name="moduleTopic"
            value={formData.moduleTopic}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-background-subtle px-3 py-2"
            placeholder="Enter module topic"
            required
          />
        </div>

        <div>
          <label htmlFor="moduleMinutes" className="block text-sm font-medium">
            Module Duration (minutes)
          </label>
          <input
            type="number"
            id="moduleMinutes"
            name="moduleMinutes"
            value={formData.moduleMinutes}
            onChange={handleInputChange}
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-background-subtle px-3 py-2"
            placeholder="Enter duration in minutes"
            required
          />
        </div>

        <div>
          <label htmlFor="learnerPersona" className="block text-sm font-medium">
            Learner Persona
          </label>
          <textarea
            id="learnerPersona"
            name="learnerPersona"
            value={formData.learnerPersona}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-background-subtle px-3 py-2"
            placeholder="Describe the target learner persona"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Learning Objectives
          </label>
          <div className="space-y-2">
            {formData.learningObjectives.map((objective, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={objective}
                  onChange={(e) =>
                    updateLearningObjective(index, e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-background-subtle px-3 py-2"
                  placeholder={`Learning objective ${index + 1}`}
                  required={index === 0}
                />
                {index === formData.learningObjectives.length - 1 && (
                  <button
                    type="button"
                    onClick={addLearningObjective}
                    className="mt-1 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add
                  </button>
                )}
                {formData.learningObjectives.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLearningObjective(index)}
                    className="mt-1 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="tools" className="block text-sm font-medium">
            Required Tools
          </label>
          <input
            type="text"
            id="tools"
            name="tools"
            value={formData.tools}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-background-subtle px-3 py-2"
            placeholder="List required tools"
            required
          />
        </div>

        <div>
          <label htmlFor="finalFormat" className="block text-sm font-medium">
            Final Format
          </label>
          <select
            id="finalFormat"
            name="finalFormat"
            value={formData.finalFormat}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-background-subtle px-3 py-2"
            required
          >
            <option value="markdown">Markdown</option>
            <option value="slides">Slides</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-background-accent hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </main>
  )
}

export default AppLanding
