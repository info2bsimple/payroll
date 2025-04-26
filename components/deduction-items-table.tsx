"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Pencil, Trash2, XCircle, MoveUp, MoveDown, Lock } from "lucide-react"
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

// Define deduction item interface
interface DeductionItem {
  id: string
  name: string
  status: "active" | "inactive"
  isDefault: boolean // Flag to indicate if this is a default item
}

// Form schema
const formSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อรายการเงินหัก"),
})

type FormValues = z.infer<typeof formSchema>

// Default deduction items that should be present for all companies
const defaultDeductionItems: DeductionItem[] = [
  { id: "default-1", name: "ประกันสังคม", status: "active", isDefault: true },
  { id: "default-2", name: "ภาษีหัก ณ ที่จ่าย", status: "active", isDefault: true },
  { id: "default-3", name: "กองทุนสำรองเลี้ยงชีพ", status: "active", isDefault: true },
]

// Mock data for deduction items (additional company-specific items)
const mockDeductionItems: Record<string, DeductionItem[]> = {
  "1": [
    { id: "1", name: "เงินกู้สวัสดิการ", status: "active", isDefault: false },
    { id: "2", name: "ค่าสหกรณ์", status: "active", isDefault: false },
    { id: "3", name: "ค่าประกันชีวิต", status: "inactive", isDefault: false },
  ],
  "2": [
    { id: "1", name: "เงินกู้สวัสดิการ", status: "active", isDefault: false },
    { id: "2", name: "ค่าอุปกรณ์", status: "active", isDefault: false },
  ],
}

interface DeductionItemsTableProps {
  companyId: string
}

