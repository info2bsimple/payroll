"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, PenSquare, XCircle, CheckCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EditBankForm } from "@/components/forms/edit-bank-form"
import { EditSalaryForm } from "@/components/forms/edit-salary-form"
import { EditEmployeeForm } from "@/components/forms/edit-employee-form"
import { useToast } from "@/hooks/use-toast"
import { mockEmployees } from "@/data/mock-data"

export default function EmployeeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()

  const [employee, setEmployee] = useState<any>(null)
  const [isEditBankActive, setIsEditBankActive] = useState(false)
  const [isEditSalaryActive, setIsEditSalaryActive] = useState(false)
  const [isEditEmployeeActive, setIsEditEmployeeActive] = useState(false)
  const [isStatusChangeDialogOpen, setIsStatusChangeDialogOpen] = useState(false)

  useEffect(() => {
    // In a real app, fetch from API
    const employeeId = params.id as string
    const foundEmployee = mockEmployees.find((e) => e.id === employeeId)

    if (foundEmployee) {
      setEmployee(foundEmployee)
    } else {
      // Redirect to payroll page if employee not found
      router.push("/payroll")
    }
  }, [params.id, router])

  const handleSaveBank = (data: Partial<any>) => {
    if (!employee) return

    const updatedEmployee = {
      ...employee,
      ...data,
    }

    // In a real app, this would be an API call
    setEmployee(updatedEmployee)
    setIsEditBankActive(false)

    toast({
      title: "แก้ไขข้อมูลธนาคารสำเร็จ",
      description: "ข้อมูลธนาคารของพนักงานได้รับการอัปเดตเรียบร้อยแล้ว",
    })
  }

  const handleSaveSalary = (data: Partial<any>) => {
    if (!employee) return

    const updatedEmployee = {
      ...employee,
      ...data,
    }

    // In a real app, this would be an API call
    setEmployee(updatedEmployee)
    setIsEditSalaryActive(false)

    toast({
      title: "แก้ไขข้อมูลเงินเดือนสำเร็จ",
      description: "ข้อมูลเงินเดือนของพนักงานได้รับการอัปเดตเรียบร้อยแล้ว",
    })
  }

  const handleEditEmployee = (data: Partial<any>) => {
    if (!employee) return

    const updatedEmployee = {
      ...employee,
      ...data,
    }

    // In a real app, this would be an API call
    setEmployee(updatedEmployee)
    setIsEditEmployeeActive(false)

    toast({
      title: "แก้ไขข้อมูลพนักงานสำเร็จ",
      description: `ข้อมูลของ ${data.prefix}${data.firstName} ${data.lastName} ได้รับการอัปเดตเรียบร้อยแล้ว`,
    })
  }

  const handleStatusChange = () => {
    if (!employee) return

    const newStatus = employee.status === "active" ? "inactive" : "active"
    const updatedEmployee = {
      ...employee,
      status: newStatus,
    }

    // In a real app, this would be an API call
    setEmployee(updatedEmployee)
    setIsStatusChangeDialogOpen(false)

    toast({
      title: "เปลี่ยนสถานะพนักงานสำเร็จ",
      description: `สถานะของพนักงานได้ถูกเปลี่ยนเป็น${newStatus === "active" ? "ใช้งาน" : "ไม่ใช้งาน"}เรียบร้อยแล้ว`,
    })
  }

  if (!employee) {
    return <div className="container mx-auto p-6">กำลังโหลดข้อมูล...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex flex-wrap justify-between items-start gap-4">
        <div>
          <Button variant="outline" onClick={() => router.push("/payroll")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            กลับไปหน้ารายการพนักงาน
          </Button>
          <h1 className="text-2xl font-bold">
            {employee.prefix}
            {employee.firstName} {employee.lastName}
          </h1>
          <div className="flex items-center mt-1">
            <p className="text-muted-foreground">รหัสพนักงาน: {employee.id}</p>
            <span className="mx-2">•</span>
            <p className="text-muted-foreground">แผนก: {employee.department}</p>
            <span className="mx-2">•</span>
            <div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  employee.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {employee.status === "active" ? "ใช้งาน" : "ไม่ใช้งาน"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setIsEditEmployeeActive(true)}>
            <PenSquare className="mr-2 h-4 w-4" />
            แก้ไขข้อมูลพนักงาน
          </Button>
          <Button variant="outline" onClick={() => setIsStatusChangeDialogOpen(true)}>
            {employee.status === "active" ? (
              <XCircle className="mr-2 h-4 w-4" />
            ) : (
              <CheckCircle className="mr-2 h-4 w-4" />
            )}
            {employee.status === "active" ? "ยกเลิกการใช้งาน" : "เปิดใช้งาน"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">ข้อมูลพนักงาน</TabsTrigger>
          <TabsTrigger value="finance">ข้อมูลการเงิน</TabsTrigger>
          <TabsTrigger value="tax">ข้อมูลภาษี</TabsTrigger>
          <TabsTrigger value="social-security">ประกันสังคม</TabsTrigger>
          <TabsTrigger value="provident-fund">กองทุนสำรองเลี้ยงชีพ</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลทั่วไป</CardTitle>
              <CardDescription>ข้อมูลพื้นฐานของพนักงาน</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">ชื่อ-นามสกุล</h3>
                    <p className="text-lg font-medium mt-1">
                      {employee.prefix}
                      {employee.firstName} {employee.lastName}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">เลขบัตรประจำตัวประชาชน</h3>
                    <p className="text-lg font-medium mt-1">{employee.idCardNumber}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">วันเดือนปีเกิด</h3>
                    <p className="text-lg font-medium mt-1">{employee.dateOfBirth || "-"}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">วันที่เริ่มงาน</h3>
                    <p className="text-lg font-medium mt-1">{employee.startDate || "-"}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">ประเภทพนักงาน</h3>
                    <p className="text-lg font-medium mt-1">{employee.employeeType}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">บริษัท</h3>
                    <p className="text-lg font-medium mt-1">{employee.company}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">แผนก</h3>
                    <p className="text-lg font-medium mt-1">{employee.department}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">ตำแหน่ง</h3>
                    <p className="text-lg font-medium mt-1">{employee.position}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>ข้อมูลบัญชีธนาคาร</CardTitle>
                <CardDescription>ข้อมูลบัญชีธนาคารสำหรับการโอนเงินเดือน</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsEditBankActive(true)}>
                <PenSquare className="mr-2 h-4 w-4" />
                แก้ไข
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              {isEditBankActive ? (
                <EditBankForm employee={employee} onSave={handleSaveBank} onCancel={() => setIsEditBankActive(false)} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">ธนาคาร</h3>
                      <p className="text-lg font-medium mt-1">{employee.bank}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">ชื่อบัญชี</h3>
                      <p className="text-lg font-medium mt-1">{employee.accountName}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">เลขที่บัญชี</h3>
                      <p className="text-lg font-medium mt-1">{employee.accountNumber}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">สาขา</h3>
                      <p className="text-lg font-medium mt-1">{employee.branch}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">พื้นที่</h3>
                      <p className="text-lg font-medium mt-1">{employee.bankLocation || "กรุงเทพฯ"}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finance" className="space-y-6 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>ข้อมูลเงินเดือน</CardTitle>
                <CardDescription>ข้อมูลเงินเดือนและค่าตอบแทน</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsEditSalaryActive(true)}>
                <PenSquare className="mr-2 h-4 w-4" />
                แก้ไข
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              {isEditSalaryActive ? (
                <EditSalaryForm
                  employee={employee}
                  onSave={handleSaveSalary}
                  onCancel={() => setIsEditSalaryActive(false)}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">เงินเดือน</h3>
                      <p className="text-lg font-medium mt-1">
                        {employee.salary ? `${employee.salary.toLocaleString()} บาท` : "-"}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">อัตราค่าจ้างรายวัน</h3>
                      <p className="text-lg font-medium mt-1">
                        {employee.dailyRate ? `${employee.dailyRate.toLocaleString()} บาท` : "-"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">ค่าตำแหน่ง</h3>
                      <p className="text-lg font-medium mt-1">
                        {employee.positionAllowance ? `${employee.positionAllowance.toLocaleString()} บาท` : "-"}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">ค่าครองชีพ</h3>
                      <p className="text-lg font-medium mt-1">
                        {employee.costOfLiving ? `${employee.costOfLiving.toLocaleString()} บาท` : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="provident-fund" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลกองทุนสำรองเลี้ยงชีพ</CardTitle>
              <CardDescription>ข้อมูลการเป็นสมาชิกกองทุนสำรองเลี้ยงชีพ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">รหัสกองทุน</h3>
                    <p className="text-lg font-medium mt-1">{employee.providentFundId || "-"}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">วันที่เข้าเป็นสมาชิกกองทุน</h3>
                    <p className="text-lg font-medium mt-1">{employee.fundMembershipDate || "-"}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">ประเภทสมาชิกกองทุนฯ</h3>
                    <p className="text-lg font-medium mt-1">{employee.fundMemberType || "-"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลภาษี</CardTitle>
              <CardDescription>ข้อมูลสำหรับการคำนวณภาษี</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">ยังไม่มีข้อมูลภาษี</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social-security" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลประกันสังคม</CardTitle>
              <CardDescription>ข้อมูลประกันสังคม</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">ยังไม่มีข้อมูลประกันสังคม</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isEditEmployeeActive && (
        <EditEmployeeForm
          employee={employee}
          onSave={handleEditEmployee}
          onCancel={() => setIsEditEmployeeActive(false)}
          existingEmployees={mockEmployees.filter((e) => e.id !== employee.id)}
        />
      )}

      {/* Status Change Dialog */}
      <AlertDialog open={isStatusChangeDialogOpen} onOpenChange={setIsStatusChangeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {employee.status === "active" ? "ยกเลิกการใช้งานพนักงาน" : "เปิดใช้งานพนักงาน"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {employee.status === "active"
                ? `คุณต้องการยกเลิกการใช้งานของ ${employee.prefix}${employee.firstName} ${employee.lastName} ใช่หรือไม่?`
                : `คุณต้องการเปิดใช้งาน ${employee.prefix}${employee.firstName} ${employee.lastName} ใช่หรือไม่?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusChange}>
              {employee.status === "active" ? "ยกเลิกการใช้งาน" : "เปิดใช้งาน"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
