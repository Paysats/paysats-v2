import { Check, Bitcoin } from "lucide-react";
import { formatNGN } from "@shared/utils";

export interface ReceiptData {
    title: string;
    serviceName: string;
    serviceProvider: string;
    amount: number;
    bchAmount: number;
    transactionReference?: string;
    date?: string;
    phoneNumber?: string;
}

interface ReceiptProps {
    data: ReceiptData;
}

export const Receipt = ({ data }: ReceiptProps) => {
    const { title, serviceName, serviceProvider, amount, bchAmount, transactionReference, date, phoneNumber } = data;

    return (
        <div
            id="receipt-container"
            className="w-[400px] bg-white rounded-2xl shadow-2xl overflow-hidden"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
            {/* Header with gradient */}
            <div className="bg-gradient-to-br from-[#0AC18E] to-[#059669] p-8 text-white relative overflow-hidden">
                {/* backgrond pattern */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                {/* Logo */}
                <div className="relative z-10 flex items-center justify-center mb-4">
                    <div className="flex items-center gap-2">
                        <Bitcoin size={32} strokeWidth={2.5} />
                        <span className="text-3xl font-bold">Paysats</span>
                    </div>
                </div>

                <div className="relative z-10 flex justify-center mb-4">
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30">
                        <Check size={40} strokeWidth={3} />
                    </div>
                </div>

                <div className="relative z-10 text-center">
                    <h2 className="text-2xl font-bold mb-1">{title}</h2>
                    <p className="text-white/90 text-sm">Payment Successful</p>
                </div>
            </div>

            <main className="p-8">
                {/* Amount */}
                <div className="text-center mb-8">
                    <p className="text-gray-500 text-sm mb-2">Amount Paid</p>
                    <p className="text-4xl font-bold text-gray-900">{formatNGN(amount)}</p>
                    <p className="text-gray-500 mt-2 flex items-center justify-center gap-1">
                        <Bitcoin size={16} className="text-[#0AC18E]" />
                        <span>{bchAmount.toFixed(6)} BCH</span>
                    </p>
                </div>

                <div className="border-t border-dashed border-gray-300 my-6"></div>

                {/* Details */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">Service</span>
                        <span className="font-semibold text-gray-900">{serviceName}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">Provider</span>
                        <span className="font-semibold text-gray-900">{serviceProvider}</span>
                    </div>

                    {phoneNumber && (
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Phone Number</span>
                            <span className="font-semibold text-gray-900">{phoneNumber}</span>
                        </div>
                    )}

                    {transactionReference && (
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Reference</span>
                            <span className="font-mono text-xs text-gray-900 bg-gray-100 px-2 py-1 rounded">
                                {transactionReference.slice(0, 20)}...
                            </span>
                        </div>
                    )}

                    {date && (
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Date</span>
                            <span className="text-sm text-gray-900">{date}</span>
                        </div>
                    )}
                </div>

                <div className="border-t border-dashed border-gray-300 my-6"></div>

                <footer className="text-center space-y-3">
                    <div className="inline-flex items-center gap-2 bg-[#0AC18E]/10 px-4 py-2 rounded-full">
                        <div className="w-2 h-2 rounded-full bg-[#0AC18E] animate-pulse"></div>
                        <span className="text-sm font-medium text-[#0AC18E]">Paid with Bitcoin Cash</span>
                    </div>

                    <p className="text-xs text-gray-400">
                        Fast, secure, and borderless payments
                    </p>

                    <p className="text-xs text-gray-400 mt-4">
                        trypaysats.xyz • Your everyday with BCH
                    </p>
                </footer>
            </main>

            {/* Bottom accent */}
            <div className="h-2 bg-gradient-to-r from-[#0AC18E] via-[#059669] to-[#0AC18E]"></div>
        </div>
    );
};
