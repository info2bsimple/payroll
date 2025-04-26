"use client"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { format, parse } from "date-fns"
import { th } from "date-fns/locale"

// Prefix options
const prefixes = [
  { label: "นาย", value: "นาย" },
  { label: "นาง", value: "นาง" },
  { label: "นางสาว", value: "นางสาว" },
  { label: "ดร.", value: "ดร." },
]

// Mock data for employee types
const employeeTypes = [
  { label: "พนักงานประจำ - รายเดือน", value: "พนักงานประจำ - รายเดือน" },
  { label: "พนักงานประจำ - รายวัน", value: "พนักงานประจำ - รายวัน" },
  { label: "พนักงานชั่วคราว", value: "พนักงานชั่วคราว" },
  { label: "พนักงานทดลองงาน", value: "พนักงานทดลองงาน" },
]

// Mock data for companies
const companies = [
  { label: "บริษัท ภูมิพัฒนา จำกัด", value: "บริษัท ภูมิพัฒนา จำกัด" },
  { label: "บริษัท เทคโนโลยีสารสนเทศ จำกัด", value: "บริษัท เทคโนโลยีสารสนเทศ จำกัด" },
]

// Mock data for departments
const departments = [
  { label: "ซอฟแวร์ เดเวลอป", value: "ซอฟแวร์ เดเวลอป" },
  { label: "บัญชี", value: "บัญชี" },
  { label: "การตลาด", value: "การตลาด" },
  { label: "ทรัพยากรบุคคล", value: "ทรัพยากรบุคคล" },
]

// Mock data for positions
const positions = [
  { label: "นักพัฒนาโปรแกรมด้านบุคคล", value: "นักพัฒนาโปรแกรมด้านบุคคล" },
  { label: "ผู้ตรวจสอบภายใน", value: "ผู้ตรวจสอบภายใน" },
  { label: "Back-End Developer", value: "Back-End Developer" },
  { label: "ผู้อำนวยการฝ่ายบัญชี", value: "ผู้อำนวยการฝ่ายบัญชี" },
]

// Form schema
const formSchema = z.object({
  // Employee Information
  prefix: z.string().min(1, "กรุณาเลือกคำนำหน้า"),
  firstName: z.string().min(1, "กรุณากรอกชื่อ"),
  lastName: z.string().min(1, "กรุณากรอกนามสกุล"),
  idCardNumber: z
    .string()
    .length(13, "เลขบัตรประจำตัวประชาชนต้องมี 13 หลัก")
    .regex(/^\d+$/, "เลขบัตรประจำตัวประชาชนต้องเป็นตัวเลขเท่านั้น"),
  employeeCode: z.string().optional(), // New field - optional
  providentFundId: z.string().optional(), // New field - optional
  employeeType: z.string().min(1, "กรุณาเลือกประเภทพนักงาน"),
  company: z.string().min(1, "กรุณาเลือกสังกัดบริษัท"),
  startDate: z.date({
    required_error: "กรุณาเลือกวันที่เริ่มงาน",
  }),
  department: z.string().min(1, "กรุณาเลือกแผนก"),
  position: z.string().min(1, "กรุณาเลือกตำแหน่ง"),
})

type FormValues = z.infer<typeof formSchema>

interface Employee {
  id: string
  prefix: string
  firstName: string
  lastName: string
  idCardNumber: string
  employeeCode?: string // New field
  providentFundId?: string // New field
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
}

interface EditEmployeeFormProps {
  employee: Employee
  onSave: (data: Partial<Employee>) => void
  onCancel: () => void
  existingEmployees: Employee[]
}

