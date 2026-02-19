import { Logo } from "@shared-ui/Logo";
import { Mail, MessageCircle, Clock } from "lucide-react";
import { MotionDiv } from "@shared-ui/MotionComponents";
import { staggerContainerVariants, staggerItemVariants } from "@/config/animationConfig";
import { FaXTwitter } from "react-icons/fa6";
import { Divider } from "antd";
import { config } from "@/config/config";
import { AppLayout } from "@/layouts/AppLayout";

export const Support = () => {
    return (
        <AppLayout serviceTabs={false}>

        <MotionDiv
                className="flex-grow flex flex-col items-center justify-center max-w-2xl mx-auto w-full px-4 text-center"
                variants={staggerContainerVariants}
                initial="initial"
                animate="animate"
            >
                {/* Title */}
                <MotionDiv variants={staggerItemVariants} className="mb-8">
                    <h1 className="text-4xl capitalize md:text-5xl font-bold text-foreground mb-4">
                        {config.app.NAME} Support
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                        Have a question or run into an issue? Our team is ready to assist you. 
                        Reach out to us for assistance with payments or general inquiries.
                    </p>
                </MotionDiv>

                <MotionDiv 
                    variants={staggerItemVariants}
                    className="flex flex-col gap-6 w-full max-w-md"
                >
                    {/* email */}
                    <MotionDiv
                        variants={staggerItemVariants}
                    >

                        <a 
                            href={`mailto:${config.app.SUPPORT_EMAIL}`}
                            className="text-2xl md:text-3xl font-bold text-primary hover:text-primary/80 transition-colors"
                            >
                            {config.app.SUPPORT_EMAIL}
                        </a>
                            </MotionDiv>

<Divider className="-mt-2! -mb-2!"/>
                    {/* twitter */}
                    <MotionDiv
                        variants={staggerItemVariants}
                    >
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <FaXTwitter className="text-primary" size={24} />
                            <a 
                            href={`https://x.com/${config.app.X_HANDLE}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
                        >
                            @{config.app.X_HANDLE}
                        </a>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mt-2">
                            DM us for quick support
                        </p>
                    </MotionDiv>
                </MotionDiv>

                {/* Response Time */}
                <MotionDiv 
                    variants={staggerItemVariants}
                    className="mt-8 flex items-center gap-2 text-muted-foreground"
                >
                    <Clock size={16} className="text-primary" />
                    <span className="text-sm">We typically respond within 24 hours</span>
                </MotionDiv>
            </MotionDiv>

            {/* Footer
            <footer className="py-8 text-center border-t border-border">
                <div className="flex flex-col gap-4 items-center">
                    <div className="flex gap-6 text-sm text-muted-foreground">
                        <a href="/terms" className="hover:text-primary transition-colors">
                            Terms of Service
                        </a>
                        <a href="/privacy" className="hover:text-primary transition-colors">
                            Privacy Policy
                        </a>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} Paysats. All rights reserved.
                    </p>
                </div>
            </footer> */}
        </AppLayout>
    );
};

export default Support;
