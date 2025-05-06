// npm
import { useState } from "react"
import { useLocation, useNavigate } from "react-router"

// components
import FormInput from "../../../components/form/FormInput/FormInput"
import ArrayInput from "../../../components/form/ArrayInput/ArrayInput"
import MicrolessonDisplay from "../../../components/form/MicrolessonDisplay/MicrolessonDisplay"

// services
import { submitModuleOutlineData } from "../../../services/module"

// helpers
import { tryCatch } from "../../../helpers/try-catch"

// types
import type { ModuleOutline as FormData } from "../../../types/module-outline"

// component
function EditLessonOutline() {
  const location = useLocation()
  const navigate = useNavigate()
  const { response } = location.state as { response: FormData }

  const [formData, setFormData] = useState<FormData>({
    title: response.title,
    about: response.about,
    tools: response.tools,
    learnerPersona: response.learnerPersona,
    prerequisites: response.prerequisites,
    microlessons: response.microlessons,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const updateItem = <K extends keyof FormData>(
    field: K,
    index: number,
    value: string,
  ) => {
    if (Array.isArray(formData[field])) {
      const newArray = [...(formData[field] as string[])]
      newArray[index] = value
      setFormData((prev) => ({ ...prev, [field]: newArray }))
    }
  }

  const addItem = <K extends keyof FormData>(field: K) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] as string[]), ""],
    }))
  }

  const removeItem = <K extends keyof FormData>(field: K, index: number) => {
    const newArray = [...(formData[field] as string[])]
    newArray.splice(index, 1)
    setFormData((prev) => ({ ...prev, [field]: newArray }))
  }

  const handleMicrolessonChange = (
    microlessonId: number,
    field: string,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      microlessons: prev.microlessons.map((microlesson) =>
        microlesson.id === microlessonId
          ? { ...microlesson, [field]: value }
          : microlesson,
      ),
    }))
  }

  const handleMicrolessonOutlineChange = (
    microlessonId: number,
    index: number,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      microlessons: prev.microlessons.map((microlesson) =>
        microlesson.id === microlessonId
          ? {
              ...microlesson,
              outline: microlesson.outline.map((step, i) =>
                i === index ? value : step,
              ),
            }
          : microlesson,
      ),
    }))
  }

  const handleMicrolessonOutlineAdd = (microlessonId: number) => {
    setFormData((prev) => ({
      ...prev,
      microlessons: prev.microlessons.map((microlesson) =>
        microlesson.id === microlessonId
          ? { ...microlesson, outline: [...microlesson.outline, ""] }
          : microlesson,
      ),
    }))
  }

  const handleMicrolessonOutlineRemove = (
    microlessonId: number,
    index: number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      microlessons: prev.microlessons.map((microlesson) =>
        microlesson.id === microlessonId
          ? {
              ...microlesson,
              outline: microlesson.outline.toSpliced(index, 1),
            }
          : microlesson,
      ),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    if (isSubmitting) return

    const submissionData = cleanUpData()

    const [response, error] = await tryCatch(
      submitModuleOutlineData(submissionData)
    )

    if (error) {
      handleSubmitError(error)
      setIsSubmitting(false)
      return
    }
    console.log(response)

    navigate(`/module/output`, { state: { response } })
    setIsSubmitting(false)
  }

  function cleanUpData() {
    const filteredTools = formData.tools.filter((tool) => tool.trim() !== "")
    const filteredPrerequisites = formData.prerequisites.filter(
      (prerequisite) => prerequisite.trim() !== "",
    )

    const rebuiltMicrolessons = formData.microlessons.map((microlesson) => {
      
      let numMinutes = parseInt(microlesson.minutes)

      if (isNaN(numMinutes)) numMinutes = 0

      return{
      ...microlesson,
      outline: microlesson.outline.filter((step) => step.trim() !== ""),
      minutes: numMinutes.toString(),
    }
    })

    return {
      ...formData,
      tools: filteredTools,
      prerequisites: filteredPrerequisites,
      microlessons: rebuiltMicrolessons,
    }
  }

  function handleSubmitError(error: any) {
    setError(
      error instanceof Error
        ? error.message
        : "An error occurred while submitting the form",
    )
  }

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Module Outline</h1>
      <form>
        {error && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <FormInput
          label="Module Title"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Enter module title"
          required
        />

        <FormInput
          label="About the module"
          id="about"
          name="about"
          value={formData.about}
          onChange={handleInputChange}
          type="textarea"
          rows={6}
        />

        <ArrayInput
          label="Module Tools"
          values={formData.tools}
          onUpdate={(index: number, value: string) =>
            updateItem("tools", index, value)
          }
          onAdd={() => addItem("tools")}
          onRemove={(index: number) => removeItem("tools", index)}
          placeholder="Tool"
          required
        />

        <FormInput
          label="Learner Persona"
          id="learnerPersona"
          name="learnerPersona"
          value={formData.learnerPersona}
          onChange={handleInputChange}
          type="textarea"
        />

        <ArrayInput
          label="Prerequisites"
          values={formData.prerequisites}
          onUpdate={(index: number, value: string) =>
            updateItem("prerequisites", index, value)
          }
          onAdd={() => addItem("prerequisites")}
          onRemove={(index: number) => removeItem("prerequisites", index)}
          placeholder="Prerequisite"
          required
        />

        <h2 className="text-xl font-bold mt-6 mb-4">Microlessons</h2>
        <div className="space-y-4">
          {formData.microlessons.map((microlesson) => (
            <MicrolessonDisplay
              key={microlesson.id}
              microlesson={microlesson}
              onUpdate={(field, value) =>
                handleMicrolessonChange(microlesson.id, field, value)
              }
              onOutlineUpdate={(index, value) =>
                handleMicrolessonOutlineChange(microlesson.id, index, value)
              }
              onOutlineAdd={() => handleMicrolessonOutlineAdd(microlesson.id)}
              onOutlineRemove={(index) =>
                handleMicrolessonOutlineRemove(microlesson.id, index)
              }
            />
          ))}
        </div>

        {error && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm text-white bg-background-accent hover:bg-background-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-bold ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={handleSubmit}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </main>
  )
}

export default EditLessonOutline
