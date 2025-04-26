"use client"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect, useRef } from "react"

// Form schema
const formSchema = z.object({
  salary: z.coerce.number().min(0, "เงินเดือนต้องไม่ต่ำกว่า 0"),
  hourlyRate: z.coerce.number().min(0, "อัตราค่าจ้างรายชั่วโมงต้องไม่ต่ำกว่า 0"),
  positionAllowance: z.coerce.number().min(0, "เงินประจำตำแหน่งต้องไม่ต่ำกว่า 0"),
  costOfLiving: z.coerce.number().min(0, "ค่าครองชีพต้องไม่ต่ำกว่า 0"),
})

type FormValues = z.infer<typeof formSchema>

interface Employee {
  id: string
  prefix: string
  firstName: string
  lastName: string
  idCardNumber: string
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
  hourlyRate?: number
  positionAllowance?: number
  costOfLiving?: number
  status: "active" | "inactive"
}

interface EditSalaryFormProps {
  employee: Employee
  onSave: (data: Partial<Employee>) => void
  onCancel: () => void
}

export function EditSalaryForm({ employee, onSave, onCancel }: EditSalaryFormProps) {
  const { toast } = useToast()
  const [workHoursPerMonth, setWorkHoursPerMonth] = useState(176) // Default for monthly employees
  const updatingRef = useRef(false)

  useEffect(() => {
    // Set work hours based on employee type
    if (employee.employeeType.includes("รายวัน")) {
      setWorkHoursPerMonth(208) // 26 days * 8 hours
    } else {
      setWorkHoursPerMonth(176) // 22 days * 8 hours
    }
  }, [employee.employeeType])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      salary: employee.salary || 0,
      hourlyRate: employee.hourlyRate || 0,
      positionAllowance: employee.positionAllowance || 0,
      costOfLiving: employee.costOfLiving || 0,
    },
  })

  // Calculate hourly rate when form is initialized
  useEffect(() => {
    const salary = form.getValues("salary")
    if (salary > 0 && workHoursPerMonth > 0) {
      const calculatedHourlyRate = Math.round(salary / workHoursPerMonth)
      form.setValue("hourlyRate", calculatedHourlyRate)
    }
  }, [workHoursPerMonth, form])

  // Function to update salary based on hourly rate
  const updateSalaryFromHourlyRate = (hourlyRate: number) => {
    if (updatingRef.current) return

    updatingRef.current = true
    if (hourlyRate > 0) {
      const calculatedSalary = hourlyRate * workHoursPerMonth
      form.setValue("salary", calculatedSalary)
    }
    updatingRef.current = false
  }

  // Function to update hourly rate based on salary
  const updateHourlyRateFromSalary = (salary: number) => {
    if (updatingRef.current) return

    updatingRef.current = true
    if (salary > 0) {
      const calculatedHourlyRate = Math.round(salary / workHoursPerMonth)
      form.setValue("hourlyRate", calculatedHourlyRate)
    }
    updatingRef.current = false
  }

  const handleSubmit = (data: FormValues) => {
    // Update employee status if salary is set
    const newStatus = data.salary > 0 ? "active" : "inactive"

    onSave({
      ...data,
      status: newStatus as "active" | "inactive",
    })

    toast({
      title: "แก้ไขข้อมูลเงินเดือนสำเร็จ",
      description: `ข้อมูลเงินเดือนได้รับการอัปเดตเรียบร้อยแล้ว`,
    })
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">แก้ไขข้อมูลเงินเดือน</h3>
          <Button variant="outline" size="sm" onClick={onCancel}>
            ยกเลิก
          </Button>
        </div>
        <Separator className="mb-4" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>เงินเดือน (บาท)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            updateHourlyRateFromSalary(Number(e.target.value))
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hourlyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>อัตราค่าจ้างรายชั่วโมง (บาท/ชั่วโมง)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            updateSalaryFromHourlyRate(Number(e.target.value))
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-muted-foreground">คำนวณจาก {workHoursPerMonth} ชั่วโมงทำงานต่อเดือน</p>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="positionAllowance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>เงินประจำตำแหน่ง (บาท)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="costOfLiving"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ค่าครองชีพ (บาท)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="bg-muted/50 p-4 rounded-md">
                <h4 className="font-medium mb-2">สรุปรายได้ต่อเดือน</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm">เงินเดือนพื้นฐาน:</div>
                  <div className="text-sm font-medium">{form.watch("salary").toLocaleString()} บาท</div>

                  <div className="text-sm">เงินประจำตำแหน่ง:</div>
                  <div className="text-sm font-medium">{form.watch("positionAllowance").toLocaleString()} บาท</div>

                  <div className="text-sm">ค่าครองชีพ:</div>
                  <div className="text-sm font-medium">{form.watch("costOfLiving").toLocaleString()} บาท</div>

                  <div className="text-sm font-medium">รวมรายได้ต่อเดือน:</div>
                  <div className="text-sm font-bold">
                    {(
                      form.watch("salary") +
                      form.watch("positionAllowance") +
                      form.watch("costOfLiving")
                    ).toLocaleString()}{" "}
                    บาท
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">บันทึกข้อมูล</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
