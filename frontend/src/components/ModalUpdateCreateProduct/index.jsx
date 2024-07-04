import { useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, Button, Select } from "antd";
import { toast } from "react-toastify";

import UploadImage from "../Upload/UploadImage";
import { ApiProduct } from "../../services/ProductService";
const { Option } = Select;
const ModalFormProduct = ({ visible, onCancel, onSave, product }) => {
  const token = localStorage.getItem('token')
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(product ? product.coverImg : "");
  useEffect(() => {
    if (product) {
      console.log(product)
      form.setFieldsValue(product);
      setImageUrl(product.image);
    } else {
      form.resetFields();
      setImageUrl("");
    }
  }, [product, form]);

  const handleSave = () => {
    console.log(imageUrl);
    form
      .validateFields()
      .then(async (values) => {
        values.image = imageUrl; // Include the updated image URL
        onSave(values);
        let res = {};
        if (product) {
          res = await ApiProduct.updateProduct(product._id, values, token);
          if (res.status === "OK") {
            toast.success("Update thành công");
          } else {
            toast.error(res.message)
          }
        } else {
          console.log("tạo", values);
          res = await ApiProduct.addProduct(values, token);
          console.log("res", res)
          if (res.status === "OK") {
            toast.success("Tạo thành công");
          } else {
            toast.error(res.message)
          }
        }

        form.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleUploadComplete = (url) => {
    setImageUrl(url);
  };

  return (
    <Modal
      open={visible}
      title={product ? "Sửa sản phẩm" : "Thêm sản phẩm"}
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
      <Form form={form} layout="vertical" name="productForm">

        <Form.Item
          name="name"
          label="Tên sản phẩm"
          rules={[{ required: true, message: "Please input the product name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô tả sản phẩm"
        //rules={[{ required: true, message: "Please input the product name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="price"
          label="Giá"
          rules={[
            { required: true, message: "Please input the price!" },
          ]}
        >
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item
          name="quantity"
          label="Tổng số lượng"
          rules={[
            { required: true, message: "Please input the total quantity!" },
          ]}
        >
          <InputNumber min={1} />
        </Form.Item>


        <Form.Item
          name="image"
          label="Hình ảnh"
          rules={[
            { required: product, message: "Please upload the cover image!" },
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

export default ModalFormProduct;
