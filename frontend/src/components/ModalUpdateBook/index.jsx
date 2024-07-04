import { useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, Button, Select } from "antd";
import { toast } from "react-toastify";

import UploadImage from "../Upload/UploadImage";
import { ApiBOOK } from "../../services/BookService";
const { Option } = Select;
const { TextArea } = Input;
const ModalForm = ({ visible, onCancel, onSave, book }) => {
  const token = localStorage.getItem('token')
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(book ? book.coverImg : "");
  const [categories, setCategories] = useState([]);
  const [ortherCategory, setOrtherCategory] = useState("")
  const [isOrtherCate, setIsOrtherCate] = useState(false)

  useEffect(() => {
    getAllCate();
    if (book) {
      form.setFieldsValue(book);
      setImageUrl(book.coverImg);
      setIsOrtherCate(false);
    } else {
      form.resetFields();
      setImageUrl("");
      setIsOrtherCate(false);
    }
  }, [book, form]);
  const getAllCate = async () => {
    const res = await ApiBOOK.getAllCate();
    setCategories(res.data);
  };
  const handleSave = () => {
    form
      .validateFields()
      .then(async (values) => {
        values.coverImg = imageUrl; // Include the updated image URL
        console.log("ảnh", values.coverImg);
        if (isOrtherCate) {
          values.categoryName = ortherCategory
        }
        onSave(values);
        console.log("có book chưa", book)
        let res = {};
        if (book) {
          res = await ApiBOOK.UpdateBook(book._id, values, token)
            .then((res) => {
              if (res.status === "OK") {
                toast.success("Update thành công");
              } else {
                toast.error(res.message)
              }
            });
        } else {
          console.log("tạo", values);
          res = await ApiBOOK.AddBook(values, token).then((res) => {
            console.log('kết quả tạo', res)
            if (res.status === "OK") {
              toast.success("Tạo thành công");
            } else {
              toast.error(res.message);
            }
          });
        }

        form.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleUploadComplete = (url) => {
    setImageUrl(url);
    console.log("upload ảnh chưa", url)
  };

  const handleCategoryChange = (value) => {
    if (value === "orther") {
      setIsOrtherCate(true);
      form.setFieldsValue({ categoryName: "" });
    } else {
      setIsOrtherCate(false);
    }
  };

  return (
    <Modal
      open={visible}
      title={book ? "Edit Book" : "Add Book"}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSave}>
          Save
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" name="bookForm">
        <Form.Item
          name="bookId"
          label="Mã sách"
          rules={[{ required: true, message: "Please input the book ID!" }]}
        >
          <Input disabled={!!book} />
        </Form.Item>
        <Form.Item
          name="name"
          label="Tên sách"
          rules={[{ required: true, message: "Please input the book name!" }]}
        >
          <Input />
        </Form.Item>
        {!book && (
          <>
            <Form.Item
              name="author"
              label="Tác giả"
              rules={[
                { required: true, message: "Please input the author name!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="publisher"
              label="Nhà xuất bản"
              rules={[
                { required: true, message: "Please input the publisher name!" },
              ]}
            >
              <Input />
            </Form.Item>
          </>
        )}
        <Form.Item label="Mô tả" name="description">
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="categoryName"
          label="Thể loại"
          rules={[
            { required: true, message: "Please input the category name!" },
          ]}
        >
          <Select
            placeholder="Select a category"
            onChange={handleCategoryChange}
          >
            {categories.map((category) => (
              <Option key={category._id} value={category.categoryName}>
                {category.categoryName}
              </Option>
            ))}
            <Option key='orther' value='orther'>Khác</Option>
          </Select>
        </Form.Item>
        {isOrtherCate && (
          <Form.Item
            name="categoryName"
            label="Thể loại khác"
            rules={[
              { required: true, message: "Please input the orther category!" },
            ]}
          >
            <Input
              value={ortherCategory}
              onChange={(e) => setOrtherCategory(e.target.value)}
            />
          </Form.Item>
        )}
        <Form.Item
          name="quantityTotal"
          label="Tổng số lượng"
          rules={[
            { required: true, message: "Please input the total quantity!" },
          ]}
        >
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item
          name="quantityAvailable"
          label="Số lượng sẵn có"
          rules={[
            { required: true, message: "Please input the available quantity!" },
          ]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          name="coverImg"
          label="Hình ảnh"
          rules={[
            { required: book, message: "Please upload the cover image!" },
          ]}
        >
          <UploadImage onUploadComplete={handleUploadComplete} />
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Cover"
              style={{
                width: "30%",
                height: "30%",
                marginTop: "10px",
                marginLeft: "35%",
                objectFit: "contain",
              }}
            />
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalForm;
