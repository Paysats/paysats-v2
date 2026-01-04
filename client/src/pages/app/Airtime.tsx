import ServiceTabs from "@/components/app/ServiceTabs"
import { Button } from "@/components/ui/Button"
import { Form, FormItem } from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { AppLayout } from "@/layouts/AppLayout"
import { NETWORK_PROVIDERS, NetworkProviderEnum } from "@/utils/networkProviders"
import { Bitcoin, PhoneCall } from "lucide-react"
import { useState, type FC } from "react"
import { TbCurrencyNaira } from "react-icons/tb";
import { MotionDiv } from "@/components/ui/MotionComponents"
import { staggerContainerVariants, staggerItemVariants } from "@/config/animationConfig"

interface AirtimeFormProps {
    handleContinue?: (data: any) => void;
}

export const Airtime:FC<AirtimeFormProps> = ({ handleContinue }) => {
    const [form] = Form.useForm();
    const [selectedNetwork, setSelectedNetwork] = useState<NetworkProviderEnum | null>(null);
    const amount = Form.useWatch('amount', form);

    const onFinish = (values: any) => {
        console.log('Form values:', values);
        const data = {
            ...values,
            network: selectedNetwork
        }
        console.log("Data ====> ", data)
        handleContinue?.(data);
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
                    <h2 className="text-3xl md:text-4xl font-bold">
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
                    className="flex flex-col gap-1"
                >
                    {/* select network */}
                    <MotionDiv className="flex flex-col gap-4" variants={staggerItemVariants}>
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
                                                    className={`w-24 cursor-pointer hover:border-primary transition-colors flex flex-col border border-gray-300 items-center gap-2 p-2 rounded-lg ${selectedNetwork === provider.name ? "border-primary border-2" : ""}`}
                                                >
                                                    <img src={`src/assets/${provider.logo}`} alt={provider.name} className="w-10 h-10" />
                                                    <b>{provider.name}</b>
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
                            label={<span className="font-medium text-base">Phone Number</span>}
                            className="mb-2"
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
                    <MotionDiv className="mb-2 flex flex-col gap-1" variants={staggerItemVariants}>
                        <FormItem
                            name="amount"
                            label={<span className="font-medium text-base">Amount (NGN)</span>}
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
                    <MotionDiv className="flex items-end justify-end -mt-4" variants={staggerItemVariants}>
                        <p className="text-base text-muted-foreground flex">{amount || '100'} NGN = 0.01 <Bitcoin className="text-primary -rotate-10" size={20} /></p>
                    </MotionDiv>
                    <MotionDiv variants={staggerItemVariants}>
                        <Button fullWidth size="lg" htmlType="submit" disabled={!form.getFieldsValue().phoneNumber || !form.getFieldsValue().amount || !selectedNetwork}>
                            Continue
                        </Button>
                    </MotionDiv>
                </Form>
            </MotionDiv>
        </AppLayout>
    )
}