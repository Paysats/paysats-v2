import { useState, useMemo, type FC } from "react"
import { AppLayout } from "@/layouts/AppLayout"
import { Button } from "@/components/ui/Button"
import { Form, FormItem } from "@/components/ui/Form"
import { Input, SearchInput } from "@/components/ui/Input"
import { Modal } from "@/components/ui/Modal"
import { NETWORK_PROVIDERS, NetworkProviderEnum } from "@/utils/networkProviders"
import { DATA_PLANS } from "@/utils/dataPlans"
import type { DataPlanVariation } from "@/utils/dataPlans"
import { Bitcoin, PhoneCall, ChevronRight, Wifi } from "lucide-react"
import { TbCurrencyNaira } from "react-icons/tb"
import { MotionDiv } from "@/components/ui/MotionComponents"
import { staggerContainerVariants, staggerItemVariants, cardHoverVariants } from "@/config/animationConfig"

interface DataFormProps {
    handleContinue?: (data: any) => void;
}

export const Data:FC<DataFormProps> = ({ handleContinue }) => {
    const [form] = Form.useForm();
    const [selectedNetwork, setSelectedNetwork] = useState<NetworkProviderEnum | null>(null);
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPlan, setSelectedPlan] = useState<DataPlanVariation | null>(null);

    const amount = Form.useWatch('amount', form);
    const phoneNumber = Form.useWatch('phoneNumber', form);

    const plans = useMemo(() => {
        if (!selectedNetwork) return [];
        const networkPlans = DATA_PLANS[selectedNetwork?.toLowerCase()] || [];
        console.log({ networkPlans, searchQuery, selectedNetwork })
        if (!searchQuery) return networkPlans;
        return networkPlans.filter(plan =>
            plan.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [selectedNetwork, searchQuery]);

    const onFinish = (values: any) => {
        const data = {
            ...values,
            network: selectedNetwork,
            plan: selectedPlan
        };
        console.log("Data Order ====> ", data);
        handleContinue?.(data);
    };

    const handlePlanSelect = (plan: DataPlanVariation) => {
        setSelectedPlan(plan);
        form.setFieldValue('plan', plan.variation_code);
        form.setFieldValue('amount', plan.variation_amount);
        setIsPlanModalOpen(false);
    };

    return (
        <AppLayout>
            <MotionDiv
                className="flex flex-col gap-2"
                variants={staggerContainerVariants}
                initial="initial"
                animate="animate"
            >
                <MotionDiv variants={staggerItemVariants}>
                    <h2 className="text-3xl md:text-4xl font-bold">
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
                    className="flex flex-col gap-1 mt-6"
                >
                    {/* select network */}
                    <MotionDiv className="flex flex-col gap-4 mb-4" variants={staggerItemVariants}>
                        <h3 className="text-lg font-semibold">
                            Select Network
                        </h3>
                        <FormItem
                            name="network"
                            rules={[{ required: true, message: 'Please select a network' }]}
                        >
                            <div className="flex items-center gap-4">
                                {
                                    NETWORK_PROVIDERS?.map((provider) => {
                                        return (
                                            <MotionDiv
                                                key={provider.name}
                                                whileHover={{ scale: 1.05, y: -2 }}
                                                whileTap={{ scale: 0.95 }}
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
                                                    className={`w-24 cursor-pointer hover:border-primary transition-colors flex flex-col border border-gray-300 items-center gap-2 p-2 rounded-lg ${selectedNetwork === provider.name ? "border-primary border-2" : ""}`}
                                                >
                                                    <img src={`src/assets/${provider.logo}`} alt={provider.name} className="w-10 h-10 object-contain" />
                                                    <b>{provider.name}</b>
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
                            label={<span className="font-medium text-base">Phone Number</span>}
                            rules={[
                                { required: true, message: "Phone number is required" },
                                { pattern: /^[0-9]{11}$/, message: "Phone number must be 11 digits" }
                            ]}
                        >
                            <Input
                                placeholder="0801 234 5678"
                                suffix={<PhoneCall size={18} className="text-gray-400" />}
                                maxLength={11}
                            />
                        </FormItem>
                    </MotionDiv>

                    <MotionDiv variants={staggerItemVariants}>
                        <FormItem
                            name="plan"
                            label={<span className="font-medium text-base">Select Data Plan</span>}
                            rules={[{ required: true, message: 'Please select a data plan' }]}
                        >
                            <MotionDiv
                                onClick={() => selectedNetwork && setIsPlanModalOpen(true)}
                                className={`w-full min-h-12 px-4 flex items-center justify-between border rounded-xl cursor-pointer transition-all ${!selectedNetwork ? 'opacity-50 cursor-not-allowed bg-muted' : 'hover:border-primary'}`}
                                whileHover={selectedNetwork ? { scale: 1.01 } : {}}
                                whileTap={selectedNetwork ? { scale: 0.99 } : {}}
                            >
                                {selectedPlan ? (
                                    <div className="flex flex-col">
                                        <span className="font-medium">{selectedPlan.name}</span>
                                        <span className="text-xs text-muted-foreground">₦{selectedPlan.variation_amount}</span>
                                    </div>
                                ) : (
                                    <span className="text-muted-foreground">
                                        {selectedNetwork ? "Choose a plan" : "Select network first"}
                                    </span>
                                )}
                                <ChevronRight size={20} className="text-muted-foreground" />
                            </MotionDiv>
                        </FormItem>
                    </MotionDiv>

                    {selectedPlan && (
                        <MotionDiv variants={staggerItemVariants}>
                            <FormItem
                                name="amount"
                                label={<span className="font-medium text-base">Amount (NGN)</span>}
                            >
                                <Input
                                    disabled
                                    placeholder="0.00"
                                    suffix={<TbCurrencyNaira size={20} className="text-gray-400" />}
                                />
                            </FormItem>
                        </MotionDiv>
                    )}

                    <MotionDiv className="flex items-end justify-end mt-2 mb-6" variants={staggerItemVariants}>
                        <p className="text-base text-muted-foreground flex items-center gap-1">
                            {amount || '0'} NGN = {amount ? (Number(amount) / 10000).toFixed(4) : '0.0000'} <Bitcoin className="text-primary -rotate-10" size={20} />
                        </p>
                    </MotionDiv>

                    <MotionDiv variants={staggerItemVariants}>
                        <Button
                            size="lg"
                            htmlType="submit"
                            fullWidth
                            disabled={!phoneNumber || !amount || !selectedNetwork || !selectedPlan}
                        >
                            Continue
                        </Button>
                    </MotionDiv>
                </Form>
            </MotionDiv>

            <Modal
                isOpen={isPlanModalOpen}
                onClose={() => setIsPlanModalOpen(false)}
                title={`Select ${selectedNetwork} Data Plan`}
            >
                <div className="flex flex-col gap-4">
                    <SearchInput
                        placeholder="Search for a plan..."
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-1">
                        {plans?.length > 0 ? (
                            plans?.map((plan) => (
                                <div
                                    key={plan.variation_code}
                                    onClick={() => handlePlanSelect(plan)}
                                    className="flex items-center justify-between px-3 py-1 border rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group"
                                >
                                    <div className="flex flex-col">
                                        <b className="text-base group-hover:text-primary transition-colors">{plan.name}</b>
                                        <span className="text-sm text-muted-foreground">₦{plan.variation_amount}</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <Wifi size={16} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-10 text-center text-muted-foreground">
                                No plans found for "{searchQuery}"
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </AppLayout>
    )
}
