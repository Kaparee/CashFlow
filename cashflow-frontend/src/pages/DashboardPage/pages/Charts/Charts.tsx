import React, { useContext, useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import sDashboard from "../../DashboardPage.module.css";
import api from "../../../../api/api";
import { ToastContext } from "../../../../contexts/ToastContext";
import { useAccount } from "../../contexts/AccountContext";
import { format, subMonths } from 'date-fns';

interface BalanceData {
    monthNumber: number;
    totalExpenseAmount: number;
    totalIncomeAmount: number;
    balance: number;
}

interface CategoryData {
    categoryId: number;
    categoryName: string;
    color: string;
    totalValue: number;
    percentage: number;
}

interface DailyData {
    date: string;
    income: number;
    expense: number;
    balance: number;
}

const Charts: React.FC = () => {
    const { account } = useAccount();
    const { addToast } = useContext(ToastContext);
    const [balanceData, setBalanceData] = useState<BalanceData | null>(null);
    const [expenseCategories, setExpenseCategories] = useState<CategoryData[]>([]);
    const [incomeCategories, setIncomeCategories] = useState<CategoryData[]>([]);
    const [dailyData, setDailyData] = useState<DailyData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const getDefaultDates = () => {
        const today = new Date();
        const oneMonthAgo = subMonths(today, 1);
        
        return {
            start: format(oneMonthAgo, 'yyyy-MM-dd'),
            end: format(today, 'yyyy-MM-dd')
        };
    };
    
    const defaultDates = getDefaultDates();
    const [startDate, setStartDate] = useState<string>(defaultDates.start);
    const [endDate, setEndDate] = useState<string>(defaultDates.end);

    useEffect(() => {
        fetchData();
    }, [startDate, endDate]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const startDateTime = `${startDate}T00:00:00.000Z`;
            const endDateTime = `${endDate}T23:59:59.999Z`;

            const balanceResponse = await api.get(`balance-analytics?startDate=${startDateTime}&endDate=${endDateTime}`);
            setBalanceData(balanceResponse.data[0]);

            const expenseResponse = await api.get(
                `category-analytics?startDate=${startDateTime}&endDate=${endDateTime}&type=expense`
            );
            setExpenseCategories(expenseResponse.data);

            const incomeResponse = await api.get(
                `category-analytics?startDate=${startDateTime}&endDate=${endDateTime}&type=income`
            );
            setIncomeCategories(incomeResponse.data);

            const dailyResponse = await api.get(
                `daily-analytics?startDate=${startDateTime}&endDate=${endDateTime}`
            );
            setDailyData(dailyResponse.data);

            setIsLoading(false);
        } catch (error: any) {
            addToast('Nie udało się pobrać danych analitycznych', 'error');
            console.error("Error fetching data:", error);
            setIsLoading(false);
        }
    };

    const handleCurrencyFormatting = (balance: number, format: string) => {
        return new Intl.NumberFormat(navigator.language, { 
            style: "currency", 
            currency: format, 
            useGrouping: true 
        }).format(balance);
    };

    return (
        <div className={`w-100 h-100 d-flex flex-column align-items-center`}>
            <div className={`d-flex justify-content-between align-items-center w-75 px-4 py-4 mb-3 mt-3 flex-wrap gap-3 border rounded-4 ${sDashboard.bgDarkSecondary} ${sDashboard.borderDarkEmphasis}`}>
                <div className={`fs-3 fw-bold ${sDashboard.textDarkPrimary}`}>
                    <i className="bi bi-graph-up me-2 text-gradient"></i>
                    Wykresy <span className="text-gradient">Finansowe</span>
                </div>
                
                <div className={`d-flex gap-3 align-items-center flex-wrap`}>
                    <div className="d-flex flex-column">
                        <label className={`${sDashboard.textDarkAccentPrimary} mb-1 small fw-bold`}>
                            <i className="bi bi-calendar-event me-1"></i>Od:
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className={`form-control rounded-4 ${sDashboard.bgDarkPrimary} ${sDashboard.textDarkPrimary} ${sDashboard.borderDarkAccent}`}
                            style={{ maxWidth: "200px" }}
                        />
                    </div>
                    <div className="d-flex flex-column">
                        <label className={`${sDashboard.textDarkAccentPrimary} mb-1 small fw-bold`}>
                            <i className="bi bi-calendar-check me-1"></i>Do:
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className={`form-control rounded-4 ${sDashboard.bgDarkPrimary} ${sDashboard.textDarkPrimary} ${sDashboard.borderDarkAccent}`}
                            style={{ maxWidth: "200px" }}
                            min={startDate}
                        />
                    </div>
                </div>
            </div>

            <div className="p-2">
                {!isLoading && !balanceData && (
                    <div className={`${sDashboard.textDarkPrimary} text-center mb-4`}>
                        Brak danych z tego okresu
                    </div>
                )}

                {!isLoading && balanceData && (
                    <div className="row mb-4">
                        <div className="col-md-6 mb-3">
                            <div className={`${sDashboard.bgDarkSecondary} p-4 rounded-4 border-2 border-danger h-100 position-relative overflow-hidden ${sDashboard.shadowDarkHover}`} style={{borderStyle: 'solid', transition: 'all 0.3s ease', transform: 'scale(1)'}} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.01)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                                <div className="position-absolute top-0 end-0 opacity-25" style={{fontSize: '5rem', marginTop: '-1rem', marginRight: '-1rem'}}>
                                    <i className="bi bi-arrow-down-circle-fill text-danger"></i>
                                </div>
                                <div className="d-flex align-items-center mb-2">
                                    <i className="bi bi-arrow-down-circle-fill text-danger fs-4 me-2"></i>
                                    <h5 className={`${sDashboard.textDarkPrimary} mb-0 fw-bold`}>Wydatki</h5>
                                </div>
                                <h2 className="text-danger fw-bold mb-0">
                                    {handleCurrencyFormatting(balanceData.totalExpenseAmount, 'PLN')}
                                </h2>
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <div className={`${sDashboard.bgDarkSecondary} p-4 rounded-4 border-2 border-success h-100 position-relative overflow-hidden ${sDashboard.shadowDarkHover}`} style={{borderStyle: 'solid', transition: 'all 0.3s ease', transform: 'scale(1)'}} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.01)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                                <div className="position-absolute top-0 end-0 opacity-25" style={{fontSize: '5rem', marginTop: '-1rem', marginRight: '-1rem'}}>
                                    <i className="bi bi-arrow-up-circle-fill text-success"></i>
                                </div>
                                <div className="d-flex align-items-center mb-2">
                                    <i className="bi bi-arrow-up-circle-fill text-success fs-4 me-2"></i>
                                    <h5 className={`${sDashboard.textDarkPrimary} mb-0 fw-bold`}>Przychody</h5>
                                </div>
                                <h2 className="text-success fw-bold mb-0">
                                    {handleCurrencyFormatting(balanceData.totalIncomeAmount, 'PLN')}
                                </h2>
                            </div>
                        </div>
                    </div>
                )}

                <div className="row mb-4">
                    <div className="col-lg-6 mb-4">
                        <div className={`${sDashboard.bgDarkSecondary} p-4 rounded-4 border-2 border-danger ${sDashboard.shadowDarkHover} h-100`} 
                             style={{borderStyle: 'solid', transition: 'all 0.3s ease', transform: 'scale(1)'}}
                             onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                             onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                            <div className="d-flex align-items-center justify-content-center mb-3">
                                <i className="bi bi-pie-chart-fill text-danger fs-4 me-2"></i>
                                <h3 className={`${sDashboard.textDarkPrimary} mb-0 fw-bold`}>
                                    Kategorie <span className="text-danger">Wydatków</span>
                                </h3>
                            </div>
                            {isLoading ? (
                                <div className="d-flex justify-content-center align-items-center" style={{ height: 400 }}>
                                    <div className="spinner-border text-danger" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : expenseCategories.length > 0 ? (
                                <div style={{ height: 400 }}>
                                    <PieChart
                                        series={[
                                            {
                                                data: expenseCategories.map((cat, index) => ({
                                                    id: index,
                                                    value: cat.totalValue,
                                                    label: cat.categoryName,
                                                    color: cat.color || "#FF6B6B",
                                                })),
                                                valueFormatter: (obj) => handleCurrencyFormatting(obj.value, account?.currencyCode || 'PLN'),
                                                highlightScope: { fade: 'global', highlight: 'item' },
                                                faded: { innerRadius: 30, additionalRadius: -30, color: "#454545" },
                                                innerRadius: 40,
                                                outerRadius: 130,
                                                paddingAngle: 3,
                                                cornerRadius: 8,
                                            },
                                        ]}
                                        margin={{ top: 10, right: 10, bottom: 80, left: 10 }}
                                        slotProps={{
                                            legend: {
                                                direction: 'row' as any,
                                                position: { vertical: 'bottom', horizontal: 'center' },
                                            },
                                        }}
                                        sx={{
                                            "& .MuiChartsLegend-label": {
                                                fill: "#DEDEDE !important",
                                                color: "#DEDEDE !important",
                                            },
                                            "& .MuiChartsLegend-series text": {
                                                fill: "#DEDEDE !important",
                                            },
                                            "& text": {
                                                fill: "#DEDEDE !important",
                                            },
                                            "& .MuiPieArc-root": {
                                                stroke: "none",
                                            },
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className={`${sDashboard.textDarkSecondary} text-center opacity-50 d-flex flex-column align-items-center justify-content-center`} style={{ height: 400 }}>
                                    <i className="bi bi-inbox fs-1 mb-3 text-danger"></i>
                                    <p className="text-danger fw-bold">Brak danych o wydatkach</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                        <div className={`${sDashboard.bgDarkSecondary} p-4 rounded-4 border-2 border-success ${sDashboard.shadowDarkHover} h-100`} 
                             style={{borderStyle: 'solid', transition: 'all 0.3s ease', transform: 'scale(1)'}}
                             onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                             onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                            <div className="d-flex align-items-center justify-content-center mb-3">
                                <i className="bi bi-pie-chart-fill text-success fs-4 me-2"></i>
                                <h3 className={`${sDashboard.textDarkPrimary} mb-0 fw-bold`}>
                                    Kategorie <span className="text-success">Przychodów</span>
                                </h3>
                            </div>
                            {isLoading ? (
                                <div className="d-flex justify-content-center align-items-center" style={{ height: 400 }}>
                                    <div className="spinner-border text-success" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : incomeCategories.length > 0 ? (
                                <div style={{ height: 400 }}>
                                    <PieChart
                                        series={[
                                            {
                                                data: incomeCategories.map((cat, index) => ({
                                                    id: index,
                                                    value: cat.totalValue,
                                                    label: cat.categoryName,
                                                    color: cat.color || "#78D36B",
                                                })),
                                                valueFormatter: (obj) => handleCurrencyFormatting(obj.value, account?.currencyCode || 'PLN'),
                                                highlightScope: { fade: 'global', highlight: 'item' },
                                                faded: { innerRadius: 30, additionalRadius: -30, color: "#454545" },
                                                innerRadius: 40,
                                                outerRadius: 130,
                                                paddingAngle: 3,
                                                cornerRadius: 8,
                                            },
                                        ]}
                                        margin={{ top: 10, right: 10, bottom: 80, left: 10 }}
                                        slotProps={{
                                            legend: {
                                                direction: 'row' as any,
                                                position: { vertical: 'bottom', horizontal: 'center' },
                                            },
                                        }}
                                        sx={{
                                            "& .MuiChartsLegend-label": {
                                                fill: "#DEDEDE !important",
                                                color: "#DEDEDE !important",
                                            },
                                            "& .MuiChartsLegend-series text": {
                                                fill: "#DEDEDE !important",
                                            },
                                            "& text": {
                                                fill: "#DEDEDE !important",
                                            },
                                            "& .MuiPieArc-root": {
                                                stroke: "none",
                                            },
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className={`${sDashboard.textDarkSecondary} text-center opacity-50 d-flex flex-column align-items-center justify-content-center`} style={{ height: 400 }}>
                                    <i className="bi bi-inbox fs-1 mb-3 text-success"></i>
                                    <p className="text-success fw-bold">Brak danych o przychodach</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-lg-6 mb-4">
                        <div className={`${sDashboard.bgDarkSecondary} p-4 rounded-4 border-2 border-danger ${sDashboard.shadowDarkHover} h-100`} 
                             style={{borderStyle: 'solid', transition: 'all 0.3s ease', transform: 'scale(1)'}}
                             onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                             onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                            <div className="d-flex align-items-center justify-content-center mb-3 position-relative">
                                <div className="position-absolute start-0 top-0">
                                    <i className="bi bi-bar-chart-fill text-danger opacity-25" style={{fontSize: '3rem'}}></i>
                                </div>
                                <div className="text-center">
                                    <i className="bi bi-arrow-down-circle-fill text-danger fs-4 me-2"></i>
                                    <h3 className={`${sDashboard.textDarkPrimary} mb-0 fw-bold d-inline`}>
                                        Wydatki po <span className="text-danger">Kategoriach</span>
                                    </h3>
                                </div>
                            </div>
                            {isLoading ? (
                                <div className="d-flex justify-content-center align-items-center" style={{ height: 400 }}>
                                    <div className="spinner-border text-danger" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : expenseCategories.length > 0 ? (
                                <div style={{ height: 400 }}>
                                    <BarChart
                                        xAxis={[
                                            {
                                                scaleType: "band",
                                                data: expenseCategories.map(c => c.categoryName),
                                                colorMap: {
                                                    type: "ordinal",
                                                    colors: expenseCategories.map(c => c.color || "#FF6B6B"),
                                                },
                                            },
                                        ]}
                                        series={[
                                            {
                                                data: expenseCategories.map(c => c.totalValue),
                                                label: `Wydatki (${account?.currencyCode || 'PLN'})`,
                                                valueFormatter: (value) => handleCurrencyFormatting(value || 0, account?.currencyCode || 'PLN'),
                                                color: "#FF6B6B",
                                            },
                                        ]}
                                        borderRadius={10}
                                        margin={{ top: 60, right: 20, bottom: 80, left: 80 }}
                                        slotProps={{
                                            legend: {
                                                direction: 'row' as any,
                                                position: { vertical: 'top', horizontal: 'center' },
                                            },
                                        }}
                                        sx={{
                                            "& .MuiChartsAxis-tickLabel": {
                                                fill: "#DEDEDE",
                                            },
                                            "& .MuiChartsAxis-label": {
                                                fill: "#DEDEDE",
                                            },
                                            "& .MuiChartsLegend-label": {
                                                fill: "#DEDEDE !important",
                                                color: "#DEDEDE !important",
                                            },
                                            "& .MuiChartsLegend-series text": {
                                                fill: "#DEDEDE !important",
                                            },
                                            "& text": {
                                                fill: "#DEDEDE !important",
                                            },
                                            "& .MuiChartsAxis-line": {
                                                stroke: "#DEDEDE",
                                            },
                                            "& .MuiChartsAxis-tick": {
                                                stroke: "#DEDEDE",
                                            },
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className={`${sDashboard.textDarkSecondary} text-center opacity-50 d-flex flex-column align-items-center justify-content-center`} style={{ height: 400 }}>
                                    <i className="bi bi-inbox fs-1 mb-3 text-danger"></i>
                                    <p className="text-danger fw-bold">Brak danych o wydatkach</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                        <div className={`${sDashboard.bgDarkSecondary} p-4 rounded-4 border-2 border-success ${sDashboard.shadowDarkHover} h-100`} 
                             style={{borderStyle: 'solid', transition: 'all 0.3s ease', transform: 'scale(1)'}}
                             onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                             onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                            <div className="d-flex align-items-center justify-content-center mb-3 position-relative">
                                <div className="position-absolute start-0 top-0">
                                    <i className="bi bi-bar-chart-fill text-success opacity-25" style={{fontSize: '3rem'}}></i>
                                </div>
                                <div className="text-center">
                                    <i className="bi bi-arrow-up-circle-fill text-success fs-4 me-2"></i>
                                    <h3 className={`${sDashboard.textDarkPrimary} mb-0 fw-bold d-inline`}>
                                        Przychody po <span className="text-success">Kategoriach</span>
                                    </h3>
                                </div>
                            </div>
                            {isLoading ? (
                                <div className="d-flex justify-content-center align-items-center" style={{ height: 400 }}>
                                    <div className="spinner-border text-success" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : incomeCategories.length > 0 ? (
                                <div style={{ height: 400 }}>
                                    <BarChart
                                        xAxis={[
                                            {
                                                scaleType: "band",
                                                data: incomeCategories.map(c => c.categoryName),
                                                colorMap: {
                                                    type: "ordinal",
                                                    colors: incomeCategories.map(c => c.color || "#78D36B"),
                                                },
                                            },
                                        ]}
                                        series={[
                                            {
                                                data: incomeCategories.map(c => c.totalValue),
                                                label: `Przychody (${account?.currencyCode || 'PLN'})`,
                                                valueFormatter: (value) => handleCurrencyFormatting(value || 0, account?.currencyCode || 'PLN'),
                                                color: "#78D36B",
                                            },
                                        ]}
                                        borderRadius={10}
                                        margin={{ top: 60, right: 20, bottom: 80, left: 80 }}
                                        slotProps={{
                                            legend: {
                                                direction: 'row' as any,
                                                position: { vertical: 'top', horizontal: 'center' },
                                            },
                                        }}
                                        sx={{
                                            "& .MuiChartsAxis-tickLabel": {
                                                fill: "#DEDEDE",
                                            },
                                            "& .MuiChartsAxis-label": {
                                                fill: "#DEDEDE",
                                            },
                                            "& .MuiChartsLegend-label": {
                                                fill: "#DEDEDE !important",
                                                color: "#DEDEDE !important",
                                            },
                                            "& .MuiChartsLegend-series text": {
                                                fill: "#DEDEDE !important",
                                            },
                                            "& text": {
                                                fill: "#DEDEDE !important",
                                            },
                                            "& .MuiChartsAxis-line": {
                                                stroke: "#DEDEDE",
                                            },
                                            "& .MuiChartsAxis-tick": {
                                                stroke: "#DEDEDE",
                                            },
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className={`${sDashboard.textDarkSecondary} text-center opacity-50 d-flex flex-column align-items-center justify-content-center`} style={{ height: 400 }}>
                                    <i className="bi bi-inbox fs-1 mb-3 text-success"></i>
                                    <p className="text-success fw-bold">Brak danych o przychodach</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-12">
                        <div className={`${sDashboard.bgDarkSecondary} p-4 rounded-4 border-2 ${sDashboard.shadowDarkHover} position-relative overflow-hidden`} 
                             style={{borderStyle: 'solid', borderColor: '#00A676', transition: 'all 0.3s ease', transform: 'scale(1)'}}
                             onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.01)'}
                             onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                            <div className="position-absolute start-0 top-0 p-4">
                                    <i className="bi bi-graph-up-arrow text-success opacity-25" style={{fontSize: '3rem'}}></i>
                            </div>
                            <div className="d-flex align-items-center justify-content-center mb-3">
                                <i className="bi bi-graph-up-arrow fs-4 me-2" style={{color: '#00A676'}}></i>
                                <h3 className={`${sDashboard.textDarkPrimary} mb-0 fw-bold`}>
                                    Trend <span style={{color: '#00A676'}}>Dzienny</span>
                                </h3>
                            </div>
                            {isLoading ? (
                                <div className="d-flex justify-content-center align-items-center" style={{ height: 450 }}>
                                    <div className="spinner-border" style={{color: '#00A676'}} role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : dailyData.length > 0 ? (
                                <div style={{ height: 450 }}>
                                    <LineChart
                                        xAxis={[
                                            {
                                                scaleType: "point",
                                                data: dailyData.map((d) => {
                                                    const date = new Date(d.date);
                                                    return `${date.getDate()}.${date.getMonth() + 1}`;
                                                }),
                                            },
                                        ]}
                                        series={[
                                            {
                                                data: dailyData.map((d) => d.income),
                                                label: "Przychody",
                                                color: "#78D36B",
                                                curve: "catmullRom",
                                                valueFormatter: (value) => handleCurrencyFormatting(value || 0, account?.currencyCode || 'PLN'),
                                                showMark: true,
                                            },
                                            {
                                                data: dailyData.map((d) => d.expense),
                                                label: "Wydatki",
                                                color: "#FF6B6B",
                                                curve: "catmullRom",
                                                valueFormatter: (value) => handleCurrencyFormatting(value || 0, account?.currencyCode || 'PLN'),
                                                showMark: true,
                                            },
                                        ]}
                                        grid={{ vertical: true, horizontal: true }}
                                        margin={{ top: 60, right: 40, bottom: 60, left: 80 }}
                                        slotProps={{
                                            legend: {
                                                direction: 'row' as any,
                                                position: { vertical: 'top', horizontal: 'center' },
                                            },
                                        }}
                                        sx={{
                                            "& .MuiChartsAxis-tickLabel": {
                                                fill: "#DEDEDE",
                                            },
                                            "& .MuiChartsAxis-label": {
                                                fill: "#DEDEDE",
                                            },
                                            "& .MuiChartsLegend-label": {
                                                fill: "#DEDEDE !important",
                                                color: "#DEDEDE !important",
                                            },
                                            "& .MuiChartsLegend-series text": {
                                                fill: "#DEDEDE !important",
                                            },
                                            "& text": {
                                                fill: "#DEDEDE !important",
                                            },
                                            "& .MuiChartsGrid-line": {
                                                stroke: "#525252ff",
                                                strokeDasharray: "3 3",
                                            },
                                            "& .MuiChartsAxis-line": {
                                                stroke: "#a1a1a1ff",
                                            },
                                            "& .MuiChartsAxis-tick": {
                                                stroke: "#DEDEDE",
                                            },
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className={`${sDashboard.textDarkSecondary} text-center opacity-50 d-flex flex-column align-items-center justify-content-center`} style={{ height: 450 }}>
                                    <i className="bi bi-inbox fs-1 mb-3" style={{color: '#00A676'}}></i>
                                    <p className="fw-bold" style={{color: '#00A676'}}>Brak danych dziennych</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Charts;
