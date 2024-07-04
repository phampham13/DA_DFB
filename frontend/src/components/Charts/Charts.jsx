import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import numeral from 'numeral';

const MonthlySalesChart = ({ data, nameChart }) => {
    const customTooltipFormatter = (revenue, name, props) => {
        return numeral(revenue).format('0,0');
    };

    return (
        <ResponsiveContainer width="100%" height={500} minWidth={400} minHeight={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis
                    tickFormatter={(revenue) =>
                        revenue >= 1000000 ? `${(revenue / 1000000).toFixed(2)}Tr` : `${numeral(revenue).format('0,0')}đ`
                    }
                />
                <Tooltip formatter={(revenue) => numeral(revenue).format('0,0')} />
                <Legend />
                <Bar dataKey="revenue" fill="#ffc658" name={`Tổng ${nameChart} theo tháng`} />
            </BarChart>
        </ResponsiveContainer>
    );
};

const BorrowerSlipChart = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={300} minWidth={400} minHeight={300}>
            <BarChart
                data={data}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pending" stackId="a" fill="#ffc658" />
                <Bar dataKey="borowing" stackId="a" fill="#59f061" />
                <Bar dataKey="returned" stackId="a" fill="#42adf5" />
                <Bar dataKey="overdue" stackId="a" fill="#f05959" />
            </BarChart>
        </ResponsiveContainer>
    );
};

const OffBorrowerSlipChart = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={300} minWidth={400} minHeight={300}>
            <BarChart
                data={data}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="borowing" stackId="a" fill="#59f061" />
                <Bar dataKey="returned" stackId="a" fill="#42adf5" />
                <Bar dataKey="overdue" stackId="a" fill="#f05959" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export { MonthlySalesChart, BorrowerSlipChart, OffBorrowerSlipChart };
