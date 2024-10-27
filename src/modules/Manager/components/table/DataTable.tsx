import React, { useEffect, useRef, useState } from "react";
import { Button, message, Select, Table } from "antd";
import { Option } from "antd/es/mentions";
import { TableProps } from "antd/es/table";
import { MdLabelImportantOutline } from "react-icons/md";
import { TiExportOutline } from "react-icons/ti";
import { saveAs } from "file-saver";
import "../../styles.scss";
import Papa from "papaparse";

interface DataTableProps<T> extends TableProps<T> {
  columns: any[];
  data: T[];
  loading: boolean;
  selectedColumns: string[];
  onColumnChange: (value: string[]) => void;
}

const DataTable = <T extends object>({
  columns,
  data,
  loading,
  selectedColumns,
  onColumnChange,
  ...tableProps
}: DataTableProps<T>) => {
  const [importedData, setImportedData] = useState<T[]>([]);
  const displayedColumns = columns.filter((column) =>
    selectedColumns.includes(column.key)
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem("importedData");
    if (storedData) {
      setImportedData([...JSON.parse(storedData), ...data]);
    } else {
      setImportedData(data);
    }
  }, [data]);

  // Hàm xử lý xuất dữ liệu
  const handleExport = () => {
    const csvData = data.map((row) =>
      displayedColumns
        .filter((col) => col.key !== "actions") 
        .map((col) => {
          const cellData = row[col.key];
          return cellData;
        })
        .join(",")
    );
  
    const csvContent = [
      displayedColumns
        .filter((col) => col.key !== "actions") 
        .map((col) => col.title)
        .join(","),
      ...csvData,
    ].join("\n");
  
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "exported_data.csv");
  };
  

  // Hàm xử lý nhập dữ liệu
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          console.log("Columns from Props:", columns); 
          console.log("Parsed Data from CSV:", result.data); 
  
          const columnKeyMapping: { [key: string]: string } = {
            "ID": "id",
            "Số điện thoại": "phone",
            "Loại": "type",
            "Trạng thái": "status",
          };
  
          const importedData = result.data.map((item: any) => {
            const rowData: { [key: string]: any } = {};
            columns.forEach((col) => {
            if (col.key !== 'actions') { 
              const csvKey = Object.keys(columnKeyMapping).find(
                (key) => columnKeyMapping[key] === col.key
              );
              rowData[col.key] = csvKey ? item[csvKey] || undefined : undefined;
            }
          });
            rowData.isNew = true;
            console.log("Mapped Row Data:", rowData); 
            return rowData;
          });
  
          let allValid = true;
          importedData.forEach((data, index) => {
            const errors: string[] = [];
            columns.forEach((col) => {
              if (!data[col.key] && col.key !== 'actions') {
                errors.push(`${col.title} is missing`);
              }
            });
  
            if (errors.length > 0) {
              allValid = false;
              message.error(`Row ${index + 1}: ${errors.join(", ")}`);
            }
          });
  
          if (!allValid) {
            return;
          }
  
          setImportedData([ ...importedData, ...data]);
          localStorage.setItem(
            "importedData",
            JSON.stringify(importedData)
          );
        },
      });
    }
  };
  
  
  
  
  

  return (
    <>
      <div className="feature">
        <div className="checkbox">
          <Select
            mode="multiple"
            className="column-select"
            value={selectedColumns.includes("all") ? ["all"] : selectedColumns}
            onChange={onColumnChange}
          >
            <Option key="all" value="all">
              All
            </Option>
            {columns.map((column) => (
              <Option key={column.key} value={column.key}>
                {column.title}
              </Option>
            ))}
          </Select>
        </div>
        <div className="btn">
          <Button
            icon={<MdLabelImportantOutline />}
            onClick={() => fileInputRef.current?.click()}
          >
            Nhập dữ liệu
          </Button>
          <Button icon={<TiExportOutline />} onClick={handleExport}>
            Xuất dữ liệu
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept=".csv"
            onChange={handleImport}
          />
        </div>
      </div>
      <Table
        columns={displayedColumns}
        dataSource={importedData}
        rowKey="id"
        loading={loading}
        scroll={{ y: 370 }}
        {...tableProps}
      />
    </>
  );
};

export default DataTable;
