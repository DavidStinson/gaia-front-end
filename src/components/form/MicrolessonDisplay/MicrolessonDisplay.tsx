import FormInput from "../FormInput/FormInput"
import ArrayInput from "../ArrayInput/ArrayInput"

// types
import type { Microlesson } from "../../../types/module-outline"

interface MicrolessonDisplayProps {
  microlesson: Microlesson
  onUpdate: (
    field: keyof Omit<Microlesson, "id" | "outline">,
    value: string,
  ) => void
  onOutlineUpdate: (index: number, value: string) => void
  onOutlineAdd: () => void
  onOutlineRemove: (index: number) => void
}

function MicrolessonDisplay({
  microlesson,
  onUpdate,
  onOutlineUpdate,
  onOutlineAdd,
  onOutlineRemove,
}: MicrolessonDisplayProps) {
  return (
    <div className="border rounded-lg p-4 mb-4">
      <FormInput
        label="Title"
        id={`title-${microlesson.id}`}
        name={`title-${microlesson.id}`}
        value={microlesson.title}
        onChange={(e) => onUpdate("title", e.target.value)}
      />

      <FormInput
        label="Learning Objective"
        id={`objective-${microlesson.id}`}
        name={`objective-${microlesson.id}`}
        value={microlesson.learningObjective}
        onChange={(e) => onUpdate("learningObjective", e.target.value)}
        type="textarea"
      />

      <FormInput
        label="Module Duration (minutes)"
        id={`minutes-${microlesson.id}`}
        name={`minutes-${microlesson.id}`}
        value={`${microlesson.minutes}`}
        onChange={(e) => onUpdate("minutes", e.target.value)}
      />

      <ArrayInput
        label="Outline"
        values={microlesson.outline}
        onUpdate={onOutlineUpdate}
        onAdd={onOutlineAdd}
        onRemove={onOutlineRemove}
        placeholder="Outline step"
      />
    </div>
  )
}

export default MicrolessonDisplay
