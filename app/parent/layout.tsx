import { ParentNav } from '@/components/ParentNav'

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-amber-50 pb-20">
      {children}
      <ParentNav />
    </div>
  )
}