export function EditEmployeeForm({ employee, onSave, onCancel, existingEmployees }: EditEmployeeFormProps) {
  const { toast } = useToast()

  // Parse the date string to a Date object
  const parsedDate = employee.startDate
    ? parse(employee.startDate, "d MMM yyyy", new Date(), { locale: th })
    : new Date()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prefix: employee.prefix,
      firstName: employee.firstName,
      lastName: employee.lastName,
      idCardNumber: employee.idCardNumber,
      employeeCode: employee.employeeCode || "", // New field
      providentFundId: employee.providentFundId || "", // New field
      employeeType: employee.employeeType,
      company: employee.company,
      startDate: parsedDate,
      department: employee.department,
      position: employee.position,
    },
  })

  const handleSubmit = (data: FormValues) => {
    // Check if ID card number already exists (only if changed)
    if (
      data.idCardNumber !== employee.idCardNumber &&
      existingEmployees.some((emp) => emp.idCardNumber === data.idCardNumber)
    ) {
      form.setError("idCardNumber", {
        type: "manual",
        message: "เลขบัตรประจำตัวประชาชนนี้มีอยู่ในระบบแล้ว",
      })
      return
    }

    // Check if name already exists (only if changed)
    const fullName = `${data.firstName} ${data.lastName}`.toLowerCase()
    const currentFullName = `${employee.firstName} ${employee.lastName}`.toLowerCase()

    if (
      fullName !== currentFullName &&
      existingEmployees.find((emp) => `${emp.firstName} ${emp.lastName}`.toLowerCase() === fullName)
    ) {
      toast({
        title: "พบข้อมูลซ้ำในระบบ",
        description: "มีข้อมูลในฐานข้อมูลพนักงานแล้ว",
        variant: "destructive",
      })
      return
    }

    // Format date to string
    const formattedDate = format(data.startDate, "d MMM yyyy", { locale: th })

    const updatedEmployee = {
      ...data,
      startDate: formattedDate,
    }

    onSave(updatedEmployee)

    toast({
      title: "แก้ไขข้อมูลพนักงานสำเร็จ",
      description: `ข้อมูลของ ${data.prefix}${data.firstName} ${data.lastName} ได้รับการอัปเดตเรียบร้อยแล้ว`,
    })
  }

  return (
    <Sheet open={true} onOpenChange={onCancel}>
      <SheetContent className="sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>แก้ไขข้อมูลพนักงาน</SheetTitle>
          <SheetDescription>แก้ไขข้อมูลพนักงานให้เป็นปัจจุบัน</SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-6">
            <div>
              <h3 className="text-lg font-medium">ข้อมูลพนักงาน</h3>
              <Separator className="my-2" />
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="prefix"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>คำนำหน้า</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                              >
                                {field.value ? prefixes.find((p) => p.value === field.value)?.label : "เลือกคำนำหน้า"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="ค้นหาคำนำหน้า..." />
                              <CommandList>
                                <CommandEmpty>ไม่พบคำนำหน้า</CommandEmpty>
                                <CommandGroup>
                                  {prefixes.map((prefix) => (
                                    <CommandItem
                                      value={prefix.label}
                                      key={prefix.value}
                                      onSelect={() => {
                                        form.setValue("prefix", prefix.value)
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          prefix.value === field.value ? "opacity-100" : "opacity-0",
                                        )}
                                      />
                                      {prefix.label}
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
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ชื่อ</FormLabel>
                        <FormControl>
                          <Input placeholder="กรอกชื่อ" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>นามสกุล</FormLabel>
                        <FormControl>
                          <Input placeholder="กรอกนามสกุล" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="idCardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>เลขบัตรประจำตัวประชาชน</FormLabel>
                      <FormControl>
                        <Input placeholder="กรอกเลขบัตรประจำตัวประชาชน 13 หลัก" maxLength={13} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* New fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="employeeCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>รหัสพนักงาน</FormLabel>
                        <FormControl>
                          <Input placeholder="กรอกรหัสพนักงาน (ถ้ามี)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="providentFundId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>รหัสสมาชิกกองทุนสำรองเลี้ยงชีพ</FormLabel>
                        <FormControl>
                          <Input placeholder="กรอกรหัสสมาชิกกองทุนฯ (ถ้ามี)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="employeeType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ประเภทพนักงาน</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                              >
                                {field.value
                                  ? employeeTypes.find((t) => t.value === field.value)?.label
                                  : "เลือกประเภทพนักงาน"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="ค้นหาประเภทพนักงาน..." />
                              <CommandList>
                                <CommandEmpty>ไม่พบประเภทพนักงาน</CommandEmpty>
                                <CommandGroup>
                                  {employeeTypes.map((type) => (
                                    <CommandItem
                                      value={type.label}
                                      key={type.value}
                                      onSelect={() => {
                                        form.setValue("employeeType", type.value)
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          type.value === field.value ? "opacity-100" : "opacity-0",
                                        )}
                                      />
                                      {type.label}
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
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>สังกัดบริษัท</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                              >
                                {field.value ? companies.find((c) => c.value === field.value)?.label : "เลือกสังกัดบริษัท"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="ค้นหาบริษัท..." />
                              <CommandList>
                                <CommandEmpty>ไม่พบบริษัท</CommandEmpty>
                                <CommandGroup>
                                  {companies.map((company) => (
                                    <CommandItem
                                      value={company.label}
                                      key={company.value}
                                      onSelect={() => {
                                        form.setValue("company", company.value)
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          company.value === field.value ? "opacity-100" : "opacity-0",
                                        )}
                                      />
                                      {company.label}
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

                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>วันที่เริ่มงาน</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "d MMMM yyyy", { locale: th }) : <span>เลือกวันที่</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>แผนก</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                              >
                                {field.value ? departments.find((d) => d.value === field.value)?.label : "เลือกแผนก"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="ค้นหาแผนก..." />
                              <CommandList>
                                <CommandEmpty>ไม่พบแผนก</CommandEmpty>
                                <CommandGroup>
                                  {departments.map((dept) => (
                                    <CommandItem
                                      value={dept.label}
                                      key={dept.value}
                                      onSelect={() => {
                                        form.setValue("department", dept.value)
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          dept.value === field.value ? "opacity-100" : "opacity-0",
                                        )}
                                      />
                                      {dept.label}
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
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ตำแหน่ง</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                              >
                                {field.value ? positions.find((p) => p.value === field.value)?.label : "เลือกตำแหน่ง"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="ค้นหาตำแหน่ง..." />
                              <CommandList>
                                <CommandEmpty>ไม่พบตำแหน่ง</CommandEmpty>
                                <CommandGroup>
                                  {positions.map((pos) => (
                                    <CommandItem
                                      value={pos.label}
                                      key={pos.value}
                                      onSelect={() => {
                                        form.setValue("position", pos.value)
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          pos.value === field.value ? "opacity-100" : "opacity-0",
                                        )}
                                      />
                                      {pos.label}
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
              </div>
            </div>

            <SheetFooter className="flex flex-row gap-2 sm:justify-between">
              <Button type="button" variant="outline" onClick={onCancel}>
                ยกเลิก
              </Button>
              <Button type="submit">บันทึกข้อมูล</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
