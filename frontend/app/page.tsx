import Sections from "@/components/sections"
import { Sidebar } from "@/components/sidebar"

export default function Home() {
  return (
    <div className="flex h-screen bg-[#f7f9f9]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto w-full">
        <Sections />
      </main>
    </div>
  )
}

