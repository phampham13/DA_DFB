import classNames from 'classnames/bind';
import styles from './Statistics.module.scss';
import { DatePicker, Tabs } from 'antd';
import dayjs from 'dayjs';
import numeral from 'numeral';
import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { MonthlySalesChart, BorrowerSlipChart, OffBorrowerSlipChart, PenaltyChart, OffPenaltyChart } from '../../../components/Charts/Charts';
import { borrowerSlipStatistic } from '../../../services/BorrowerSlipService';
import { offBorrowerSlipStatistic } from '../../../services/OffBorrowerSlipService';
import { revenueStatistic } from '../../../services/OrderService';

const cx = classNames.bind(styles);

const Statistics = () => {
    const { user, token } = useContext(AuthContext);
    const [year, setYear] = useState(dayjs().year());
    const [salesData, setSalesData] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0)
    const [penaltyFee, setPenaltyFee] = useState({})
    const [offPenaltyFee, setOffPenaltyFee] = useState({})
    const [bSlip, setBSlip] = useState({});
    const [offBSlip, setOffBSlip] = useState({});

    const handleYearChange = (date, dateString) => {
        setYear(date.year());
        console.log(date.year());
    };

    useEffect(() => {
        const fetchSalesData = async () => {
            const res = await revenueStatistic(token, year)
            console.log(res)
            setSalesData(res.data.monthlyRevenueStats);
            setTotalRevenue(res.data.totalRevenue)
        };

        const fetchBorrowerData = async () => {
            const res1 = await borrowerSlipStatistic(token, year)

            const res2 = await offBorrowerSlipStatistic(token, year)

            setBSlip(res1.data1);
            setPenaltyFee(res1.data2);
            setOffBSlip(res2.data1);
            setOffPenaltyFee(res2.data2)
        };

        fetchSalesData();
        fetchBorrowerData();
    }, [year, token]);

    const tabItems = [
        {
            key: '1',
            label: 'Thống kê doanh thu',
            children: <div className={cx("chart-container")}>
                <div className={cx("about")}>
                    <p style={{ fontWeight: 600 }}>Doanh thu năm {year}: <span>{(() => {
                        return totalRevenue >= 1000000 ? `${(totalRevenue / 1000000).toFixed(2)}Triệu` : `${numeral(totalRevenue).format('0,0')}đ`;
                    })()}</span></p>
                </div>
                <MonthlySalesChart data={salesData} nameChart="doanh thu" />
            </div>,
        },
        {
            key: '2',
            label: 'Thống kê mượn trả',
            children: (
                <div className={cx("chart-area")}>
                    <div className={cx("chart-container")}>
                        <h5>Mượn trực tiếp</h5>
                        <div className={cx("about")}>
                            <p>Tổng phiếu: <span>{bSlip.totalBorrowerSlip}</span></p>
                            <p>Tổng sách: <span>{bSlip.totalBorrowedBook}</span></p>
                        </div>
                        <BorrowerSlipChart data={bSlip.monthlySlipStats} />
                    </div>
                    <div className={cx("chart-container")}>
                        <h5>Mượn online</h5>
                        <div className={cx("about")}>

                            <p>Tổng phiếu: <span>{offBSlip.totalBorrowerSlip}</span></p>
                            <p>Tổng sách: <span>{offBSlip.totalBorrowedBook}</span></p>
                        </div>
                        <OffBorrowerSlipChart data={offBSlip.monthlySlipStats} />
                    </div>
                </div>
            ),
        },
        {
            key: '3',
            label: 'Thống kê phí phạt',
            children: (
                <div className={cx("chart-area")}>
                    <div className={cx("chart-container")}>
                        <h5>Mượn trực tiếp</h5>
                        <div className={cx("about")}>
                            <p>Tổng phí phạt: <span>{penaltyFee.totalLateFee}</span></p>
                            <p>Tổng phí phạt đã nộp: <span>{penaltyFee.totalPaidLateFee}</span></p>
                        </div>
                        <OffPenaltyChart data={penaltyFee.monthlyPenalty} />
                    </div>
                    <div className={cx("chart-container")}>
                        <h5>Mượn online</h5>
                        <div className={cx("about")}>

                            <p>Tổng phí phạt: <span>{offPenaltyFee.totalLateFee}</span></p>
                            <p>Tổng phí phạt đã nộp: <span>{offPenaltyFee.totalPaidLateFee}</span></p>
                        </div>
                        <PenaltyChart data={offPenaltyFee.monthlyPenalty} />
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div className={cx("wrapper")}>
            Chọn năm:
            <DatePicker
                picker="year"
                defaultValue={dayjs()}
                onChange={handleYearChange}
                className={cx("year-picker")}
            />
            <Tabs items={tabItems} className={cx("tab")} />
        </div>
    );
};

export default Statistics;

