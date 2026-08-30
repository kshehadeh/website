import type { Metadata } from 'next';
import ContentLayout from '@/components/ContentLayout/ContentLayout';
import { HeadingWithRotatedBg } from '@/components/HeadingWithRotatedBg';

export const metadata: Metadata = {
    title: 'Karim Shehadeh - Terms & Conditions',
    description: 'Terms and conditions for using karim.cloud.',
    alternates: {
        canonical: '/terms',
    },
};

export default function TermsPage() {
    return (
        <ContentLayout pageType="terms" sidecar={null}>
            <article className="mx-auto max-w-4xl">
                <HeadingWithRotatedBg>
                    Terms &amp; Conditions
                </HeadingWithRotatedBg>
                <p>
                    <strong>Last Updated: August 30, 2026</strong>
                </p>
                <p>
                    These Terms &amp; Conditions govern your use of this website
                    (the “Website”). By accessing or using the Website, you
                    agree to these Terms. If you do not agree with these Terms,
                    please do not use the Website.
                </p>

                <h2>Use of the Website</h2>
                <p>
                    The Website and its content are provided for general
                    informational purposes. You may browse, read, and share
                    links to publicly available content for personal and
                    non-commercial purposes.
                </p>
                <p>You agree not to use the Website in a way that:</p>
                <ul>
                    <li>Violates any applicable law or regulation.</li>
                    <li>
                        Attempts to interfere with the operation or security of
                        the Website.
                    </li>
                    <li>
                        Attempts to gain unauthorized access to the Website, its
                        systems, or related services.
                    </li>
                    <li>
                        Uses automated systems to excessively access, scrape, or
                        disrupt the Website.
                    </li>
                    <li>
                        Misrepresents the source or ownership of content
                        published on the Website.
                    </li>
                </ul>

                <h2>Intellectual Property</h2>
                <p>
                    Unless otherwise stated, the original content published on
                    this Website, including articles, written material,
                    photographs, illustrations, graphics, and other original
                    works, is owned by the Website owner and is protected by
                    applicable copyright and intellectual property laws.
                </p>
                <p>
                    You may link to content on the Website and quote reasonable
                    portions of written material with appropriate attribution.
                    You may not reproduce, republish, sell, distribute, or
                    commercially exploit substantial portions of the
                    Website&apos;s original content without prior permission.
                </p>
                <p>
                    Third-party trademarks, images, quotations, and other
                    materials remain the property of their respective owners.
                </p>

                <h2>User-Submitted Content</h2>
                <p>
                    If the Website allows you to submit comments, messages, or
                    other content, you are responsible for the content you
                    submit.
                </p>
                <p>
                    You agree not to submit unlawful, abusive, defamatory,
                    infringing, malicious, or intentionally misleading material.
                </p>
                <p>
                    By submitting content intended for public display, you grant
                    the Website owner permission to display that content as part
                    of the Website. This does not transfer ownership of your
                    content.
                </p>
                <p>
                    The Website owner reserves the right to remove submitted
                    content at their discretion.
                </p>

                <h2>Third-Party Links</h2>
                <p>
                    The Website may contain links to third-party websites or
                    services. These links are provided for convenience or
                    reference.
                </p>
                <p>
                    The Website owner does not control and is not responsible
                    for the content, availability, privacy practices, security,
                    or policies of third-party websites. Visiting third-party
                    websites is at your own risk and subject to their respective
                    terms and policies.
                </p>

                <h2>No Professional Advice</h2>
                <p>
                    Content published on the Website represents general
                    information, commentary, or personal opinion and should not
                    be considered legal, financial, medical, investment, or
                    other professional advice.
                </p>
                <p>
                    You should consult an appropriate professional before making
                    decisions that require professional guidance.
                </p>

                <h2>Accuracy and Availability</h2>
                <p>
                    Reasonable efforts may be made to provide useful and
                    accurate information, but no guarantee is made that the
                    Website or its content will always be accurate, complete,
                    current, secure, or available.
                </p>
                <p>
                    Content may be modified, corrected, removed, or updated at
                    any time without notice.
                </p>

                <h2>Disclaimer of Warranties</h2>
                <p>
                    The Website and its content are provided on an “as is” and
                    “as available” basis without warranties of any kind, either
                    express or implied, to the extent permitted by applicable
                    law.
                </p>
                <p>Use of the Website is at your own risk.</p>

                <h2>Limitation of Liability</h2>
                <p>
                    To the fullest extent permitted by applicable law, the
                    Website owner will not be liable for any direct, indirect,
                    incidental, consequential, special, or other damages arising
                    from your use of, or inability to use, the Website or its
                    content.
                </p>
                <p>
                    Some jurisdictions do not allow certain limitations of
                    liability, so these limitations may not apply to you.
                </p>

                <h2>Privacy</h2>
                <p>
                    Information collected through the Website is handled in
                    accordance with the Website&apos;s Privacy Policy, if
                    applicable.
                </p>
                <p>
                    Third-party services used by the Website, such as hosting
                    providers, analytics services, embedded content, or social
                    media platforms, may collect information according to their
                    own privacy policies.
                </p>

                <h2>Changes to These Terms</h2>
                <p>
                    These Terms may be updated periodically. Changes become
                    effective when the revised Terms are published on the
                    Website.
                </p>
                <p>
                    The “Last Updated” date at the top of this page indicates
                    when these Terms were most recently revised.
                </p>

                <h2>Governing Law</h2>
                <p>
                    These Terms are governed by the laws applicable in the
                    jurisdiction in which the Website owner operates, without
                    regard to conflict-of-law principles.
                </p>

                <h2>Contact</h2>
                <p>
                    If you have questions about these Terms &amp; Conditions,
                    please contact the Website owner using the contact
                    information provided on the Website.
                </p>
            </article>
        </ContentLayout>
    );
}
