import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicyPage = () => {
    return (
        <DashboardLayout>
            <div className="container max-w-4xl mx-auto py-8 px-4">
                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle className="text-3xl">Privacy Policy</CardTitle>
                        <p className="text-muted-foreground">Last updated: December 2024</p>
                    </CardHeader>
                    <CardContent className="prose prose-invert max-w-none space-y-6">

                        <section>
                            <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
                            <p className="text-muted-foreground">
                                When you create an account, we collect:
                            </p>
                            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                                <li>Email address (required for account creation)</li>
                                <li>Username (chosen by you)</li>
                                <li>Profile information you choose to provide</li>
                            </ul>
                            <p className="text-muted-foreground mt-2">
                                We do not use tracking cookies or third-party analytics services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
                            <p className="text-muted-foreground">We use your information to:</p>
                            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                                <li>Provide and maintain your account</li>
                                <li>Enable features like saved favorites and personal garage</li>
                                <li>Communicate important service updates</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">3. Data Storage & Security</h2>
                            <p className="text-muted-foreground">
                                Your data is stored securely using Supabase, which provides enterprise-grade
                                security including encryption at rest and in transit. Our infrastructure is
                                hosted on AWS with data centers that comply with industry security standards.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">4. Your Rights (GDPR)</h2>
                            <p className="text-muted-foreground">Under GDPR, you have the right to:</p>
                            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                                <li><strong>Access</strong> - Request a copy of your personal data</li>
                                <li><strong>Rectification</strong> - Correct inaccurate personal data</li>
                                <li><strong>Erasure</strong> - Delete your account and all associated data</li>
                                <li><strong>Portability</strong> - Receive your data in a portable format</li>
                            </ul>
                            <p className="text-muted-foreground mt-2">
                                You can delete your account at any time from your Profile settings.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">5. Data Retention</h2>
                            <p className="text-muted-foreground">
                                We retain your personal data only for as long as your account is active.
                                When you delete your account, all personal data is permanently removed
                                within 30 days.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">6. Third-Party Services</h2>
                            <p className="text-muted-foreground">We use the following third-party services:</p>
                            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                                <li><strong>Supabase</strong> - Database and authentication (Data Processor)</li>
                                <li><strong>Cloudflare</strong> - Content delivery and security</li>
                            </ul>
                            <p className="text-muted-foreground mt-2">
                                These services have their own privacy policies and GDPR compliance measures.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">7. Contact Us</h2>
                            <p className="text-muted-foreground">
                                For privacy-related questions or to exercise your data rights, contact us at:
                            </p>
                            <p className="text-muted-foreground font-mono mt-2">
                                privacy@oemwdb.com
                            </p>
                        </section>

                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default PrivacyPolicyPage;
