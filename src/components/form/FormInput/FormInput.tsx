interface FormInputProps {
  label: string
  id: string
  name: string
  value: string
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
  type?: "text" | "number" | "textarea"
  placeholder?: string
  required?: boolean
  min?: string
  rows?: number
  readOnly?: boolean
}

function FormInput({
  label,
  id,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  min,
  rows = 3,
  readOnly = false,
}: FormInputProps) {
  const inputClassName =
    "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-background-subtle px-3 py-2"
  const labelClassName = "block text-sm font-bold pt-4 pb-2"

  return (
    <div>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className={inputClassName}
          placeholder={placeholder}
          required={required}
          rows={rows}
          readOnly={readOnly}
        />
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className={inputClassName}
          placeholder={placeholder}
          required={required}
          min={min}
          readOnly={readOnly}
        />
      )}
    </div>
  )
}

export default FormInput
