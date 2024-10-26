import React from "react";
import { Button, Select, Skeleton, Table } from "antd";
import { Option } from "antd/es/mentions";
import { TableProps } from "antd/es/table";
import { MdDeleteForever, MdLabelImportantOutline } from "react-icons/md";
import { TiExportOutline, TiPlusOutline } from "react-icons/ti";
import '../styles.scss';

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
  const displayedColumns = columns.filter((column) =>
    selectedColumns.includes(column.key)
  );

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
              <Option key="all" value="all">All</Option>
              {columns.map((column) => (
                <Option key={column.key} value={column.key}>
                  {column.title}
                </Option>
              ))}
            </Select>
          </div>
          <div className="btn">
            <Button icon={<MdLabelImportantOutline />}>Nhập dữ liệu</Button>
            <Button icon={<TiExportOutline />}>Xuất dữ liệu</Button>
          </div>
        </div>
          <Table
            columns={displayedColumns}
            dataSource={data}
            rowKey="id"
            loading={loading}
            scroll={{ y: 370 }}
            {...tableProps}
          />
    </>
  );
};

export default DataTable;
