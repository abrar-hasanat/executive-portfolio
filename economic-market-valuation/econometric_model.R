#!/usr/bin/env Rscript

required_packages <- c("lmtest", "ggplot2", "broom", "readr")
missing_packages <- required_packages[!vapply(required_packages, requireNamespace, logical(1), quietly = TRUE)]
if (length(missing_packages) > 0) {
  stop(sprintf("Install required R packages before running: %s", paste(missing_packages, collapse = ", ")))
}

library(lmtest)
library(ggplot2)
library(broom)
library(readr)

dataset <- read_csv("macro_valuation_dataset.csv", show_col_types = FALSE)
dataset$Sector <- factor(dataset$Sector)

model <- lm(
  Actual_Valuation_Multiple ~ Country_Risk_Score + Regulatory_Index + Interest_Rate_Pct + Sector,
  data = dataset
)

model_summary <- summary(model)
cat("\n=== Multivariate OLS Regression Summary ===\n")
print(model_summary)
cat(sprintf("\nTarget validation: R-squared = %.3f (target: 0.890)\n", model_summary$r.squared))

cat("\n=== Coefficients, Standard Errors, t-statistics, p-values ===\n")
print(tidy(model))

cat("\n=== Breusch-Pagan Heteroskedasticity Test ===\n")
print(bptest(model))

png("qq_residual_diagnostics.png", width = 1200, height = 900, res = 140)
qqnorm(residuals(model), main = "Q-Q Plot: OLS Residual Diagnostics")
qqline(residuals(model), col = "#3B82F6", lwd = 2)
dev.off()

png("residuals_vs_fitted.png", width = 1200, height = 900, res = 140)
plot(
  fitted(model), residuals(model),
  col = rgb(59, 130, 246, 90, maxColorValue = 255), pch = 16,
  xlab = "Fitted Valuation Multiple", ylab = "Residuals",
  main = "Residuals vs Fitted: Policy Risk Valuation Model"
)
abline(h = 0, col = "#EF4444", lwd = 2)
dev.off()

cat("\nDiagnostic plots written to qq_residual_diagnostics.png and residuals_vs_fitted.png\n")