export function DeductionItemsTable({ companyId }: DeductionItemsTableProps) {
  const { toast } = useToast()
  const [deductionItems, setDeductionItems] = useState<DeductionItem[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState<DeductionItem | null>(null)

  // Initialize form for adding new item
  const addForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  // Initialize form for editing item
  const editForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  useEffect(() => {
    // In a real app, fetch from API
    // Combine default items with company-specific items
    const companyItems = mockDeductionItems[companyId] || []
    setDeductionItems([...defaultDeductionItems, ...companyItems])
  }, [companyId])

  const validateName = (name: string, currentId?: string): boolean => {
    const isDuplicate = deductionItems.some(
      (item) => item.name.toLowerCase() === name.toLowerCase() && item.id !== currentId,
    )

    if (isDuplicate) {
      return false
    }

    return true
  }

  const handleAddItem = (data: FormValues) => {
    if (!validateName(data.name)) {
      addForm.setError("name", {
        type: "manual",
        message: "ชื่อรายการเงินหักซ้ำกับที่มีอยู่แล้ว",
      })
      return
    }

    const newItem: DeductionItem = {
      id: Math.random().toString(36).substring(2, 9),
      name: data.name,
      status: "active",
      isDefault: false,
    }

    setDeductionItems([...deductionItems, newItem])
    addForm.reset({
      name: "",
    })
    setIsAddDialogOpen(false)

    toast({
      title: "เพิ่มรายการเงินหักสำเร็จ",
      description: `รายการ "${newItem.name}" ได้ถูกเพิ่มเข้าสู่ระบบเรียบร้อยแล้ว`,
    })
  }

  const handleEditItem = (data: FormValues) => {
    if (!currentItem) return

    if (!validateName(data.name, currentItem.id)) {
      editForm.setError("name", {
        type: "manual",
        message: "ชื่อรายการเงินหักซ้ำกับที่มีอยู่แล้ว",
      })
      return
    }

    setDeductionItems(
      deductionItems.map((item) => {
        if (item.id === currentItem.id) {
          return {
            ...item,
            name: data.name,
          }
        }
        return item
      }),
    )

    setIsEditDialogOpen(false)
    setCurrentItem(null)

    toast({
      title: "แก้ไขรายการเงินหักสำเร็จ",
      description: `รายการได้ถูกแก้ไขเป็น "${data.name}" เรียบร้อยแล้ว`,
    })
  }

  const handleDeleteItem = () => {
    if (!currentItem) return

    if (currentItem.isDefault) {
      toast({
        title: "ไม่สามารถลบได้",
        description: "ไม่สามารถลบรายการเงินหักที่เป็นค่าเริ่มต้นของระบบ",
        variant: "destructive",
      })
      setIsDeleteDialogOpen(false)
      setCurrentItem(null)
      return
    }

    setDeductionItems(deductionItems.filter((item) => item.id !== currentItem.id))
    setIsDeleteDialogOpen(false)
    setCurrentItem(null)

    toast({
      title: "ลบรายการเงินหักสำเร็จ",
      description: `รายการ "${currentItem.name}" ได้ถูกลบออกจากระบบเรียบร้อยแล้ว`,
    })
  }

  const handleStatusChange = () => {
    if (!currentItem) return

    setDeductionItems(
      deductionItems.map((item) => {
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

  const openEditDialog = (item: DeductionItem) => {
    setCurrentItem(item)
    editForm.reset({
      name: item.name,
    })
    setIsEditDialogOpen(true)
  }

  const moveItemUp = (index: number) => {
    if (index === 0) return

    // Don't allow moving default items
    if (deductionItems[index].isDefault || deductionItems[index - 1].isDefault) return

    const newItems = [...deductionItems]
    const temp = newItems[index]
    newItems[index] = newItems[index - 1]
    newItems[index - 1] = temp
    setDeductionItems(newItems)
  }

  const moveItemDown = (index: number) => {
    if (index === deductionItems.length - 1) return

    // Don't allow moving default items
    if (deductionItems[index].isDefault || deductionItems[index + 1].isDefault) return

    const newItems = [...deductionItems]
    const temp = newItems[index]
    newItems[index] = newItems[index + 1]
    newItems[index + 1] = temp
    setDeductionItems(newItems)
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => {
            addForm.reset({
              name: "",
            })
            setIsAddDialogOpen(true)
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          เพิ่มรายการเงินหัก
        </Button>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">ลำดับ</TableHead>
              <TableHead>ชื่อรายการเงินหัก</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead className="text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deductionItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  ไม่พบข้อมูลรายการเงินหัก
                </TableCell>
              </TableRow>
            ) : (
              deductionItems.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {item.name}
                      {item.isDefault && <Lock className="ml-2 h-4 w-4 text-muted-foreground" />}
                    </div>
                  </TableCell>
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
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => moveItemUp(index)}
                        disabled={index === 0 || item.isDefault || (index > 0 && deductionItems[index - 1].isDefault)}
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => moveItemDown(index)}
                        disabled={
                          index === deductionItems.length - 1 ||
                          item.isDefault ||
                          (index < deductionItems.length - 1 && deductionItems[index + 1].isDefault)
                        }
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditDialog(item)}
                        disabled={item.isDefault}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setCurrentItem(item)
                          setIsDeleteDialogOpen(true)
                        }}
                        disabled={item.isDefault}
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
            <DialogTitle>เพิ่มรายการเงินหัก</DialogTitle>
            <DialogDescription>กรอกชื่อรายการเงินหักที่ต้องการเพิ่ม</DialogDescription>
          </DialogHeader>
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(handleAddItem)} className="space-y-4 py-2">
              <FormField
                control={addForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ชื่อรายการเงินหัก</FormLabel>
                    <FormControl>
                      <Input placeholder="เงินกู้สวัสดิการ" {...field} maxLength={100} />
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
            <DialogTitle>แก้ไขรายการเงินหัก</DialogTitle>
            <DialogDescription>แก้ไขชื่อรายการเงินหัก</DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditItem)} className="space-y-4 py-2">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ชื่อรายการเงินหัก</FormLabel>
                    <FormControl>
                      <Input placeholder="เงินกู้สวัสดิการ" {...field} maxLength={100} />
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
