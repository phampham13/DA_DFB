import classNames from "classnames/bind";
import styles from "../BookManage/BookList.module.scss";
import { useEffect, useState, useRef, useContext } from "react";
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
import ModalCreateUpdateBorrowerSlip from "../../../components/ModalCreateBr";
import ModalDetailBr from "../../../components/ModalDetailBr";
import { getDetailBr } from "../../../services/OffBorrowerSlipService";
import { UpdateBr } from "../../../services/OffBorrowerSlipService";
import {
  DeleteManySlipOn,
  DeleteSlipOn,
  GetAllSlipOn,
  GetDetailSlipOn,
  UpdateSlipOn,
} from "../../../services/BorrowerSlipService";
import { getDetailsUser } from "../../../services/UserService";
import ModalDetail from "../../../components/ModalBrSlipDetail/ModalDetail";
import Loading from "../../../components/LoadingComponent/Loading";
const cx = classNames.bind(styles);
const { RangePicker } = DatePicker;
const OnBorrowerSlip = () => {
  const [data, setData] = useState([]);

  const [defaultState, setdefaultState] = useState(0);
  const [lateFee, setLateFee] = useState("");

  const [selectedRow, setSelectedRow] = useState([]);

  const [datasrc, setDatasrc] = useState({});
  const [showModal, setShowModal] = useState(false);

  const [showInput, setshowInput] = useState(false);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [IsLoad, setIsLoad] = useState(false);

  const [IdDelete, setIdDelete] = useState();
  const ListstateUpdate = [
    {
      name: "Đang chờ",
      state: 0,
    },
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
    sort: "createdAt",
  });
  const getAllData = async () => {
    setIsLoad(true);

    const res = await GetAllSlipOn(token);
    const orders = res.data;
    const ordersWithUserDetails = await Promise.all(
      orders.map(async (order) => {
        const userDetails = await getDetailsUser(order.userId, token);
        return { ...order, userDetails: userDetails?.data };
      })
    );
    setData(ordersWithUserDetails);
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

  useEffect(() => {
    const fetchData = async () => {
      await getAllData();
    };

    fetchData();
  }, [selectedRow, reload]);
  /*const handleSearch = (selectedKeys, confirm, dataIndex) => {
    if (dataIndex === "dueDate") {
      const dateOutput = moment(selectedKeys[0], "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      );
      setSearchText(dateOutput);
    } else {
      setSearchText(selectedKeys[0]);
    }
    setSearchedColumn(dataIndex);
  };*/

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const handleViewDetail = async (id) => {
    setSelectedRow(id);

    const res = await GetDetailSlipOn(token, id);
    const user = await getDetailsUser(res.data.userId, token);
    const response = { ...res.data, userId: user.data };
    setDatasrc(response);
    setShowDetailModal(true);
  };
  const handleCloseModal = async () => {
    setshowModalUpdate(false);
    setShowModal(false);
    setshowInput(false);
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
    console.log("handle edit", src);

    setDatasrc(src);
    setdefaultState(src.state);
    setshowModalUpdate(true);
  };

  const handleDelete = async (id) => {
    setShowDeleteModal(!showDeleteModal);
    setIdDelete(id);
  };
  const handleDeleteAccept = () => {
    DeleteSlipOn(token, IdDelete)
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
    if (e.target.value === 2 && datasrc.state === 3) {
      setshowInput(true);
    } else {
      setshowInput(false);
    }
  };
  const handleDeleteMany = async () => {
    const ids = [...selectedRowKeys];
    const body = {
      ids: ids,
    };

    const res = await DeleteManySlipOn(token, body);

    if (res.status === "OK") {
      toast.success("Xóa thành công");
      selectedRowKeys.length = 0;
      setReload(!reload);
    } else {
      toast.error(res.message)
    }
    setShowDeleteModalMany(false);
  };
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const UpdateState = async () => {
    let body = {};
    if (showInput === true) {
      body = {
        newState: defaultState,
        lateFee: lateFee,
      };
    } else {
      body = {
        newState: defaultState,
      };
    }
    await UpdateSlipOn(token, datasrc._id, body).then((res) => {
      if (res) {
        if (res.status != "OK") {
          toast.error(res.message);
        } else {
          toast.success("Cập nhật thành công ");
        }
        setReload(!reload);
        handleCloseModal();
      } else {
        toast.error("Hành động thất bại");
      }
    });
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
      record[dataIndex[0]][dataIndex[1]]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
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
      title: "Tên người dùng",
      dataIndex: ['userDetails', 'name'],
      key: "name",
      width: "20%",
      ...getColumnSearchProps(['userDetails', 'name']),
      render: (_, record) => {
        return (
          <span onClick={() => handleViewDetail(record._id)}>
            {record.userDetails?.name || "N/A"}
          </span>
        );
      },
    },
    {
      title: "SĐT người dùng",
      dataIndex: ['userDetails', 'phoneNumber'],
      key: "phoneNumber",
      ...getColumnSearchProps(['userDetails', 'phoneNumber']),
      render: (_, record) => {
        return <span>{record.userDetails?.phoneNumber || "N/A"}</span>;
      },
    },
    {
      title: "Tổng số lượng",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: "20%",
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Hạn trả",
      dataIndex: "dueDate",
      //...getColumnSearchProps("dueDate"),
      render: (_, record) => {
        return (
          <>
            <p>{moment(record.dueDate).format("DD/MM/YYYY")}</p>
          </>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      //...getColumnSearchProps("createdAt"),
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
      filters: [
        { text: "Đang chờ", value: "Đang chờ" },
        { text: "Đang mượn", value: "Đang mượn" },
        { text: "Đã trả", value: "Đã trả" },
        { text: "Quá hạn", value: "Quá hạn" },
      ],
      onFilter: (value, record) => {
        const state = record.state;
        if (value === "Đang chờ") {
          return state === 0;
        } else if (value === "Đang mượn") {
          return state === 1;
        } else if (value === "Đã trả") {
          return state === 2;
        } else if (value === "Quá hạn") {
          return state === 3;
        }
        return true; // Không filter nếu không có giá trị filter nào được chọn
      },

      render: (_, record) => {
        return (
          <>
            {record.state === 1 ? (
              <div>
                {" "}
                <Tag color="green">Đang mượn</Tag>
              </div>
            ) : record.state === 2 ? (
              <Tag color="blue">Đã trả</Tag>
            ) : record.state === 3 ? (
              <Tag color="red">Quá hạn</Tag>
            ) : (
              <div>
                <Tag color="yellow">Đang chờ</Tag>
              </div>
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
  const handleChange = (event) => {
    setLateFee(event.target.value);
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
          <Flex gap="middle" align="start" vertical>
            <Space direction="vertical" style={{ marginBottom: 16 }}>
              <RangePicker onChange={handleDateChange} />
            </Space>
          </Flex>
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
              {ListstateUpdate.filter((item) => item.state !== 0).map(
                (item) => (
                  <Radio key={item.state} value={item.state}>
                    {item.name}
                  </Radio>
                )
              )}
            </Radio.Group>
            {showInput == true && (
              <div>
                <label htmlFor="lateFeeInput">Phí phạt trả muộn:</label>
                <input
                  type="text"
                  id="lateFeeInput"
                  value={lateFee}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Space>
            <Button onClick={UpdateState} type="primary">
              Cập nhật
            </Button>
            <Button onClick={handleCloseModal} htmlType="reset">
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
          <ModalDetail brSlip={datasrc}></ModalDetail>
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

      {/*<Modal show={showModal} onHide={handleCloseModal} size='xl'>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết phiếu mượn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div></div>
        </Modal.Body>
        <Modal.Footer>
          <Button
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

export default OnBorrowerSlip;
