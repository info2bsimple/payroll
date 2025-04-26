"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Pencil, Trash2, XCircle, MoveUp, MoveDown } from "lucide-react"
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

// Define non-monetary benefit interface
interface NonMonetaryBenefit {
  id: string
  name: string
  amount: string
  unit: string
  status: "active" | "inactive"
}

// Form schema
const formSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อรายการสิทธิประโยชน์"),
  amount: z.string().min(1, "กรุณากรอกจำนวน"),
  unit: z.string().min(1, "กรุณากรอกหน่วย"),
})

type FormValues = z.infer<typeof formSchema>

// Mock data for non-monetary benefits
const mockNonMonetaryBenefits: Record<string, NonMonetaryBenefit[]> = {
  "1": [
    { id: "1", name: "โทรศัพท์เคลื่อนที่", amount: "1", unit: "เครื่อง", status: "active" },
    { id: "2", name: "คอมพิวเตอร์", amount: "1", unit: "เครื่อง", status: "active" },
    { id: "3", name: "รถประจำตำแหน่ง", amount: "1", unit: "คัน", status: "inactive" },
  ],
  "2": [
    { id: "1", name: "โทรศัพท์เคลื่อนที่", amount: "1", unit: "เครื่อง", status: "active" },
    { id: "2", name: "ประกันสุขภาพ", amount: "1", unit: "กรมธรรม์", status: "active" },
  ],
}

interface NonMonetaryBenefitsTableProps {
  companyId: string
}

