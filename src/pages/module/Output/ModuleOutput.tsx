//npm
import { useState } from "react"
import { useLocation } from "react-router"

// types
import type { Module } from "../../../types/module"

function MicrolessonOutput() {
  const location = useLocation()
  const { response } = location.state as { response: Module }

  const [openMicrolessons, setOpenMicrolessons] = useState<Boolean[]>(
    new Array(response.microlessons.length).fill(false),
  )

  const [copiedMicrolessons, setCopiedMicrolessons] = useState<Boolean[]>(
    new Array(response.microlessons.length).fill(false),
  )

  async function copyToClipboard(text: string, id: number) {
    try {
      await navigator.clipboard.writeText(text)
    } catch (error) {
      console.error("Failed to copy text: ", error)
    }
    // change the button text to copied for 2 seconds
    setCopiedMicrolessons((prev) => {
      const newCopiedMicrolessons = [...prev]
      newCopiedMicrolessons[id - 1] = true
      return newCopiedMicrolessons
    })
    setTimeout(() => {
      setCopiedMicrolessons((prev) => {
        const newCopiedMicrolessons = [...prev]
        newCopiedMicrolessons[id - 1] = false
        return newCopiedMicrolessons
      })
    }, 1500)
  }

  function toggleMicrolesson(id: number) {
    setOpenMicrolessons((prev) => {
      const newOpenMicrolessons = [...prev]
      newOpenMicrolessons[id - 1] = !newOpenMicrolessons[id - 1]
      return newOpenMicrolessons
    })
  }

  const ledResponses = response.microlessons.map((microlesson) => {
    return (
      <div className="border rounded-lg p-4 mb-4">
        <p className="text-lg font-bold mb-2">{microlesson.title}</p>
        <button
          className="bg-background-accent text-white px-4 py-2 rounded-md ml-2 hover:bg-background-accent-hover hover:cursor-pointer"
          onClick={() => toggleMicrolesson(microlesson.id)}
        >
          {openMicrolessons[microlesson.id - 1]
            ? "Hide microlesson"
            : "View microlesson"}
        </button>
        <button
          className="bg-background-accent text-white px-4 py-2 rounded-md ml-2 hover:bg-background-accent-hover hover:cursor-pointer"
          onClick={() =>
            copyToClipboard(microlesson.ledResponse, microlesson.id)
          }
        >
          {copiedMicrolessons[microlesson.id - 1]
            ? "Copied!"
            : "Copy to clipboard"}
        </button>
        <pre
          className={`whitespace-pre-wrap font-sans mt-4 ${
            openMicrolessons[microlesson.id - 1] ? "" : "hidden"
          }`}
        >
          {microlesson.ledResponse.replace(/\\n/g, "\n")}
        </pre>
      </div>
    )
  })

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Microlesson Output</h1>
      <div className="space-y-4">{ledResponses}</div>
    </main>
  )
}

export default MicrolessonOutput
