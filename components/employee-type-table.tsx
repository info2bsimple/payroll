"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Pencil, Trash2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

// Define employee type interface
interface EmployeeType {
  id: string
  name: string
  workDaysPerMonth: number
  workHoursPerDay: number
  workHoursPerMonth: number
  status: "active" | "inactive"
  inUse: boolean // Flag to indicate if this type is being used by employees
}

// Form schema
const formSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อประเภทพนักงาน"),
  workDaysPerMonth: z.coerce.number().min(1, "จำนวนวันทำงานต้องมากกว่า 0").max(31, "จำนวนวันทำงานต้องไม่เกิน 31 วัน"),
  workHoursPerDay: z.coerce.number().min(1, "จำนวนชั่วโมงทำงานต้องมากกว่า 0").max(24, "จำนวนชั่วโมงทำงานต้องไม่เกิน 24 ชั่วโมง"),
})

type FormValues = z.infer<typeof formSchema>

// Mock data for employee types
const mockEmployeeTypes: Record<string, EmployeeType[]> = {
  "1": [
    {
      id: "1",
      name: "พนักงานเงินเดือน",
      workDaysPerMonth: 22,
      workHoursPerDay: 8,
      workHoursPerMonth: 176,
      status: "active",
      inUse: true,
    },
    {
      id: "2",
      name: "พนักงานรายกะ",
      workDaysPerMonth: 26,
      workHoursPerDay: 8,
      workHoursPerMonth: 208,
      status: "active",
      inUse: false,
    },
    {
      id: "3",
      name: "ลูกจ้างชั่วคราว",
      workDaysPerMonth: 20,
      workHoursPerDay: 6,
      workHoursPerMonth: 120,
      status: "active",
      inUse: true,
    },
  ],
  "2": [
    {
      id: "1",
      name: "พนักงานประจำ",
      workDaysPerMonth: 22,
      workHoursPerDay: 8,
      workHoursPerMonth: 176,
      status: "active",
      inUse: true,
    },
    {
      id: "2",
      name: "พนักงานทดลองงาน",
      workDaysPerMonth: 22,
      workHoursPerDay: 8,
      workHoursPerMonth: 176,
      status: "active",
      inUse: false,
    },
  ],
}

interface EmployeeTypeTableProps {
  companyId: string
}

