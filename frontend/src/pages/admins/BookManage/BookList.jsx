import classNames from "classnames/bind";
import styles from "./BookList.module.scss";

import { useEffect, useState, useRef } from "react";
import { Modal } from "react-bootstrap";
import ModalBookDetail from "./ModalBookDetail";

import { toast } from "react-toastify";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Space, Table, Button } from "antd";
import Highlighter from "react-highlight-words";
import ModalForm from "../../../components/ModalUpdateBook";
const cx = classNames.bind(styles);

import { FaPen } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { ApiBOOK } from "../../../services/BookService";
import Loading from "../../../components/LoadingComponent/Loading";
const BookList = () => {
  const token = localStorage.getItem("token");
  const [data, setData] = useState([]);
  const [page, setPage] = useState(10);

  const [request, setRequest] = useState({
    limit: 80,
    page: 0,
    sort: "createdAt",
  });

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [addModal, setAddModal] = useState(false);

  const [IdDelete, setIdDelete] = useState();
  const [bookNameDelete, setBookNameDelete] = useState("")
  const [reload, setReload] = useState(false);

  const [selectedRow, setSelectedRow] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteManyModal, setShowDeleteManyModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalUp, setShowModalUp] = useState(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [IsLoad, setIsLoad] = useState(false);

  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const getAll = async () => {
    setIsLoad(true);
    const res = await ApiBOOK.getAllBook(
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
  useEffect(() => {
    const fetchData = async () => {
      await getAll();
    };

    fetchData();
  }, [selectedRow, reload]);
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
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
    {
      title: "STT",
      dataIndex: "stt",
      defaultSortOrder: "stt",
      sorter: (a, b) => b.stt - a.stt,
      ...getColumnSearchProps("stt"),
    },
    {
      title: "Mã sách",
      dataIndex: "bookId",
      showSorterTooltip: {
        target: "full-header",
      },

      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend"],
      render: (_, record) => {
        return (
          <>
            <span
              className="cursor-pointer"
              onClick={() => handleDetail(record)}
            >
              {record.bookId}
            </span>
          </>
        );
      },
    },

    {
      title: "Tên sách",
      dataIndex: "name",
      showSorterTooltip: {
        target: "full-header",
      },
      filters: [],
      // specify the condition of filtering result
      // here is that finding the name started with `value`
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend"],
      ...getColumnSearchProps("name"),
      render: (_, record) => {
        return (
          <>
            <span
              className="cursor-pointer"
              onClick={() => handleDetail(record)}
            >
              {record.name}
            </span>
          </>
        );
      },
    },
    {
      title: "Thể loại",
      dataIndex: "categoryName",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.categoryName - b.categoryName,
      ...getColumnSearchProps("categoryName"),
    },
    {
      title: "Tổng số lượng",
      dataIndex: "quantityTotal",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.quantityTotal - b.quantityTotal,
    },
    {
      title: "Số lượng sẵn có",
      dataIndex: "quantityAvailable",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.quantityAvailable - b.quantityAvailable,
    },
    {
      title: "Hình ảnh",
      dataIndex: "coverImg",
      render: (_, record) => {
        return (
          <div className={cx("image-cell")}>
            <img width="45px" height="60px" src={record.coverImg} alt="" />
          </div>
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
                  onClick={() => handleDelete1(record._id, record.name)}
                  className="text-lg"
                />
              </span>
            </div>
          </>
        );
      },
    },
  ];
  const dataTable = data?.map((book, index) => {
    return { ...book, key: book._id, stt: index + 1 };
  });

  const handleDetail = (book) => {
    setSelectedRow(book);
    setShowModal(true);
  };
  const handleEdit = (book) => {
    setSelectedRow(book);
    setShowModalUp(true);
  };
  const handleDelete1 = async (id, name) => {
    setShowDeleteModal(!showDeleteModal);
    setIdDelete(id);
    setBookNameDelete(name)
  };
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleCloseModalUP = () => {
    setShowModalUp(false);
  };
  const handleCloseModalAdd = () => {
    setAddModal(false);
  };
  const handleSave = () => {
    setShowModalUp(false);
    setAddModal(false);

    getAll();
    setReload(!reload);
  };
  const handleDelete = () => {
    ApiBOOK.DeleteBook(IdDelete, token)
      .then((res) => {
        if (res) {
          toast.success("Xóa sách thành công");
          setIdDelete(null);
          setShowDeleteModal(false);
          setReload(!reload);
        }
      })
      .catch((error) => {
        console.error("Error deleting book:", error);
        toast.error("Xóa sách thất bại");
      });
  };
  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleCloseDeleteManyModal = () => setShowDeleteManyModal(false);
  const handleShowAdd = () => {
    setAddModal(true);
  };

  const handleDeleteMany = async () => {
    console.log(selectedRowKeys);
    const ids = [...selectedRowKeys];
    const res = await ApiBOOK.DeleteManyBook(ids, token);
    setReload(!reload);
    selectedRowKeys.length = 0;

    if (res) {
      toast.success("Xóa thành công");
    }
  };
  return (
    <>
      <div className={cx("wrap")}>
        <div className={cx("topBar")}>
          <Button onClick={handleShowAdd} type="primary">
            Thêm sách
          </Button>
          {selectedRowKeys.length >= 2 && (
            <>
              <Button onClick={() => setShowDeleteManyModal(true)} danger>
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
          />
        </Loading>

        <Modal show={showDeleteManyModal} onHide={handleCloseDeleteManyModal}>
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận xóa</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Bạn chắc chắn muốn xóa {selectedRowKeys.length} sách?
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="primary"
              onClick={handleCloseDeleteManyModal}
            >
              Hủy
            </Button>
            <Button type="primary" danger onClick={handleDeleteMany}>
              Xóa
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận xóa</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Bạn chắc chắn muốn xóa sách: {bookNameDelete}
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="primary"
              onClick={handleCloseDeleteModal}
            >
              Hủy
            </Button>
            <Button type="primary" danger onClick={handleDelete}>
              Xóa
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Chi tiết sách</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ModalBookDetail book={selectedRow} />
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

        <ModalForm
          visible={showModalUp}
          onCancel={handleCloseModalUP}
          onSave={handleSave}
          book={selectedRow}
        />
        <ModalForm
          visible={addModal}
          onCancel={handleCloseModalAdd}
          onSave={handleSave}
        />
      </div>
    </>
  );
};

export default BookList;
