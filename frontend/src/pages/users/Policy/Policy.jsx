import classNames from "classnames/bind";
import styles from "./Policy.module.scss";
import { CloseCircleTwoTone, CheckCircleTwoTone, SmileTwoTone } from "@ant-design/icons";

const cx = classNames.bind(styles);
const Policy = () => {
    return (
        <div className={cx("wrapper")}>
            <div className={cx('container')}>
                <div className={cx('header')} style={{ textAlign: 'center' }}>
                    <h3><strong>Quy định mượn trả sách tại D Free Book</strong></h3>

                </div>
                <div className={cx('content')}>
                    <div style={{ fontSize: 16 }}><CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 20, marginRight: 5 }} />
                        Mỗi bạn đọc mượn trực tiếp tại thư viện được mượn tối đa <b>3</b> cuốn sách, thời hạn mượn là <b>5</b> tuần (35 ngày) - KHÔNG GIA HẠN. Ngày trả được ghi tại trang sách cuối
                    </div>
                    <div><CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 20, marginRight: 5 }} />
                        Mỗi bạn đọc mượn qua web được mượn tối đa <b>5</b> cuốn sách, thời hạn mượn là <b>50 ngày</b> - KHÔNG GIA HẠN. Hạn trả được cập nhật trên web tại mục phiếu mượn và
                        được gửi qua email đăng kí tài khoản khi bạn tạo phiếu mượn thành công.
                    </div>
                    <div><CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 20, marginRight: 5 }} />
                        Một số sách của thư viện sẽ không được mượn mang về mà chỉ được đọc tại chỗ. Chúng được gắn mã dạng “DB-...”
                    </div>
                    <div><CloseCircleTwoTone twoToneColor="#eb2f96" style={{ fontSize: 20, marginRight: 5 }} />
                        Nếu cậu trả MUỘN hơn so với thời hạn sẽ bị phạt: (Tiền nộp phạt sẽ được đưa vào quỹ duy trì thư viện) <br />
                        <div style={{ paddingLeft: 40 }}>
                            - Dưới 15 ngày: 1k/ngày/quyển <br />
                            - Từ 15-50 ngày: 15k/quyển <br />
                            - Từ 50-100 ngày: 20k/quyển <br />
                            - Trên 100 ngày: 25k/quyển <br />
                        </div>
                        Trường hợp cậu làm mất hoặc làm hư hỏng sách đã mượn thì có thể bồi thường cho thư
                        viện bằng một cuốn sách tương đương hoặc cùng thể loại. Hoặc đóng phí phạt 50k/ quyển
                    </div>
                    <div><SmileTwoTone style={{ fontSize: 20, marginRight: 5 }} />
                        Cậu hãy trả sách đúng thời hạn, giữ gìn và bảo quản sách cẩn thận như những đứa con của mình nhé!<br />
                        Chúng mình vận hành thư viện miễn phí nên thứ ràng buộc duy nhất giữa D Free Book và bạn đọc chỉ có niềm tin.
                        Vì vậy, chúng mình rất hoan nghênh mọi bạn đọc ghé mượn sách và hy vọng các cậu sẽ chấp hành quy định để những cuốn sách được gìn giữ,
                        chuyền tay đến thật nhiều người nhé! D cảm ơn các cậu thật nhiều.
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Policy;