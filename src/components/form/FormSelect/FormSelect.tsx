interface FormSelectProps {
  label: string
  id: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: { value: string; label: string }[]
  required?: boolean
}

function FormSelect({
  label,
  id,
  name,
  value,
  onChange,
  options,
  required = false,
}: FormSelectProps) {
  const labelClassName = "block text-sm font-bold pt-4 pb-2"
  const selectClassName =
    "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-background-subtle px-3 py-2 mb-6"

  return (
    <div>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={selectClassName}
        required={required}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default FormSelect
