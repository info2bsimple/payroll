"use client"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

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

// Account types
const accountTypes = [
  { label: "ออมทรัพย์", value: "ออมทรัพย์" },
  { label: "กระแสรายวัน", value: "กระแสรายวัน" },
  { label: "ฝากประจำ", value: "ฝากประจำ" },
]

// Provinces
const provinces = [
  { label: "กรุงเทพมหานคร", value: "กรุงเทพมหานคร" },
  { label: "นนทบุรี", value: "นนทบุรี" },
  { label: "ปทุมธานี", value: "ปทุมธานี" },
  { label: "สมุทรปราการ", value: "สมุทรปราการ" },
  { label: "เชียงใหม่", value: "เชียงใหม่" },
  { label: "ชลบุรี", value: "ชลบุรี" },
  { label: "ภูเก็ต", value: "ภูเก็ต" },
  { label: "ขอนแก่น", value: "ขอนแก่น" },
  { label: "สงขลา", value: "สงขลา" },
]

// Districts by province
const districtsByProvince: Record<string, { label: string; value: string }[]> = {
  กรุงเทพมหานคร: [
    { label: "บางรัก", value: "บางรัก" },
    { label: "ปทุมวัน", value: "ปทุมวัน" },
    { label: "สาทร", value: "สาทร" },
    { label: "พญาไท", value: "พญาไท" },
    { label: "บางนา", value: "บางนา" },
    { label: "จตุจักร", value: "จตุจักร" },
  ],
  นนทบุรี: [
    { label: "เมืองนนทบุรี", value: "เมืองนนทบุรี" },
    { label: "บางกรวย", value: "บางกรวย" },
    { label: "บางใหญ่", value: "บางใหญ่" },
    { label: "ปากเกร็ด", value: "ปากเกร็ด" },
  ],
  ปทุมธานี: [
    { label: "เมืองปทุมธานี", value: "เมืองปทุมธานี" },
    { label: "คลองหลวง", value: "คลองหลวง" },
    { label: "ธัญบุรี", value: "ธัญบุรี" },
    { label: "ลำลูกกา", value: "ลำลูกกา" },
  ],
}

// Subdistricts by district
const subdistrictsByDistrict: Record<string, { label: string; value: string }[]> = {
  บางรัก: [
    { label: "สีลม", value: "สีลม" },
    { label: "บางรัก", value: "บางรัก" },
    { label: "สี่พระยา", value: "สี่พระยา" },
  ],
  ปทุมวัน: [
    { label: "รองเมือง", value: "รองเมือง" },
    { label: "ปทุมวัน", value: "ปทุมวัน" },
    { label: "ลุมพินี", value: "ลุมพินี" },
  ],
  เมืองนนทบุรี: [
    { label: "บางกระสอ", value: "บางกระสอ" },
    { label: "ตลาดขวัญ", value: "ตลาดขวัญ" },
    { label: "สวนใหญ่", value: "สวนใหญ่" },
  ],
  ปากเกร็ด: [
    { label: "ปากเกร็ด", value: "ปากเกร็ด" },
    { label: "บางพูด", value: "บางพูด" },
    { label: "บางตลาด", value: "บางตลาด" },
  ],
}

// Form schema
const formSchema = z.object({
  // Company Information
  name: z
    .string()
    .min(1, "กรุณากรอกชื่อบริษัท")
    .refine((val) => /^บริษัท\s.+\sจำกัด$/.test(val), {
      message: "ชื่อบริษัทต้องอยู่ในรูปแบบ 'บริษัท [ชื่อ] จำกัด'",
    }),
  registrationNumber: z
    .string()
    .length(13, "เลขทะเบียนนิติบุคคลต้องมี 13 หลัก")
    .regex(/^\d+$/, "เลขทะเบียนนิติบุคคลต้องเป็นตัวเลขเท่านั้น"),
  bank: z.string().min(1, "กรุณาเลือกธนาคาร"),
  accountNumber: z.string().min(1, "กรุณากรอกเลขที่บัญชี").regex(/^\d+$/, "เลขที่บัญชีต้องเป็นตัวเลขเท่านั้น"),
  branch: z.string().min(1, "กรุณากรอกสาขาธนาคาร"),
  accountType: z.string().min(1, "กรุณาเลือกประเภทบัญชี"),

  // Company Address
  address: z.string().min(1, "กรุณากรอกที่อยู่"),
  province: z.string().min(1, "กรุณาเลือกจังหวัด"),
  district: z.string().min(1, "กรุณาเลือกอำเภอ/เขต"),
  subdistrict: z.string().min(1, "กรุณาเลือกตำบล/แขวง"),
  postalCode: z.string().length(5, "รหัสไปรษณีย์ต้องมี 5 หลัก").regex(/^\d+$/, "รหัสไปรษณีย์ต้องเป็นตัวเลขเท่านั้น"),

  // Employer Information
  socialSecurityNumber: z
    .string()
    .length(10, "เลขทะเบียนนายจ้างประกันสังคมต้องมี 10 หลัก")
    .regex(/^\d+$/, "เลขทะเบียนนายจ้างประกันสังคมต้องเป็นตัวเลขเท่านั้น"),
  branchNumber: z.string().min(1, "กรุณากรอกลำดับที่สาขา"),
  socialSecurityRate: z.coerce
    .number()
    .min(0, "อัตราเงินหักประกันสังคมต้องไม่ต่ำกว่า 0%")
    .max(100, "อัตราเงินหักประกันสังคมต้องไม่เกิน 100%"),
})

