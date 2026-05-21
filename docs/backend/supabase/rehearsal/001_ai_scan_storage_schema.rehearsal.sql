-- DRAFT / LOCAL REHEARSAL ONLY / NOT APPLIED
-- Caesar AI Scan — Supabase/Postgres migration rehearsal (T020)
-- Do not execute against production or any live Supabase project.

CREATE TABLE ai_scan_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_name TEXT NOT NULL,
    project_slug TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE ai_scan_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES ai_scan_projects(id) ON DELETE CASCADE,
    run_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL,
    scanner_version TEXT,
    raw_payload_manifest JSONB DEFAULT '{}'::jsonb,
    summary JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE ai_scan_findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID NOT NULL REFERENCES ai_scan_runs(id) ON DELETE CASCADE,
    finding_type TEXT NOT NULL,
    severity TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE ai_inventory_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES ai_scan_projects(id) ON DELETE CASCADE,
    component_type TEXT NOT NULL,
    name TEXT NOT NULL,
    version TEXT,
    source_path TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'identified',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE ai_review_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    finding_id UUID REFERENCES ai_scan_findings(id) ON DELETE SET NULL,
    reviewer_note TEXT,
    review_status TEXT NOT NULL DEFAULT 'pending',
    review_lane TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE ai_import_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID NOT NULL REFERENCES ai_scan_runs(id) ON DELETE CASCADE,
    import_status TEXT NOT NULL,
    import_mode TEXT NOT NULL DEFAULT 'offline_review_only',
    ledger_payload JSONB DEFAULT '{}'::jsonb,
    import_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS plan (future — not activated in rehearsal):
-- ALTER TABLE ai_scan_projects ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY tenant_projects ON ai_scan_projects
--   USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
