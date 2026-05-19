import Link from "next/link"

type Speaker = {
    id: string
    name: string
    photo: string | null
    bio: string | null
}

export default function SpeakerCard({ speaker }: { speaker: Speaker }) {
    return (
        <Link href={`/speakers/${speaker.id}`}>
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">

                <div className="flex items-center gap-3 mb-2">
                    {speaker.photo ? (
                        <img
                            src={speaker.photo}
                            alt={speaker.name}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                            {speaker.name[0].toUpperCase()}
                        </div>
                    )}
                    <p className="font-semibold text-lg">{speaker.name}</p>
                </div>

                {speaker.bio && (
                    <p className="text-sm text-gray-500 line-clamp-2">{speaker.bio}</p>
                )}
            </div>
        </Link>
    )
}