export function EmployeeTypeTable({ companyId }: EmployeeTypeTableProps) {
  const { toast } = useToast()
  const [employeeTypes, setEmployeeTypes] = useState<EmployeeType[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [currentType, setCurrentType] = useState<EmployeeType | null>(null)

  // Initialize form for adding new employee type
  const addForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      workDaysPerMonth: 22,
      workHoursPerDay: 8,
    },
  })

  // Initialize form for editing employee type
  const editForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      workDaysPerMonth: 22,
      workHoursPerDay: 8,
    },
  })

  useEffect(() => {
    // In a real app, fetch from API
    setEmployeeTypes(mockEmployeeTypes[companyId] || [])
  }, [companyId])

  const validateName = (name: string, currentId?: string): boolean => {
    const isDuplicate = employeeTypes.some(
      (type) => type.name.toLowerCase() === name.toLowerCase() && type.id !== currentId,
    )

    if (isDuplicate) {
      return false
    }

    return true
  }

  const handleAddType = (data: FormValues) => {
    if (!validateName(data.name)) {
      addForm.setError("name", {
        type: "manual",
        message: "ชื่อประเภทพนักงานซ้ำกับที่มีอยู่แล้ว",
      })
      return
    }

    const workHoursPerMonth = data.workDaysPerMonth * data.workHoursPerDay

    const newType: EmployeeType = {
      id: Math.random().toString(36).substring(2, 9),
      name: data.name,
      workDaysPerMonth: data.workDaysPerMonth,
      workHoursPerDay: data.workHoursPerDay,
      workHoursPerMonth: workHoursPerMonth,
      status: "active",
      inUse: false,
    }

    setEmployeeTypes([...employeeTypes, newType])
    addForm.reset({
      name: "",
      workDaysPerMonth: 22,
      workHoursPerDay: 8,
    })
    setIsAddDialogOpen(false)

    toast({
      title: "เพิ่มประเภทพนักงานสำเร็จ",
      description: `ประเภทพนักงาน "${newType.name}" ได้ถูกเพิ่มเข้าสู่ระบบเรียบร้อยแล้ว`,
    })
  }

  const handleEditType = (data: FormValues) => {
    if (!currentType) return

    if (!validateName(data.name, currentType.id)) {
      editForm.setError("name", {
        type: "manual",
        message: "ชื่อประเภทพนักงานซ้ำกับที่มีอยู่แล้ว",
      })
      return
    }

    const workHoursPerMonth = data.workDaysPerMonth * data.workHoursPerDay

    setEmployeeTypes(
      employeeTypes.map((type) => {
        if (type.id === currentType.id) {
          return {
            ...type,
            name: data.name,
            workDaysPerMonth: data.workDaysPerMonth,
            workHoursPerDay: data.workHoursPerDay,
            workHoursPerMonth: workHoursPerMonth,
          }
        }
        return type
      }),
    )

    setIsEditDialogOpen(false)
    setCurrentType(null)

    toast({
      title: "แก้ไขประเภทพนักงานสำเร็จ",
      description: `ประเภทพนักงานได้ถูกแก้ไขเป็น "${data.name}" เรียบร้อยแล้ว`,
    })
  }

  const handleDeleteType = () => {
    if (!currentType) return

    if (currentType.inUse) {
      toast({
        title: "ไม่สามารถลบได้",
        description: "ไม่สามารถลบประเภทพนักงานที่มีการใช้งานอยู่",
        variant: "destructive",
      })
      setIsDeleteDialogOpen(false)
      setCurrentType(null)
      return
    }

    setEmployeeTypes(employeeTypes.filter((type) => type.id !== currentType.id))
    setIsDeleteDialogOpen(false)
    setCurrentType(null)

    toast({
      title: "ลบประเภทพนักงานสำเร็จ",
      description: `ประเภทพนักงาน "${currentType.name}" ได้ถูกลบออกจากระบบเรียบร้อยแล้ว`,
    })
  }

  const handleStatusChange = () => {
    if (!currentType) return

    setEmployeeTypes(
      employeeTypes.map((type) => {
        if (type.id === currentType.id) {
          return {
            ...type,
            status: type.status === "active" ? "inactive" : "active",
          }
        }
        return type
      }),
    )

    setIsStatusDialogOpen(false)
    setCurrentType(null)

    toast({
      title: "เปลี่ยนสถานะสำเร็จ",
      description: `สถานะของประเภทพนักงาน "${currentType.name}" ได้ถูกเปลี่ยนเรียบร้อยแล้ว`,
    })
  }

  const openEditDialog = (type: EmployeeType) => {
    setCurrentType(type)
    editForm.reset({
      name: type.name,
      workDaysPerMonth: type.workDaysPerMonth,
      workHoursPerDay: type.workHoursPerDay,
    })
    setIsEditDialogOpen(true)
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => {
            addForm.reset({
              name: "",
              workDaysPerMonth: 22,
              workHoursPerDay: 8,
            })
            setIsAddDialogOpen(true)
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          เพิ่มประเภทพนักงาน
        </Button>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">ลำดับ</TableHead>
              <TableHead>ชื่อประเภทพนักงาน</TableHead>
              <TableHead className="text-center hidden sm:table-cell">วันทำงาน/เดือน</TableHead>
              <TableHead className="text-center hidden sm:table-cell">ชั่วโมง/วัน</TableHead>
              <TableHead className="text-center hidden md:table-cell">ชั่วโมง/เดือน</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead className="text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employeeTypes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  ไม่พบข้อมูลประเภทพนักงาน
                </TableCell>
              </TableRow>
            ) : (
              employeeTypes.map((type, index) => (
                <TableRow key={type.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    {type.name}
                    <div className="sm:hidden text-xs text-muted-foreground mt-1">
                      วันทำงาน: {type.workDaysPerMonth} วัน, ชั่วโมง/วัน: {type.workHoursPerDay} ชม.
                    </div>
                  </TableCell>
                  <TableCell className="text-center hidden sm:table-cell">{type.workDaysPerMonth}</TableCell>
                  <TableCell className="text-center hidden sm:table-cell">{type.workHoursPerDay}</TableCell>
                  <TableCell className="text-center hidden md:table-cell">{type.workHoursPerMonth}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        type.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {type.status === "active" ? "ใช้งาน" : "ไม่ใช้งาน"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => openEditDialog(type)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setCurrentType(type)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setCurrentType(type)
                          setIsStatusDialogOpen(true)
                        }}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Employee Type Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>เพิ่มประเภทพนักงาน</DialogTitle>
            <DialogDescription>กรอกข้อมูลประเภทพนักงานที่ต้องการเพิ่ม</DialogDescription>
          </DialogHeader>
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(handleAddType)} className="space-y-4 py-2">
              <FormField
                control={addForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ชื่อประเภทพนักงาน</FormLabel>
                    <FormControl>
                      <Input placeholder="พนักงานเงินเดือน" {...field} maxLength={100} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="workDaysPerMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>จำนวนวันทำงานต่อเดือน</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="31" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="workHoursPerDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>จำนวนชั่วโมงทำงานต่อวัน</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="24" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-sm text-muted-foreground mt-2">
                จำนวนชั่วโมงทำงานต่อเดือน: {addForm.watch("workDaysPerMonth") * addForm.watch("workHoursPerDay")} ชั่วโมง
              </div>
              <DialogFooter className="mt-6">
                <Button variant="outline" type="button" onClick={() => setIsAddDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button type="submit">บันทึก</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Employee Type Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>แก้ไขประเภทพนักงาน</DialogTitle>
            <DialogDescription>แก้ไขข้อมูลประเภทพนักงาน</DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditType)} className="space-y-4 py-2">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ชื่อประเภทพนักงาน</FormLabel>
                    <FormControl>
                      <Input placeholder="พนักงานเงินเดือน" {...field} maxLength={100} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="workDaysPerMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>จำนวนวันทำงานต่อเดือน</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="31" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="workHoursPerDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>จำนวนชั่วโมงทำงานต่อวัน</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="24" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-sm text-muted-foreground mt-2">
                จำนวนชั่วโมงทำงานต่อเดือน: {editForm.watch("workDaysPerMonth") * editForm.watch("workHoursPerDay")} ชั่วโมง
              </div>
              <DialogFooter className="mt-6">
                <Button variant="outline" type="button" onClick={() => setIsEditDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button type="submit">บันทึก</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบข้อมูล</AlertDialogTitle>
            <AlertDialogDescription>
              คุณต้องการลบประเภทพนักงาน {currentType?.name} ใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteType}>ยืนยัน</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Status Change Confirmation */}
      <AlertDialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการเปลี่ยนสถานะ</AlertDialogTitle>
            <AlertDialogDescription>
              คุณต้องการเปลี่ยนสถานะประเภทพนักงาน {currentType?.name} เป็น
              {currentType?.status === "active" ? " ไม่ใช้งาน" : " ใช้งาน"} ใช่หรือไม่?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusChange}>ยืนยัน</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
