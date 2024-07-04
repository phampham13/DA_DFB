import classNames from "classnames/bind";
import styles from "../BookManage/BookList.module.scss";
import { useEffect, useState, useRef, useContext } from "react";
import { ApiProduct } from "../../../services/ProductService";
import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Input,
  Space,
  Table,
  Flex,
  Tag,
  Form,
  Radio,
  DatePicker,
} from "antd";
import Highlighter from "react-highlight-words";
import { FaPen } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { Modal } from "react-bootstrap";
import { getAll } from "../../../services/OffBorrowerSlipService";
import { AuthContext } from "../../../contexts/AuthContext";
import moment from "moment";
import { toast } from "react-toastify";
import { DeleteBr } from "../../../services/OffBorrowerSlipService";
import { DeleteManyBr } from "../../../services/OffBorrowerSlipService";
import ModalCreateUpdateBorrowerSlip from "../../../components/ModalCreateBr";
import ModalDetailBr from "../../../components/ModalDetailBr";
import { getDetailBr } from "../../../services/OffBorrowerSlipService";
import { UpdateBr } from "../../../services/OffBorrowerSlipService";
import Loading from "../../../components/LoadingComponent/Loading";
const cx = classNames.bind(styles);
const { RangePicker } = DatePicker;
const OffBorrowerSlip = () => {
  const [data, setData] = useState([]);

  const [defaultState, setdefaultState] = useState(0);
  const [selectedRow, setSelectedRow] = useState([]);

  const [datasrc, setDatasrc] = useState({});
  const [showModal, setShowModal] = useState(false);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [IsLoad, setIsLoad] = useState(false);

  const [IdDelete, setIdDelete] = useState();

  const ListstateUpdate = [
    {
      name: "Đang mượn",
      state: 1,
    },
    {
      name: "Đã trả",
      state: 2,
    },
    {
      name: "Quá hạn",
      state: 3,
    },
  ];

  const { user, token } = useContext(AuthContext);
  const [request, setRequest] = useState({
    limit: 10,
    page: 0,
    sort: "price",
  });
  const getAllData = async () => {
    setIsLoad(true);

    const res = await getAll(token);
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
  const [showDeleteModalMany, setShowDeleteModalMany] = useState(false);
  const [page, setPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      await getAllData();
    };

    fetchData();
  }, [selectedRow, reload]);
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
  const handleViewDetail = async (id) => {
    setSelectedRow(id);

    const res = await getDetailBr(token, id);
    setDatasrc(res.data);
    console.log(res.data);
    setShowDetailModal(true);
  };
  const handleCloseModal = () => {
    setshowModalUpdate(false);
    setShowModal(false);
  };
  const handleCloseModalAdd = () => {
    setAddModal(false);
  };
  const handleSave = async () => {
    const fetchBooks = async () => {
      try {
        setAddModal(false);
        setTimeout(() => {
          const res = getAll(token).then((res) => {
            setData(res.data);
            setSelectedRow(res.data);
            setReload(!reload);
          });
        }, 3000);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      }
    };

    fetchBooks();
  };
  const handleEdit = async (src) => {
    // setProduct(res.data);

    setDatasrc(src);
    setdefaultState(src.state);
    setshowModalUpdate(true);
  };

  const handleDelete = async (id) => {
    setShowDeleteModal(!showDeleteModal);
    setIdDelete(id);
  };
  const handleDeleteAccept = () => {
    DeleteBr(token, IdDelete)
      .then((res) => {
        if (res.status != "OK") {
          toast.error(res.message);
        }
        toast.success("Xóa thẻ mượn thành công công");
        setIdDelete(null);
        setShowDeleteModal(false);
        setReload(!reload);
      })
      .catch((error) => {
        toast.error("Xóa thẻ mượn thất bại");
      });
  };
  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleCloseDeleteModalMany = () => setShowDeleteModalMany(false);
  const handleCloseModalDetail = () => setShowDetailModal(false);
  const onChange = (e) => {
    setdefaultState(e.target.value);
  };
  const handleDeleteMany = async () => {
    const ids = [...selectedRowKeys];

    const res = await DeleteManyBr(token, ids);
    setReload(!reload);
    if (res) {
      toast.success("Xóa thành công");
      selectedRowKeys.length = 0;
      setShowDeleteModalMany(false);
    }
  };
  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const UpdateState = async () => {
    const body = {
      newState: defaultState,
    };
    await UpdateBr(token, datasrc._id, body).then((res) => {
      if (res) {
        if (res.status != "OK") {
          toast.error(res.message);
        } else {
          toast.success("Cập nhật thành công ");
        }
        setReload(!reload);
      } else {
        toast.error("Hành động thất bại");
      }
    });
    handleCloseModal()
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
      title: "Tên bạn đọc",
      dataIndex: "name",
      key: "name",
      width: "20%",
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
      title: "SĐT",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      ...getColumnSearchProps("phoneNumber"),
    },
    {
      title: "Tổng số lượng",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: "20%",
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      sortDirections: ["descend", "ascend"],
      ...getColumnSearchProps("totalAmount"),
    },
    {
      title: "Hạn trả",
      dataIndex: "dueDate",

      render: (_, record) => {
        return (
          <>
            <p>{moment(record.dueDate).format("DD/MM/YYYY")}</p>
          </>
        );
      },
    },
    {
      title: "Ngày mượn",
      dataIndex: "createdAt",
      ...getColumnSearchProps("createdAt"),
      render: (_, record) => {
        return (
          <>
            <p>{moment(record.createdAt).format("DD/MM/YYYY")}</p>
          </>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "state",

      render: (_, record) => {
        return (
          <>
            {record.state === 1 ? (
              <div>
                {" "}
                <Tag color="orange">Đang mượn</Tag>
              </div>
            ) : record.state === 2 ? (
              <Tag color="green">Đã trả</Tag>
            ) : (
              <Tag color="red">Quá hạn</Tag>
            )}
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

  const OpenModalDelMany = async () => {
    setShowDeleteModalMany(true);
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
  const handleDateChange = (dates, dateStrings) => {
    // dates: [moment, moment]
    // dateStrings: ["YYYY-MM-DD", "YYYY-MM-DD"]
    console.log(dates, dateStrings);
    const [startDate, endDate] = dateStrings;

    if (startDate && endDate) {
      const filteredData = data.filter((item) => {
        const itemDate = moment(item.createdAt, moment.ISO_8601).format(
          "YYYY-MM-DD"
        );
        return itemDate >= startDate && itemDate <= endDate;
      });
      setData(filteredData);
    } else {
      setReload(!reload); // reset to original data if no date range selected
    }
  };

  return (
    <>
      <div className={cx("wrap")}>
        <div className={cx("topBar")}>
          <Space
            direction="vertical"
            style={{ marginBottom: 16, marginRight: 16 }}
          >
            <RangePicker onChange={handleDateChange} />
          </Space>

          <Button onClick={handleShowAdd} type="primary">
            Thêm phiếu mượn
          </Button>
          <p></p>
          {selectedRowKeys.length >= 2 && (
            <>
              <Button onClick={OpenModalDelMany} danger>
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

      <Modal show={showModalUpdate} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Xác thay đổi trạng thái</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Radio.Group
              defaultValue={defaultState}
              onChange={onChange}
              style={{ padding: "15px" }}
            >
              {ListstateUpdate.map((item) => (
                <Radio key={item.state} value={item.state}>
                  {item.name}
                </Radio>
              ))}
            </Radio.Group>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Space>
            <Button onClick={UpdateState} type="primary">
              Cập nhật
            </Button>
            <Button htmlType="reset" onClick={handleCloseModal}>
              Hủy
            </Button>
          </Space>
        </Modal.Footer>
      </Modal>

      <Modal show={showDetailModal} onHide={handleCloseModalDetail} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Xem chi tiết</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ModalDetailBr datasrc={datasrc} />
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn chắc chắn muốn xóa phiếu mượn này ?</Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCloseDeleteModal}>
            Hủy
          </Button>
          <Button danger type="primary" onClick={handleDeleteAccept}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModalMany} onHide={handleCloseDeleteModalMany}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn chắc chắn muốn xóa ?</Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCloseDeleteModalMany}>
            Hủy
          </Button>
          <Button danger type="primary" onClick={handleDeleteMany}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>

      {/*<Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết phiếu mượn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div></div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className={cx("btn-close-modal")}
            style={{ backgroundColor: "#36a2eb" }}
            onClick={handleCloseModal}
          >
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>*/}

      <ModalCreateUpdateBorrowerSlip
        visible={addModal}
        onCancel={handleCloseModalAdd}
        onSave={handleSave}
      />
    </>
  );
};

export default OffBorrowerSlip;
