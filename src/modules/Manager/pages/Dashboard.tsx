import React, { useEffect, useState } from "react";
import "./statistic.scss";
import {
  getExpenseByMonthYear,
  getRevenueOfServiceByDate,
  getSalaryOfEmployeeByMonthYear,
} from "../../../services/api";
import { useBranch } from "../../../hooks/branchContext";
import BarCharts from "./BarCharts";
import { DatePicker, Button, message } from "antd";
import dayjs, { Dayjs } from "dayjs";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import '../../../../public/fonts/Roboto-Black-normal.js'
import { RiFileExcel2Line } from "react-icons/ri";
import { GrDocumentPdf } from "react-icons/gr";

const Dashboard: React.FC = () => {
  const { branchId, setBranchId } = useBranch();
  const [services, setServices] = useState([]);
  const [totalServices, setTotalServices] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [products, setProduct] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const token = localStorage.getItem("accessToken") || "";
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

  useEffect(() => {
    const dateFormat = selectedDate.format("YYYY-MM-DD").split("-");

    const getApiRevenueOfServiceByDate = async () => {
      const response = await getRevenueOfServiceByDate(
        token,
        branchId,
        Number(dateFormat[1]),
        Number(dateFormat[0])
      );
      setTotalServices(
        response?.data?.reduce((total, o) => total + Number(o.revenue), 0)
      );

      setServices([
        ...response?.data?.map((o) => {
          return {
            ...o,
            category: "service",
          };
        }),
      ]);
    };

    const getApiSalaryOfEmployeeByMonthYear = async () => {
      const response = await getSalaryOfEmployeeByMonthYear(
        token,
        branchId,
        Number(dateFormat[1]),
        Number(dateFormat[0])
      );
      setTotalEmployees(
        response?.data?.reduce(
          (total, o) => total + Number(o.salary) + Number(o.commissions),
          0
        )
      );
      setEmployees([
        ...response?.data?.map((o) => {
          return {
            ...o,
            name: o.fullName,
            revenue: Number(o.salary) + Number(o.commissions),
            category: "employee",
          };
        }),
      ]);
    };

    const getApiExpenseByMonthYear = async () => {
      const response = await getExpenseByMonthYear(
        branchId,
        Number(dateFormat[1]),
        Number(dateFormat[0])
      );
      setTotalExpenses(
        response?.data?.reduce((total, o) => total + Number(o.revenue), 0)
      );
      setProduct([
        ...response?.data?.map((o) => {
          return {
            ...o,
            category: "product",
          };
        }),
      ]);
    };

    getApiRevenueOfServiceByDate();
    getApiSalaryOfEmployeeByMonthYear();
    getApiExpenseByMonthYear();
  }, [branchId, selectedDate]);

  const exportToExcel = () => {
    const currentMonth = dayjs().format('MM');
    const currentYear = dayjs().format('YYYY');
    const currentDateTime = dayjs().format('DD/MM/YYYY HH:mm:ss');
    const dateExport = [{"ID":`Ngày xuất báo cáo: ${currentDateTime}`}] 

    const serviceData = services.map(service => ({
        "ID": service.id,
        "Tên dịch vụ": service.name,
        "Doanh thu": service.revenue,
        "Số lượt thực hiện": service.quantities,
        "Danh mục": service.category
    }));

    const mostUsedService = services.reduce((prev, current) => {
        return (Number(prev.quantities) > Number(current.quantities)) ? prev : current;
    });

    const highestRevenueService = services.reduce((prev, current) => {
        return (Number(prev.revenue) > Number(current.revenue)) ? prev : current;
    });

    const summaryData = [
        {
            "ID": mostUsedService.id,
            "Tên dịch vụ": mostUsedService.name,
            "Doanh thu": mostUsedService.revenue,
            "Số lượt thực hiện": mostUsedService.quantities,
            "Danh mục": "Dịch vụ ưa dùng nhất"
        },
        {
            "ID": highestRevenueService.id,
            "Tên dịch vụ": highestRevenueService.name,
            "Doanh thu": highestRevenueService.revenue,
            "Số lượt thực hiện": highestRevenueService.quantities,
            "Danh mục": "Dịch vụ đem lại doanh thu cao nhất"
        }
    ];

    const finalServiceData = [...serviceData,[], ...summaryData,[], ...dateExport];

    const employeeData = employees.map(employee => ({
        "ID": employee.id,
        "Tên nhân viên": employee.fullName,
        "Chức vụ": employee.role,
        "Giờ làm": employee.hours,
        "Mức lương": employee.rates,
        "Hoa hồng": employee.commissions,
        "Tổng lương": employee.revenue,
        "Danh mục": employee.category
    }));

    const bestEmployee = employees.reduce((prev, current) => {
        return (Number(prev.hours) > Number(current.hours)) ? prev : current;
    });

    const employeeSummaryData = [
        {
            "ID": bestEmployee.id,
            "Tên nhân viên": bestEmployee.fullName,
        "Chức vụ": bestEmployee.role,
        "Giờ làm": bestEmployee.hours,
        "Mức lương": bestEmployee.rates,
        "Hoa hồng": bestEmployee.commissions,
        "Tổng lương": bestEmployee.revenue,
            "Danh mục": "Nhân viên xuất sắc của tháng"
        }
    ];

    const finalEmployeeData = [...employeeData,[], ...employeeSummaryData,[],...dateExport];

    const productData = products.map(product => ({
        "ID": product.id,
        "Tên sản phẩm": product.name,
        "Doanh thu": product.revenue,
        "Số lượng": product.quantities,
        "Danh mục": product.category
    }));

    const bestSellingProduct = products.reduce((prev, current) => {
        return (Number(prev.quantities) > Number(current.quantities)) ? prev : current;
    });

    const highestRevenueProduct = products.reduce((prev, current) => {
        return (Number(prev.revenue) > Number(current.revenue)) ? prev : current;
    });

    const productSummaryData = [
        {
            "ID": bestSellingProduct.id,
            "Tên sản phẩm": bestSellingProduct.name,
            "Doanh thu": bestSellingProduct.revenue,
            "Số lượng": bestSellingProduct.quantities,
            "Danh mục": "Sản phẩm bán chạy nhất"
        },
        {
            "ID": highestRevenueProduct.id,
            "Tên sản phẩm": highestRevenueProduct.name,
            "Doanh thu": highestRevenueProduct.revenue,
            "Số lượng": highestRevenueProduct.quantities,
            "Danh mục": "Sản phẩm đem lại doanh thu cao nhất"
        }
    ];


    const finalProductData = [...productData,[], ...productSummaryData,[], ...dateExport];

    const serviceWorksheet = XLSX.utils.json_to_sheet(finalServiceData);
    const employeeWorksheet = XLSX.utils.json_to_sheet(finalEmployeeData);
    const productWorksheet = XLSX.utils.json_to_sheet(finalProductData);


    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, serviceWorksheet, "Thống kê dịch vụ");
    XLSX.utils.book_append_sheet(workbook, employeeWorksheet, "Thống kê nhân viên");
    XLSX.utils.book_append_sheet(workbook, productWorksheet, "Thống kê sản phẩm");

    const fileName = `bao_cao_thong_ke_${currentMonth}_${currentYear}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const exportToPDF = () => {
    const currentMonth = dayjs().format('MM');
    const currentYear = dayjs().format('YYYY');
    const currentDateTime = dayjs().format('DD/MM/YYYY HH:mm:ss');
    const doc = new jsPDF();
    doc.setFont("Roboto-Black", "normal");
    doc.setFontSize(20);
    doc.text(`Báo cáo thống kê: ${currentMonth}/${currentYear}`, 70, 22);
    doc.setFontSize(18);
    doc.text("\n\nThống kê dịch vụ", 14, 22);

    // Tính toán các giá trị cần thiết
    const mostUsedService = services.reduce((prev, current) => {
      return (Number(prev.quantities) > Number(current.quantities)) ? prev : current;
  });

  const highestRevenueService = services.reduce((prev, current) => {
      return (Number(prev.revenue) > Number(current.revenue)) ? prev : current;
  });

    const bestEmployee = employees.reduce((prev, current) => {
      return (Number(prev.hours) > Number(current.hours)) ? prev : current;
  });

    const bestSellingProduct = products.reduce((prev, current) => {
      return (Number(prev.quantities) > Number(current.quantities)) ? prev : current;
  });

  const highestRevenueProduct = products.reduce((prev, current) => {
      return (Number(prev.revenue) > Number(current.revenue)) ? prev : current;
  });
  const totalRevenue = services.reduce((sum, service) => sum + Number(service.revenue), 0);
  const totalServiceQuantity = services.reduce((sum, service) => sum + Number(service.quantities), 0);


    // Dữ liệu cho bảng dịch vụ
    const tableData = services.map(service => [
        service.id,
        service.name,
        service.revenue,
        service.quantities,
        service.category
    ]);

    const summaryData = [
      [
        '','Tổng cộng:',totalRevenue.toLocaleString(),totalServiceQuantity,''
      ],
      [
          mostUsedService.id,
          mostUsedService.name,
          mostUsedService.revenue,
          mostUsedService.quantities,
           "Dịch vụ ưa dùng nhất"
      ],
      [
          highestRevenueService.id,
          highestRevenueService.name,
          highestRevenueService.revenue,
          highestRevenueService.quantities,
          "Dịch vụ đem lại doanh thu cao nhất"
      ]
  ];
    
    const finalServiceData = [...tableData,...summaryData]
    // Xuất bảng dịch vụ
    autoTable(doc, {
        head: [['ID', 'Tên dịch vụ', 'Doanh thu', 'Số lượng', 'Danh mục']],
        body: finalServiceData,
        startY: 40,
        styles: { font: "Roboto-Black" },
        didParseCell: (data) => {
          if (data.row.index >= tableData.length) { 
              data.cell.styles.fillColor = [255, 223, 186]; 
              data.cell.styles.textColor = [0, 0, 0]; 
          }
      }
    });

    // Thêm trang mới cho bảng nhân viên
    doc.addPage();
    doc.setFontSize(18);
    doc.text("Thống kê nhân viên", 14, 22);

    // Dữ liệu cho bảng nhân viên
    const tableEmployeeData = employees.map(emp => [
        emp.id,
        emp.fullName,
        emp.role,
        emp.hours,
        emp.rates,
        emp.commissions,
        emp.revenue,
        emp.category
    ]);
    const totalEmployeeRevenue = employees.reduce((sum, emp) => sum + Number(emp.revenue), 0);

    const employeeSummaryData = [['','Tổng cộng:','','','','',totalEmployeeRevenue.toLocaleString()],
      [
          bestEmployee.id,
          bestEmployee.fullName,
      bestEmployee.role,
      bestEmployee.hours,
      bestEmployee.rates,
      bestEmployee.commissions,
      bestEmployee.revenue,
      "Nhân viên xuất sắc của tháng"
      ]
  ];
const finalEmployeeData = [...tableEmployeeData,...employeeSummaryData]
    // Xuất bảng nhân viên
    autoTable(doc, {
        head: [['ID', 'Tên nhân viên', 'Chức vụ', 'Giờ làm', 'Mức lương', 'Hoa hồng', 'Tổng lương', 'Danh mục']],
        body: finalEmployeeData,
        startY: 30,
        styles: { font: "Roboto-Black" },
        didParseCell: (data) => {
          if (data.row.index >= tableEmployeeData.length) { 
              data.cell.styles.fillColor = [255, 223, 186]; 
              data.cell.styles.textColor = [0, 0, 0]; 
          }
      }
    });

    // Thêm trang mới cho bảng sản phẩm
    doc.addPage();
    doc.setFontSize(18);
    doc.text("Thống kê sản phẩm", 14, 22);

    // Dữ liệu cho bảng sản phẩm
    const tableProductData = products.map(product => [
        product.id,
        product.name,
        product.revenue,
        product.quantities,
        product.category
    ]);
    const totalProductRevenue = products.reduce((sum, pro) => sum + Number(pro.revenue), 0);
    const totalProductQuantity = products.reduce((sum, pro) => sum + Number(pro.quantities), 0);

    const productSummaryData = [['','Tổng cộng:',totalProductRevenue.toLocaleString(),totalProductQuantity.toLocaleString()],
      [
          bestSellingProduct.id,
          bestSellingProduct.name,
          bestSellingProduct.revenue,
          bestSellingProduct.quantities,
          "Sản phẩm bán chạy nhất"
      ],
      [
          highestRevenueProduct.id,
          highestRevenueProduct.name,
           highestRevenueProduct.revenue,
          highestRevenueProduct.quantities,
          "Sản phẩm đem lại doanh thu cao nhất"
      ]
  ];
  const finalProductData = [...tableProductData,...productSummaryData]
    // Xuất bảng sản phẩm
    autoTable(doc, {
        head: [['ID', 'Tên sản phẩm', 'Doanh thu', 'Số lượng', 'Danh mục']],
        body: finalProductData,
        startY: 30,
        styles: { font: "Roboto-Black" },
        didParseCell: (data) => {
          if (data.row.index >= tableProductData.length) { 
              data.cell.styles.fillColor = [255, 223, 186]; 
              data.cell.styles.textColor = [0, 0, 0]; 
          }
      }
    });
    const dateExport = `Ngày xuất báo cáo: ${currentDateTime}`;
    doc.setFontSize(12);
    doc.text(dateExport, 14, doc.autoTable.previous.finalY + 30);
    doc.save(`bao_cao_thong_ke_${currentMonth}_${currentYear}.pdf`);
  };


  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-container">
          <DatePicker
            value={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            format="DD/MM/YYYY"
            allowClear={false}
          />
          <div className="btn-export">
            <Button className="export-excel" onClick={exportToExcel} icon={<RiFileExcel2Line />}>Xuất Excel</Button>
            <Button className="export-pdf" onClick={exportToPDF} icon={<GrDocumentPdf />}>Xuất PDF</Button>
          </div>
        </div>
        <div className="stat-card">
          <div className="statistic-basic">
            <div
              className="statistic-basic-content"
              style={{ backgroundColor: "#C280FF" }}
            >
              <span className="title-statsitic-basic">DỊCH VỤ</span>
              <span className="value-statistic-basic">
                {totalServices.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
            </div>
            <div
              className="statistic-basic-content"
              style={{ backgroundColor: "#FF9D9C" }}
            >
              <span className="title-statsitic-basic">NHÂN VIÊN</span>
              <span className="value-statistic-basic">
                {totalEmployees.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
            </div>
            <div
              className="statistic-basic-content"
              style={{ backgroundColor: "#FFC96C" }}
            >
              <span className="title-statsitic-basic">SẢN PHẨM</span>
              <span className="value-statistic-basic">
                {totalExpenses.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="chart-section">
        <h2>Thống Kê Dịch Vụ</h2>
        
        <BarCharts datas={services} />
      </div>

      <div className="chart-section">
        <h2>Thống Kê Nhân Viên</h2>
        <BarCharts datas={employees} />
      </div>

      <div className="chart-section">
        <h2>Thống Kê Sản Phẩm</h2>
        <BarCharts datas={products} />
      </div>
    </div>
  );
};

export default Dashboard;
