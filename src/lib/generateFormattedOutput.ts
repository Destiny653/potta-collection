import { SurveySchemaType } from './validation';
import { ImplementationExtent, BarrierSignificance } from '@/types/survey';

export const generateFormattedOutput = (data: SurveySchemaType): string => {
  const styles = `
    <style>
      :root {
        --primary: #1a365d;
        --secondary: #3182ce;
        --success: #38a169;
        --bg: #f8fafc;
        --text: #2d3748;
        --border: #e2e8f0;
      }
      body { 
        font-family: 'Inter', system-ui, -apple-system, sans-serif; 
        color: var(--text); 
        line-height: 1.6; 
        padding: 20px; 
        background: var(--bg);
        margin: 0;
      }
      .container { 
        max-width: 900px; 
        margin: 0 auto; 
        background: white;
        border: 1px solid var(--border); 
        border-radius: 12px; 
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        overflow: hidden; 
      }
      .header { 
        background: var(--primary); 
        color: white; 
        padding: 40px 24px; 
        text-align: center; 
        border-bottom: 4px solid var(--secondary);
      }
      .header h1 { margin: 0; font-size: 2rem; font-weight: 800; letter-spacing: -0.025em; }
      .header p { margin: 8px 0 0; opacity: 0.9; font-size: 0.9rem; }
      
      .section { padding: 32px; border-bottom: 1px solid var(--border); }
      .section:last-child { border-bottom: none; }
      .section-title { 
        font-size: 1.5rem; 
        font-weight: 700; 
        color: var(--primary); 
        margin-bottom: 24px; 
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .section-title::after {
        content: '';
        flex: 1;
        height: 2px;
        background: var(--border);
      }

      .field { margin-bottom: 20px; }
      .label { font-weight: 700; color: #4a5568; font-size: 0.9rem; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em; }
      .value { 
        color: #1a202c; 
        background: #f1f5f9;
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 1rem;
        border-left: 4px solid var(--secondary);
      }
      
      table { width: 100%; border-collapse: separate; border-spacing: 0; margin-top: 16px; border-radius: 8px; border: 1px solid var(--border); overflow: hidden; }
      th, td { padding: 12px 16px; text-align: left; font-size: 0.85rem; border-bottom: 1px solid var(--border); }
      th { background-color: #f8fafc; font-weight: 700; color: #4a5568; }
      tr:last-child td { border-bottom: none; }
      
      .selected { background-color: #ebf8ff; color: #2c5282; font-weight: 700; }
      .check-cell { text-align: center; width: 100px; }
      .check-icon { 
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        background: var(--success);
        color: white;
        border-radius: 50%;
        font-size: 14px;
      }
      
      .tag-container { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
      .tag { 
        display: inline-block; 
        background: #f1f5f9; 
        border-radius: 20px; 
        padding: 6px 14px; 
        font-size: 0.8rem; 
        border: 1px solid var(--border); 
        color: #64748b;
      }
      .tag.selected { 
        background: var(--secondary); 
        color: white; 
        border-color: var(--secondary);
        font-weight: 600;
      }

      .meta-grid { 
        display: grid; 
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
        gap: 20px; 
      }
    </style>
  `;

  const getDisplayValue = (field: string, otherValue?: string) => {
    if (field === 'Other (please specify)' && otherValue) {
      return otherValue;
    }
    return field;
  };

  const renderImplementationExtentTable = (title: string, practices: Record<string, string>) => {
    const extents = Object.values(ImplementationExtent);
    return `
      <div class="field">
        <div class="label">${title}</div>
        <table>
          <thead>
            <tr>
              <th>Practice</th>
              ${extents.map(e => `<th class="check-cell">${e}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${Object.entries(practices).map(([key, value]) => `
              <tr>
                <td>${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</td>
                ${extents.map(e => `
                  <td class="check-cell ${value === e ? 'selected' : ''}">
                    ${value === e ? '<span class="check-icon">✓</span>' : ''}
                  </td>
                `).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  };

  const renderBarrierSignificanceTable = (practices: Record<string, string>) => {
    const significances = Object.values(BarrierSignificance);
    return `
      <div class="field">
        <div class="label">Barrier Significance</div>
        <table>
          <thead>
            <tr>
              <th>Barrier</th>
              ${significances.map(s => `<th class="check-cell">${s}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${Object.entries(practices).map(([key, value]) => `
              <tr>
                <td>${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</td>
                ${significances.map(s => `
                  <td class="check-cell ${value === s ? 'selected' : ''}">
                    ${value === s ? '<span class="check-icon">✓</span>' : ''}
                  </td>
                `).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  };

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ESG Survey Response - ${data.sectionA.company}</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>ESG Telecom Survey</h1>
          <p>Submission ID: ${Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
          <p>Recorded on: ${new Date().toLocaleString()}</p>
        </div>

        <div class="section">
          <div class="section-title">A. Respondent Profile</div>
          <div class="meta-grid">
            <div class="field">
              <div class="label">Company</div>
              <div class="value">${data.sectionA.company}</div>
            </div>
            <div class="field">
              <div class="label">Role</div>
              <div class="value">${getDisplayValue(data.sectionA.role, (data.sectionA as any).roleOther)}</div>
            </div>
            <div class="field">
              <div class="label">Department</div>
              <div class="value">${getDisplayValue(data.sectionA.department, (data.sectionA as any).departmentOther)}</div>
            </div>
            <div class="field">
              <div class="label">Experience</div>
              <div class="value">${data.sectionA.telecomExperience}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">B. Awareness & Strategy</div>
          <div class="field">
            <div class="label">ESG Familiarity</div>
            <div class="value">${data.sectionB.familiarityWithESG}</div>
          </div>
          <div class="field">
            <div class="label">Sustainability Practice Level</div>
            <div class="value">${data.sectionB.sustainabilityPracticeLevel}</div>
          </div>
          <div class="field">
            <div class="label">ESG Reporting Status</div>
            <div class="value">${data.sectionB.esgReporting}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">C. Practice Maturity Matrix</div>
          ${renderImplementationExtentTable('Environmental Practices', data.sectionC.environmental)}
          ${renderImplementationExtentTable('Social Practices', data.sectionC.social)}
          ${renderImplementationExtentTable('Governance Practices', data.sectionC.governance)}
        </div>

        <div class="section">
          <div class="section-title">D. Financial Impact & Value</div>
          <div class="field">
          <div class="label">ESG Importance</div>
          <div class="value">${data.sectionD.esgImportance}</div>
        </div>
        <div class="field">
          <div class="label">Associated Financial Benefits</div>
          <div class="tag-container">
            ${data.sectionD.financialBenefits.map(b => `<span class="tag selected">✓ ${b}</span>`).join('')}
          </div>
        </div>
        <div class="field">
          <div class="label">Profitability Agreement</div>
          <div class="value">${data.sectionD.profitabilityAgreement}</div>
        </div>
        <div class="field">
          <div class="label">Measurable Link</div>
          <div class="value">${data.sectionD.measurableLink}</div>
        </div>
        </div>

        <div class="section">
          <div class="section-title">E. Challenges & Barriers</div>
          <div class="field">
            <div class="label">Primary Strategic Challenges</div>
            <div class="tag-container">
              ${data.sectionE.strategicChallenges.map(c => `<span class="tag selected">⚠ ${c}</span>`).join('')}
            </div>
          </div>
          ${renderBarrierSignificanceTable(data.sectionE.barrierSignificance)}
        </div>

        <div class="section">
          <div class="section-title">F. Internal Readiness</div>
          <div class="field">
            <div class="label">Readiness Level</div>
            <div class="value">${data.sectionF.readiness}</div>
          </div>
          <div class="field">
            <div class="label">Dedicated ESG Team</div>
            <div class="value">${data.sectionF.dedicatedESGTeam}</div>
          </div>
          <div class="field">
            <div class="label">Tracked Performance Indicators</div>
            <div class="tag-container">
              ${data.sectionF.trackedIndicators.map(i => `<span class="tag selected">● ${i}</span>`).join('')}
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">G. Strategic Recommendations</div>
          <div class="field">
            <div class="value" style="min-height: 100px; white-space: pre-wrap;">${data.sectionG.recommendations || 'No recommendations provided.'}</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
};
