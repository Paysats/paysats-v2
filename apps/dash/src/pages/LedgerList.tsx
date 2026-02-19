import React, { useState, useEffect } from 'react';
import { dashService } from '@/api/services/dash.service'
import type { IAdminTransaction } from '@/api/services/dash.service'
import { ServiceTypeEnum, TransactionStatusEnum } from '@shared/types';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import {
    ChevronRight,
    Search,
    Filter,
    Layers,
    History,
    CheckCircle2,
    Clock,
    XCircle,
    AlertCircle
} from 'lucide-react';
import { MotionDiv } from '@shared/ui/MotionComponents';
import { staggerContainerVariants, staggerItemVariants } from '@shared/config/animationConfig';
import { Card } from '@shared/ui/Card';
import { cn } from '@shared/utils/cn';
import { toast } from 'react-next-toast';
import { Table, Select, Input, Tag, Space, ConfigProvider, theme } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const StatusBadge: React.FC<{ status: TransactionStatusEnum | string }> = ({ status }) => {
    const config: Record<string, { label: string; icon: React.ElementType; color: string; bg: string; border: string }> = {
        [TransactionStatusEnum.SUCCESS]: { label: 'Settled', icon: CheckCircle2, color: 'text-primary', bg: 'bg-primary/5', border: 'border-primary/20' },
        [TransactionStatusEnum.PAYMENT_PENDING]: { label: 'Payment Pending', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/5', border: 'border-amber-500/20' },
        [TransactionStatusEnum.PAYMENT_CONFIRMED]: { label: 'Paid', icon: CheckCircle2, color: 'text-blue-500', bg: 'bg-blue-500/5', border: 'border-blue-500/20' },
        [TransactionStatusEnum.PROCESSING]: { label: 'Processing', icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-500/5', border: 'border-blue-500/20' },
        [TransactionStatusEnum.FAILED]: { label: 'Failed', icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/5', border: 'border-destructive/20' },
        [TransactionStatusEnum.INITIATED]: { label: 'Initiated', icon: Clock, color: 'text-muted-foreground', bg: 'bg-muted/5', border: 'border-border/20' },
        [TransactionStatusEnum.REFUND_PENDING]: { label: 'Refund Pending', icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-500/5', border: 'border-orange-500/20' },
    };

    const item = config[status] || { label: status, icon: AlertCircle, color: 'text-gray-500', bg: 'bg-gray-100', border: 'border-gray-200' };
    const Icon = item.icon;

    return (
        <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border backdrop-blur-sm", item.bg, item.color, item.border)}>
            <Icon size={12} className="shrink-0" />
            {item.label}
        </div>
    );
};

const LedgerList: React.FC = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState<IAdminTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [statusFilter, setStatusFilter] = useState('');
    const [serviceFilter, setServiceFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await dashService.getTransactions({
                page,
                limit: 10,
                status: statusFilter,
                service: serviceFilter,
                search: searchQuery
            });
            setTransactions(response.data);
            setTotalPages(response.meta.totalPages);
            setTotalItems(response.meta.total);
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
            toast.error('Failed to retrieve transaction records');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [page, statusFilter, serviceFilter, searchQuery]);

    const columns: ColumnsType<IAdminTransaction> = [
        {
            title: <span className="text-[9px] font-black tracking-[0.2em] uppercase opacity-60">Sequence ID</span>,
            dataIndex: 'reference',
            key: 'reference',
            width: 180,
            render: (text, record) => (
                <div className="space-y-1 py-2">
                    <p className="text-[13px] font-black text-foreground tracking-tight group-hover:text-primary transition-colors font-mono">{text}</p>
                    <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">{format(new Date(record.createdAt), 'HH:mm:ss')}</p>
                </div>
            ),
        },
        {
            title: <span className="text-[9px] font-black tracking-[0.2em] uppercase opacity-60">Module Agent</span>,
            dataIndex: 'serviceType',
            key: 'serviceType',
            render: (text, record) => (
                <div className="flex items-center gap-3 py-2">
                    <div className="w-9 h-9 rounded-xl bg-secondary/50 border border-border/20 flex items-center justify-center text-primary/70 shrink-0">
                        <Layers size={14} />
                    </div>
                    <div className="min-w-0">
                        <p className="font-black text-foreground/90 uppercase text-[10px] tracking-widest truncate">{text}</p>
                        <p className="text-[9px] text-muted-foreground/50 font-bold tracking-tight truncate">{record.serviceMeta?.phone || record.serviceMeta?.account || 'SYSTEM_NODE'}</p>
                    </div>
                </div>
            ),
        },
        {
            title: <span className="text-[9px] font-black tracking-[0.2em] uppercase opacity-60">Value</span>,
            key: 'amount',
            render: (_, record) => (
                <div className="space-y-1 py-2">
                    <p className="text-[13px] font-black text-foreground tracking-tight">₦{record.amount.ngn.toLocaleString()}</p>
                    <p className="text-[9px] font-bold text-primary/70 tracking-widest">{record.amount.bch.toFixed(8)} BCH</p>
                </div>
            ),
        },
        {
            title: <span className="text-[9px] font-black tracking-[0.2em] uppercase opacity-60">Protocol State</span>,
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status) => <StatusBadge status={status} />,
        },
        {
            title: <span className="text-[9px] font-black tracking-[0.2em] uppercase opacity-60">Timestamp</span>,
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: 'right',
            responsive: ['md'],
            render: (date) => (
                <div className="space-y-1 py-2">
                    <p className="text-[11px] font-bold text-foreground/70 uppercase tracking-wider">{format(new Date(date), 'MMM d, yyyy')}</p>
                    <div className="flex items-center justify-end gap-1.5 opacity-30">
                        <Clock size={10} />
                        <span className="text-[10px] font-medium font-mono">T-MINUS</span>
                    </div>
                </div>
            ),
        },
        {
            title: '',
            key: 'action',
            align: 'right',
            width: 50,
            render: () => <ChevronRight size={16} className="text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />,
        },
    ];

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                    colorPrimary: '#33C279',
                    colorBgContainer: 'transparent',
                    borderRadius: 16,
                    fontFamily: 'inherit'
                },
                components: {
                    Table: {
                        headerBg: 'transparent',
                        headerColor: 'rgba(255, 255, 255, 0.4)',
                        headerSplitColor: 'transparent',
                        colorText: 'rgba(255, 255, 255, 0.9)',
                        rowHoverBg: 'rgba(51, 194, 121, 0.03)',
                        paddingContentVerticalLG: 24,
                    },
                    Pagination: {
                        itemBg: 'transparent',
                        itemActiveBg: 'rgba(51, 194, 121, 0.1)',
                    }
                }
            }}
        >
            <MotionDiv
                variants={staggerContainerVariants}
                initial="initial"
                animate="animate"
                className="space-y-12 md:space-y-16 pb-20 pt-8"
            >
                <div className="space-y-4 px-4">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Historical Analysis</p>
                    <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tightest">
                        Audit Matrix
                    </h1>
                    <p className="text-muted-foreground/60 text-[10px] md:text-sm font-bold uppercase tracking-widest max-w-2xl leading-relaxed">
                        Immutable transaction log. Every signal broadcasted and captured by the Dash security engine
                        is serialized for cryptographic verification.
                    </p>
                </div>

                <div className="px-4">
                    <Card variant="default" className="p-4 md:p-6 bg-secondary/5 border-border/10!">
                        <div className="flex flex-col xl:flex-row gap-6 items-stretch xl:items-center">
                            <Input
                                placeholder="Scan Reference or Node Identifier..."
                                prefix={<Search size={18} className="text-muted-foreground/40 mr-2" />}
                                className="bg-card! border-border/20! hover:border-primary/30! focus:border-primary/40! h-14 rounded-2xl text-[13px] font-bold tracking-tight transition-all grow shadow-inner shadow-black/5"
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                            />

                            <div className="grid grid-cols-2 lg:flex items-center gap-4">
                                <Select
                                    value={statusFilter}
                                    onChange={(v) => { setStatusFilter(v); setPage(1); }}
                                    className="w-full lg:w-48! h-14 rounded-2xl"
                                    placeholder={<div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60"><Filter size={14} /> Protocol</div>}
                                    options={[
                                        { value: '', label: 'Full Spectrum' },
                                        { value: TransactionStatusEnum.SUCCESS, label: 'Settled Nodes' },
                                        { value: TransactionStatusEnum.PAYMENT_PENDING, label: 'Pending Sig' },
                                        { value: TransactionStatusEnum.PAYMENT_CONFIRMED, label: 'Confirmed' },
                                        { value: TransactionStatusEnum.PROCESSING, label: 'In-Transit' },
                                        { value: TransactionStatusEnum.FAILED, label: 'Terminated' },
                                    ]}
                                />

                                <Select
                                    value={serviceFilter}
                                    onChange={(v) => { setServiceFilter(v); setPage(1); }}
                                    className="w-full lg:w-52! h-14 rounded-2xl"
                                    placeholder={<div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60"><Layers size={14} /> System</div>}
                                    options={[
                                        { value: '', label: 'All Modules' },
                                        { value: ServiceTypeEnum.AIRTIME, label: 'Airtime Hub' },
                                        { value: ServiceTypeEnum.DATA, label: 'Data Relay' },
                                        { value: ServiceTypeEnum.ELECTRICITY, label: 'Power Grid' },
                                        { value: ServiceTypeEnum.CABLE_TV, label: 'Vision Stream' },
                                    ]}
                                />
                            </div>
                        </div>
                    </Card>
                </div>

                <Card className="mx-4 overflow-hidden bg-card/40 border-border/20! p-0! shadow-2xl shadow-black/20">
                    <Table
                        columns={columns}
                        dataSource={transactions}
                        loading={loading}
                        rowKey="_id"
                        onRow={(record) => ({
                            onClick: () => navigate(`/ledger/${record.reference}`),
                            className: 'group cursor-pointer'
                        })}
                        scroll={{ x: 800 }}
                        pagination={{
                            current: page,
                            pageSize: 10,
                            total: totalItems,
                            onChange: (p) => setPage(p),
                            showSizeChanger: false,
                            className: 'px-8 py-8 border-t border-border/10',
                            itemRender: (_page, type, originalElement) => {
                                if (type === 'prev') return <div className="flex items-center gap-2 px-4 h-full cursor-pointer group/nav"><span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 group-hover/nav:text-primary transition-colors">Prev Sequence</span></div>;
                                if (type === 'next') return <div className="flex items-center gap-2 px-4 h-full cursor-pointer group/nav"><span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 group-hover/nav:text-primary transition-colors">Next Sequence</span></div>;
                                return originalElement;
                            }
                        }}
                        className="dash-table-premium"
                    />
                </Card>
            </MotionDiv>
        </ConfigProvider>
    );
};

export default LedgerList;
