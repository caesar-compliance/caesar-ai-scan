import fs from 'fs/promises';
import path from 'path';

async function validate() {
  const schemaPath = 'schemas/supabase-storage-contract.schema.json';
  const sqlDraftPath = 'docs/backend/supabase/001_ai_scan_storage_schema.draft.sql';
  
  // 1. Verify files exist
  try {
    await fs.access(schemaPath);
    await fs.access(sqlDraftPath);
  } catch (err) {
    console.error('Validation Error: Required files not found.');
    process.exit(1);
  }

  // 2. Verify SQL draft marker
  const sqlContent = await fs.readFile(sqlDraftPath, 'utf8');
  if (!sqlContent.includes('DRAFT / NOT APPLIED')) {
    console.error('Validation Error: SQL draft not marked as DRAFT / NOT APPLIED.');
    process.exit(1);
  }

  // 3. Verify no secrets, emails, URLs
  const forbiddenPatterns = [/SUPABASE_URL/, /SUPABASE_KEY/, /@/];
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(sqlContent)) {
      console.error(`Validation Error: Forbidden pattern found: ${pattern}`);
      process.exit(1);
    }
  }

  console.log('✅ Supabase storage draft validation PASSED.');
}

validate();