type FormValues = z.infer<typeof formSchema>

interface Company extends FormValues {
  id: string
  status: "active" | "inactive"
}

interface AddCompanyFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: FormValues) => void
  existingCompanies: Company[]
  defaultValues?: FormValues
  isEditing?: boolean
}

export function AddCompanyForm({
  open,
  onOpenChange,
  onSubmit,
  existingCompanies,
  defaultValues,
  isEditing = false,
}: AddCompanyFormProps) {
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      name: "",
      registrationNumber: "",
      bank: "",
      accountNumber: "",
      branch: "",
      accountType: "",
      address: "",
      province: "",
      district: "",
      subdistrict: "",
      postalCode: "",
      socialSecurityNumber: "",
      branchNumber: "",
      socialSecurityRate: 5,
    },
  })

  const watchProvince = form.watch("province")
  const watchDistrict = form.watch("district")

  // Reset dependent fields when province changes
  const handleProvinceChange = (value: string) => {
    form.setValue("province", value)
    form.setValue("district", "")
    form.setValue("subdistrict", "")
    form.setValue("postalCode", "")
  }

  // Reset dependent fields when district changes
  const handleDistrictChange = (value: string) => {
    form.setValue("district", value)
    form.setValue("subdistrict", "")
  }

  const handleSubmit = (data: FormValues) => {
    // Check if registration number already exists (only for new companies)
    if (!isEditing && existingCompanies.some((c) => c.registrationNumber === data.registrationNumber)) {
      form.setError("registrationNumber", {
        type: "manual",
        message: "เลขทะเบียนนิติบุคคลนี้มีอยู่ในระบบแล้ว",
      })
      return
    }

    onSubmit(data)

    toast({
      title: `${isEditing ? "แก้ไข" : "เพิ่ม"}ข้อมูลบริษัทสำเร็จ`,
      description: `${data.name} ได้ถูก${isEditing ? "แก้ไข" : "เพิ่ม"}เข้าสู่ระบบเรียบร้อยแล้ว`,
    })

    // Reset form
    form.reset()
  }

  const handleClose = () => {
    form.reset()
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="sm:max-w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditing ? "แก้ไขข้อมูลบริษัท" : "เพิ่มข้อมูลบริษัท"}</SheetTitle>
          <SheetDescription>กรอกข้อมูลบริษัทและข้อมูลนายจ้าง</SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-6">
            {/* Company Information Section */}
            <div>
              <h3 className="text-lg font-medium">ข้อมูลบริษัท</h3>
              <Separator className="my-2" />
              <div className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ชื่อบริษัท</FormLabel>
                      <FormControl>
                        <Input placeholder="บริษัท ทดสอบ จำกัด" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="registrationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>เลขทะเบียนนิติบุคคล</FormLabel>
                      <FormControl>
                        <Input placeholder="0123456789012" maxLength={13} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                  name="accountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>เลขที่บัญชีธนาคาร</FormLabel>
                      <FormControl>
                        <Input placeholder="1234567890" {...field} />
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
                      <FormLabel>สาขาธนาคาร</FormLabel>
                      <FormControl>
                        <Input placeholder="สาขาสีลม" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accountType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ประเภทบัญชี</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                            >
                              {field.value
                                ? accountTypes.find((type) => type.value === field.value)?.label
                                : "เลือกประเภทบัญชี"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="ค้นหาประเภทบัญชี..." />
                            <CommandList>
                              <CommandEmpty>ไม่พบประเภทบัญชี</CommandEmpty>
                              <CommandGroup>
                                {accountTypes.map((type) => (
                                  <CommandItem
                                    value={type.label}
                                    key={type.value}
                                    onSelect={() => {
                                      form.setValue("accountType", type.value)
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
              </div>
            </div>

            {/* Company Address Section */}
            <div>
              <h3 className="text-lg font-medium">ที่อยู่บริษัท</h3>
              <Separator className="my-2" />
              <div className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ที่อยู่</FormLabel>
                      <FormControl>
                        <Textarea placeholder="กรอกที่อยู่ เลขที่ ถนน ซอย" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>จังหวัด</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                            >
                              {field.value ? provinces.find((p) => p.value === field.value)?.label : "เลือกจังหวัด"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="ค้นหาจังหวัด..." />
                            <CommandList>
                              <CommandEmpty>ไม่พบจังหวัด</CommandEmpty>
                              <CommandGroup>
                                {provinces.map((province) => (
                                  <CommandItem
                                    value={province.label}
                                    key={province.value}
                                    onSelect={() => handleProvinceChange(province.value)}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        province.value === field.value ? "opacity-100" : "opacity-0",
                                      )}
                                    />
                                    {province.label}
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
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>อำเภอ/เขต</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              disabled={!watchProvince}
                              className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                            >
                              {field.value && watchProvince
                                ? districtsByProvince[watchProvince]?.find((d) => d.value === field.value)?.label ||
                                  "เลือกอำเภอ/เขต"
                                : "เลือกอำเภอ/เขต"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="ค้นหาอำเภอ/เขต..." />
                            <CommandList>
                              <CommandEmpty>ไม่พบอำเภอ/เขต</CommandEmpty>
                              <CommandGroup>
                                {watchProvince &&
                                  districtsByProvince[watchProvince]?.map((district) => (
                                    <CommandItem
                                      value={district.label}
                                      key={district.value}
                                      onSelect={() => handleDistrictChange(district.value)}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          district.value === field.value ? "opacity-100" : "opacity-0",
                                        )}
                                      />
                                      {district.label}
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
                  name="subdistrict"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ตำบล/แขวง</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              disabled={!watchDistrict}
                              className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                            >
                              {field.value && watchDistrict
                                ? subdistrictsByDistrict[watchDistrict]?.find((s) => s.value === field.value)?.label ||
                                  "เลือกตำบล/แขวง"
                                : "เลือกตำบล/แขวง"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="ค้นหาตำบล/แขวง..." />
                            <CommandList>
                              <CommandEmpty>ไม่พบตำบล/แขวง</CommandEmpty>
                              <CommandGroup>
                                {watchDistrict &&
                                  subdistrictsByDistrict[watchDistrict]?.map((subdistrict) => (
                                    <CommandItem
                                      value={subdistrict.label}
                                      key={subdistrict.value}
                                      onSelect={() => {
                                        form.setValue("subdistrict", subdistrict.value)
                                        // Set postal code based on subdistrict (mock data)
                                        form.setValue("postalCode", "10500")
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          subdistrict.value === field.value ? "opacity-100" : "opacity-0",
                                        )}
                                      />
                                      {subdistrict.label}
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
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>รหัสไปรษณีย์</FormLabel>
                      <FormControl>
                        <Input placeholder="10500" maxLength={5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Employer Information Section */}
            <div>
              <h3 className="text-lg font-medium">ข้อมูลนายจ้าง</h3>
              <Separator className="my-2" />
              <div className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="socialSecurityNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>เลขทะเบียนนายจ้างประกันสังคม</FormLabel>
                      <FormControl>
                        <Input placeholder="1234567890" maxLength={10} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="branchNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ลำดับที่สาขา</FormLabel>
                      <FormControl>
                        <Input placeholder="00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="socialSecurityRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>อัตราเงินหักประกันสังคม (%)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="100" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <SheetFooter className="flex flex-row gap-2 sm:justify-between">
              <Button type="button" variant="outline" onClick={handleClose}>
                ยกเลิก
              </Button>
              <Button type="submit">{isEditing ? "บันทึกการแก้ไข" : "บันทึกข้อมูล"}</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
