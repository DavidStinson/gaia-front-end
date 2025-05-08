// types
interface ArrayInputProps {
  label: string
  values: string[]
  onUpdate: (index: number, value: string) => void
  onAdd: () => void
  onRemove: (index: number) => void
  placeholder?: string
  required?: boolean
  readOnly?: boolean
}

function ArrayInput({
  label,
  values,
  onUpdate,
  onAdd,
  onRemove,
  placeholder = "Enter item",
  required = false,
  readOnly = false,
}: ArrayInputProps) {
  const inputClassName =
    "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-background-subtle px-3 py-2"
  const labelClassName = "block text-sm font-bold pt-4 pb-2"
  const removeButtonClassName =
    "mt-1 inline-flex items-center px-3 py-2 border border-transparent text-sm font-bold leading-4 rounded-md text-warning-on-warning-background bg-background-attention hover:bg-background-attention-hover hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
  const addButtonClassName = 
  "mt-1 w-full flex justify-center px-3 py-2 border border-transparent text-sm leading-4 font-bold rounded-md text-accent-on-subtle-background bg-background-subtle hover:bg-background-subtle-hover hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"

  return (
    <div>
      <label className={labelClassName}>{label}</label>
      <div className="flex flex-col gap-2">
        {values.map((value, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => {onUpdate(index, e.target.value)}}
              className={inputClassName}
              placeholder={`${placeholder} ${(index + 1).toString()}`}
              required={required && index === 0}
              readOnly={readOnly}
            />
            {!readOnly && values.length > 1 && (
              <button
                type="button"
                onClick={() => {onRemove(index)}}
                className={removeButtonClassName}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        {!readOnly && (
          <button
            type="button"
            onClick={() => {onAdd()}}
            className={addButtonClassName}
          >
            Add another
          </button>
        )}
      </div>
    </div>
  )
}

export default ArrayInput
