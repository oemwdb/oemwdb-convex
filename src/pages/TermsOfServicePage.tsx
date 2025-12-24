import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsOfServicePage = () => {
    return (
        <DashboardLayout>
            <div className="container max-w-4xl mx-auto py-8 px-4">
                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle className="text-3xl">Terms of Service</CardTitle>
                        <p className="text-muted-foreground">Last updated: December 2024</p>
                    </CardHeader>
                    <CardContent className="prose prose-invert max-w-none space-y-6">

                        <section>
                            <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
                            <p className="text-muted-foreground">
                                By accessing or using OEMWDB ("the Service"), you agree to be bound by these
                                Terms of Service. If you do not agree to these terms, please do not use the Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
                            <p className="text-muted-foreground">
                                OEMWDB is a reference database for OEM (Original Equipment Manufacturer)
                                automotive parts, including wheels, vehicles, and related specifications.
                                The information provided is for reference purposes only.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
                            <p className="text-muted-foreground">You are responsible for:</p>
                            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                                <li>Maintaining the security of your account credentials</li>
                                <li>All activities that occur under your account</li>
                                <li>Notifying us immediately of any unauthorized access</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">4. Acceptable Use</h2>
                            <p className="text-muted-foreground">You agree not to:</p>
                            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                                <li>Use the Service for any illegal purpose</li>
                                <li>Attempt to gain unauthorized access to our systems</li>
                                <li>Scrape or bulk download data without permission</li>
                                <li>Upload malicious content or spam</li>
                                <li>Impersonate others or misrepresent your identity</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">5. Intellectual Property</h2>
                            <p className="text-muted-foreground">
                                OEM specifications, part numbers, and related data are the property of their
                                respective manufacturers. OEMWDB provides this information for reference
                                purposes only under fair use principles.
                            </p>
                            <p className="text-muted-foreground mt-2">
                                The OEMWDB platform, design, and original content are protected by copyright.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">6. Disclaimer of Warranties</h2>
                            <p className="text-muted-foreground">
                                The Service is provided "as is" without warranties of any kind. We do not
                                guarantee the accuracy, completeness, or reliability of any information
                                in the database. Always verify specifications with official manufacturer sources
                                before making purchasing or fitment decisions.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">7. Limitation of Liability</h2>
                            <p className="text-muted-foreground">
                                OEMWDB shall not be liable for any indirect, incidental, special, or
                                consequential damages arising from your use of the Service, including
                                but not limited to incorrect fitment information or purchasing decisions.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">8. Account Termination</h2>
                            <p className="text-muted-foreground">
                                We reserve the right to suspend or terminate accounts that violate these
                                terms. You may delete your account at any time from your Profile settings.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">9. Changes to Terms</h2>
                            <p className="text-muted-foreground">
                                We may update these terms from time to time. Continued use of the Service
                                after changes constitutes acceptance of the new terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">10. Contact</h2>
                            <p className="text-muted-foreground">
                                For questions about these terms, contact us at:
                            </p>
                            <p className="text-muted-foreground font-mono mt-2">
                                legal@oemwdb.com
                            </p>
                        </section>

                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default TermsOfServicePage;
