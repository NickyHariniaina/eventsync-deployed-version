"use client"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"

interface EventData {
  title: string
  description: string | null
  location: string | null
  startDate: string
  endDate: string
}

export default function EditEventPage() {
  const router = useRouter()
  const { id } = useParams()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [event, setEvent] = useState<EventData | null>(null)

  useEffect(() => {
    fetch(`/api/events/${id}`)
      .then((res) => res.json())
      .then((data) => setEvent(data))
  }, [id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)

    const response = await fetch(`/api/events/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.get("title"),
        description: formData.get("description"),
        startDate: formData.get("startDate"),
        endDate: formData.get("endDate"),
        location: formData.get("location"),
      }),
    })

    if (response.ok) {
      router.push("/admin/events")
    } else {
      const data = await response.json()
      setError(data.error || "Une erreur est survenue")
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm("Supprimer cet événement ?")) return

    const response = await fetch(`/api/events/${id}`, {
      method: "DELETE",
    })

    if (response.ok) {
      router.push("/admin/events")
    }
  }

  if (!event) return <p>Chargement...</p>

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Modifier l'événement</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>   
          <label className="block text-sm font-medium mb-1">Titre *</label>
          <input
            name="title"
            type="text"
            required
            defaultValue={event.title}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            rows={4}
            defaultValue={event.description ?? ""}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Lieu</label>
          <input
            name="location"
            type="text"
            defaultValue={event.location ?? ""}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date de début *</label>
            <input
              name="startDate"
              type="datetime-local"
              required
              defaultValue={event.startDate?.slice(0, 16)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date de fin *</label>
            <input
              name="endDate"
              type="datetime-local"
              required
              defaultValue={event.endDate?.slice(0, 16)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
          >
            {loading ? "Sauvegarde..." : "Sauvegarder"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border rounded"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded ml-auto"
          >
            Supprimer
          </button>
        </div>
      </form>
    </div>
  )
}