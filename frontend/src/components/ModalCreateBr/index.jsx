import React, { useEffect, useState, useContext } from "react";
import { Modal, Button, Form, Input, AutoComplete } from "antd";
import { ApiBOOK } from "../../services/BookService";
import { createBorrowerSlip } from "../../services/OffBorrowerSlipService";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

const ModalCreateUpdateBorrowerSlip = ({
  visible,
  onCancel,
  onSave,
  initialData,
}) => {
  const [form] = Form.useForm();
  const [options, setOptions] = useState([]);
  const [reload, setReload] = useState(false);

  const { user, token } = useContext(AuthContext);

  const [request, setRequest] = useState({
    limit: 20,
    page: 0,
    sort: "quantityTotal",
    search: "",
  });
  const handleChangeInput = async (vl) => {
    setFinal(vl);
    setAutoCompleteValue(vl);
  };
  const [autoCompleteValue, setAutoCompleteValue] = useState("");
  const [FinalValue, setFinal] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await ApiBOOK.getAllBook(request);
        const bookOptions = res.data.map((book) => ({ value: book.bookId }));
        setOptions(bookOptions);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      }
    };

    fetchBooks();

    if (initialData) {
      form.setFieldsValue({
        ...initialData,
        bookIds: initialData.bookIds ? initialData.bookIds.join(", ") : "",
      });
    } else {
      form.resetFields();
    }
  }, [form, initialData, reload]);

  const handleSave = () => {
    form.validateFields().then(async (values) => {
      values.bookIds = values.bookIds.split(",").map((id) => id.trim());
      values.totalAmount = values.bookIds.length;
      if (values.totalAmount > 3) {
        toast.error("không thể mượn đồng thời nhiều hơn 3")
        return
      }
      onSave(values);
      await createBorrowerSlip(token, values).then((res) => {
        //console.log(res);
        if (res.status !== "OK") {
          toast.error(res.message);
          setReload(!reload);
        } else {
          toast.success("Tạo phiếu mượn thành công");
        }
      });
      form.resetFields();
    });
  };

  const handleBookIdsChange = () => {
    const bookIds = form.getFieldValue("bookIds");
    if (bookIds) {
      const bookIdArray = bookIds.split(",").map((id) => id.trim());
      const totalAmount = bookIdArray.length;
      form.setFieldsValue({ totalAmount });
    } else {
      form.setFieldsValue({ totalAmount: 0 });
    }
  };

  const handleSearch = (value) => {
    setRequest((prevRequest) => ({
      ...prevRequest,
      search: value,
    }));
    console.log(value);
    setAutoCompleteValue(value);
    setFinal(value);
  };

  const handleAddBookId = () => {
    const currentBookIds = form.getFieldValue("bookIds");
    const newBookIds = currentBookIds
      ? `${currentBookIds}, ${FinalValue}`
      : FinalValue;
    form.setFieldsValue({ bookIds: newBookIds });
    handleBookIdsChange();
    setAutoCompleteValue(""); // Reset AutoComplete
  };

  return (
    <Modal
      open={visible}
      title={initialData ? "Cập nhật phiếu mượn" : "Tạo phiếu mượn mới"}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSave}>
          Lưu
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Tên người mượn"
          rules={[{ required: true, message: "Vui lòng nhập tên người mượn!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phoneNumber"
          label="Số điện thoại"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Thêm ID sách">
          <AutoComplete
            style={{ width: 200 }}
            options={options}
            placeholder="Nhập ID sách"
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
            onSearch={handleSearch}
            value={autoCompleteValue}
            onChange={handleChangeInput}
          />
          <Button onClick={handleAddBookId} style={{ marginLeft: 8 }}>
            Thêm
          </Button>
        </Form.Item>
        <Form.Item
          name="bookIds"
          label="Danh sách ID sách"
          rules={[
            { required: true, message: "Vui lòng nhập danh sách ID sách!" },
          ]}
        >
          <Input onChange={handleBookIdsChange} />
        </Form.Item>
        <Form.Item name="totalAmount" label="Tổng số lượng">
          <Input readOnly />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCreateUpdateBorrowerSlip;
