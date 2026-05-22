# Local SQL Compile Rehearsal Guide

This guide describes how to use the local SQL compile rehearsal boundary.

## Overview
The goal is to provide a deterministic, local validation layer for our SQL schema files before they are even considered for a real database.

## Validation Steps
1. Run `npm run sql:compile-rehearsal-report` to generate the report.
2. Run `npm run validate:sql-compile-rehearsal` to validate the generated report and the SQL files for forbidden patterns.

## Safety Constraints
- **NO** live database connections.
- **NO** external service calls.
- **NO** secrets or project-specific refs.
- **OFFLINE ONLY**.
