import ServiceTabs from "@/components/app/ServiceTabs"
import { Button } from "@/components/ui/Button"
import { Form, FormItem } from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { AppLayout } from "@/layouts/AppLayout"
import { NETWORK_PROVIDERS } from "@/utils/networkProviders"
import { Bitcoin, PhoneCall } from "lucide-react"
import { useState, useEffect, type FC } from "react"
import { TbCurrencyNaira } from "react-icons/tb";
import { MotionDiv } from "@/components/ui/MotionComponents"
import { staggerContainerVariants, staggerItemVariants } from "@/config/animationConfig"
import { NetworkProviderEnum } from "@shared/types/network-provider.types"
import { rateService } from "@/api/services/rate.service"
import { Spin } from "antd"

interface AirtimeFormProps {
    handleContinue: (data: any) => void;
    loading?: boolean;
}

export const AirtimeForm:FC<AirtimeFormProps> = ({ handleContinue, loading = false }) => {
    const [form] = Form.useForm();
    const [selectedNetwork, setSelectedNetwork] = useState<NetworkProviderEnum | null>(null);
    const amount = Form.useWatch('amount', form);
    const [bchAmount, setBchAmount] = useState<number>(0);
    const [convertingRate, setConvertingRate] = useState<boolean>(false);
    const [conversionError, setConversionError] = useState<string | null>(null);

    // noticed an ish.. disabling preview conversion for now to avoid: 
    // 1. coingecko rate limits (429 errors) - free account for MVP
    // 2. price inconsistency (CoinGecko vs Prompt.cash)
    // User will see accurate rate from prompt.cash in Review screen
    const enablePreviewConversion = false;

    // Real-time conversion effect (disabled by default)
    useEffect(() => {
        const convertAmount = async () => {
            if (!amount || isNaN(Number(amount)) || Number(amount) <= 0 || !enablePreviewConversion) {
                setBchAmount(0);
                setConversionError(null);
                return;
            }

            setConvertingRate(true);
            setConversionError(null);

            try {
                const result = await rateService.convertNGNToBCH(Number(amount));

                setBchAmount(result.bch);
            } catch (error) {
                console.error('Error converting amount:', error);
                setConversionError('Unable to fetch rate');
                setBchAmount(0);
            } finally {
                setConvertingRate(false);
            }
        };

        // Debounce the conversion to avoid too many API calls
        const timeoutId = setTimeout(convertAmount, 500);

        return () => clearTimeout(timeoutId);
    }, [amount, enablePreviewConversion]);

    const onFinish = (values: any) => {
        const data = {
            ...values,
            network: selectedNetwork?.toLowerCase()
        }
        handleContinue(data);
    };

    return (
        <AppLayout>

            <MotionDiv
                className="flex flex-col gap-4"
                variants={staggerContainerVariants}
                initial="initial"
                animate="animate"
            >
                <MotionDiv className="flex flex-col gap-2" variants={staggerItemVariants}>
                    <h2 className="text-2xl md:text-4xl font-bold">
                        Buy Airtime
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Top up any Nigerian mobile number instantly with <span className="text-primary">PaySats</span>
                    </p>
                </MotionDiv>
                {/* form */}
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
                                                    onClick={
                                                        () => {
                                                            setSelectedNetwork(provider.name as NetworkProviderEnum);
                                                            form.setFieldValue('network', provider.name);
                                                        }
                                                    }
                                                    className={`w-14 md:w-24 cursor-pointer hover:border-primary transition-colors flex flex-col border border-gray-300 items-center gap-2 px-2 md:p-2 rounded-sm ${selectedNetwork === provider.name ? "border-primary border-2" : ""}`}
                                                >
                                                    <img src={provider.logo} alt={provider.name} className="w-6 h-6 md:w-10 md:h-10" />
                                                    <p className="font-medium text-xs">{provider.name}</p>
                                                </button>
                                            </MotionDiv>
                                        )
                                    })
                                }
                            </div>
                        </FormItem>
                    </MotionDiv>
                    
                    {/* form... */}
                    <MotionDiv variants={staggerItemVariants}>
                        <FormItem
                            name="phoneNumber"
                            label={<span className="font-medium">Phone Number</span>}
                            rules={[
                                { required: true, message: "Phone number is required" },
                                {
                                    pattern: /^[0-9]{11}$/,
                                    message: "Phone number must be 11 digits"
                                }
                            ]}
                        >
                            <Input
                                id="phone-number"
                                placeholder="0801 234 5678"
                                suffix={
                                    <PhoneCall size={18} className="text-gray-400" />
                                }
                                maxLength={11}
                            />
                        </FormItem>
                    </MotionDiv>
                    <MotionDiv className="flex flex-col gap-1" variants={staggerItemVariants}>
                        <FormItem
                            name="amount"
                            label={<span className="font-medium">Amount (NGN)</span>}
                            rules={[
                                { required: true, message: 'Please enter an amount' },
                                { pattern: /^[0-9]+$/, message: 'Amount must be a number' }
                            ]}
                        >
                            <Input
                                id="amount"
                                placeholder="100"
                                suffix={<TbCurrencyNaira size={20} className="text-gray-400" />}
                            />
                        </FormItem>
                    </MotionDiv>
                    {enablePreviewConversion && (
                        <MotionDiv className="flex items-end justify-end -mt-8" variants={staggerItemVariants}>
                            <p className="text-base text-muted-foreground flex items-center gap-1">
                                {amount || '0'} NGN = 
                                {convertingRate ? (
                                    <Spin size="small" className="mx-1" />
                                ) : conversionError ? (
                                    <span className="text-red-500 text-xs mx-1">{conversionError}</span>
                                ) : (
                                    <span className="font-semibold text-foreground mx-1">
                                        {bchAmount.toFixed(8)} BCH
                                    </span>
                                )}
                                <Bitcoin className="text-primary -rotate-10" size={20} />
                            </p>
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
                            fullWidth 
                            size="lg" 
                            htmlType="submit" 
                            loading={loading}
                            disabled={!form.getFieldsValue().phoneNumber || !form.getFieldsValue().amount || !selectedNetwork || loading}
                        >
                            {loading ? 'Creating Transaction...' : 'Continue'}
                        </Button>
                    </MotionDiv>
                </Form>
            </MotionDiv>
        </AppLayout>
    )
}