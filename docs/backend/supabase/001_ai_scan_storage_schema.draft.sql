-- DRAFT / NOT APPLIED / FOR ARCHITECTURAL PLANNING ONLY
-- Caesar AI Scan - Future Storage Schema (Postgres/Supabase)

CREATE TABLE ai_scan_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE ai_scan_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES ai_scan_projects(id),
    run_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL,
    raw_payload_manifest JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE ai_scan_findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID REFERENCES ai_scan_runs(id),
    finding_type TEXT NOT NULL,
    details JSONB,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE ai_inventory_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES ai_scan_projects(id),
    component_type TEXT NOT NULL,
    name TEXT NOT NULL,
    version TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE ai_review_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    finding_id UUID REFERENCES ai_scan_findings(id),
    reviewer_note TEXT,
    review_status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE ai_import_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID REFERENCES ai_scan_runs(id),
    import_status TEXT NOT NULL,
    import_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Plan (Draft):
-- ALTER TABLE ai_scan_projects ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Tenant access" ON ai_scan_projects USING (tenant_id = auth.uid());
