"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Save, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"

// Define employee type interface
interface EmployeeType {
  id: string
  name: string
  workDaysPerMonth: number
  workHoursPerDay: number
  workHoursPerMonth: number
  status: "active" | "inactive"
}

// Define income item interface
interface IncomeItem {
  id: string
  name: string
  type: "เงินเดือน" | "เงินได้ประจำ" | "เงินได้อื่นๆ"
  status: "active" | "inactive"
}

// Define social security settings interface
interface SocialSecuritySettings {
  rate: number
  maxAmount: number
  incomeItems: {
    [employeeTypeId: string]: string[] // Array of income item IDs
  }
}

// Form schema for social security rate settings
const rateFormSchema = z.object({
  rate: z.coerce.number().min(0, "อัตราเงินหักประกันสังคมต้องไม่ต่ำกว่า 0%").max(100, "อัตราเงินหักประกันสังคมต้องไม่เกิน 100%"),
  maxAmount: z.coerce.number().min(0, "จำนวนเงินหักสูงสุดต้องไม่ต่ำกว่า 0 บาท"),
})

type RateFormValues = z.infer<typeof rateFormSchema>

// Mock data for employee types
const mockEmployeeTypes: Record<string, EmployeeType[]> = {
  "1": [
    {
      id: "1",
      name: "พนักงานประจำ - รายเดือน",
      workDaysPerMonth: 22,
      workHoursPerDay: 8,
      workHoursPerMonth: 176,
      status: "active",
    },
    {
      id: "2",
      name: "พนักงานประจำ - รายวัน",
      workDaysPerMonth: 26,
      workHoursPerDay: 8,
      workHoursPerMonth: 208,
      status: "active",
    },
    {
      id: "3",
      name: "พนักงานชั่วคราว",
      workDaysPerMonth: 20,
      workHoursPerDay: 6,
      workHoursPerMonth: 120,
      status: "active",
    },
    {
      id: "4",
      name: "พนักงานทดลองงาน",
      workDaysPerMonth: 22,
      workHoursPerDay: 8,
      workHoursPerMonth: 176,
      status: "active",
    },
  ],
}

// Mock data for income items
const mockIncomeItems: Record<string, IncomeItem[]> = {
  "1": [
    { id: "base-salary", name: "เงินเดือน", type: "เงินเดือน", status: "active" },
    { id: "position-allowance", name: "เงินประจำตำแหน่ง", type: "เงินได้ประจำ", status: "active" },
    { id: "professional-fee", name: "ค่าวิชาชีพ", type: "เงินได้ประจำ", status: "active" },
    { id: "consultant-fee", name: "ค่าที่ปรึกษา", type: "เงินได้ประจำ", status: "active" },
    { id: "overtime-weekday", name: "ค่าล่วงเวลา ทำงานในวันทำงานปกติ", type: "เงินได้อื่นๆ", status: "active" },
    { id: "overtime-weekend", name: "ค่าล่วงเวลา ทำงานในวันหยุด", type: "เงินได้อื่นๆ", status: "active" },
    { id: "overtime-holiday", name: "ค่าล่วงเวลา ทำงานในวันหยุดนักขัตฤกษ์", type: "เงินได้อื่นๆ", status: "active" },
    { id: "monthly-bonus", name: "ค่าเบี้ยขยันประจำเดือน", type: "เงินได้อื่นๆ", status: "active" },
    { id: "bonus", name: "โบนัส", type: "เงินได้อื่นๆ", status: "active" },
  ],
}

// Mock data for social security settings
const mockSocialSecuritySettings: Record<string, SocialSecuritySettings> = {
  "1": {
    rate: 5,
    maxAmount: 750,
    incomeItems: {
      "1": [
        "base-salary",
        "position-allowance",
        "professional-fee",
        "overtime-weekday",
        "overtime-weekend",
        "overtime-holiday",
      ],
      "2": ["base-salary", "position-allowance", "overtime-weekday", "overtime-weekend", "overtime-holiday"],
      "3": ["base-salary"],
      "4": ["base-salary", "position-allowance"],
    },
  },
}

interface SocialSecuritySettingsProps {
  companyId: string
}

