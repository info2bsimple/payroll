export interface Employee {
  id: string
  prefix: string
  firstName: string
  lastName: string
  idCardNumber: string
  employeeCode?: string
  providentFundId?: string
  dateOfBirth?: string
  fundMembershipDate?: string
  fundMemberType?: string
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
  hourlyRate?: number
  positionAllowance?: number
  costOfLiving?: number
}

// Mock data for employees
export const mockEmployees: Employee[] = [
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
    employeeCode: "EMP001",
    dateOfBirth: "15 ม.ค. 2530",
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
    providentFundId: "PVD12345",
    dateOfBirth: "22 ก.พ. 2535",
    fundMembershipDate: "15 เม.ย. 2565",
    fundMemberType: "1 - Staff",
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
    fundMemberType: "2 - Management",
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
    dateOfBirth: "10 มี.ค. 2538",
    fundMembershipDate: "1 ส.ค. 2563",
    fundMemberType: "3 - Confidential",
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
    employeeCode: "EMP005",
    providentFundId: "PVD54321",
    dateOfBirth: "5 เม.ย. 2525",
    fundMembershipDate: "1 ม.ค. 2567",
    fundMemberType: "4 - Wage",
  },
]
