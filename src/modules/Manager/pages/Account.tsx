import { Button } from 'antd';
import Search from 'antd/es/input/Search';
import React, { useState } from 'react'
import { TiPlusOutline } from 'react-icons/ti';
import '../styles.scss'

const Account = () => {
  const [searchText, setSearchText] = useState("");

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
      };
  return (
    <div className='manage-account'>
        <div className='header-container'>
        <Search
          placeholder="Search products"
          onChange={handleSearchChange}
          className="ant-input-search"
          size="large"
        />
        <Button
          type="primary"
          icon={<TiPlusOutline />}
          size="large"
        >
          Add Product
        </Button>
        </div>
    </div>
  )
}

export default Account;