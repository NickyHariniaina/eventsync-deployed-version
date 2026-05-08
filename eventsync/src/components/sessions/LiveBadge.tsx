type Props = {
    isLive: boolean
}

export function LiveBadge({ isLive }: Props) {
    if (!isLive) return null

    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-semibold text-white">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            Live
        </span>
    )
}