export function NonMonetaryBenefitsTable({ companyId }: NonMonetaryBenefitsTableProps) {
  const { toast } = useToast()
  const [benefits, setBenefits] = useState<NonMonetaryBenefit[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState<NonMonetaryBenefit | null>(null)

  // Initialize form for adding new item
  const addForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      amount: "",
      unit: "",
    },
  })

  // Initialize form for editing item
  const editForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      amount: "",
      unit: "",
    },
  })

  useEffect(() => {
    // In a real app, fetch from API
    setBenefits(mockNonMonetaryBenefits[companyId] || [])
  }, [companyId])

  const validateName = (name: string, currentId?: string): boolean => {
    const isDuplicate = benefits.some((item) => item.name.toLowerCase() === name.toLowerCase() && item.id !== currentId)

    if (isDuplicate) {
      return false
    }

    return true
  }

  const handleAddItem = (data: FormValues) => {
    if (!validateName(data.name)) {
      addForm.setError("name", {
        type: "manual",
        message: "ชื่อรายการสิทธิประโยชน์ซ้ำกับที่มีอยู่แล้ว",
      })
      return
    }

    const newItem: NonMonetaryBenefit = {
      id: Math.random().toString(36).substring(2, 9),
      name: data.name,
      amount: data.amount,
      unit: data.unit,
      status: "active",
    }

    setBenefits([...benefits, newItem])
    addForm.reset({
      name: "",
      amount: "",
      unit: "",
    })
    setIsAddDialogOpen(false)

    toast({
      title: "เพิ่มรายการสิทธิประโยชน์สำเร็จ",
      description: `รายการ "${newItem.name}" ได้ถูกเพิ่มเข้าสู่ระบบเรียบร้อยแล้ว`,
    })
  }

  const handleEditItem = (data: FormValues) => {
    if (!currentItem) return

    if (!validateName(data.name, currentItem.id)) {
      editForm.setError("name", {
        type: "manual",
        message: "ชื่อรายการสิทธิประโยชน์ซ้ำกับที่มีอยู่แล้ว",
      })
      return
    }

    setBenefits(
      benefits.map((item) => {
        if (item.id === currentItem.id) {
          return {
            ...item,
            name: data.name,
            amount: data.amount,
            unit: data.unit,
          }
        }
        return item
      }),
    )

    setIsEditDialogOpen(false)
    setCurrentItem(null)

    toast({
      title: "แก้ไขรายการสิทธิประโยชน์สำเร็จ",
      description: `รายการ "${data.name}" ได้รับการอัปเดตเรียบร้อยแล้ว`,
    })
  }

  const handleDeleteItem = () => {
    if (!currentItem) return

    setBenefits(benefits.filter((item) => item.id !== currentItem.id))
    setIsDeleteDialogOpen(false)
    setCurrentItem(null)

    toast({
      title: "ลบรายการสิทธิประโยชน์สำเร็จ",
      description: `รายการ "${currentItem.name}" ได้ถูกลบออกจากระบบเรียบร้อยแล้ว`,
    })
  }

  const handleStatusChange = () => {
    if (!currentItem) return

    setBenefits(
      benefits.map((item) => {
        if (item.id === currentItem.id) {
          return {
            ...item,
            status: item.status === "active" ? "inactive" : "active",
          }
        }
        return item
      }),
    )

    setIsStatusDialogOpen(false)
    setCurrentItem(null)

    toast({
      title: "เปลี่ยนสถานะสำเร็จ",
      description: `สถานะของรายการ "${currentItem.name}" ได้ถูกเปลี่ยนเรียบร้อยแล้ว`,
    })
  }

  const openEditDialog = (item: NonMonetaryBenefit) => {
    setCurrentItem(item)
    editForm.reset({
      name: item.name,
      amount: item.amount,
      unit: item.unit,
    })
    setIsEditDialogOpen(true)
  }

  const moveItemUp = (index: number) => {
    if (index === 0) return

    const newItems = [...benefits]
    const temp = newItems[index]
    newItems[index] = newItems[index - 1]
    newItems[index - 1] = temp
    setBenefits(newItems)
  }

  const moveItemDown = (index: number) => {
    if (index === benefits.length - 1) return

    const newItems = [...benefits]
    const temp = newItems[index]
    newItems[index] = newItems[index + 1]
    newItems[index + 1] = temp
    setBenefits(newItems)
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => {
            addForm.reset({
              name: "",
              amount: "",
              unit: "",
            })
            setIsAddDialogOpen(true)
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          เพิ่มรายการสิทธิประโยชน์
        </Button>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">ลำดับ</TableHead>
              <TableHead>ชื่อรายการสิทธิประโยชน์</TableHead>
              <TableHead className="text-center">จำนวน</TableHead>
              <TableHead className="text-center">หน่วย</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead className="text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {benefits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  ไม่พบข้อมูลรายการสิทธิประโยชน์
                </TableCell>
              </TableRow>
            ) : (
              benefits.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-center">{item.amount}</TableCell>
                  <TableCell className="text-center">{item.unit}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.status === "active" ? "ใช้งาน" : "ไม่ใช้งาน"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => moveItemUp(index)} disabled={index === 0}>
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => moveItemDown(index)}
                        disabled={index === benefits.length - 1}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => openEditDialog(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setCurrentItem(item)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setCurrentItem(item)
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

      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>เพิ่มรายการสิทธิประโยชน์</DialogTitle>
            <DialogDescription>กรอกข้อมูลรายการสิทธิประโยชน์ที่ต้องการเพิ่ม</DialogDescription>
          </DialogHeader>
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(handleAddItem)} className="space-y-4 py-2">
              <FormField
                control={addForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ชื่อรายการสิทธิประโยชน์</FormLabel>
                    <FormControl>
                      <Input placeholder="โทรศัพท์เคลื่อนที่" {...field} maxLength={100} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>จำนวน</FormLabel>
                    <FormControl>
                      <Input placeholder="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>หน่วย</FormLabel>
                    <FormControl>
                      <Input placeholder="เครื่อง" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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

      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>แก้ไขรายการสิทธิประโยชน์</DialogTitle>
            <DialogDescription>แก้ไขข้อมูลรายการสิทธิประโยชน์</DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditItem)} className="space-y-4 py-2">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ชื่อรายการสิทธิประโยชน์</FormLabel>
                    <FormControl>
                      <Input placeholder="โทรศัพท์เคลื่อนที่" {...field} maxLength={100} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>จำนวน</FormLabel>
                    <FormControl>
                      <Input placeholder="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>หน่วย</FormLabel>
                    <FormControl>
                      <Input placeholder="เครื่อง" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              คุณต้องการลบรายการ {currentItem?.name} ใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem}>ยืนยัน</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Status Change Confirmation */}
      <AlertDialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการเปลี่ยนสถานะ</AlertDialogTitle>
            <AlertDialogDescription>
              คุณต้องการเปลี่ยนสถานะรายการ {currentItem?.name} เป็น
              {currentItem?.status === "active" ? " ไม่ใช้งาน" : " ใช้งาน"} ใช่หรือไม่?
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
