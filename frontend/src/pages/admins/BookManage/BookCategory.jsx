import classNames from "classnames/bind";
import styles from "../BookManage/BookList.module.scss";
import React, { useEffect, useState, useRef, useContext } from "react";
import { ApiProduct } from "../../../services/ProductService";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, Form } from "antd";
import Highlighter from "react-highlight-words";
import { FaPen } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { Modal } from "react-bootstrap";

import ModalFormProduct from "../../../components/ModalUpdateCreateProduct";
import { toast } from "react-toastify";
import Loading from "../../../components/LoadingComponent/Loading";
import { cateAPI } from "../../../services/CategoryService";
const cx = classNames.bind(styles);
const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};
const BookCategory = () => {
  const token = localStorage.getItem("token");
  const [data, setData] = useState([]);
  const [product, setProduct] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [IdDelete, setIdDelete] = useState();
  const [page, setPage] = useState(10);
  const [IsLoad, setIsLoad] = useState(false);

  const [request, setRequest] = useState({
    limit: 40,
    page: 0,
    sort: "price",
  });
  const getAllProduct = async () => {
    setIsLoad(true);

    const res = await cateAPI.getAllCate();
    if (res.data.length > 10) {
      setPage(res.data.length);
    }
    setData(res.data);

    setIsLoad(false);
    const dataTable = res.data?.map((product, index) => ({
      ...product,
      key: product._id,
      stt: index + 1,
    }));
    setDataSource(dataTable);
  };

  const [dataSource, setDataSource] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [addModal, setAddModal] = useState(false);
  const [reload, setReload] = useState(false);
  const [showModalUp, setShowModalUp] = useState(false);
  const [showModalUpdate, setshowModalUpdate] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  useEffect(() => {
    getAllProduct();
  }, [product, reload]);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleShowAdd = () => {
    setAddModal(true);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };
  const handleViewDetail = async (id) => {
    const res = await ApiProduct.getDetailProduct(id);
    setProduct(res.data);

    setShowModal(true);
  };
  const handleCloseModal = async () => {
    setAddModal(false);
    setShowModal(false);
  };
  const handleCloseModalAdd = () => {
    setAddModal(false);
  };

  const handleEdit = async (product) => {
    const res = await ApiProduct.getDetailProduct(product._id);
    setProduct(res.data);
    setshowModalUpdate(true);
  };

  const handleDelete = async (id) => {
    setShowDeleteModal(!showDeleteModal);
    setIdDelete(id);
  };
  const handleDeleteAccept = async () => {
    await cateAPI
      .DeleteCates(IdDelete, token)
      .then((res) => {
        if (res.status === "OK") {
          toast.success("Xóa sản phẩm công");
          setIdDelete(null);
          setShowDeleteModal(false);
          setReload(!reload);
        } else {
          toast.error(res.message);
          setIdDelete(null);
          setShowDeleteModal(false);
        }
      })
      .catch((error) => {
        toast.error("Xóa sản phẩm thất bại");
      });
  };
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    Table.SELECTION_COLUMN,
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
    },

    {
      title: "Tên thể loại",
      dataIndex: "categoryName",
      key: "categoryName",
      width: "30%",
      editable: true,
      ...getColumnSearchProps("categoryName"),
      render: (_, record) => {
        return <>{record.categoryName}</>;
      },
    },
    {
      title: "Số sách",
      dataIndex: "bookCount",
      key: "bookCount",
      ...getColumnSearchProps("bookCount"),
      sorter: (a, b) => a.bookCount - b.bookCount,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Tổng số lượng",
      dataIndex: "totalBooks",
      key: "totalBooks",
      width: "20%",
      sorter: (a, b) => a.totalBooks - b.totalBooks,
      sortDirections: ["descend", "ascend"],
      ...getColumnSearchProps("totalBooks"),
    },
    {
      title: "Sẵn có",
      dataIndex: "availableBooks",
      key: "availableBooks",
      sorter: (a, b) => a.availableBooks - b.availableBooks,
      sortDirections: ["descend", "ascend"],
      ...getColumnSearchProps("availableBooks"),
    },
    {
      title: "Action",
      render: (_, record) => {
        return (
          <>
            <div className="flex justify-between">
              <span className={cx("colortext")}>
                <AiFillDelete
                  onClick={() => handleDelete(record._id)}
                  className="text-lg"
                />
              </span>
            </div>
          </>
        );
      },
    },
  ];
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: "odd",
        text: "Select Odd Row",
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: "even",
        text: "Select Even Row",
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };

  const handleSave = (row) => {
    console.log(row);
    try {
      const up = cateAPI
        .UpdateCate(row._id, row.categoryName, token)
        .then((res) => {
          if (res.data.status !== "ERR") {
            toast.success("Cập nhật thành công");
          } else {
            toast.error(res.data?.message);
          }
        });
    } catch (error) {
      toast.error("có lỗi sảy ra");
    }

    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const handleAddCate = () => {
    try {
      cateAPI.CreateCate(data, token).then((res) => {
        if (res.data.status !== "ERR") {
          toast.success("Thêm thành công");
          setReload(!reload);
          setAddModal(false);
        } else {
          toast.error(res.data.message);
        }
      });
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    }
  };
  const columnFinal = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });
  const HandleAdd = (e) => {
    setData(e.target?.value);
  };
  return (
    <>
      <div className={cx("wrap")}>
        <div className={cx("topBar")}>
          <Button onClick={handleShowAdd} type="primary">
            Thêm thể loại sách
          </Button>
        </div>
        <Loading isLoading={IsLoad}>
          <Table
            components={components}
            rowSelection={rowSelection}
            columns={columnFinal}
            rowClassName={() => "editable-row"}
            bordered
            dataSource={dataSource}
            onChange={onChange}
            pagination={{
              pageSize: 10,
              total: page,
            }}
            showSorterTooltip={{
              target: "sorter-icon",
            }}
          />
        </Loading>
      </div>
      <Modal show={addModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Thêm thể loại</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label htmlFor="">Tên thể loại</label>
          <Input placeholder="Thể loại" variant="filled" onChange={HandleAdd} />
        </Modal.Body>
        <Modal.Footer>
          <Button type="primary" onClick={handleAddCate}>
            Thêm
          </Button>
          <Button danger type="primary" onClick={handleCloseModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn chắc chắn thể loại này ?</Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCloseDeleteModal}>Hủy</Button>
          <Button danger type="primary" onClick={handleDeleteAccept}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BookCategory;
