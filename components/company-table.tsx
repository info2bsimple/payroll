"use client"

import { useState } from "react"
import { PlusCircle, Pencil, Trash2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AddCompanyForm } from "@/components/add-company-form"
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
import Link from "next/link"

// Define company type
interface Company {
  id: string
  name: string
  registrationNumber: string
  bank: string
  accountNumber: string
  branch: string
  accountType: string
  socialSecurityNumber: string
  branchNumber: string
  socialSecurityRate: number
  status: "active" | "inactive"
}

export function CompanyTable() {
  // Update the companies array to include more examples with mixed statuses
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: "1",
      name: "บริษัท ทดสอบ จำกัด",
      registrationNumber: "0123456789012",
      bank: "ธนาคารกรุงเทพ",
      accountNumber: "1234567890",
      branch: "สาขาสีลม",
      accountType: "ออมทรัพย์",
      socialSecurityNumber: "1234567890",
      branchNumber: "00",
      socialSecurityRate: 5,
      status: "active",
    },
    {
      id: "2",
      name: "บริษัท พัฒนาซอฟต์แวร์ จำกัด",
      registrationNumber: "1234567890123",
      bank: "ธนาคารกสิกรไทย",
      accountNumber: "9876543210",
      branch: "สาขาอโศก",
      accountType: "ออมทรัพย์",
      socialSecurityNumber: "0987654321",
      branchNumber: "01",
      socialSecurityRate: 5,
      status: "active",
    },
    {
      id: "3",
      name: "บริษัท ก้าวหน้า จำกัด",
      registrationNumber: "2345678901234",
      bank: "ธนาคารไทยพาณิชย์",
      accountNumber: "5678901234",
      branch: "สาขาสยาม",
      accountType: "กระแสรายวัน",
      socialSecurityNumber: "2345678901",
      branchNumber: "02",
      socialSecurityRate: 5,
      status: "inactive",
    },
    {
      id: "4",
      name: "บริษัท อุตสาหกรรมไทย จำกัด",
      registrationNumber: "3456789012345",
      bank: "ธนาคารกรุงไทย",
      accountNumber: "1122334455",
      branch: "สาขาพระราม 9",
      accountType: "ออมทรัพย์",
      socialSecurityNumber: "3456789012",
      branchNumber: "03",
      socialSecurityRate: 5,
      status: "active",
    },
    {
      id: "5",
      name: "บริษัท นวัตกรรมดิจิทัล จำกัด",
      registrationNumber: "4567890123456",
      bank: "ธนาคารกรุงศรีอยุธยา",
      accountNumber: "6677889900",
      branch: "สาขาเซ็นทรัลเวิลด์",
      accountType: "ออมทรัพย์",
      socialSecurityNumber: "4567890123",
      branchNumber: "04",
      socialSecurityRate: 5,
      status: "inactive",
    },
    {
      id: "6",
      name: "บริษัท เทคโนโลยีสารสนเทศ จำกัด",
      registrationNumber: "5678901234567",
      bank: "ธนาคารทหารไทยธนชาต",
      accountNumber: "1357924680",
      branch: "สาขาลาดพร้าว",
      accountType: "กระแสรายวัน",
      socialSecurityNumber: "5678901234",
      branchNumber: "05",
      socialSecurityRate: 5,
      status: "active",
    },
  ])

  const [isAddFormOpen, setIsAddFormOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [deleteCompany, setDeleteCompany] = useState<Company | null>(null)
  const [statusChangeCompany, setStatusChangeCompany] = useState<Company | null>(null)

  // Add state for filtering
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")

  const handleAddCompany = (company: Omit<Company, "id" | "status">) => {
    const newCompany = {
      ...company,
      id: Math.random().toString(36).substring(2, 9),
      status: "active" as const,
    }

    setCompanies([...companies, newCompany])
    setIsAddFormOpen(false)
  }

  const handleEditCompany = (company: Company) => {
    setCompanies(companies.map((c) => (c.id === company.id ? company : c)))
    setEditingCompany(null)
  }

  const handleDeleteCompany = () => {
    if (deleteCompany) {
      setCompanies(companies.filter((c) => c.id !== deleteCompany.id))
      setDeleteCompany(null)
    }
  }

  const handleStatusChange = () => {
    if (statusChangeCompany) {
      setCompanies(
        companies.map((c) => {
          if (c.id === statusChangeCompany.id) {
            return {
              ...c,
              status: c.status === "active" ? "inactive" : "active",
            }
          }
          return c
        }),
      )
      setStatusChangeCompany(null)
    }
  }

  // Add filtered companies logic
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || company.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Update the return statement to include the search/filter section and modify the table
  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
        <div className="flex-1">
          <Input
            placeholder="ค้นหาชื่อบริษัท..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={statusFilter} onValueChange={(value: "all" | "active" | "inactive") => setStatusFilter(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="สถานะทั้งหมด" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">สถานะทั้งหมด</SelectItem>
              <SelectItem value="active">ใช้งาน</SelectItem>
              <SelectItem value="inactive">ไม่ใช้งาน</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setIsAddFormOpen(true)} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            เพิ่มบริษัท
          </Button>
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">ลำดับ</TableHead>
              <TableHead>ชื่อบริษัท</TableHead>
              <TableHead className="hidden md:table-cell">เลขทะเบียนนิติบุคคล</TableHead>
              <TableHead className="hidden md:table-cell">เลขที่บัญชี</TableHead>
              <TableHead className="hidden md:table-cell">ธนาคาร</TableHead>
              <TableHead className="hidden lg:table-cell">เลขทะเบียนประกันสังคม</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead className="text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCompanies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  ไม่พบข้อมูลบริษัท
                </TableCell>
              </TableRow>
            ) : (
              filteredCompanies.map((company, index) => (
                <TableRow key={company.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    <Link href={`/company/${company.id}`} className="hover:underline text-primary">
                      {company.name}
                    </Link>
                    <div className="md:hidden text-xs text-muted-foreground mt-1">{company.registrationNumber}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{company.registrationNumber}</TableCell>
                  <TableCell className="hidden md:table-cell">{company.accountNumber}</TableCell>
                  <TableCell className="hidden md:table-cell">{company.bank}</TableCell>
                  <TableCell className="hidden lg:table-cell">{company.socialSecurityNumber}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        company.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {company.status === "active" ? "ใช้งาน" : "ไม่ใช้งาน"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => setEditingCompany(company)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => setDeleteCompany(company)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => setStatusChangeCompany(company)}>
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

      {/* Add Company Form */}
      <AddCompanyForm
        open={isAddFormOpen}
        onOpenChange={setIsAddFormOpen}
        onSubmit={handleAddCompany}
        existingCompanies={companies}
      />

      {/* Edit Company Form */}
      {editingCompany && (
        <AddCompanyForm
          open={!!editingCompany}
          onOpenChange={(open) => !open && setEditingCompany(null)}
          onSubmit={(data) => handleEditCompany({ ...data, id: editingCompany.id, status: editingCompany.status })}
          existingCompanies={companies.filter((c) => c.id !== editingCompany.id)}
          defaultValues={editingCompany}
          isEditing
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteCompany} onOpenChange={(open) => !open && setDeleteCompany(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบข้อมูล</AlertDialogTitle>
            <AlertDialogDescription>
              คุณต้องการลบข้อมูลบริษัท {deleteCompany?.name} ใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCompany}>ยืนยัน</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Status Change Confirmation */}
      <AlertDialog open={!!statusChangeCompany} onOpenChange={(open) => !open && setStatusChangeCompany(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการเปลี่ยนสถานะ</AlertDialogTitle>
            <AlertDialogDescription>
              คุณต้องการเปลี่ยนสถานะบริษัท {statusChangeCompany?.name} เป็น
              {statusChangeCompany?.status === "active" ? " ไม่ใช้งาน" : " ใช้งาน"} ใช่หรือไม่?
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
