"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Search, Pencil, Trash2, XCircle } from "lucide-react"
import { AddCompanyForm } from "@/components/add-company-form"
import Link from "next/link"
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
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

// Mock data - in a real app, this would come from an API or database
const mockCompanies: Company[] = [
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
  {
    id: "7",
    name: "บริษัท ภูมิพัฒนา จำกัด",
    registrationNumber: "6789012345678",
    bank: "ธนาคารกสิกรไทย",
    accountNumber: "2468013579",
    branch: "สาขาเอกมัย",
    accountType: "ออมทรัพย์",
    socialSecurityNumber: "6789012345",
    branchNumber: "06",
    socialSecurityRate: 5,
    status: "active",
  },
  {
    id: "8",
    name: "บริษัท วิศวกรรมไทย จำกัด",
    registrationNumber: "7890123456789",
    bank: "ธนาคารกรุงเทพ",
    accountNumber: "9876543210",
    branch: "สาขาสุขุมวิท",
    accountType: "ออมทรัพย์",
    socialSecurityNumber: "7890123456",
    branchNumber: "07",
    socialSecurityRate: 5,
    status: "active",
  },
  {
    id: "9",
    name: "บริษัท การค้าไทย จำกัด",
    registrationNumber: "8901234567890",
    bank: "ธนาคารไทยพาณิชย์",
    accountNumber: "1234567890",
    branch: "สาขาสาทร",
    accountType: "กระแสรายวัน",
    socialSecurityNumber: "8901234567",
    branchNumber: "08",
    socialSecurityRate: 5,
    status: "inactive",
  },
  {
    id: "10",
    name: "บริษัท ขนส่งไทย จำกัด",
    registrationNumber: "9012345678901",
    bank: "ธนาคารกรุงไทย",
    accountNumber: "5432109876",
    branch: "สาขาพัฒนาการ",
    accountType: "ออมทรัพย์",
    socialSecurityNumber: "9012345678",
    branchNumber: "09",
    socialSecurityRate: 5,
    status: "active",
  },
]

export default function CompanyPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [companies, setCompanies] = useState<Company[]>(mockCompanies)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isAddFormOpen, setIsAddFormOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [deleteCompany, setDeleteCompany] = useState<Company | null>(null)
  const [statusChangeCompany, setStatusChangeCompany] = useState<Company | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Count companies by status
  const totalCompanies = companies.length
  const activeCompanies = companies.filter((c) => c.status === "active").length
  const inactiveCompanies = companies.filter((c) => c.status === "inactive").length

  // Filter companies based on search and active tab
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && company.status === "active") ||
      (activeTab === "inactive" && company.status === "inactive")

    return matchesSearch && matchesTab
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage)
  const paginatedCompanies = filteredCompanies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Reset to page 1 when tab changes
  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, searchQuery])

  const handleAddCompany = (company: Omit<Company, "id" | "status">) => {
    const newCompany = {
      ...company,
      id: Math.random().toString(36).substring(2, 9),
      status: "active" as const,
    }

    setCompanies([...companies, newCompany])
    setIsAddFormOpen(false)

    toast({
      title: "เพิ่มบริษัทสำเร็จ",
      description: `บริษัท ${newCompany.name} ได้ถูกเพิ่มเข้าสู่ระบบเรียบร้อยแล้ว`,
    })
  }

  const handleEditCompany = (company: Company) => {
    setCompanies(companies.map((c) => (c.id === company.id ? company : c)))
    setEditingCompany(null)

    toast({
      title: "แก้ไขข้อมูลบริษัทสำเร็จ",
      description: `ข้อมูลบริษัท ${company.name} ได้รับการอัปเดตเรียบร้อยแล้ว`,
    })
  }

  const handleDeleteCompany = () => {
    if (deleteCompany) {
      setCompanies(companies.filter((c) => c.id !== deleteCompany.id))
      setDeleteCompany(null)

      toast({
        title: "ลบบริษัทสำเร็จ",
        description: `บริษัท ${deleteCompany.name} ได้ถูกลบออกจากระบบเรียบร้อยแล้ว`,
      })
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

      toast({
        title: "เปลี่ยนสถานะสำเร็จ",
        description: `สถานะของบริษัท ${statusChangeCompany.name} ได้ถูกเปลี่ยนเรียบร้อยแล้ว`,
      })
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6">
      <PageHeader title="จัดการข้อมูลบริษัท" description="จัดการข้อมูลบริษัทและการตั้งค่าต่างๆ" />

      {/* Stats Tabs */}
      <div className="mb-6">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="flex items-center justify-center gap-2">
              ทั้งหมด
              <Badge variant="secondary" className="ml-1">
                {totalCompanies}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center justify-center gap-2">
              ใช้งาน
              <Badge variant="secondary" className="ml-1">
                {activeCompanies}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="inactive" className="flex items-center justify-center gap-2">
              ไม่ใช้งาน
              <Badge variant="secondary" className="ml-1">
                {inactiveCompanies}
              </Badge>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all">{/* Content will be the table below */}</TabsContent>
          <TabsContent value="active">{/* Content will be the table below */}</TabsContent>
          <TabsContent value="inactive">{/* Content will be the table below */}</TabsContent>
        </Tabs>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-auto sm:min-w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ค้นหาชื่อบริษัท..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Button onClick={() => setIsAddFormOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          เพิ่มบริษัท
        </Button>
      </div>

      {/* Companies Table */}
      <div className="rounded-md border overflow-x-auto">
        <div className="bg-muted/50 px-4 py-2 text-sm">บริษัททั้งหมด {filteredCompanies.length} รายการ</div>
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
            {paginatedCompanies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  ไม่พบข้อมูลบริษัท
                </TableCell>
              </TableRow>
            ) : (
              paginatedCompanies.map((company, index) => (
                <TableRow key={company.id}>
                  <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
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
                    <Badge
                      variant={company.status === "active" ? "success" : "destructive"}
                      className="whitespace-nowrap"
                    >
                      {company.status === "active" ? "ใช้งาน" : "ไม่ใช้งาน"}
                    </Badge>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            แสดง {(currentPage - 1) * itemsPerPage + 1} ถึง{" "}
            {Math.min(currentPage * itemsPerPage, filteredCompanies.length)} จากทั้งหมด {filteredCompanies.length} รายการ
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              ก่อนหน้า
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              ถัดไป
            </Button>
          </div>
        </div>
      )}

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
