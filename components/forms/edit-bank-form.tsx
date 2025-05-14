"use client"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"

// Bank options
const banks = [
  { label: "ธนาคารกรุงเทพ", value: "ธนาคารกรุงเทพ" },
  { label: "ธนาคารกสิกรไทย", value: "ธนาคารกสิกรไทย" },
  { label: "ธนาคารกรุงไทย", value: "ธนาคารกรุงไทย" },
  { label: "ธนาคารไทยพาณิชย์", value: "ธนาคารไทยพาณิชย์" },
  { label: "ธนาคารกรุงศรีอยุธยา", value: "ธนาคารกรุงศรีอยุธยา" },
  { label: "ธนาคารทหารไทยธนชาต", value: "ธนาคารทหารไทยธนชาต" },
  { label: "ธนาคารออมสิน", value: "ธนาคารออมสิน" },
  { label: "ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร", value: "ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร" },
]

// Bank location options
const bankLocations = [
  { label: "กรุงเทพฯ", value: "กรุงเทพฯ" },
  { label: "ต่างจังหวัด", value: "ต่างจังหวัด" },
]

// Form schema
const formSchema = z.object({
  bank: z.string().min(1, "กรุณาเลือกธนาคาร"),
  accountName: z.string().min(1, "กรุณากรอกชื่อบัญชี"),
  accountNumber: z.string().min(1, "กรุณากรอกเลขที่บัญชี").regex(/^\d+$/, "เลขที่บัญชีต้องเป็นตัวเลขเท่านั้น"),
  branch: z.string().min(1, "กรุณากรอกสาขา"),
  bankLocation: z.string().min(1, "กรุณาเลือกพื้นที่"),
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
  bankLocation?: string
  salary?: number
  status: "active" | "inactive"
}

interface EditBankFormProps {
  employee: Employee
  onSave: (data: Partial<Employee>) => void
  onCancel: () => void
}

export function EditBankForm({ employee, onSave, onCancel }: EditBankFormProps) {
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bank: employee.bank,
      accountName: employee.accountName,
      accountNumber: employee.accountNumber,
      branch: employee.branch,
      bankLocation: employee.bankLocation || "กรุงเทพฯ",
    },
  })

  const handleSubmit = (data: FormValues) => {
    onSave(data)

    toast({
      title: "แก้ไขข้อมูลบัญชีธนาคารสำเร็จ",
      description: `ข้อมูลบัญชีธนาคารได้รับการอัปเดตเรียบร้อยแล้ว`,
    })
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">แก้ไขข้อมูลบัญชีธนาคาร</h3>
          <Button variant="outline" size="sm" onClick={onCancel}>
            ยกเลิก
          </Button>
        </div>
        <Separator className="mb-4" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="bank"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ธนาคาร</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? banks.find((bank) => bank.value === field.value)?.label : "เลือกธนาคาร"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="ค้นหาธนาคาร..." />
                          <CommandList>
                            <CommandEmpty>ไม่พบธนาคาร</CommandEmpty>
                            <CommandGroup>
                              {banks.map((bank) => (
                                <CommandItem
                                  value={bank.label}
                                  key={bank.value}
                                  onSelect={() => {
                                    form.setValue("bank", bank.value)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      bank.value === field.value ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  {bank.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ชื่อบัญชี</FormLabel>
                    <FormControl>
                      <Input placeholder="กรอกชื่อบัญชี" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>เลขที่บัญชี</FormLabel>
                    <FormControl>
                      <Input placeholder="กรอกเลขที่บัญชี" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="branch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>สาขา</FormLabel>
                    <FormControl>
                      <Input placeholder="กรอกสาขา" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bankLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>พื้นที่</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? bankLocations.find((loc) => loc.value === field.value)?.label : "เลือกพื้นที่"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="ค้นหาพื้นที่..." />
                          <CommandList>
                            <CommandEmpty>ไม่พบพื้นที่</CommandEmpty>
                            <CommandGroup>
                              {bankLocations.map((location) => (
                                <CommandItem
                                  value={location.label}
                                  key={location.value}
                                  onSelect={() => {
                                    form.setValue("bankLocation", location.value)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      location.value === field.value ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  {location.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
