"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { CompanyDetails } from "@/components/company-details"
import { EmployeeTypeTable } from "@/components/employee-type-table"
import { RegularIncomeTable } from "@/components/regular-income-table"
import { OtherIncomeTable } from "@/components/other-income-table"
import { NonMonetaryBenefitsTable } from "@/components/non-monetary-benefits-table"
import { DeductionItemsTable } from "@/components/deduction-items-table"
import { SocialSecuritySettings } from "@/components/social-security-settings"
import { TaxCalculationSettings } from "@/components/tax-calculation-settings"
import { ProvidentFundSettings } from "@/components/provident-fund-settings"
import { BankFeesSettings } from "@/components/bank-fees-settings"
import { AccountCodesSettings } from "@/components/account-codes-settings"
import { AddCompanyForm } from "@/components/add-company-form"
import { useToast } from "@/hooks/use-toast"

// Define company type
interface Company {
  id: string
  name: string
  registrationNumber: string
  bank: string
  accountNumber: string
  branch: string
  accountType: string
  address?: string
  province?: string
  district?: string
  subdistrict?: string
  postalCode?: string
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
    address: "เลขที่ 123 อาคาร เทสต์ ชั้น 10 ถนนสีลม ซอย 5",
    province: "กรุงเทพมหานคร",
    district: "บางรัก",
    subdistrict: "สีลม",
    postalCode: "10500",
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
    address: "เลขที่ 456 อาคาร โค้ด ชั้น 20 ถนนสุขุมวิท",
    province: "กรุงเทพมหานคร",
    district: "วัฒนา",
    subdistrict: "คลองตัน",
    postalCode: "10110",
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
    address: "เลขที่ 789 ถนนพระราม 1",
    province: "กรุงเทพมหานคร",
    district: "ปทุมวัน",
    subdistrict: "ปทุมวัน",
    postalCode: "10330",
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
]

