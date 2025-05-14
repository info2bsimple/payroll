"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Save, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

// Define bank fees settings interface
interface BankFeesSettings {
  bangkokFee: number
  provincialFee: number
}

// Form schema for bank fees settings
const bankFeesFormSchema = z.object({
  bangkokFee: z.coerce.number().min(0, "ค่าธรรมเนียมบัญชีในกรุงเทพฯ ต้องไม่ต่ำกว่า 0 บาท"),
  provincialFee: z.coerce.number().min(0, "ค่าธรรมเนียมบัญชีต่างจังหวัด ต้องไม่ต่ำกว่า 0 บาท"),
})

type BankFeesFormValues = z.infer<typeof bankFeesFormSchema>

// Mock data for bank fees settings
const mockBankFeesSettings: Record<string, BankFeesSettings> = {
  "1": {
    bangkokFee: 10,
    provincialFee: 15,
  },
}

interface BankFeesSettingsProps {
  companyId: string
}

export function BankFeesSettings({ companyId }: BankFeesSettingsProps) {
  const { toast } = useToast()
  const [settings, setSettings] = useState<BankFeesSettings | null>(mockBankFeesSettings[companyId] || null)
  const [isEditing, setIsEditing] = useState(false)

  // Initialize form for bank fees settings
  const bankFeesForm = useForm<BankFeesFormValues>({
    resolver: zodResolver(bankFeesFormSchema),
    defaultValues: {
      bangkokFee: settings?.bangkokFee || 0,
      provincialFee: settings?.provincialFee || 0,
    },
  })

  const handleBankFeesSubmit = (data: BankFeesFormValues) => {
    const updatedSettings = {
      ...settings,
      bangkokFee: data.bangkokFee,
      provincialFee: data.provincialFee,
    }

    setSettings(updatedSettings as BankFeesSettings)
    setIsEditing(false)

    toast({
      title: "บันทึกการตั้งค่าสำเร็จ",
      description: "ค่าธรรมเนียมการโอนเงินเข้าบัญชีธนาคารได้รับการอัปเดตเรียบร้อยแล้ว",
    })
  }

  if (!settings) {
    return <div>กำลังโหลดข้อมูล...</div>
  }

  return (
    <div className="space-y-8">
      {/* Bank Transfer Fees Settings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>กำหนดค่าธรรมเนียมการโอนเงินเข้าบัญชีธนาคาร</CardTitle>
            <CardDescription>กำหนดอัตราค่าธรรมเนียมการโอนเงินเข้าบัญชีธนาคารตามพื้นที่</CardDescription>
          </div>
          <Button variant="outline" size="icon" onClick={() => setIsEditing(!isEditing)}>
            <Edit className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Form {...bankFeesForm}>
              <form onSubmit={bankFeesForm.handleSubmit(handleBankFeesSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={bankFeesForm.control}
                    name="bangkokFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ค่าธรรมเนียมบัญชีในกรุงเทพฯ</FormLabel>
                        <div className="flex items-center space-x-2">
                          <FormControl>
                            <Input type="number" step="0.01" min="0" {...field} />
                          </FormControl>
                          <span>บาท</span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={bankFeesForm.control}
                    name="provincialFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ค่าธรรมเนียมบัญชีต่างจังหวัด</FormLabel>
                        <div className="flex items-center space-x-2">
                          <FormControl>
                            <Input type="number" step="0.01" min="0" {...field} />
                          </FormControl>
                          <span>บาท</span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    บันทึก
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">ค่าธรรมเนียมบัญชีในกรุงเทพฯ</h3>
                <p className="text-xl font-semibold">{settings.bangkokFee} บาท</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">ค่าธรรมเนียมบัญชีต่างจังหวัด</h3>
                <p className="text-xl font-semibold">{settings.provincialFee} บาท</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
