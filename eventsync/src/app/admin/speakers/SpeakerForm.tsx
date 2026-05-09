
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type LinkField = { label: string; url: string }

type InitialData = {
    id: string
    name: string
    photo: string | null
    bio: string | null
    links: LinkField[]
}

export default function SpeakerForm({
                                        initialData,
                                    }: {
    initialData?: InitialData
}) {
    const router = useRouter()

    const isEditing = !!initialData

    const [name, setName] = useState(initialData?.name || "")
    const [photo, setPhoto] = useState(initialData?.photo || "")
    const [bio, setBio] = useState(initialData?.bio || "")
    const [links, setLinks] = useState<LinkField[]>(initialData?.links || [])

    function addLink() {
        setLinks([...links, { label: "", url: "" }])
    }

    function removeLink(index: number) {
        setLinks(links.filter((_, i) => i !== index))
    }

    function updateLink(index: number, field: "label" | "url", value: string) {
        const updated = [...links]
        updated[index][field] = value
        setLinks(updated)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        const data = { name, photo, bio, links }

        if (isEditing) {
            await fetch(`/api/speakers/${initialData.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
        } else {
            await fetch("/api/speakers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
        }

        router.push("/admin/speakers")
        router.refresh()
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">

            <div>
                <label className="block text-sm font-medium mb-1">
                    Nom <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jean Dupont"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">
                    URL de la photo
                </label>
                <input
                    type="url"
                    value={photo}
                    onChange={(e) => setPhoto(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Biographie</label>
                <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Quelques mots sur cet intervenant..."
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Liens externes</label>
                    <button
                        type="button"
                        onClick={addLink}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        + Ajouter un lien
                    </button>
                </div>

                {links.map((link, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={link.label}
                            onChange={(e) => updateLink(i, "label", e.target.value)}
                            placeholder="Label (ex: LinkedIn)"
                            className="w-1/3 border rounded-lg px-3 py-2 text-sm"
                        />
                        <input
                            type="url"
                            value={link.url}
                            onChange={(e) => updateLink(i, "url", e.target.value)}
                            placeholder="https://..."
                            className="flex-1 border rounded-lg px-3 py-2 text-sm"
                        />
                        <button
                            type="button"
                            onClick={() => removeLink(i)}
                            className="text-red-500 px-2 hover:bg-red-50 rounded"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 text-sm"
                >
                    {isEditing ? "Mettre à jour" : "Créer"}
                </button>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="border px-5 py-2 rounded-lg hover:bg-gray-100 text-sm"
                >
                    Annuler
                </button>
            </div>
        </form>
    )
}