export default function CompanyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [company, setCompany] = useState<Company | null>(null)
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)

  useEffect(() => {
    // In a real app, fetch from API
    const companyId = params.id as string
    const foundCompany = mockCompanies.find((c) => c.id === companyId)

    if (foundCompany) {
      setCompany(foundCompany)
    } else {
      // Redirect to main page if company not found
      router.push("/")
    }
  }, [params.id, router])

  const handleEditCompany = (data: Omit<Company, "id" | "status">) => {
    if (!company) return

    const updatedCompany = {
      ...company,
      ...data,
    }

    // In a real app, this would be an API call
    // For now, we'll just update our local state
    setCompany(updatedCompany)

    // Update the mock data array (this is just for demo purposes)
    const index = mockCompanies.findIndex((c) => c.id === company.id)
    if (index !== -1) {
      mockCompanies[index] = updatedCompany
    }

    setIsEditFormOpen(false)

    toast({
      title: "แก้ไขข้อมูลบริษัทสำเร็จ",
      description: `ข้อมูลบริษัท ${updatedCompany.name} ได้รับการอัปเดตเรียบร้อยแล้ว`,
    })
  }

  if (!company) {
    return <div className="container mx-auto p-6">กำลังโหลดข้อมูล...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.push("/")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          กลับไปหน้าหลัก
        </Button>
        <h1 className="text-2xl font-bold">{company.name}</h1>
        <p className="text-muted-foreground">เลขทะเบียนนิติบุคคล: {company.registrationNumber}</p>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="mb-4 flex flex-wrap h-auto">
          <TabsTrigger value="details" className="whitespace-nowrap mb-2 sm:mb-0">
            ข้อมูลบริษัท
          </TabsTrigger>
          <TabsTrigger value="employee-types" className="whitespace-nowrap mb-2 sm:mb-0">
            ประเภทพนักงาน
          </TabsTrigger>
          <TabsTrigger value="regular-income" className="whitespace-nowrap mb-2 sm:mb-0">
            เงินได้ประจำ
          </TabsTrigger>
          <TabsTrigger value="other-income" className="whitespace-nowrap mb-2 sm:mb-0">
            เงินได้อื่นๆ
          </TabsTrigger>
          <TabsTrigger value="non-monetary-benefits" className="whitespace-nowrap mb-2 sm:mb-0">
            สิทธิประโยชน์อื่นๆ
          </TabsTrigger>
          <TabsTrigger value="deduction-items" className="whitespace-nowrap mb-2 sm:mb-0">
            รายการเงินหัก
          </TabsTrigger>
          <TabsTrigger value="social-security" className="whitespace-nowrap mb-2 sm:mb-0">
            ประกันสังคม
          </TabsTrigger>
          <TabsTrigger value="tax-calculation" className="whitespace-nowrap mb-2 sm:mb-0">
            การคำนวนภาษี
          </TabsTrigger>
          <TabsTrigger value="provident-fund" className="whitespace-nowrap mb-2 sm:mb-0">
            กองทุนสำรองเลี้ยงชีพ
          </TabsTrigger>
          <TabsTrigger value="bank-fees" className="whitespace-nowrap mb-2 sm:mb-0">
            ค่าธรรมเนียม
          </TabsTrigger>
          <TabsTrigger value="account-codes" className="whitespace-nowrap mb-2 sm:mb-0">
            รหัสบัญชี
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>รายละเอียดบริษัท</CardTitle>
              <CardDescription>ข้อมูลทั้งหมดของบริษัท</CardDescription>
            </CardHeader>
            <CardContent>
              <CompanyDetails company={company} onEdit={() => setIsEditFormOpen(true)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employee-types">
          <Card>
            <CardHeader>
              <CardTitle>ประเภทพนักงาน</CardTitle>
              <CardDescription>จัดการประเภทพนักงานภายในบริษัท</CardDescription>
            </CardHeader>
            <CardContent>
              <EmployeeTypeTable companyId={company.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regular-income">
          <Card>
            <CardHeader>
              <CardTitle>รายการเงินได้ประจำ</CardTitle>
              <CardDescription>จัดการรายการเงินได้ประจำของพนักงาน</CardDescription>
            </CardHeader>
            <CardContent>
              <RegularIncomeTable companyId={company.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="other-income">
          <Card>
            <CardHeader>
              <CardTitle>รายการเงินได้อื่นๆ</CardTitle>
              <CardDescription>จัดการรายการเงินได้อื่นๆ ของพนักงาน</CardDescription>
            </CardHeader>
            <CardContent>
              <OtherIncomeTable companyId={company.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="non-monetary-benefits">
          <Card>
            <CardHeader>
              <CardTitle>สิทธิประโยชน์อื่นๆ ที่ไม่ใช่ตัวเงิน</CardTitle>
              <CardDescription>จัดการสิทธิประโยชน์อื่นๆ ที่ไม่ใช่ตัวเงินของพนักงาน</CardDescription>
            </CardHeader>
            <CardContent>
              <NonMonetaryBenefitsTable companyId={company.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deduction-items">
          <Card>
            <CardHeader>
              <CardTitle>รายการเงินหัก</CardTitle>
              <CardDescription>จัดการรายการเงินหักของพนักงาน</CardDescription>
            </CardHeader>
            <CardContent>
              <DeductionItemsTable companyId={company.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social-security">
          <Card>
            <CardHeader>
              <CardTitle>ตั้งค่าประกันสังคม</CardTitle>
              <CardDescription>กำหนดค่าการคำนวณประกันสังคมและรายการเงินได้ที่นำมาคำนวณ</CardDescription>
            </CardHeader>
            <CardContent>
              <SocialSecuritySettings companyId={company.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax-calculation">
          <Card>
            <CardHeader>
              <CardTitle>ตั้งค่าการคำนวณภาษี</CardTitle>
              <CardDescription>กำหนดค่าการคำนวณภาษีและรายการเงินได้ที่นำมาคำนวณ</CardDescription>
            </CardHeader>
            <CardContent>
              <TaxCalculationSettings companyId={company.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="provident-fund">
          <Card>
            <CardHeader>
              <CardTitle>ตั้งค่ากองทุนสำรองเลี้ยงชีพ</CardTitle>
              <CardDescription>กำหนดค่าการคำนวณกองทุนสำรองเลี้ยงชีพและรายการเงินได้ที่นำมาคำนวณ</CardDescription>
            </CardHeader>
            <CardContent>
              <ProvidentFundSettings companyId={company.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bank-fees">
          <Card>
            <CardHeader>
              <CardTitle>ตั้งค่าค่าธรรมเนียม</CardTitle>
              <CardDescription>กำหนดค่าธรรมเนียมการโอนเงินเข้าบัญชีธนาคาร</CardDescription>
            </CardHeader>
            <CardContent>
              <BankFeesSettings companyId={company.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account-codes">
          <Card>
            <CardHeader>
              <CardTitle>ตั้งค่ารหัสบัญชี</CardTitle>
              <CardDescription>กำหนดรหัสบัญชีของรายการเงินได้ รายการเงินหัก</CardDescription>
            </CardHeader>
            <CardContent>
              <AccountCodesSettings companyId={company.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Company Form */}
      {isEditFormOpen && (
        <AddCompanyForm
          open={isEditFormOpen}
          onOpenChange={setIsEditFormOpen}
          onSubmit={handleEditCompany}
          existingCompanies={mockCompanies.filter((c) => c.id !== company.id)}
          defaultValues={company}
          isEditing={true}
        />
      )}
    </div>
  )
}
