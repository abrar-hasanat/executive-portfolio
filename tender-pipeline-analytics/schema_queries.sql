-- Commercial Construction & Tender Pipeline Analytics | Bay Oceania C&T Ltd.
-- PostgreSQL and SQLite compatible analytical queries.
-- Assumes table name: tenders

-- 1. Pipeline Stage Value & Risk-Adjusted Revenue
-- Calculates total raw contract value and weighted expected revenue by sector and stage.
SELECT
    Sector,
    Stage,
    COUNT(Tender_ID) AS Tender_Count,
    SUM(Expected_Contract_Value_USD) AS Total_Raw_Contract_Value_USD,
    ROUND(SUM(Expected_Contract_Value_USD * (Win_Probability_Pct / 100.0)), 2) AS Weighted_Expected_Revenue_USD,
    ROUND(AVG(Win_Probability_Pct), 2) AS Average_Win_Probability_Pct
FROM tenders
GROUP BY Sector, Stage
ORDER BY Sector, Stage;

-- 2. Turnaround Bottleneck Analysis
-- Compares proposal turnaround before and after DMAIC workflow optimization.
WITH turnaround_summary AS (
    SELECT
        CASE
            WHEN DMAIC_Optimized = 1 OR DMAIC_Optimized = TRUE THEN 'Post-DMAIC Optimized'
            ELSE 'Pre-DMAIC Baseline'
        END AS Workflow_Cohort,
        COUNT(Tender_ID) AS Tender_Count,
        AVG(Submission_Turnaround_Days) AS Avg_Submission_Turnaround_Days
    FROM tenders
    GROUP BY Workflow_Cohort
), pivoted AS (
    SELECT
        MAX(CASE WHEN Workflow_Cohort = 'Pre-DMAIC Baseline' THEN Avg_Submission_Turnaround_Days END) AS Pre_DMAIC_Avg_Days,
        MAX(CASE WHEN Workflow_Cohort = 'Post-DMAIC Optimized' THEN Avg_Submission_Turnaround_Days END) AS Post_DMAIC_Avg_Days
    FROM turnaround_summary
)
SELECT
    ROUND(Pre_DMAIC_Avg_Days, 2) AS Pre_DMAIC_Avg_Days,
    ROUND(Post_DMAIC_Avg_Days, 2) AS Post_DMAIC_Avg_Days,
    ROUND(Pre_DMAIC_Avg_Days - Post_DMAIC_Avg_Days, 2) AS Days_Saved,
    ROUND(((Pre_DMAIC_Avg_Days - Post_DMAIC_Avg_Days) / Pre_DMAIC_Avg_Days) * 100.0, 2) AS Turnaround_Reduction_Pct
FROM pivoted;

-- 3. High-ROI Target Identification
-- Flags high-priority opportunities for executive focus.
SELECT
    Tender_ID,
    Client_Name,
    Sector,
    Stage,
    Expected_Contract_Value_USD,
    Win_Probability_Pct,
    Profit_Margin_Pct,
    Risk_Rating,
    ROUND(Expected_Contract_Value_USD * (Win_Probability_Pct / 100.0), 2) AS Weighted_Expected_Revenue_USD,
    ROUND(Expected_Contract_Value_USD * (Profit_Margin_Pct / 100.0), 2) AS Expected_Gross_Profit_USD
FROM tenders
WHERE Expected_Contract_Value_USD > 1000000
  AND Win_Probability_Pct > 50
  AND Profit_Margin_Pct > 18
ORDER BY Weighted_Expected_Revenue_USD DESC, Expected_Gross_Profit_USD DESC;
