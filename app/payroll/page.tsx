"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Search, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { AddEmployeeForm } from "@/components/add-employee-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Define employee type
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
  salary?: number
  status: "active" | "inactive"
}

// Mock data for employees
const mockEmployees: Employee[] = [
  {
    id: "EP00001",
    prefix: "นาย",
    firstName: "อนันต์",
    lastName: "metha",
    idCardNumber: "1234567890123",
    employeeType: "พนักงานประจำ - รายเดือน",
    company: "บริษัท ภูมิพัฒนา จำกัด",
    department: "ซอฟแวร์ เดเวลอป",
    position: "นักพัฒนาโปรแกรมด้านบุคคล",
    startDate: "",
    bank: "ธนาคารกสิกรไทย",
    accountName: "นายอนันต์ metha",
    accountNumber: "1234567890",
    branch: "สาขาสีลม",
    status: "inactive",
  },
  {
    id: "EP00002",
    prefix: "นาย",
    firstName: "ชลิต",
    lastName: "สมานบุตร",
    idCardNumber: "1234567890124",
    employeeType: "พนักงานประจำ - รายเดือน",
    company: "บริษัท ภูมิพัฒนา จำกัด",
    department: "บัญชี",
    position: "ผู้ตรวจสอบภายใน",
    startDate: "1 เม.ย. 2565",
    bank: "ธนาคารกรุงเทพ",
    accountName: "นายชลิต สมานบุตร",
    accountNumber: "9876543210",
    branch: "สาขาอโศก",
    salary: 29000,
    status: "active",
  },
  {
    id: "EP00003",
    prefix: "นาย",
    firstName: "รุ่งเจ้า",
    lastName: "สมานะ",
    idCardNumber: "1234567890125",
    employeeType: "พนักงานประจำ - รายวัน",
    company: "บริษัท ภูมิพัฒนา จำกัด",
    department: "ซอฟแวร์ เดเวลอป",
    position: "นักพัฒนาโปรแกรมด้านบุคคล",
    startDate: "15 พ.ค. 2566",
    bank: "ธนาคารไทยพาณิชย์",
    accountName: "นายรุ่งเจ้า สมานะ",
    accountNumber: "5678901234",
    branch: "สาขาสยาม",
    salary: 50000,
    status: "active",
  },
  {
    id: "EP00004",
    prefix: "นาย",
    firstName: "เชวงศักดิ์",
    lastName: "ศรีวงศ์",
    idCardNumber: "1234567890126",
    employeeType: "พนักงานประจำ - รายเดือน",
    company: "บริษัท ภูมิพัฒนา จำกัด",
    department: "ซอฟแวร์ เดเวลอป",
    position: "Back-End Developer",
    startDate: "1 ก.ค. 2563",
    bank: "ธนาคารกรุงไทย",
    accountName: "นายเชวงศักดิ์ ศรีวงศ์",
    accountNumber: "1122334455",
    branch: "สาขาพระราม 9",
    status: "active",
  },
  {
    id: "EP00005",
    prefix: "นาง",
    firstName: "หนึ่ง",
    lastName: "ชื่อไท",
    idCardNumber: "1234567890127",
    employeeType: "พนักงานประจำ - รายเดือน",
    company: "บริษัท ภูมิพัฒนา จำกัด",
    department: "บัญชี",
    position: "ผู้อำนวยการฝ่ายบัญชี",
    startDate: "4 ธ.ค. 2566",
    bank: "ธนาคารกรุงศรีอยุธยา",
    accountName: "นางหนึ่ง ชื่อไท",
    accountNumber: "6677889900",
    branch: "สาขาเซ็นทรัลเวิลด์",
    salary: 30000,
    status: "active",
  },
]

