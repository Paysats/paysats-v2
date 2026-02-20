import { useState, useMemo, useEffect, type FC } from "react"
import { AppLayout } from "@/layouts/AppLayout"
import { Button } from "@shared-ui/Button"
import { Form, FormItem } from "@shared-ui/Form"
import { Input, SearchInput } from "@shared-ui/Input"
import { Modal } from "@shared-ui/Modal"
import { NETWORK_PROVIDERS } from "@shared/utils/networkProviders"
import type { DataPlanVariation } from "@shared/utils/dataPlans"
import { Bitcoin, PhoneCall, ChevronRight, Wifi, Zap } from "lucide-react"
import { TbCurrencyNaira } from "react-icons/tb"
import { MotionDiv } from "@shared-ui/MotionComponents"
import { staggerContainerVariants, staggerItemVariants, cardHoverVariants } from "@shared/config/animationConfig"
import type { NetworkProviderEnum } from "@shared/types/network-provider.types"
import { UtilityService } from "@/api/services/utility.service"
import type { DataPlan } from "@/api/services/utility.service"
import { GlowEffect } from "@shared-ui/GlowEffect"
import { cn } from "@shared/utils/cn"

interface DataFormProps {
    handleContinue: (data: any) => void;
    loading?: boolean;
}

export const Data: FC<DataFormProps> = ({ handleContinue, loading }) => {
    const [form] = Form.useForm();
    const [selectedNetwork, setSelectedNetwork] = useState<NetworkProviderEnum | null>(null);
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPlan, setSelectedPlan] = useState<DataPlan | null>(null);
    const [fetchedPlans, setFetchedPlans] = useState<DataPlan[]>([]);
    const [fetchingPlans, setFetchingPlans] = useState(false);

    const amount = Form.useWatch('amount', form);
    const phoneNumber = Form.useWatch('phoneNumber', form);

    useEffect(() => {
        if (!selectedNetwork) return;

        const fetchPlans = async () => {
            setFetchingPlans(true);
            try {
                const plans = await UtilityService.getDataPlans(selectedNetwork);
                setFetchedPlans(plans);
            } catch (error) {
                console.error("Error fetching plans:", error);
            } finally {
                setFetchingPlans(false);
            }
        };

        fetchPlans();
    }, [selectedNetwork]);

    const plans = useMemo(() => {
        if (!fetchedPlans) return [];
        if (!searchQuery) return fetchedPlans;
        return fetchedPlans.filter(plan =>
            plan.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [fetchedPlans, searchQuery]);

    const enablePreviewConversion = false;

    const onFinish = (values: any) => {
        const data = {
            ...values,
            network: selectedNetwork,
            plan: selectedPlan
        };
        handleContinue(data);
    };

    const handlePlanSelect = (plan: DataPlan) => {
        setSelectedPlan(plan);
        form.setFieldValue('plan', plan.planCode);
        form.setFieldValue('amount', plan.amount);
        setIsPlanModalOpen(false);
    };

    return (
        <AppLayout>
            <MotionDiv
                className="flex flex-col gap-4"
                variants={staggerContainerVariants}
                initial="initial"
                animate="animate"
            >
                <MotionDiv className="flex flex-col gap-3" variants={staggerItemVariants}>
                    <h2 className="text-2xl md:text-4xl font-bold">
                        Buy Data
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Instantly top up data for any Nigerian mobile number with <span className="text-primary">PaySats</span>
                    </p>
                </MotionDiv>

                <Form
                    form={form}
                    onFinish={onFinish}
                    layout="vertical"
                    className="flex flex-col"
                >
                    {/* select network */}
                    <MotionDiv className="flex flex-col gap-4 mt-1" variants={staggerItemVariants}>
                        <h3 className="text-lg font-semibold">
                            Select Network
                        </h3>
                        <FormItem
                            name="network"
                            rules={[{ required: true, message: 'Please select a network' }]}
                        >
                            <div className="grid grid-cols-4 gap-3 w-full">
                                {
                                    NETWORK_PROVIDERS?.map((provider) => {
                                        return (
                                            <MotionDiv
                                                key={provider.name}
                                                whileHover={{ scale: 1.05, y: -2 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="w-full"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedNetwork(provider.name as NetworkProviderEnum);
                                                        form.setFieldValue('network', provider.name);
                                                        setSelectedPlan(null); // Reset plan when network changes
                                                        form.setFieldValue('plan', undefined);
                                                        form.setFieldValue('amount', undefined);
                                                    }}
                                                    className={`w-full cursor-pointer hover:border-primary transition-all duration-300 flex flex-col border items-center justify-center gap-2 py-3 rounded-2xl ${selectedNetwork === provider.name ? "border-primary border-2 bg-primary/5 shadow-sm" : "border-border bg-card hover:bg-muted/50"}`}
                                                >
                                                    <img src={provider.logo} alt={provider.name} className="w-8 h-8 object-contain" />
                                                    <p className="font-medium text-[10px] md:text-xs">{provider.name}</p>
                                                </button>
                                            </MotionDiv>
                                        )
                                    })
                                }
                            </div>
                        </FormItem>
                    </MotionDiv>

                    <MotionDiv variants={staggerItemVariants}>
                        <FormItem
                            name="phoneNumber"
                            label={<span className="font-medium">Phone Number</span>}
                            rules={[
                                { required: true, message: "Phone number is required" },
                                { pattern: /^[0-9]{11}$/, message: "Phone number must be 11 digits" }
                            ]}
                        >
                            <Input
                                placeholder="0801 234 5678"
                                suffix={<PhoneCall size={18} className="text-muted-foreground" />}
                                maxLength={11}
                                className="h-12 text-lg font-medium"
                            />
                        </FormItem>
                    </MotionDiv>

                    <MotionDiv variants={staggerItemVariants}>
                        <FormItem
                            name="plan"
                            label={<span className="font-medium">Select Data Plan</span>}
                            rules={[{ required: true, message: 'Please select a data plan' }]}
                        >
                            <GlowEffect intensity="low" pulse={!!selectedPlan}>
                                <MotionDiv
                                    onClick={() => selectedNetwork && setIsPlanModalOpen(true)}
                                    className={cn(
                                        "w-full min-h-16 px-5 flex items-center justify-between border rounded-2xl cursor-pointer transition-all duration-300",
                                        !selectedNetwork
                                            ? 'opacity-50 cursor-not-allowed bg-muted/50 border-dashed'
                                            : selectedPlan
                                                ? 'border-primary bg-primary/5 shadow-sm'
                                                : 'hover:border-primary border-input bg-card'
                                    )}
                                    whileHover={selectedNetwork ? { scale: 1.01 } : {}}
                                    whileTap={selectedNetwork ? { scale: 0.99 } : {}}
                                >
                                    {selectedPlan ? (
                                        <div className="flex flex-col py-2">
                                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-0.5">Selected Plan</span>
                                            <span className="font-bold text-lg tracking-tight">{selectedPlan.name}</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                                <Wifi size={14} className="text-muted-foreground" />
                                            </div>
                                            <span className="text-muted-foreground font-medium">
                                                {selectedNetwork ? "Choose a high-speed plan" : "Select network first"}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        {selectedPlan && (
                                            <span className="text-sm font-black text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                                                ₦{selectedPlan.amount}
                                            </span>
                                        )}
                                        <ChevronRight size={20} className={cn("transition-transform duration-300", isPlanModalOpen && "rotate-90")} />
                                    </div>
                                </MotionDiv>
                            </GlowEffect>
                        </FormItem>
                    </MotionDiv>

                    {selectedPlan && (
                        <MotionDiv variants={staggerItemVariants}>
                            <FormItem
                                name="amount"
                                label={<span className="font-medium">Amount (NGN)</span>}
                            >
                                <Input
                                    disabled
                                    placeholder="0.00"
                                    suffix={<TbCurrencyNaira size={20} className="text-gray-400" />}
                                    className="h-12 text-lg font-medium"
                                />
                            </FormItem>
                        </MotionDiv>
                    )}

                    {!enablePreviewConversion && amount && Number(amount) > 0 && (
                        <MotionDiv className="flex items-end justify-end -mt-6" variants={staggerItemVariants}>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Bitcoin className="text-primary -rotate-10" size={16} />
                                <span className="italic">
                                    BCH equivalent will be shown in next step
                                </span>
                            </p>
                        </MotionDiv>
                    )}

                    <MotionDiv variants={staggerItemVariants}>
                        <Button
                            size="lg"
                            htmlType="submit"
                            fullWidth
                            disabled={!phoneNumber || !amount || !selectedNetwork || !selectedPlan || loading}
                            loading={loading}
                        >
                            {loading ? 'Initiating Protocol...' : 'Continue'}
                        </Button>
                    </MotionDiv>
                </Form>
            </MotionDiv>

            <Modal
                isOpen={isPlanModalOpen}
                onClose={() => setIsPlanModalOpen(false)}
                title={
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-black tracking-tight">Select {selectedNetwork} Plan</h2>
                    </div>
                }
                width={600}
            >
                <div className="flex flex-col gap-6 py-2">
                    <SearchInput
                        placeholder="Search for a connectivity package..."
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-secondary/10 border-none h-14 text-base"
                    />

                    <MotionDiv
                        variants={staggerContainerVariants}
                        initial="initial"
                        animate="animate"
                        className="grid grid-cols-1 gap-3 max-h-[450px] overflow-y-auto pr-1 custom-scrollbar"
                    >
                        {plans?.length > 0 ? (
                            plans?.map((plan, index) => (
                                <MotionDiv
                                    key={plan.planCode}
                                    variants={staggerItemVariants}
                                    whileHover={{ scale: 1.01, x: 4 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={() => handlePlanSelect(plan)}
                                    className={cn(
                                        "relative overflow-hidden group p-5 rounded-2xl border transition-all duration-300 cursor-pointer",
                                        selectedPlan?.planCode === plan.planCode
                                            ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                                            : "border-border/40 bg-card hover:border-primary/50 hover:bg-muted/30"
                                    )}
                                >
                                    <div className="flex justify-between items-center relative z-10">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <Zap size={10} className="text-primary animate-pulse" />
                                                <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">
                                                    Fast Fulfillment
                                                </span>
                                            </div>
                                            <h4 className="text-lg font-bold tracking-tight group-hover:text-primary transition-colors">
                                                {plan.name}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-2xl font-black tracking-tighter">₦{plan.amount}</span>
                                                <div className="h-1 w-1 rounded-full bg-border" />
                                                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Instant Signal</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-3">
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                                                selectedPlan?.planCode === plan.planCode
                                                    ? "bg-primary text-background rotate-12 shadow-lg shadow-primary/20"
                                                    : "bg-secondary/20 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary group-hover:rotate-6"
                                            )}>
                                                <Wifi size={24} className={cn("transition-all duration-500", selectedPlan?.planCode === plan.planCode ? "scale-110" : "opacity-30 group-hover:opacity-100")} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Subtle background glow on hover */}
                                    <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-700" />
                                </MotionDiv>
                            ))
                        ) : (
                            <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
                                <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center">
                                    <Wifi size={32} className="text-muted-foreground/20" />
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-muted-foreground">No matching frequency found</p>
                                    <p className="text-xs text-muted-foreground/60 uppercase tracking-widest mt-1">Adjust your search parameters</p>
                                </div>
                            </div>
                        )}
                    </MotionDiv>
                </div>
            </Modal>
        </AppLayout>
    )
}
