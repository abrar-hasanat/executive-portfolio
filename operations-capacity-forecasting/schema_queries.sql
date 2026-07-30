-- 1. Backlog & SLA Latency Query
SELECT
    department,
    AVG(CASE WHEN system_phase = 'Legacy Colleague ERP' THEN baseline_processing_hours END) AS legacy_avg_turnaround_hours,
    AVG(CASE WHEN system_phase = 'Workday ERP Cutover' THEN dmaic_optimized_hours END) AS workday_avg_turnaround_hours,
    (AVG(baseline_processing_hours) - AVG(dmaic_optimized_hours)) / NULLIF(AVG(baseline_processing_hours), 0) AS backlog_reduction_rate
FROM capacity_uat_data
GROUP BY department
ORDER BY backlog_reduction_rate DESC;

-- 2. UAT Script Integrity Check
SELECT
    department,
    system_phase,
    COUNT(*) AS scripts_executed,
    COUNT(*) FILTER (WHERE uat_script_pass_status = 'Passed') AS scripts_passed,
    COUNT(*) FILTER (WHERE uat_script_pass_status IN ('Failed', 'Flagged')) AS critical_findings,
    COUNT(*) FILTER (WHERE uat_script_pass_status = 'Passed')::DECIMAL / NULLIF(COUNT(*), 0) AS pass_rate
FROM capacity_uat_data
GROUP BY department, system_phase
HAVING COUNT(*) FILTER (WHERE uat_script_pass_status IN ('Failed', 'Flagged')) > 0
ORDER BY critical_findings DESC, pass_rate ASC;

-- 3. FTE Capacity Utilization Query
SELECT
    department,
    SUM(weekly_volume_handled) AS weekly_volume,
    SUM(team_member_fte_allocation) AS allocated_fte,
    SUM(weekly_volume_handled) / NULLIF(SUM(team_member_fte_allocation), 0) AS weekly_volume_per_fte,
    AVG(dmaic_optimized_hours) AS avg_optimized_turnaround_hours
FROM capacity_uat_data
GROUP BY department
ORDER BY weekly_volume_per_fte DESC;
