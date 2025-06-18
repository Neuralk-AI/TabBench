
import React from 'react';
import { Link } from 'react-router-dom';

const NeuralkLicensePage: React.FC = () => {
  return (
    <div className="space-y-6 md:space-y-10">
      <header className="pb-1 md:pb-1">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Neuralk AI License</h1>
        <p className="text-sm sm:text-md text-gray-600 mt-1">Version 1.0, June 2025</p>
        <Link to="/neuralk-license/" className="text-sm text-blue-600 hover:underline">https://dashboard.neuralk-ai.com/#/neuralk-license/</Link>
      </header>

      <section className="p-4 sm:p-6 bg-slate-50 rounded-lg shadow-md border border-slate-200 text-gray-700 text-sm leading-relaxed">
        <p className="mb-4">
          This license is a derivative of the Apache 2.0 license
          (<a href="http://www.apache.org/licenses/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">http://www.apache.org/licenses/</a>) with a single modification:
          The added Paragraph 10 introduces an enhanced attribution requirements.
        </p>

        <h2 className="text-lg font-semibold mt-6 mb-3 text-gray-800 uppercase">TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION</h2>

        <section className="mb-4">
          <h3 className="text-md font-semibold mb-2 text-gray-700">1. Definitions.</h3>
          <p className="mb-1">"License" shall mean the terms and conditions for use, reproduction, and distribution as defined by Sections 1 through 9 of this document.</p>
          <p className="mb-1">"Licensor" shall mean the copyright owner or entity authorized by the copyright owner that is granting the License.</p>
          <p className="mb-1">"Legal Entity" shall mean the union of the acting entity and all other entities that control, are controlled by, or are under common control with that entity. For the purposes of this definition, "control" means (i) the power, direct or indirect, to cause the direction or management of such entity, whether by contract or otherwise, or (ii) ownership of fifty percent (50%) or more of the outstanding shares, or (iii) beneficial ownership of such entity.</p>
          <p className="mb-1">"You" (or "Your") shall mean an individual or Legal Entity exercising permissions granted by this License.</p>
          <p className="mb-1">"Source" form shall mean the preferred form for making modifications, including but not limited to software source code, documentation source, and configuration files.</p>
          <p className="mb-1">"Object" form shall mean any form resulting from mechanical transformation or translation of a Source form, including but not limited to compiled object code, generated documentation, and conversions to other media types.</p>
          <p className="mb-1">"Work" shall mean the work of authorship, whether in Source or Object form, made available under the License, as indicated by a copyright notice that is included in or attached to the work (an example is provided in the Appendix below).</p>
          <p className="mb-1">"Derivative Works" shall mean any work, whether in Source or Object form, that is based on (or derived from) the Work and for which the editorial revisions, annotations, elaborations, or other modifications represent, as a whole, an original work of authorship. For the purposes of this License, Derivative Works shall not include works that remain separable from, or merely link (or bind by name) to the interfaces of, the Work and Derivative Works thereof.</p>
          <p className="mb-1">"Contribution" shall mean any work of authorship, including the original version of the Work and any modifications or additions to that Work or Derivative Works thereof, that is intentionally submitted to Licensor for inclusion in the Work by the copyright owner or by an individual or Legal Entity authorized to submit on behalf of the copyright owner. For the purposes of this definition, "submitted" means any form of electronic, verbal, or written communication sent to the Licensor or its representatives, including but not limited to communication on electronic mailing lists, source code control systems, and issue tracking systems that are managed by, or on behalf of, the Licensor for the purpose of discussing and improving the Work, but excluding communication that is conspicuously marked or otherwise designated in writing by the copyright owner as "Not a Contribution."</p>
          <p className="mb-1">"Contributor" shall mean Licensor and any individual or Legal Entity on behalf of whom a Contribution has been received by Licensor and subsequently incorporated within the Work.</p>
        </section>

        <section className="mb-4">
          <h3 className="text-md font-semibold mb-2 text-gray-700">2. Grant of Copyright License.</h3>
          <p>Subject to the terms and conditions of this License, each Contributor hereby grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable copyright license to reproduce, prepare Derivative Works of, publicly display, publicly perform, sublicense, and distribute the Work and such Derivative Works in Source or Object form.</p>
        </section>

        <section className="mb-4">
          <h3 className="text-md font-semibold mb-2 text-gray-700">3. Grant of Patent License.</h3>
          <p>Subject to the terms and conditions of this License, each Contributor hereby grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable (except as stated in this section) patent license to make, have made, use, offer to sell, sell, import, and otherwise transfer the Work, where such license applies only to those patent claims licensable by such Contributor that are necessarily infringed by their Contribution(s) alone or by combination of their Contribution(s) with the Work to which such Contribution(s) was submitted. If You institute patent litigation against any entity (including a cross-claim or counterclaim in a lawsuit) alleging that the Work or a Contribution incorporated within the Work constitutes direct or contributory patent infringement, then any patent licenses granted to You under this License for that Work shall terminate as of the date such litigation is filed.</p>
        </section>

        <section className="mb-4">
          <h3 className="text-md font-semibold mb-2 text-gray-700">4. Redistribution.</h3>
          <p>You may reproduce and distribute copies of the Work or Derivative Works thereof in any medium, with or without modifications, and in Source or Object form, provided that You meet the following conditions:</p>
          <ol className="list-[lower-alpha] list-inside ml-4 space-y-1 mt-2">
            <li>You must give any other recipients of the Work or Derivative Works a copy of this License; and</li>
            <li>You must cause any modified files to carry prominent notices stating that You changed the files; and</li>
            <li>You must retain, in the Source form of any Derivative Works that You distribute, all copyright, patent, trademark, and attribution notices from the Source form of the Work, excluding those notices that do not pertain to any part of the Derivative Works; and</li>
            <li>If the Work includes a "NOTICE" text file as part of its distribution, then any Derivative Works that You distribute must include a readable copy of the attribution notices contained within such NOTICE file, excluding those notices that do not pertain to any part of the Derivative Works, in at least one of the following places: within a NOTICE text file distributed as part of the Derivative Works; within the Source form or documentation, if provided along with the Derivative Works; or, within a display generated by the Derivative Works, if and wherever such third-party notices normally appear. The contents of the NOTICE file are for informational purposes only and do not modify the License. You may add Your own attribution notices within Derivative Works that You distribute, alongside or as an addendum to the NOTICE text from the Work, provided that such additional attribution notices cannot be construed as modifying the License.</li>
          </ol>
          <p className="mt-2">You may add Your own copyright statement to Your modifications and may provide additional or different license terms and conditions for use, reproduction, or distribution of Your modifications, or for any such Derivative Works as a whole, provided Your use, reproduction, and distribution of the Work otherwise complies with the conditions stated in this License.</p>
        </section>

        <section className="mb-4">
          <h3 className="text-md font-semibold mb-2 text-gray-700">5. Submission of Contributions.</h3>
          <p>Unless You explicitly state otherwise, any Contribution intentionally submitted for inclusion in the Work by You to the Licensor shall be under the terms and conditions of this License, without any additional terms or conditions. Notwithstanding the above, nothing herein shall supersede or modify the terms of any separate license agreement you may have executed with Licensor regarding such Contributions.</p>
        </section>

        <section className="mb-4">
          <h3 className="text-md font-semibold mb-2 text-gray-700">6. Trademarks.</h3>
          <p>This License does not grant permission to use the trade names, trademarks, service marks, or product names of the Licensor, except as required for reasonable and customary use in describing the origin of the Work and reproducing the content of the NOTICE file.</p>
        </section>

        <section className="mb-4">
          <h3 className="text-md font-semibold mb-2 text-gray-700">7. Disclaimer of Warranty.</h3>
          <p>Unless required by applicable law or agreed to in writing, Licensor provides the Work (and each Contributor provides its Contributions) on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied, including, without limitation, any warranties or conditions of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A PARTICULAR PURPOSE. You are solely responsible for determining the appropriateness of using or redistributing the Work and assume any risks associated with Your exercise of permissions under this License.</p>
        </section>

        <section className="mb-4">
          <h3 className="text-md font-semibold mb-2 text-gray-700">8. Limitation of Liability.</h3>
          <p>In no event and under no legal theory, whether in tort (including negligence), contract, or otherwise, unless required by applicable law (such as deliberate and grossly negligent acts) or agreed to in writing, shall any Contributor be liable to You for damages, including any direct, indirect, special, incidental, or consequential damages of any character arising as a result of this License or out of the use or inability to use the Work (including but not limited to damages for loss of goodwill, work stoppage, computer failure or malfunction, or any and all other commercial damages or losses), even if such Contributor has been advised of the possibility of such damages.</p>
        </section>

        <section className="mb-4">
          <h3 className="text-md font-semibold mb-2 text-gray-700">9. Accepting Warranty or Additional Liability.</h3>
          <p>While redistributing the Work or Derivative Works thereof, You may choose to offer, and charge a fee for, acceptance of support, warranty, indemnity, or other liability obligations and/or rights consistent with this License. However, in accepting such obligations, You may act only on Your own behalf and on Your sole responsibility, not on behalf of any other Contributor, and only if You agree to indemnify, defend, and hold each Contributor harmless for any liability incurred by, or claims asserted against, such Contributor by reason of your accepting any such warranty or additional liability.</p>
        </section>
        
        <hr className="my-6 border-gray-300"/>

        <h2 className="text-lg font-semibold mt-6 mb-3 text-gray-800 uppercase">ADDITIONAL PROVISION</h2>
        
        <section className="mb-4">
            <h3 className="text-md font-semibold mb-2 text-gray-700">10. Attribution Requirements</h3>
            <p className="mb-2">As a condition of using, modifying, or sharing the materials, you agree to the following:</p>
            <ol className="list-[lower-alpha] list-inside ml-4 space-y-2">
                <li>
                    Distribution of Materials: When you distribute or make publicly available the Work, any modifications of it, or any service or product that contains or is built upon its source code, you must:
                    <ol className="list-[lower-roman] list-inside ml-6 mt-1 space-y-1">
                        <li>Include the full text of this License with the distributed materials.</li>
                        <li>Feature the notice “Built with Neuralk-Foundry” in a prominent location on all related websites, user interfaces, blog entries, and in all product documentation or "about" sections.</li>
                    </ol>
                </li>
                <li>
                    Exception for Internal Use: The obligations outlined in the section 10 do not apply to private, internal use for the purposes of testing and benchmarking, so long as no part of the work or its results are communicated or made available to any external third party.
                </li>
            </ol>
        </section>

        <p className="mt-8 mb-4 font-semibold text-center text-gray-800 uppercase">END OF TERMS AND CONDITIONS</p>

        <pre className="bg-gray-100 p-3 rounded-md text-xs border border-gray-200 whitespace-pre-wrap">
{`   Copyright 2025 Neuralk-AI

   Licensed derived from the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       `}<Link to="/neuralk-license/" className="text-blue-600 hover:underline">https://dashboard.neuralk-ai.com/neuralk-license/</Link>{`

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.`}
        </pre>
      </section>
    </div>
  );
};

export default NeuralkLicensePage;
