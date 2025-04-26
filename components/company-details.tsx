"use client"

interface CompanyDetailsProps {
  company: {
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
  onEdit: () => void
}

export function CompanyDetails({ company, onEdit }: CompanyDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          แก้ไขข้อมูลบริษัท
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-2 font-medium">ข้อมูลบริษัท</div>
          <div className="divide-y">
            <div className="grid grid-cols-1 md:grid-cols-3 px-4 py-3">
              <div className="text-sm text-muted-foreground mb-1 md:mb-0">ชื่อบริษัท</div>
              <div className="md:col-span-2 font-medium">{company.name}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 px-4 py-3">
              <div className="text-sm text-muted-foreground mb-1 md:mb-0">เลขทะเบียนนิติบุคคล</div>
              <div className="md:col-span-2 font-medium">{company.registrationNumber}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 px-4 py-3">
              <div className="text-sm text-muted-foreground mb-1 md:mb-0">สถานะ</div>
              <div className="md:col-span-2 font-medium">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    company.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {company.status === "active" ? "ใช้งาน" : "ไม่ใช้งาน"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-2 font-medium">ข้อมูลธนาคาร</div>
          <div className="divide-y">
            <div className="grid grid-cols-1 md:grid-cols-3 px-4 py-3">
              <div className="text-sm text-muted-foreground mb-1 md:mb-0">ธนาคาร</div>
              <div className="md:col-span-2 font-medium">{company.bank}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 px-4 py-3">
              <div className="text-sm text-muted-foreground mb-1 md:mb-0">เลขที่บัญชี</div>
              <div className="md:col-span-2 font-medium">{company.accountNumber}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 px-4 py-3">
              <div className="text-sm text-muted-foreground mb-1 md:mb-0">สาขา</div>
              <div className="md:col-span-2 font-medium">{company.branch}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 px-4 py-3">
              <div className="text-sm text-muted-foreground mb-1 md:mb-0">ประเภทบัญชี</div>
              <div className="md:col-span-2 font-medium">{company.accountType}</div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-2 font-medium">ข้อมูลประกันสังคม</div>
          <div className="divide-y">
            <div className="grid grid-cols-1 md:grid-cols-3 px-4 py-3">
              <div className="text-sm text-muted-foreground mb-1 md:mb-0">เลขทะเบียนนายจ้างประกันสังคม</div>
              <div className="md:col-span-2 font-medium">{company.socialSecurityNumber}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 px-4 py-3">
              <div className="text-sm text-muted-foreground mb-1 md:mb-0">ลำดับที่สาขา</div>
              <div className="md:col-span-2 font-medium">{company.branchNumber}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 px-4 py-3">
              <div className="text-sm text-muted-foreground mb-1 md:mb-0">อัตราเงินหักประกันสังคม</div>
              <div className="md:col-span-2 font-medium">{company.socialSecurityRate}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
