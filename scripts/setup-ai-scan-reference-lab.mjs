import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const CLONE_DATE = "2026-05-21";
const BASE_DIR = path.resolve('..', '_reference-lab', 'scan');

const ALLOWLIST = [
  { url: "https://github.com/kuzivaai/getregula.git", path: "direct-ai-compliance-scanners/getregula", category: "reference_only" },
  { url: "https://github.com/ark-forge/mcp-eu-ai-act.git", path: "direct-ai-compliance-scanners/mcp-eu-ai-act", category: "reference_only" },
  { url: "https://github.com/airblackbox/gateway.git", path: "direct-ai-compliance-scanners/airblackbox-gateway", category: "reference_only" },
  { url: "https://github.com/semgrep/semgrep.git", path: "scanner-engines/semgrep", category: "architecture_reference" },
  { url: "https://github.com/opengrep/opengrep.git", path: "scanner-engines/opengrep", category: "architecture_reference" },
  { url: "https://github.com/gitleaks/gitleaks.git", path: "security-scanners/gitleaks", category: "architecture_reference" },
  { url: "https://github.com/aquasecurity/trivy.git", path: "security-scanners/trivy", category: "architecture_reference" },
  { url: "https://github.com/ossf/scorecard.git", path: "security-scanners/scorecard", category: "reference_only" },
  { url: "https://github.com/anchore/syft.git", path: "bom-inventory/syft", category: "architecture_reference" },
  { url: "https://github.com/CycloneDX/cdxgen.git", path: "bom-inventory/cdxgen", category: "architecture_reference" },
  { url: "https://github.com/CycloneDX/specification.git", path: "bom-inventory/cyclonedx-specification", category: "standards_reference" },
  { url: "https://github.com/NVIDIA/garak.git", path: "llm-ai-security/garak", category: "product_benchmark" },
  { url: "https://github.com/protectai/modelscan.git", path: "llm-ai-security/modelscan", category: "product_benchmark" },
  { url: "https://github.com/verifywise-ai/verifywise.git", path: "governance-platforms/verifywise", category: "product_benchmark" },
  { url: "https://github.com/credo-ai/credoai_lens.git", path: "governance-platforms/credoai-lens", category: "product_benchmark" },
  { url: "https://github.com/credo-ai/credoai_connect.git", path: "governance-platforms/credoai-connect", category: "product_benchmark" },
  { url: "https://github.com/microsoft/responsible-ai-toolbox.git", path: "governance-platforms/responsible-ai-toolbox", category: "architecture_reference" },
  { url: "https://github.com/Trusted-AI/AIF360.git", path: "governance-platforms/aif360", category: "architecture_reference" },
  { url: "https://github.com/OWASP/www-project-ai-security-and-privacy-guide.git", path: "standards-taxonomies/owasp-ai-security-and-privacy-guide", category: "standards_reference" },
  { url: "https://github.com/OWASP/www-project-top-10-for-large-language-model-applications.git", path: "standards-taxonomies/owasp-llm-top-10", category: "standards_reference" }
];

function setupReferenceLab() {
  console.log(`🚀 Setting up AI Scan Reference Lab at: ${BASE_DIR}`);

  if (!fs.existsSync(BASE_DIR)) {
    fs.mkdirSync(BASE_DIR, { recursive: true });
  }

  const references = [];

  for (const repo of ALLOWLIST) {
    const fullPath = path.join(BASE_DIR, repo.path);
    const parentDir = path.dirname(fullPath);

    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }

    let status = "success";
    let headSha = null;
    let detectedLicenses = [];

    try {
      if (!fs.existsSync(fullPath)) {
        console.log(`📦 Cloning ${repo.url} into ${repo.path}...`);
        execSync(`git clone --depth 1 --filter=blob:none ${repo.url} ${fullPath}`, { stdio: 'ignore' });
      } else {
        console.log(`🔄 Repository ${repo.path} already exists. Fetching metadata...`);
        execSync(`git -C ${fullPath} fetch --depth 1`, { stdio: 'ignore' });
      }

      headSha = execSync(`git -C ${fullPath} rev-parse HEAD`).toString().trim();
      
      const files = fs.readdirSync(fullPath);
      detectedLicenses = files.filter(f => 
        /^(LICENSE|COPYING|NOTICE|README)(\.(md|txt|rtf))?$/i.test(f) || 
        f.toLowerCase().includes('license')
      );

    } catch (error) {
      console.error(`❌ Failed to process ${repo.url}: ${error.message}`);
      status = "failed";
    }

    references.push({
      name: path.basename(repo.path),
      url: repo.url,
      local_path: repo.path,
      category: repo.category,
      clone_status: status,
      clone_date: CLONE_DATE,
      head_sha: headSha,
      detected_license_files: detectedLicenses.join(',')
    });
  }

  const index = {
    last_updated: CLONE_DATE,
    references
  };

  fs.writeFileSync(path.join(BASE_DIR, 'REFERENCE_INDEX.json'), JSON.stringify(index, null, 2));
  console.log(`✅ REFERENCE_INDEX.json updated.`);
  
  if (!fs.existsSync(path.join(BASE_DIR, 'README.md'))) {
    fs.writeFileSync(path.join(BASE_DIR, 'README.md'), `# AI Scan Reference Lab\n\nReference implementations for Caesar AI Scan.`);
  }

  console.log('🎉 AI Scan Reference Lab setup complete.');
}

setupReferenceLab();
