import React from 'react'
import sDashboard from '../../../DashboardPage.module.css'
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

interface pieData {
    id: number;
    value: number;
    label: string;
    color: string;
}

interface MainDisplayProps {
    transactions: Transactions[];
    isLoading: boolean;
    date: string;
    currency: string | undefined;
    pieData: pieData[];
    showModal: (item: Transactions) => void;
}

const emptyPiePlaceholder = [{ id: 0, value: 1, color: '#121212', label: '' }];

const MainDisplay: React.FC<MainDisplayProps> = ({transactions, isLoading, currency, pieData, showModal}) => {

    const getContrastColor = (hexColor: string): 'white' | 'black' => {
        const cleanHex = hexColor.replace('#','');

        const r = parseInt(cleanHex.substring(0,2),16);
        const g = parseInt(cleanHex.substring(2,4),16);
        const b = parseInt(cleanHex.substring(4,6),16);
        const yiq = (r * 299 + g * 587 + b * 114) / 1000;
        return yiq >= 128 ? 'black' : 'white';
    }

    const handleCurrencyFormatting = (balance: number, format: string) => {
        return  new Intl.NumberFormat(navigator.language, { style: "currency", currency: format, useGrouping: true }).format(balance)
    }

    return (
        <div className={`col-lg-6 d-flex flex-column text-white`}>
            <div className={`p-md-5 mb-3 mb-md-0`}>
                <PieChart
                    series={[
                        {
                            data: pieData.length > 0 ? pieData : emptyPiePlaceholder,
                            arcLabel: undefined,
                            valueFormatter: (obj) => handleCurrencyFormatting(obj.value, currency || 'PLN'),
                            highlightScope: { fade: 'global', highlight: 'item' },
                            faded: { innerRadius: 30, additionalRadius: -30, color: '#DEDEDE' },
                            
                            innerRadius: 30,
                            paddingAngle: 5,
                            cornerRadius: 5,
                        },
                    ]}
                    height={250}
                    margin={{bottom: 25}}
                    slotProps={{ 
                        legend: {
                            position: { vertical: 'bottom', horizontal: 'center' },
                            direction: 'row' as any,
                        },
                        tooltip: { trigger: pieData.length > 0 ? 'item' : 'none' }
                    }}
                    sx={{ 
                        "& .MuiChartsLegend-label": {
                             color: "#DEDEDE !important" 
                        },
                        "& text": {
                            color: "#DEDEDE !important",
                        } 
                    }}
                    />
            </div>
            <div className={`d-flex flex-column overflow-y-auto`} style={{maxHeight: '30rem'}}>
                {isLoading &&
                    <>
                        {isLoading && Array.from({length: 3}).map((_, index) => (
                            <div key={index} className={`my-1 half-blurred`}>
                                <div className={`py-2 px-3 rounded-5 d-flex align-items-center ${sDashboard.bgDarkAccent} border ${sDashboard.borderDarkEmphasis} ${sDashboard.shadowDark}`}>
                                    <span className={`me-2 half-blurred`}>
                                        <i className={`bi fs-5 bi-box-seam`}></i>
                                    </span> 
                                    <span className={`half-blurred`}>Placeholder</span> 
                                    <span className='fw-bold mx-2 half-blurred'>|</span> 
                                    <span className='half-blurred'>Placeholder</span>
                                    <span className={`ms-auto fw-bold half-blurred`}>00000.00 {currency}</span>
                                </div>
                            </div>
                        ))}
                    </>
                }

                {!isLoading && transactions.length > 0 &&
                    <>
                        {transactions.map((item) => (
                            <div key={item.transactionId} className={`my-1`}>
                                <button className={`btn w-100 py-2 px-3 rounded-5 d-flex align-items-center`} style={{backgroundColor: item.category.color, color: getContrastColor(item.category.color)}} onClick={() => showModal(item)}>
                                    <span className={`me-2`}>
                                        <i className={`bi fs-5 ${item.category.icon ? item.category.icon : 'bi-box-seam'}`}></i>
                                    </span> 
                                    <span className='row'>
                                        <div className='col-auto'>
                                            <span className={`text-start fw-bold`}>{item.category.name}</span> 
                                        </div>
                                        {item.description && 
                                            <div className='col-auto'>
                                                <span>{item.description}</span>
                                            </div>
                                        }
                                    </span>
                                    <span className={`ms-auto fw-bold`}>{handleCurrencyFormatting(item.amount, currency || 'PLN')}</span>                    
                                </button>
                            </div>
                        ))}
                    </>
                }
                {!isLoading && transactions.length === 0 &&
                    <>
                        <div className={`${sDashboard.textDarkPrimary}`}>
                            Brak danych z tego okresu
                        </div>
                    </>
                }
            </div>
        </div>
    );
};

export default MainDisplay;