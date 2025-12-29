import React, { useEffect } from 'react'
import s from './MainDisplay.module.css'
import { PieChart } from '@mui/x-charts/PieChart';

interface KeyWords {
    wordId: number;
    word: string;
}

interface Category {
    categoryId: number;
    name: string;
    color: string;
    type: string;
    limitAmount: number;
    icon: string;
    keyWords: KeyWords[];
}

interface Transactions {
    transactionId: number;
    amount: number;
    description: string;
    date: Date;
    type: string;
    category: Category;
}

interface MainDisplayProps {
    transactions: Transactions[];
    isLoading: boolean;
    date: string;
    currency: string | undefined;
}

const dryData = [
  { id: 0, value: 400, label: 'Jedzenie', color: '#ff5733' },
  { id: 1, value: 200, label: 'Paliwo', color: '#33ff57' },
  { id: 2, value: 150, label: 'Rozrywka', color: '#3357ff' },
];

const MainDisplay: React.FC<MainDisplayProps> = ({transactions, isLoading, date, currency}) => {

    const getContrastColor = (hexColor: string): 'white' | 'black' => {
        const cleanHex = hexColor.replace('#','');

        const r = parseInt(cleanHex.substring(0,2),16);
        const g = parseInt(cleanHex.substring(2,4),16);
        const b = parseInt(cleanHex.substring(4,6),16);
        const yiq = (r * 299 + g * 587 + b * 114) / 1000;
        return yiq >= 128 ? 'black' : 'white';
    }


    return (
        <div className={`col-md-6 d-flex flex-column text-white`}>
            <div className={`border-bottom`}>
                {/* <i className="bi bi-pie-chart display-1"></i> */}
                <PieChart
                    series={[
                        {
                        data: dryData,
                        innerRadius: 30,
                        paddingAngle: 5,
                        cornerRadius: 5,
                        }
                    ]}
                    height={250}
                    width={200}
                    sx={{ 
                        "& .MuiChartsLegend-label": {
                             color: "white !important" 
                        },
                        "& text": {
                            color: "white !important",
                        } 
                    }}
                />
            </div>
            <div className={`border-bottom d-flex flex-column overflow-y-auto`} style={{maxHeight: '30rem'}}>
                {transactions.map((item, index) => (
                    <div key={item.transactionId} className={`my-1`}>
                        <div className={`py-2 px-3 rounded-5 d-flex align-items-center`} style={{backgroundColor: item.category.color, color: getContrastColor(item.category.color)}}>
                            <span className={`me-2`}>
                                <i className={`bi fs-5 ${item.category.icon ? item.category.icon : 'bi-box-seam'}`}></i>
                                </span> <span className={``}>{item.category.name}</span> 
                                {item.description && 
                                    <>
                                        <span className='fw-bold mx-2'>|</span> 
                                        <span>{item.description}</span>
                                    </>
                                }
                                <span className={`ms-auto fw-bold`}>{item.amount} {currency}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MainDisplay;