export default function PayrollPage() {
  const router = useRouter()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState<string>("ทั้งหมด")
  const [positionFilter, setPositionFilter] = useState<string>("ทั้งหมด")
  const [statusFilter, setStatusFilter] = useState<string>("ทั้งหมด")
  const [isAddFormOpen, setIsAddFormOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    // In a real app, fetch from API
    setEmployees(mockEmployees)
  }, [])

  // Get unique departments for filter
  const departments = ["ทั้งหมด", ...new Set(mockEmployees.map((emp) => emp.department))]

  // Get unique positions for filter
  const positions = ["ทั้งหมด", ...new Set(mockEmployees.map((emp) => emp.position))]

  // Filter employees based on search and filters
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDepartment = departmentFilter === "ทั้งหมด" || employee.department === departmentFilter
    const matchesPosition = positionFilter === "ทั้งหมด" || employee.position === positionFilter
    const matchesStatus = statusFilter === "ทั้งหมด" || employee.status === statusFilter

    // Filter based on the active tab
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && employee.status === "active") ||
      (activeTab === "inactive" && employee.status === "inactive")

    return matchesSearch && matchesDepartment && matchesPosition && matchesStatus && matchesTab
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage)
  const paginatedEmployees = filteredEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Stats
  const totalEmployees = employees.length
  const activeEmployees = employees.filter((e) => e.status === "active").length
  const inactiveEmployees = employees.filter((e) => e.status === "inactive").length

  const handleAddEmployee = (newEmployee: Omit<Employee, "id">) => {
    // Generate a new ID with EP prefix and 5 digits
    const newId = `EP${(employees.length + 1).toString().padStart(5, "0")}`

    const employeeWithId = {
      ...newEmployee,
      id: newId,
    }

    setEmployees([...employees, employeeWithId as Employee])
    setIsAddFormOpen(false)
  }

  useEffect(() => {
    // When tab changes, reset to page 1
    setCurrentPage(1)

    // Update status filter based on tab
    if (activeTab === "active") {
      setStatusFilter("active")
    } else if (activeTab === "inactive") {
      setStatusFilter("inactive")
    } else {
      setStatusFilter("ทั้งหมด")
    }
  }, [activeTab])

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6">
      <PageHeader title="จัดการข้อมูลเงินเดือน" description="จัดการข้อมูลเงินเดือนของพนักงาน" />

      {/* Stats Tabs */}
      <div className="mb-6">
        <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="flex items-center justify-center gap-2">
              ทั้งหมด
              <Badge variant="secondary" className="ml-1">
                {totalEmployees}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center justify-center gap-2">
              มีเงินเดือน
              <Badge variant="secondary" className="ml-1">
                {activeEmployees}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="inactive" className="flex items-center justify-center gap-2">
              ยังไม่มีเงินเดือน
              <Badge variant="secondary" className="ml-1">
                {inactiveEmployees}
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
            placeholder="ค้นหาชื่อพนักงาน หรือรหัสพนักงาน"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex gap-2">
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="แผนก" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="ตำแหน่ง" />
              </SelectTrigger>
              <SelectContent>
                {positions.map((pos) => (
                  <SelectItem key={pos} value={pos}>
                    {pos}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="สถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ทั้งหมด">ทั้งหมด</SelectItem>
                <SelectItem value="active">ใช้งาน</SelectItem>
                <SelectItem value="inactive">ไม่ใช้งาน</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={() => setIsAddFormOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              เพิ่มพนักงาน
            </Button>
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="rounded-md border overflow-x-auto">
        <div className="bg-muted/50 px-4 py-2 text-sm">พนักงานทั้งหมด {filteredEmployees.length} รายการ</div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">ลำดับ</TableHead>
              <TableHead className="w-[100px]">รหัส</TableHead>
              <TableHead>ชื่อ นามสกุล</TableHead>
              <TableHead className="hidden md:table-cell">แผนก</TableHead>
              <TableHead className="hidden md:table-cell">ตำแหน่ง</TableHead>
              <TableHead className="hidden lg:table-cell">เงินเดือน</TableHead>
              <TableHead className="hidden lg:table-cell">ประเภทพนักงาน</TableHead>
              <TableHead className="hidden xl:table-cell">สังกัดบริษัท</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead className="hidden lg:table-cell">วันที่เริ่มงาน</TableHead>
              <TableHead className="w-[50px]">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-6 text-muted-foreground">
                  ไม่พบข้อมูลพนักงาน
                </TableCell>
              </TableRow>
            ) : (
              paginatedEmployees.map((employee, index) => (
                <TableRow key={employee.id}>
                  <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                  <TableCell>
                    <Link href={`/payroll/${employee.id}`} className="text-primary hover:underline">
                      {employee.id}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/payroll/${employee.id}`} className="font-medium hover:underline">
                      {employee.prefix} {employee.firstName} {employee.lastName}
                    </Link>
                    <div className="md:hidden text-xs text-muted-foreground mt-1">
                      {employee.department} - {employee.position}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline" className={employee.department === "บัญชี" ? "bg-blue-50" : "bg-purple-50"}>
                      {employee.department}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{employee.position}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {employee.salary ? `${employee.salary.toLocaleString()} บาท` : "-"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{employee.employeeType}</TableCell>
                  <TableCell className="hidden xl:table-cell">{employee.company}</TableCell>
                  <TableCell>
                    <Badge variant={employee.status === "active" ? "success" : "destructive"}>
                      {employee.status === "active" ? "ใช้งาน" : "ไม่ใช้งาน"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{employee.startDate || "-"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/payroll/${employee.id}`)}>
                          ดูข้อมูล
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/payroll/${employee.id}/edit`)}>
                          แก้ไข
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
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
            Next
          </Button>
        </div>
      )}

      {/* Add Employee Form */}
      <AddEmployeeForm
        open={isAddFormOpen}
        onOpenChange={setIsAddFormOpen}
        onSubmit={handleAddEmployee}
        existingEmployees={employees}
      />
    </div>
  )
}
