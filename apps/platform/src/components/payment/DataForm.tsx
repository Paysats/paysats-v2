import { useState, useMemo, useEffect, type FC } from "react"
import { AppLayout } from "@/layouts/AppLayout"
import { Button } from "@shared-ui/Button"
import { Form, FormItem } from "@shared-ui/Form"
import { Input, SearchInput } from "@shared-ui/Input"
import { Modal } from "@shared-ui/Modal"
import { NETWORK_PROVIDERS } from "@shared/utils/networkProviders"
import type { DataPlanVariation } from "@shared/utils/dataPlans"
import { Bitcoin, PhoneCall, ChevronRight, Wifi } from "lucide-react"
import { TbCurrencyNaira } from "react-icons/tb"
import { MotionDiv } from "@shared-ui/MotionComponents"
import { staggerContainerVariants, staggerItemVariants, cardHoverVariants } from "@shared/config/animationConfig"
import type { NetworkProviderEnum } from "@shared/types/network-provider.types"
import { UtilityService } from "@/api/services/utility.service"
import type { DataPlan } from "@/api/services/utility.service"

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
                            <MotionDiv
                                onClick={() => selectedNetwork && setIsPlanModalOpen(true)}
                                className={`w-full min-h-14 px-4 flex items-center justify-between border rounded-xl cursor-pointer transition-all ${!selectedNetwork ? 'opacity-50 cursor-not-allowed bg-muted/50 border-dashed' : 'hover:border-primary border-input bg-card'}`}
                                whileHover={selectedNetwork ? { scale: 1.01 } : {}}
                                whileTap={selectedNetwork ? { scale: 0.99 } : {}}
                            >
                                {selectedPlan ? (
                                    <div className="flex flex-col py-1">
                                        <span className="font-semibold text-base">{selectedPlan.name}</span>
                                        <span className="text-xs text-muted-foreground">₦{selectedPlan.amount}</span>
                                    </div>
                                ) : (
                                    <span className="text-muted-foreground font-medium">
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
                            {loading ? 'Creating Transaction...' : 'Continue'}
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
                                    key={plan.planCode}
                                    onClick={() => handlePlanSelect(plan)}
                                    className="flex items-center justify-between px-3 py-1 border rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group"
                                >
                                    <div className="flex flex-col">
                                        <b className="text-base group-hover:text-primary transition-colors">{plan.name}</b>
                                        <span className="text-sm text-muted-foreground">₦{plan.amount}</span>
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
