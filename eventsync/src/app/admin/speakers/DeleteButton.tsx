"use client"

import { useRouter } from "next/navigation"

export default function DeleteButton({
                                         id,
                                         name,
                                     }: {
    id: string
    name: string
}) {
    const router = useRouter()

    async function handleDelete() {
        if (!confirm(`Supprimer "${name}" ?`)) return

        await fetch(`/api/speakers/${id}`, { method: "DELETE" })

        router.refresh()
    }

    return (
        <button
            onClick={handleDelete}
            className="border border-red-300 text-red-500 px-3 py-1.5 rounded text-sm hover:bg-red-50"
        >
            Supprimer
        </button>
    )
}
