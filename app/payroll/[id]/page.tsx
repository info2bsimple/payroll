"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Pencil } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { mockEmployees } from "@/data/mock-data"
import { EditEmployeeForm } from "@/components/forms/edit-employee-form"
import { EditBankForm } from "@/components/forms/edit-bank-form"
import { EditSalaryForm } from "@/components/forms/edit-salary-form"

interface Employee {
  id: string
  prefix: string
  firstName: string
  lastName: string
  idCardNumber: string
  employeeCode?: string
  providentFundId?: string
  dateOfBirth?: string
  fundMembershipDate?: string
  fundMemberType?: string
  employeeType: string
  company: string
  department: string
  position: string
  startDate: string
  bank: string
  accountName: string
  accountNumber: string
  branch: string
  salary?: number
  status: "active" | "inactive"
  hourlyRate?: number
  positionAllowance?: number
  costOfLiving?: number
}

export default function EmployeeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [activeTab, setActiveTab] = useState("info")

  // Add these state variables
  const [isEditingEmployee, setIsEditingEmployee] = useState(false)
  const [isEditingBank, setIsEditingBank] = useState(false)
  const [isEditingSalary, setIsEditingSalary] = useState(false)

  useEffect(() => {
    // In a real app, fetch from API
    const employeeId = params.id as string
    const foundEmployee = mockEmployees.find((emp) => emp.id === employeeId)

    if (foundEmployee) {
      setEmployee(foundEmployee)
    } else {
      // Redirect to main page if employee not found
      router.push("/payroll")
    }
  }, [params.id, router])

  if (!employee) {
    return <div className="container mx-auto p-6">กำลังโหลดข้อมูล...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.push("/payroll")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          กลับไปหน้ารายการพนักงาน
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {employee.id} - {employee.prefix}
              {employee.firstName} {employee.lastName}
              <Badge variant={employee.status === "active" ? "success" : "destructive"}>
                {employee.status === "active" ? "ใช้งาน" : "ไม่ใช้งาน"}
              </Badge>
            </h1>
            <p className="text-muted-foreground">
              {employee.position} • {employee.department}
            </p>
          </div>
          <Button onClick={() => router.push(`/payroll/${employee.id}/edit`)}>
            <Pencil className="mr-2 h-4 w-4" />
            แก้ไขข้อมูล
          </Button>
        </div>
      </div>

      {/* Edit Employee Form */}
      {isEditingEmployee && employee && (
        <EditEmployeeForm
          employee={employee}
          onSave={(updatedEmployee) => {
            setEmployee({ ...employee, ...updatedEmployee })
            setIsEditingEmployee(false)
          }}
          onCancel={() => setIsEditingEmployee(false)}
          existingEmployees={mockEmployees.filter((emp) => emp.id !== employee.id)}
        />
      )}

      {/* Edit Bank Form */}
      {isEditingBank && employee && (
        <EditBankForm
          employee={employee}
          onSave={(updatedEmployee) => {
            setEmployee({ ...employee, ...updatedEmployee })
            setIsEditingBank(false)
          }}
          onCancel={() => setIsEditingBank(false)}
        />
      )}

      {/* Edit Salary Form */}
      {isEditingSalary && employee && (
        <EditSalaryForm
          employee={employee}
          onSave={(updatedEmployee) => {
            setEmployee({ ...employee, ...updatedEmployee })
            setIsEditingSalary(false)
          }}
          onCancel={() => setIsEditingSalary(false)}
        />
      )}

      <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="info">ข้อมูลพนักงาน</TabsTrigger>
          <TabsTrigger value="salary">เงินเดือน</TabsTrigger>
          <TabsTrigger value="work-hours">จำนวนวันทำงาน</TabsTrigger>
          <TabsTrigger value="benefits">สิทธิประโยชน์</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">ข้อมูลพนักงาน</h3>
                  <Button variant="outline" size="sm" onClick={() => setIsEditingEmployee(true)}>
                    <Pencil className="mr-2 h-3 w-3" />
                    แก้ไข
                  </Button>
                </div>
                <Separator className="mb-4" />

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm text-muted-foreground">คำนำหน้า</div>
                    <div className="font-medium">{employee.prefix}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm text-muted-foreground">ชื่อ</div>
                    <div className="font-medium">{employee.firstName}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm text-muted-foreground">นามสกุล</div>
                    <div className="font-medium">{employee.lastName}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm text-muted-foreground">เลขบัตรประจำตัวประชาชน</div>
                    <div className="font-medium">{employee.idCardNumber}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm text-muted-foreground">ประเภทพนักงาน</div>
                    <div className="font-medium">{employee.employeeType}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm text-muted-foreground">สังกัดบริษัท</div>
                    <div className="font-medium">{employee.company}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm text-muted-foreground">วันที่เริ่มงาน</div>
                    <div className="font-medium">{employee.startDate || "-"}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm text-muted-foreground">แผนก</div>
                    <div className="font-medium">{employee.department}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm text-muted-foreground">ตำแหน่ง</div>
                    <div className="font-medium">{employee.position}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm text-muted-foreground">รหัสพนักงาน</div>
                    <div className="font-medium">{employee.employeeCode || "-"}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm text-muted-foreground">รหัสสมาชิกกองทุนสำรองเลี้ยงชีพ</div>
                    <div className="font-medium">{employee.providentFundId || "-"}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm text-muted-foreground">วันเดือนปีเกิด</div>
                    <div className="font-medium">{employee.dateOfBirth || "-"}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm text-muted-foreground">วันที่เข้าเป็นสมาชิกกองทุน</div>
                    <div className="font-medium">{employee.fundMembershipDate || "-"}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm text-muted-foreground">ประเภทสมาชิกกองทุนฯ</div>
                    <div className="font-medium">{employee.fundMemberType || "-"}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">ข้อมูลบัญชีธนาคาร</h3>
                  <Button variant="outline" size="sm" onClick={() => setIsEditingBank(true)}>
                    <Pencil className="mr-2 h-3 w-3" />
                    แก้ไข
                  </Button>
                </div>
                <Separator className="mb-4" />

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm text-muted-foreground">ธนาคาร</div>
                    <div className="font-medium">{employee.bank}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm text-muted-foreground">ชื่อบัญชี</div>
                    <div className="font-medium">{employee.accountName}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm text-muted-foreground">เลขที่บัญชี</div>
                    <div className="font-medium">{employee.accountNumber}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm text-muted-foreground">สาขา</div>
                    <div className="font-medium">{employee.branch}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="salary">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">สรุปเงินเดือน</h3>
                <Button variant="outline" size="sm" onClick={() => setIsEditingSalary(true)}>
                  <Pencil className="mr-2 h-3 w-3" />
                  แก้ไข
                </Button>
              </div>
              <Separator className="mb-4" />

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">เงินเดือนพื้นฐาน</p>
                    <p className="text-xl font-semibold">
                      {employee.salary ? `${employee.salary.toLocaleString()} บาท` : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">รายได้เพิ่มเติม</p>
                    <p className="text-xl font-semibold">
                      {(employee.positionAllowance || 0) + (employee.costOfLiving || 0) > 0
                        ? `${((employee.positionAllowance || 0) + (employee.costOfLiving || 0)).toLocaleString()} บาท`
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ภาษีและประกันสังคม</p>
                    <p className="text-xl font-semibold text-red-500">-0 บาท</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-lg text-muted-foreground">รวมรับสุทธิ</p>
                  <p className="text-2xl font-bold text-green-600">
                    {employee.salary
                      ? `${(
                          (employee.salary || 0) + (employee.positionAllowance || 0) + (employee.costOfLiving || 0)
                        ).toLocaleString()} บาท`
                      : "-"}
                  </p>
                </div>

                <Separator />

                <h4 className="text-lg font-medium mb-4">เงินเดือนและรายได้เสริมประจำเดือน</h4>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">ลำดับ</th>
                        <th className="text-left py-2 px-4">รายการ</th>
                        <th className="text-right py-2 px-4">จำนวนเงิน(บาท)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 px-4">1</td>
                        <td className="py-2 px-4">ฐานเงินเดือน</td>
                        <td className="text-right py-2 px-4">
                          {employee.salary
                            ? `${employee.salary.toLocaleString()} (${employee.hourlyRate || 125} บาท/ชั่วโมง)`
                            : "-"}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4">2</td>
                        <td className="py-2 px-4">เงินประจำตำแหน่ง</td>
                        <td className="text-right py-2 px-4">
                          {employee.positionAllowance ? `${employee.positionAllowance.toLocaleString()}` : "-"}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4">3</td>
                        <td className="py-2 px-4">ค่าครองชีพ</td>
                        <td className="text-right py-2 px-4">
                          {employee.costOfLiving ? `${employee.costOfLiving.toLocaleString()}` : "-"}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr className="bg-muted/50">
                        <td colSpan={2} className="py-2 px-4 font-medium">
                          รวมเงินเดือนและรายได้เสริมประจำเดือน
                        </td>
                        <td className="text-right py-2 px-4 font-medium">
                          {(
                            (employee.salary || 0) +
                            (employee.positionAllowance || 0) +
                            (employee.costOfLiving || 0)
                          ).toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="work-hours">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">จำนวนวันทำงานต่อเดือน</h3>
              <Separator className="mb-4" />

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">จำนวนวันทำงานต่อเดือน</p>
                    <p className="text-xl font-semibold">30 วัน/เดือน</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">จำนวนชั่วโมงทำงานต่อวัน</p>
                    <p className="text-xl font-semibold">8 ชั่วโมง/วัน</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">จำนวนชั่วโมงทำงานต่อเดือน</p>
                    <p className="text-xl font-semibold">240 ชั่วโมง/เดือน</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">อัตราค่าล่วงเวลา</p>
                    <p className="text-xl font-semibold">- บาท/ชั่วโมง</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">สิทธิประโยชน์อื่นๆ ที่เป็นจำนวนเงิน</h3>
                <Separator className="mb-4" />

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">ลำดับ</th>
                        <th className="text-left py-2 px-4">รายการ</th>
                        <th className="text-center py-2 px-4">จำนวน</th>
                        <th className="text-left py-2 px-4">รายละเอียด</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 px-4">1</td>
                        <td className="py-2 px-4">ค่าล่วงเวลา /ค่าทำงานล่วงเวลาในวันหยุด</td>
                        <td className="text-center py-2 px-4">-</td>
                        <td className="py-2 px-4">เท่า ของรายได้ต่อชั่วโมง</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4">2</td>
                        <td className="py-2 px-4">ค่าล่วงเวลา /ค่าทำงานล่วงเวลา ในวันหยุด</td>
                        <td className="text-center py-2 px-4">-</td>
                        <td className="py-2 px-4">เท่า ของรายได้ต่อชั่วโมง</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4">3</td>
                        <td className="py-2 px-4">ค่าล่วงเวลา /ค่าทำงานล่วงเวลา ในวันหยุด</td>
                        <td className="text-center py-2 px-4">-</td>
                        <td className="py-2 px-4">เท่า ของรายได้ต่อชั่วโมง</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4">4</td>
                        <td className="py-2 px-4">ค่าเดินทางประจำเดือน</td>
                        <td className="text-center py-2 px-4">-</td>
                        <td className="py-2 px-4">-</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4">5</td>
                        <td className="py-2 px-4">โบนัส</td>
                        <td className="text-center py-2 px-4">-</td>
                        <td className="py-2 px-4">-</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={4} className="py-2 px-4 text-center text-muted-foreground">
                          สิทธิประโยชน์อื่นๆ ที่เป็นจำนวนเงิน
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">สิทธิประโยชน์อื่นๆ ที่ไม่ใช่จำนวนเงิน</h3>
                <Separator className="mb-4" />

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">ลำดับ</th>
                        <th className="text-left py-2 px-4">รายการ</th>
                        <th className="text-left py-2 px-4">รายละเอียด</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={3} className="py-6 px-4 text-center text-muted-foreground">
                          ไม่มีข้อมูล
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
