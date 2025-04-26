import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">ระบบจัดการข้อมูลเงินเดือน</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/company">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <Building2 className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>จัดการข้อมูลบริษัท</CardTitle>
              <CardDescription>จัดการข้อมูลบริษัท ประเภทพนักงาน และการตั้งค่าต่างๆ</CardDescription>
            </CardHeader>
            <CardContent>
              <p>ตั้งค่าข้อมูลบริษัท รายการเงินได้ รายการเงินหัก และการคำนวณภาษี</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/payroll">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <Users className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>จัดการข้อมูลเงินเดือน</CardTitle>
              <CardDescription>จัดการข้อมูลพนักงานและการจ่ายเงินเดือน</CardDescription>
            </CardHeader>
            <CardContent>
              <p>เพิ่มข้อมูลพนักงาน จัดการเงินเดือน และดูประวัติการจ่ายเงินเดือน</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
