import classNames from "classnames/bind";
import { useState, useRef, useEffect, useContext } from "react";
import styles from "./Orders.module.scss";

import { Button, Input, Space, Table, Flex, Tag, Form, Radio } from "antd";

import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { FaPen } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import {
  DeleteOrder,
  DeleteOrderMany,
  UpdateOrderStatus,
  getAllOrder,
} from "../../../services/OrderService";
import { AuthContext } from "../../../contexts/AuthContext";
import { getDetailsUser } from "../../../services/UserService";
import ModalOrderDetail from "./ModalOrderDetail";
import { Modal } from "react-bootstrap";
import { getDetailOrder } from "../../../services/OrderService";
import { toast } from "react-toastify";
import Loading from "../../../components/LoadingComponent/Loading";
const cx = classNames.bind(styles);

const Orders = () => {
  const { token } = useContext(AuthContext);

  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [order, setOrder] = useState({});
  const [showModalUpdate, setshowModalUpdate] = useState(false);
  const [showDeleteModal, setshowDeleteModal] = useState(false);
  const [IdDelete, setIdDelete] = useState();

  const [reload, setReload] = useState(false);
  const [page, setPage] = useState(10);

  const [defaultState, setdefaultState] = useState("pending");
  const [showDeleteModalMany, setShowDeleteModalMany] = useState(false);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [IsLoad, setIsLoad] = useState(false);

  const ListstateUpdate = [
    {
      name: "Pending",
      state: "pending",
    },
    {
      name: "Shipped",
      state: "shipped",
    },
    {
      name: "Returned",
      state: "returned",
    },
  ];
  const getAllData = async () => {
    setIsLoad(true);

    const res = await getAllOrder(token);
    const orders = res.data;
    const ordersWithUserDetails = await Promise.all(
      orders.map(async (order) => {
        const userDetails = await getDetailsUser(order.user, token);
        return { ...order, userDetails: userDetails?.data };
      })
    );
    if (res.data.length > 10) {
      setPage(res.data.length);
    }
    setData(ordersWithUserDetails);
    setIsLoad(false);
  };

  useEffect(() => {
    getAllData();
  }, [reload]);

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const dataTable = data.map((order, index) => ({
    ...order,
    key: order._id,
    stt: index + 1,
  }));

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
          newSelectedRowKeys = changeableRowKeys.filter(
            (_, index) => index % 2 === 0
          );
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: "even",
        text: "Select Even Row",
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter(
            (_, index) => index % 2 !== 0
          );
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleCloseDeleteModalMany = () => setShowDeleteModalMany(false);
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const handleDelete = async (id) => {
    setIdDelete(id);
    setshowDeleteModal(true);
  };
  const handleDeleteAccept = () => {
    DeleteOrder(token, IdDelete)
      .then((res) => {
        if (res.status === "OK") {
          toast.success("Xóa sản phẩm công");
          setIdDelete(null);
          setshowDeleteModal(false);
          setReload(!reload);
        } else {
          toast.error(res.message)
          setIdDelete(null);
          setshowDeleteModal(false);
        }
      })
      .catch((error) => {
        toast.error("Xóa sản phẩm thất bại");
      });
  };
  const handleEdit = async (src) => {
    setdefaultState(src.status);

    setshowModalUpdate(true);
    setOrder(src);
  };
  const handleCloseModal = async (src) => {
    setshowDeleteModal(false);
    setShowDetailModal(false);
    setshowModalUpdate(false);
  };
  const OpenModalDelMany = async () => {
    setShowDeleteModalMany(true);
  };

  const UpdateState = async () => {
    const body = {
      newStatus: defaultState,
    };

    UpdateOrderStatus(token, order._id, body).then((res) => {
      if (res) {
        if (res.status != "OK") {
          toast.error(res.message);
        } else {
          toast.success("Cập nhật thành công ");
        }
        setReload(!reload);
      } else {
        toast.error(res.message);
      }
    });
    setshowModalUpdate(false);
  };
  const handleViewDetail = async (id) => {
    const res = await getDetailOrder(token, id);
    console.log(res.data);
    setOrder(res.data);
    setShowDetailModal(true);
  };
  const handleDeleteMany = async () => {
    const ids = [...selectedRowKeys];
    const body = {
      ids: ids,
    };
    const res = await DeleteOrderMany(token, body);
    setReload(!reload);
    if (res.status === "OK") {
      toast.success("Xóa thành công");
      selectedRowKeys.length = 0;
    } else {
      toast.error(res.message)
    }
    setShowDeleteModalMany(false)
  };
  const onChange = (e) => {
    setdefaultState(e.target.value);
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button type="link" size="small" onClick={() => close()}>
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
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
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
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
      title: "Tên người nhận",
      render: (_, record) => {
        return (
          <span onClick={() => handleViewDetail(record._id)}>
            {record.userDetails?.name || "N/A"}
          </span>
        );
      },
    },
    {
      title: "SĐT",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      ...getColumnSearchProps("phoneNumber"),
      render: (_, record) => {
        return record.userDetails?.phoneNumber || "N/A";
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (_, record) => {
        return (
          <>
            {record.status === "pending" ? (
              <Tag color="orange">Pending</Tag>
            ) : record.status === "shipped" ? (
              <Tag color="green">Shipped</Tag>
            ) : (
              <Tag color="red">Returned</Tag>
            )}
          </>
        );
      },
    },
    {
      title: "Action",
      render: (_, record) => {
        return (
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
        );
      },
    },
  ];

  return (
    <>
      <div className={cx("wrap")}>
        <div className={cx("topBar")}>
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

        <Modal show={showDetailModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Xem chi tiết</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ModalOrderDetail order={order}></ModalOrderDetail>
          </Modal.Body>
        </Modal>

        <Modal show={showDeleteModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận xóa</Modal.Title>
          </Modal.Header>
          <Modal.Body>Bạn chắc chắn muốn xóa đơn này ?</Modal.Body>
          <Modal.Footer>
            <Button onClick={handleCloseModal}>
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

        <Modal show={showDeleteModalMany} onHide={handleCloseDeleteModalMany}>
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận xóa</Modal.Title>
          </Modal.Header>
          <Modal.Body>Bạn chắc chắn muốn xóa các đơn ?</Modal.Body>
          <Modal.Footer>
            <Button onClick={handleCloseDeleteModalMany}>
              Hủy
            </Button>
            <Button danger type="primary" onClick={handleDeleteMany}>
              Xóa
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default Orders;
