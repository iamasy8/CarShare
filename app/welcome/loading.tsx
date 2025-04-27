import { Skeleton } from "@/components/ui/skeleton"

export default function WelcomeLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <div className="container max-w-6xl px-4 py-16 mx-auto">
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-3/4 max-w-xl mx-auto mb-4" />
          <Skeleton className="h-6 w-2/3 max-w-md mx-auto" />
        </div>

        <div className="flex justify-center mb-12">
          <Skeleton className="h-10 w-64 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[400px] rounded-xl" />
          ))}
        </div>

        <Skeleton className="h-[300px] rounded-xl mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[200px] rounded-xl" />
          ))}
        </div>

        <Skeleton className="h-[200px] rounded-xl mb-12" />

        <div className="flex flex-col items-center">
          <Skeleton className="h-14 w-64 rounded-full" />
          <Skeleton className="h-4 w-72 mt-4" />
          <Skeleton className="h-4 w-48 mt-8" />
        </div>
      </div>
    </div>
  )
}
