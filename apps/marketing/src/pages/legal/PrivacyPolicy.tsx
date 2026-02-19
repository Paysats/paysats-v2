import { AppLayout } from "@/layouts/AppLayout";
import { MotionDiv } from "@shared-ui/MotionComponents";
import { staggerContainerVariants, staggerItemVariants } from "@/config/animationConfig";

export const PrivacyPolicy = () => {
    return (
        <AppLayout serviceTabs={false}>
            <MotionDiv
                className="max-w-3xl mx-auto w-full px-4 py-8"
                variants={staggerContainerVariants}
                initial="initial"
                animate="animate"
            >
                <MotionDiv variants={staggerItemVariants} className="mb-8">
                    <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
                    <p className="text-muted-foreground">Last Updated: February 1, 2026</p>
                </MotionDiv>

                <MotionDiv variants={staggerItemVariants} className="prose prose-sm dark:prose-invert max-w-none space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
                        <p>
                            We collect minimal information required to fulfill your requests:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Phone numbers for airtime and data top-ups.</li>
                            <li>Customer IDs for utility bill payments (Electricity, Cable TV).</li>
                            <li>Transaction data related to your BCH payments.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
                        <p>
                            Your information is used strictly for:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Fulfilling the utility services you purchase.</li>
                            <li>Processing BCH payments via Prompt.cash.</li>
                            <li>Providing customer support if you encounter issues.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">3. Data Sharing</h2>
                        <p>
                            We share your information with third-party service providers (e.g. network operators) only to the extent necessary to complete your purchase. We do not sell your personal data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">4. Data Security</h2>
                        <p>
                            We implement standard security measures to protect your information. However, please note that no method of transmission over the internet is 100% secure.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">5. Cookies</h2>
                        <p>
                            We may use local storage to save your preferences and session state for a better user experience.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">6. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact our support team.
                        </p>
                    </section>
                </MotionDiv>
            </MotionDiv>
        </AppLayout>
    );
};

export default PrivacyPolicy;
