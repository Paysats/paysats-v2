import { AppLayout } from "@/layouts/AppLayout";
import { MotionDiv } from "@/components/ui/MotionComponents";
import { staggerContainerVariants, staggerItemVariants } from "@/config/animationConfig";

export const TermsOfService = () => {
    return (
        <AppLayout serviceTabs={false}>
            <MotionDiv
                className="max-w-3xl mx-auto w-full px-4 py-8"
                variants={staggerContainerVariants}
                initial="initial"
                animate="animate"
            >
                <MotionDiv variants={staggerItemVariants} className="mb-8">
                    <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
                    <p className="text-muted-foreground">Last Updated: February 1, 2026</p>
                </MotionDiv>

                <MotionDiv variants={staggerItemVariants} className="prose prose-sm dark:prose-invert max-w-none space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold mb-2">1. Agreement to Terms</h2>
                        <p>
                            By accessing or using PaySats, you agree to be bound by these Terms of Service. If you do not agree, do not use the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">2. Description of Service</h2>
                        <p>
                            PaySats provides a platform for utility payments (Airtime, Data, Electricity, etc.) using Bitcoin Cash (BCH). Payments are processed via third-party providers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">3. Payments and Refunds</h2>
                        <p>
                            All payments made via PaySats are final. Due to the irreversible nature of cryptocurrency transactions, we cannot offer refunds once a payment has been broadcast to the BCH network and the service fulfillment has been initiated.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">4. User Responsibilities</h2>
                        <p>
                            Users are responsible for providing accurate information (e.g., phone numbers, account IDs) for utility fulfillment. PaySats is not liable for failed services due to incorrect user input.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">5. Limitation of Liability</h2>
                        <p>
                            PaySats is provided "as is" without warranties of any kind. We are not liable for any damages resulting from your use of the service or any third-party service interruptions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">6. Changes to Terms</h2>
                        <p>
                            We reserve the right to modify these terms at any time. Your continued use of the service constitutes acceptance of the updated terms.
                        </p>
                    </section>
                </MotionDiv>
            </MotionDiv>
        </AppLayout>
    );
};

export default TermsOfService;
