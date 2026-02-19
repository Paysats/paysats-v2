import React from 'react';
import { SERVICES } from '@shared/constants';
import * as LucideIcons from 'lucide-react';
import { BiTv } from "react-icons/bi";
import { Link } from 'react-router-dom';
import { Button } from '@shared/ui/Button';
import { AppLayout } from '@/layouts/AppLayout';

interface IComingSoonServiceProps {
    serviceName: string;
    mainText: string;
    subText: string;
}

const ComingSoonService: React.FC<IComingSoonServiceProps> = ({ serviceName, mainText, subText }) => {
    return (
        <AppLayout serviceTabs={false}>
            <main className="flex-grow flex flex-col items-center justify-center max-w-2xl mx-auto w-full px-4 text-center">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary/10 flex items-center justify-center mb-8">
                    {
                        (() => {
                            const service = SERVICES.find(item => item.route === serviceName.toLowerCase() || item.id === serviceName.toLowerCase());
                            if (!service) return null;

                            let Icon: any = (LucideIcons as any)[service.icon] || LucideIcons.HelpCircle;
                            if (service.id === 'cable') Icon = BiTv;

                            return Icon ? <Icon className="w-16 h-16 text-primary" /> : null;
                        })()
                    }
                </div>

                <Button size="sm" variant={"secondary"} className="bg-primary/20! text-primary! font-bold mb-2 px-4! py-0!">
                    COMING SOON
                </Button>

                <h2 className="text-3xl md:text-4xl mt-1 font-bold text-foreground mb-4">
                    {serviceName.toLowerCase() === "electricity" ? "Electricity Bills" : serviceName}
                </h2>

                <p className="text-muted-foreground text-base md:text-lg mb-2 md:mb-4 max-w-md mx-auto">
                    {mainText || `Coming soon — pay for ${serviceName} with BCH.`}
                </p>

                <p className="text-muted-foreground text-sm md:text-base mb-10 max-w-md mx-auto">
                    {subText || `We are working hard to bring this service to Paysats.`}
                </p>

                <Link
                    to="/"
                    className="bg-primary hover:bg-primary-600 text-white font-bold py-2 md:py-4 px-6 md:px-8 rounded-xl transition-all active:scale-95 shadow-lg shadow-primary/20 inline-flex items-center gap-2"
                >
                    <span>←</span> Back to Service Selection
                </Link>
            </main>


        </AppLayout>
    )
}

export default ComingSoonService