"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Save, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"

// Define income item interface with account code
interface IncomeItem {
  id: string
  name: string
  type: "เงินได้ประจำ" | "เงินได้อื่นๆ" | "รายการเงินหัก" | "ค่าธรรมเนียม"
  accountCode: string
  status: "active" | "inactive"
}

// Mock data for income items with account codes
const mockIncomeItems: IncomeItem[] = [
  // Regular Income
  { id: "base-salary", name: "ฐานเงินเดือน", type: "เงินได้ประจำ", accountCode: "5101", status: "active" },
  { id: "professional-fee", name: "ค่าวิชาชีพ", type: "เงินได้ประจำ", accountCode: "5102", status: "active" },
  { id: "position-allowance", name: "ค่าตำแหน่ง", type: "เงินได้ประจำ", accountCode: "5103", status: "active" },

  // Other Income
  { id: "overtime", name: "ค่าโอที", type: "เงินได้อื่นๆ", accountCode: "5201", status: "active" },
  { id: "per-diem", name: "ค่าเบี้ยเลี้ยง", type: "เงินได้อื่นๆ", accountCode: "5202", status: "active" },
  { id: "bonus", name: "ค่าโบนัส", type: "เงินได้อื่นๆ", accountCode: "5203", status: "active" },
  { id: "commission", name: "ค่าคอมมิชชั่น", type: "เงินได้อื่นๆ", accountCode: "5204", status: "active" },

  // Deductions
  { id: "social-security", name: "ประกันสังคม", type: "รายการเงินหัก", accountCode: "2101", status: "active" },
  { id: "withholding-tax", name: "ภาษีหัก ณ ที่จ่าย (ภงด 1)", type: "รายการเงินหัก", accountCode: "2102", status: "active" },
  { id: "provident-fund", name: "กองทุนสำรองเลี้ยงชีพ", type: "รายการเงินหัก", accountCode: "2103", status: "active" },
  { id: "welfare-loan", name: "เงินกู้สวัสดิการ", type: "รายการเงินหัก", accountCode: "2104", status: "active" },
  { id: "cooperative-fee", name: "ค่าสหกรณ์", type: "รายการเงินหัก", accountCode: "2105", status: "active" },
  { id: "life-insurance", name: "ค่าประกันชีวิต", type: "รายการเงินหัก", accountCode: "2106", status: "active" },

  // Bank Fees
  { id: "bank-fee", name: "ค่าธรรมเนียมธนาคาร", type: "ค่าธรรมเนียม", accountCode: "3101", status: "active" },
  {
    id: "bank-account",
    name: "ธนาคาร - เลขที่บัญชี (1234567890)",
    type: "ค่าธรรมเนียม",
    accountCode: "1101",
    status: "active",
  },
]

// Form schema for account codes
const accountCodesFormSchema = z.object({
  accountCodes: z.record(z.string().min(1, "รหัสบัญชีไม่สามารถเป็นค่าว่างได้")),
})

type AccountCodesFormValues = z.infer<typeof accountCodesFormSchema>

interface AccountCodesSettingsProps {
  companyId: string
}

export function AccountCodesSettings({ companyId }: AccountCodesSettingsProps) {
  const { toast } = useToast()
  const [incomeItems, setIncomeItems] = useState<IncomeItem[]>(mockIncomeItems)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("เงินได้ประจำ") // Default to regular income

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

  // Initialize form for account codes with current values
  const accountCodesForm = useForm<AccountCodesFormValues>({
    resolver: zodResolver(accountCodesFormSchema),
    defaultValues: {
      accountCodes: incomeItems.reduce(
        (acc, item) => {
          acc[item.id] = item.accountCode
          return acc
        },
        {} as Record<string, string>,
      ),
    },
  })

  const handleAccountCodesSubmit = (data: AccountCodesFormValues) => {
    // Update income items with new account codes
    const updatedIncomeItems = incomeItems.map((item) => ({
      ...item,
      accountCode: data.accountCodes[item.id] || item.accountCode,
    }))

    setIncomeItems(updatedIncomeItems)
    setIsEditing(false)

    toast({
      title: "บันทึกการตั้งค่าสำเร็จ",
      description: "รหัสบัญชีได้รับการอัปเดตเรียบร้อยแล้ว",
    })
  }

  return (
    <div className="space-y-8">
      {/* Account Codes Settings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>ตั้งค่ารหัสบัญชี</CardTitle>
            <CardDescription>กำหนดรหัสบัญชีของรายการเงินได้และรายการเงินหัก</CardDescription>
          </div>
          <Button variant="outline" size="icon" onClick={() => setIsEditing(!isEditing)}>
            <Edit className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4 flex flex-wrap">
              {Object.keys(groupedIncomeItems).map((type) => (
                <TabsTrigger key={type} value={type} className="whitespace-nowrap">
                  {type}
                </TabsTrigger>
              ))}
            </TabsList>

            <Form {...accountCodesForm}>
              <form onSubmit={accountCodesForm.handleSubmit(handleAccountCodesSubmit)}>
                {Object.entries(groupedIncomeItems).map(([type, items]) => (
                  <TabsContent key={type} value={type} className="space-y-6">
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[60px]">ลำดับ</TableHead>
                            <TableHead>รายการ</TableHead>
                            <TableHead className="w-[200px]">รหัสบัญชี</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {items.map((item, index) => (
                            <TableRow key={item.id}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell>
                                {isEditing ? (
                                  <FormField
                                    control={accountCodesForm.control}
                                    name={`accountCodes.${item.id}`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Input placeholder="รหัสบัญชี" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                ) : (
                                  item.accountCode
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {isEditing && activeTab === type && (
                      <div className="flex justify-end">
                        <Button type="submit">
                          <Save className="mr-2 h-4 w-4" />
                          บันทึกการตั้งค่า
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                ))}
              </form>
            </Form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
