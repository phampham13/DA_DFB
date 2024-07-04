import classNames from "classnames/bind";
import styles from "../BookManage/BookList.module.scss";
import { useEffect, useState, useRef } from "react";
import { ApiProduct } from "../../../services/ProductService";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table } from "antd";
import Highlighter from "react-highlight-words";
import { FaPen } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { Modal } from "react-bootstrap";
import ModalProduct from "./ModalHandmade";
import ModalFormProduct from "../../../components/ModalUpdateCreateProduct";
import { toast } from "react-toastify";
import Loading from "../../../components/LoadingComponent/Loading";
const cx = classNames.bind(styles);

const Products = () => {
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

    const res = await ApiProduct.getAllProduct(
      request.limit,
      request.page,
      request.sort
    );
    if (res.data.length > 10) {
      setPage(res.data.length);
    }
    setData(res.data);
    setIsLoad(false);
  };

  const dataTable = data?.map((product, index) => {
    return { ...product, key: product._id, stt: index + 1 };
  });
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
    console.log(res.data);
    setShowModal(true);
  };
  const handleCloseModal = async () => {
    setShowModal(false);
  };
  const handleCloseModalAdd = () => {
    setAddModal(false);
  };
  const handleSave = () => {
    setReload(!reload);

    setShowModalUp(false);
    setAddModal(false);
    setshowModalUpdate(false);
    getAllProduct();
  };
  const handleEdit = async (product) => {
    const res = await ApiProduct.getDetailProduct(product._id);
    setProduct(res.data);
    setshowModalUpdate(true);
  };
  const handleCloseModalUP = () => {
    setshowModalUpdate(false);
  };
  const handleDelete = async (id) => {
    setShowDeleteModal(!showDeleteModal);
    setIdDelete(id);
  };
  const handleDeleteAccept = async () => {
    await ApiProduct.deleteProduct(IdDelete, token)
      .then((res) => {
        if (res.status === "OK") {
          toast.success("Xóa sản phẩm công");
          setIdDelete(null);
          setShowDeleteModal(false);
          setReload(!reload);
        } else {
          toast.error(res.message)
          setIdDelete(null);
          setShowDeleteModal(false);
        }
      })
      .catch((error) => {
        toast.error("Xóa sản phẩm thất bại");
      });
  };
  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleDeleteMany = async () => {
    const ids = [...selectedRowKeys];
    const body = {
      ids: ids,
    };
    const res = await ApiProduct.deleteProductmany(body, token);
    if (res.status === "OK") {
      toast.success("Xóa thành công");
      setReload(!reload);
    } else {
      toast.error(res.message)
    }
    selectedRowKeys.length = 0;
  };

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
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "30%",
      ...getColumnSearchProps("name"),
      render: (_, record) => {
        return (
          <>
            <span onClick={() => handleViewDetail(record._id)}>
              {record.name}
            </span>
          </>
        );
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      ...getColumnSearchProps("quantity"),
      sorter: (a, b) => a.quantity - b.quantity,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: "20%",
      sorter: (a, b) => a.price - b.price,
      sortDirections: ["descend", "ascend"],
      ...getColumnSearchProps("price"),
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "address",
      render: (_, record) => {
        return (
          <>
            <img src={record.image} width="50px" height="50px" alt="" />
          </>
        );
      },
    },
    {
      title: "Action",
      render: (_, record) => {
        return (
          <>
            <div className="flex justify-between">
              <span className={cx("editbtn")}>
                <FaPen
                  onClick={() => handleEdit(record)}
                  className="text-lg cursor-pointer"
                />
              </span>
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
  return (
    <>
      <div className={cx("wrap")}>
        <div className={cx("topBar")}>
          <Button onClick={handleShowAdd} type="primary">
            Thêm sản phẩm
          </Button>
          <p></p>
          {selectedRowKeys.length >= 2 && (
            <>
              <Button onClick={handleDeleteMany} danger>
                Xóa tất cả
              </Button>
            </>
          )}
        </div>
        <Loading isLoading={IsLoad}>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={dataTable}
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

        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận xóa</Modal.Title>
          </Modal.Header>
          <Modal.Body>Bạn chắc chắn muốn xóa sản phẩm này ?</Modal.Body>
          <Modal.Footer>
            <Button onClick={handleCloseDeleteModal}>
              Hủy
            </Button>
            <Button
              danger
              type="primary"
              onClick={handleDeleteAccept}
            >
              Xóa
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Chi tiết sản phẩm</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ModalProduct product={product} />
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="primary"
              onClick={handleCloseModal}
            >
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>

        <ModalFormProduct
          visible={showModalUpdate}
          onCancel={handleCloseModalUP}
          onSave={handleSave}
          product={product}
        />
        <ModalFormProduct
          visible={addModal}
          onCancel={handleCloseModalAdd}
          onSave={handleSave}
        />
      </div>
    </>
  );
};

export default Products;
