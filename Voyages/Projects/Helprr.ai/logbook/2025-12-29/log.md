---
date: 2025-12-29
---

## Log (Monitoring)

### What did I actually do?
- Researched AWS CodePipeline IAM permissions (AWS official docs)
- Created test S3 bucket and CodePipeline (was able to test without running service)
- Created IAM Policy (helprr-backend-developer-policy)
- Created IAM User Group (helprr-backend-developer-group)
- Created IAM User (Jin) and tested permissions
- Found and added missing permissions (ListRuleExecutions, RetryStageExecution)
- Wrote Setup Guide, Permission Verification Demo documents in Confluence

### References
- https://docs.aws.amazon.com/codepipeline/latest/userguide/security_iam_id-based-policy-examples.html
- https://docs.aws.amazon.com/codepipeline/latest/userguide/permissions-reference.html

### Notes
- Permission testing was possible without running pipeline (using empty S3 → S3 pipeline)
- Pipelines not visible when in different region
- Couldn't test Stop execution - no running pipeline
- Original plan: 3 docs (Setup Guide, Developer Guide, Maintenance Guide)
- Actual: 2 docs (Setup Guide, Permission Verification Demo) + Developer/Maintenance Guide later