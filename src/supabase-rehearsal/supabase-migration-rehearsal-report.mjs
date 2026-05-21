import fs from 'node:fs/promises';

const MANIFEST_PATH = 'docs/backend/supabase/rehearsal/migration-rehearsal.manifest.json';
const REQUIRED_TABLES = [
  'ai_scan_projects',
  'ai_scan_runs',
  'ai_scan_findings',
  'ai_inventory_components',
  'ai_review_items',
  'ai_import_ledger'
];

export async function buildMigrationRehearsalReport() {
  const manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, 'utf8'));
  const forwardSql = await fs.readFile(manifest.migration_files.forward_sql, 'utf8');
  const rollbackSql = await fs.readFile(manifest.migration_files.rollback_sql, 'utf8');

  const rollbackCoverage = REQUIRED_TABLES.map((table) => ({
    table,
    mentioned: rollbackSql.includes(table)
  }));

  const blockers = [
    'Live Supabase project configuration (supabase/config.toml) not created in T020',
    'Migrations not applied — rehearsal_status remains local_only_not_applied',
    'RLS policies planned but not activated in rehearsal SQL',
    'Service role keys and project refs must be supplied only in future controlled setup'
  ];

  return `# Supabase Migration Rehearsal Report (v0.20.0)

## Status
- **Rehearsal type:** ${manifest.rehearsal_type}
- **Rehearsal status:** ${manifest.rehearsal_status}
- **No migration applied:** confirmed (local files only, no database connection)

## Rehearsal SQL Files
| Role | Path |
| :--- | :--- |
| Forward | \`${manifest.migration_files.forward_sql}\` |
| Rollback | \`${manifest.migration_files.rollback_sql}\` |

## Source Contract
- Storage contract: \`${manifest.source_contract.supabase_storage_contract_schema}\`
- Draft SQL: \`${manifest.source_contract.schema_draft_sql}\`
- Import mapping: \`${manifest.source_contract.import_mapping_contract}\`

## Target Tables
${REQUIRED_TABLES.map((t) => `- \`${t}\` (${forwardSql.includes(t) ? 'forward' : 'missing'})`).join('\n')}

## Rollback Coverage
${rollbackCoverage.map(({ table, mentioned }) => `- \`${table}\`: ${mentioned ? 'covered' : '**missing**'}`).join('\n')}

## Safety Flags
| Flag | Value |
| :--- | :--- |
| no_live_supabase_connection | ${manifest.safety.no_live_supabase_connection} |
| no_database_writes | ${manifest.safety.no_database_writes} |
| no_applied_migrations | ${manifest.safety.no_applied_migrations} |
| no_project_ref | ${manifest.safety.no_project_ref} |
| no_secrets | ${manifest.safety.no_secrets} |
| local_rehearsal_only | ${manifest.safety.local_rehearsal_only} |

## Remaining Blockers Before Live Supabase
${blockers.map((b) => `- ${b}`).join('\n')}

## Warnings
${manifest.warnings.map((w) => `- ${w}`).join('\n')}
`;
}
