import classNames from "classnames/bind";
import styles from "./Home.module.scss";
import Carousel from "react-bootstrap/Carousel";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

const Home = () => {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("introText")}>
        <h2>D Free Book</h2>
        <p> D Free Book được thành lập năm 2017 bởi Hoàng Quý Bình - cựu sinh viên Đại học Bách khoa Hà Nội.</p>
        <p>Với quan niệm <span>“Sách nằm im là sách chết”</span> và một sự quyết tâm làm sống lại văn hóa đọc trong cuộc sống hiện đại,
          từ tủ sách cá nhân Bình đã quyết định thành lập thư viện cộng đồng.
          Đến nay, sau một hành trình dài có sự đồng hành, chung sức của nhiều sự tử tế,
          thư viện hơn 10000 đầu sách - nơi mọi người ở mọi lứa tuổi có thể mượn sách hoàn toàn MIỄN PHÍ.
        </p>
        <p>D Free Book là thư viện 3 không:<span> không đặt cọc, không thu phí và không giới hạn đối tượng </span>.</p>
        <Link to='/policy'>Xem quy định mượn trả sách tại đây</Link>
        <p>D Free Book giờ đây không chỉ dừng lại ở việc cho mượn sách miễn phí trực tiếp mà còn triển khai cho mượn sách online;
          tình nguyện xây dựng tủ sách cho trẻ em ở vùng còn khó khăn và kết nối với các tổ chức về sách để tặng sách cho những nơi đang cần...
          Chúng mình hy vọng sẽ trở thành nơi trung chuyển để những cuốn sách - tri thức không chỉ còn nằm im trên giá. </p>
        <p><FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: 5, color: 'red', fontSize: '16' }} /><b>Địa chỉ:</b> <i>Số nhà 107 khu tập thể A5, ngách 27, ngõ 128C Đại La, Hà Nội</i></p>
      </div>
      <div className={cx("carousel-container")}>
        <Carousel className={cx("carousel")}>
          <Carousel.Item className={cx("item")} interval={2500}>
            <img
              src="../dfreeintro/dfreeintro.jpg"
              className={cx("ima")}
            ></img>
          </Carousel.Item>
          <Carousel.Item className={cx("item")} interval={1500}>
            <img
              src="../dfreeintro/dfreeintro2.jpg"
              className={cx("ima")}
            ></img>
            <Carousel.Caption>
              <p>Ngắm D Free Book từ đằng xa</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item className={cx("item")} interval={1500}>
            <img
              src="../dfreeintro/dfreeintro5.jpg"
              className={cx("ima")}
            ></img>
            <Carousel.Caption>
              <h3>Quan niệm của chúng mình:</h3>
              <p>
                Sách nằm in sách chết
              </p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item className={cx("item")} interval={1500}>
            <img
              src="../dfreeintro/dfreeintro4.jpg"
              className={cx("ima")}
            ></img>
            <Carousel.Caption>
              <h4>Góc nhỏ nhà D</h4>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item className={cx("item")} interval={1500}>
            <img
              src="../dfreeintro/dfreeintro7.jpg"
              className={cx("ima")}
            ></img>
            <Carousel.Caption>
              <h4>Góc nhỏ nhà D</h4>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item className={cx("item")} interval={1500}>
            <img
              src="../dfreeintro/dfreeintro10.jpg"
              className={cx("ima")}
            ></img>
            <Carousel.Caption>
              <h4>Góc nhỏ nhà D</h4>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item className={cx("item")} interval={1500}>
            <img
              src="../dfreeintro/dfreeintro11.jpg"
              className={cx("ima")}
            ></img>
            <Carousel.Caption>
              <h4>Góc nhỏ nhà D</h4>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
    </div>
  );
};

export default Home;