export function SocialSecuritySettings({ companyId }: SocialSecuritySettingsProps) {
  const { toast } = useToast()
  const [employeeTypes, setEmployeeTypes] = useState<EmployeeType[]>([])
  const [incomeItems, setIncomeItems] = useState<IncomeItem[]>([])
  const [settings, setSettings] = useState<SocialSecuritySettings | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("1") // Default to first employee type

  // Initialize form for rate settings
  const rateForm = useForm<RateFormValues>({
    resolver: zodResolver(rateFormSchema),
    defaultValues: {
      rate: 5,
      maxAmount: 750,
    },
  })

  useEffect(() => {
    // In a real app, fetch from API
    setEmployeeTypes(mockEmployeeTypes[companyId] || [])
    setIncomeItems(mockIncomeItems[companyId] || [])
    setSettings(mockSocialSecuritySettings[companyId] || null)

    if (mockSocialSecuritySettings[companyId]) {
      rateForm.reset({
        rate: mockSocialSecuritySettings[companyId].rate,
        maxAmount: mockSocialSecuritySettings[companyId].maxAmount,
      })
    }
  }, [companyId, rateForm])

  // Group income items by type
  const groupedIncomeItems = incomeItems.reduce(
    (acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = []
      }
      acc[item.type].push(item)
      return acc
    },
    {} as Record<string, IncomeItem[]>,
  )

  const handleRateSubmit = (data: RateFormValues) => {
    if (!settings) return

    const updatedSettings = {
      ...settings,
      rate: data.rate,
      maxAmount: data.maxAmount,
    }

    setSettings(updatedSettings)
    setIsEditing(false)

    toast({
      title: "บันทึกการตั้งค่าสำเร็จ",
      description: "อัตราเงินหักประกันสังคมได้รับการอัปเดตเรียบร้อยแล้ว",
    })
  }

  const handleIncomeItemChange = (employeeTypeId: string, incomeItemId: string, checked: boolean) => {
    if (!settings) return

    const updatedIncomeItems = { ...settings.incomeItems }

    if (!updatedIncomeItems[employeeTypeId]) {
      updatedIncomeItems[employeeTypeId] = []
    }

    if (checked) {
      // Add item if not already included
      if (!updatedIncomeItems[employeeTypeId].includes(incomeItemId)) {
        updatedIncomeItems[employeeTypeId] = [...updatedIncomeItems[employeeTypeId], incomeItemId]
      }
    } else {
      // Remove item
      updatedIncomeItems[employeeTypeId] = updatedIncomeItems[employeeTypeId].filter((id) => id !== incomeItemId)
    }

    const updatedSettings = {
      ...settings,
      incomeItems: updatedIncomeItems,
    }

    setSettings(updatedSettings)
  }

  const handleSaveIncomeItems = () => {
    toast({
      title: "บันทึกการตั้งค่าสำเร็จ",
      description: "รายการเงินได้ที่ใช้คำนวณประกันสังคมได้รับการอัปเดตเรียบร้อยแล้ว",
    })
  }

  if (!settings) {
    return <div>กำลังโหลดข้อมูล...</div>
  }

  return (
    <div className="space-y-8">
      {/* Section 1: Social Security Rate Settings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>กำหนดอัตราเงินหักประกันสังคม</CardTitle>
            <CardDescription>กำหนดอัตราเงินหักประกันสังคมและจำนวนเงินหักสูงสุดต่อเดือน</CardDescription>
          </div>
          <Button variant="outline" size="icon" onClick={() => setIsEditing(!isEditing)}>
            <Edit className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Form {...rateForm}>
              <form onSubmit={rateForm.handleSubmit(handleRateSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={rateForm.control}
                    name="rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>กำหนดอัตราเงินหักประกันสังคม (%) ของฐานเงินเดือน</FormLabel>
                        <div className="flex items-center space-x-2">
                          <FormControl>
                            <Input type="number" step="0.01" min="0" max="100" {...field} />
                          </FormControl>
                          <span>%</span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={rateForm.control}
                    name="maxAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>กำหนดอัตราเงินหักสูงสุดไม่เกินเดือนละ</FormLabel>
                        <div className="flex items-center space-x-2">
                          <FormControl>
                            <Input type="number" step="1" min="0" {...field} />
                          </FormControl>
                          <span>บาท</span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit">บันทึก</Button>
                </div>
              </form>
            </Form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  กำหนดอัตราเงินหักประกันสังคม (%) ของฐานเงินเดือน
                </h3>
                <p className="text-xl font-semibold">{settings.rate}%</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">กำหนดอัตราเงินหักสูงสุดไม่เกินเดือนละ</h3>
                <p className="text-xl font-semibold">{settings.maxAmount.toLocaleString()} บาท</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 2: Income Items for Social Security Calculation */}
      <Card>
        <CardHeader>
          <CardTitle>รายการเงินได้เพื่อคำนวณการหักประกันสังคม</CardTitle>
          <CardDescription>เลือกรายการเงินได้ที่ต้องการนำมาคำนวณการหักประกันสังคมตามประเภทพนักงาน</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4 flex flex-wrap">
              {employeeTypes.map((type) => (
                <TabsTrigger key={type.id} value={type.id}>
                  {type.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {employeeTypes.map((employeeType) => (
              <TabsContent key={employeeType.id} value={employeeType.id} className="space-y-6">
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[60px]">ลำดับ</TableHead>
                        <TableHead>รายการเงินได้</TableHead>
                        <TableHead>ประเภท</TableHead>
                        <TableHead className="w-[100px] text-center">เลือก</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Base Salary (Always first and always selected) */}
                      <TableRow className="bg-muted/30">
                        <TableCell>1</TableCell>
                        <TableCell className="font-medium">เงินเดือน</TableCell>
                        <TableCell>เงินเดือน</TableCell>
                        <TableCell className="text-center">
                          <Checkbox checked={true} disabled onCheckedChange={() => {}} />
                        </TableCell>
                      </TableRow>

                      {/* Regular Income Items */}
                      {groupedIncomeItems["เงินได้ประจำ"]?.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell>{index + 2}</TableCell>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.type}</TableCell>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={settings.incomeItems[employeeType.id]?.includes(item.id) || false}
                              onCheckedChange={(checked) =>
                                handleIncomeItemChange(employeeType.id, item.id, checked === true)
                              }
                            />
                          </TableCell>
                        </TableRow>
                      ))}

                      {/* Other Income Items */}
                      {groupedIncomeItems["เงินได้อื่นๆ"]?.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell>{(groupedIncomeItems["เงินได้ประจำ"]?.length || 0) + index + 2}</TableCell>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.type}</TableCell>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={settings.incomeItems[employeeType.id]?.includes(item.id) || false}
                              onCheckedChange={(checked) =>
                                handleIncomeItemChange(employeeType.id, item.id, checked === true)
                              }
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveIncomeItems}>
                    <Save className="mr-2 h-4 w-4" />
                    บันทึกการตั้งค่า
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
