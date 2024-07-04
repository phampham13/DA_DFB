import classNames from "classnames/bind";
import styles from "./BorrowerList.module.scss";
import { useEffect, useState, useRef } from "react";
import { ApiProduct } from "../../../services/ProductService";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, Flex, Popconfirm } from "antd";
import Highlighter from "react-highlight-words";
import { FaPen } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { Modal } from "react-bootstrap";

import { toast } from "react-toastify";
import { ApiUserBr } from "../../../services/UserBrrowers";
import Loading from "../../../components/LoadingComponent/Loading";

const cx = classNames.bind(styles);

const BorrowerList = () => {
  const token = localStorage.getItem("token");
  const [data, setData] = useState([]);
  const [product, setProduct] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [IdDelete, setIdDelete] = useState();
  const [IsLoad, setIsLoad] = useState(false);

  const [request, setRequest] = useState({
    limit: 10,
    page: 0,
    sort: "price",
  });
  const getAllData = async () => {
    setIsLoad(true);

    const res = await ApiUserBr.GetAll(token);
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
    getAllData();
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
    getAllData();
  };
  const handleEdit = async (userid, staterq) => {
    let body = {};
    if (staterq === 1) {
      body = {
        state: 0,
      };
    }
    if (staterq === 0) {
      body = {
        state: 1,
      };
    }
    const res = await ApiUserBr.UpdateState(userid, body, token);
    console.log("aa");
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
  const handleDeleteAccept = () => {
    ApiUserBr.DeleteUser(IdDelete, token)
      .then((res) => {
        if (res) {
          toast.success("Xóa tài khoản công");
          setIdDelete(null);
          setShowDeleteModal(false);
          setReload(!reload);
        }
      })
      .catch((error) => {
        toast.error("Xóa tài khoản thất bại");
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
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
    },

    {
      title: "Tên",
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
      title: "SĐT",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      ...getColumnSearchProps("quantity"),

      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "20%",

      sortDirections: ["descend", "ascend"],
      ...getColumnSearchProps("email"),
    },
    {
      title: "Tình trạng",
      dataIndex: "image",
      key: "address",
      render: (_, record) => {
        return (
          <>
            {record.state === 1 ? (
              <Flex align="center">
                <div className={cx("red-dot")}></div>
                <div className={cx("space-red")}>Bị chặn</div>
              </Flex>
            ) : (
              <Flex align="center">
                <div className={cx("green-dot")}></div>
                <div className={cx("space-green")}>Đang hoạt động</div>
              </Flex>
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
                <Popconfirm
                  placement="top"
                  title={
                    record.state === 1
                      ? `Bạn có muốn kích hoạt tài khoản ${record.name}`
                      : `Bạn có muốn khóa tài khoản ${record.name}`
                  }
                  description=""
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => handleEdit(record._id, record.state)}
                >
                  <Button className={cx("editbtn")}>
                    <FaPen className="text-lg cursor-pointer" />
                  </Button>
                </Popconfirm>
              </span>
              <Button className={cx("colortext")}>
                <AiFillDelete
                  onClick={() => handleDelete(record._id)}
                  className="text-lg"
                />
              </Button>
            </div>
          </>
        );
      },
    },
  ];
  //const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  /*const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };*/
  /*const rowSelection = {
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
  };*/
  return (
    <>
      <div className={cx("wrap")}>
        <div className={cx("topBar")} >
        </div>
        <Loading isLoading={IsLoad}>
          <Table
            //rowSelection={rowSelection}
            columns={columns}
            dataSource={dataTable}
          />
        </Loading>

        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận xóa</Modal.Title>
          </Modal.Header>
          <Modal.Body>Bạn chắc chắn muốn xóa tài khoản này ?</Modal.Body>
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

      </div>
    </>
  );
};

export default BorrowerList;
