import FavoritesList from "@/components/favorites/FavoritesList"

export const metadata = {
  title: "Mes Favoris - EventSync",
}

export default function FavoritesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mes Favoris</h1>
      <FavoritesList />
    </div>
  )
}
