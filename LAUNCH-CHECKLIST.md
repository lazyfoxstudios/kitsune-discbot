# Private pilot and broader-release review

Status: **Restricted text-chat pilot policy review completed November 25, 2026; authenticated Discord startup and live acceptance pending. No public rollout.**

Reviewed pilot facts: only the current slash-command input and fixed character instructions go to the operator-controlled local AI service; replies are channel-visible; the connector has no conversation-history store, account-data access, household tools or cloud-AI route. Connector operational logs are bounded, inference-service debug mode is off and proxy access logging is off. These checks do not establish zero retention, secure erasure or complete deletion from independent providers, support mail or backups. The published policies explain those limits.

The items below remain the broader-release review checklist. Checked code/configuration properties do not replace authenticated Discord acceptance, operator review for expanded audiences or legal requirements applicable to that expansion.

Record evidence in private operational records. Publish only the user-facing findings needed for accurate disclosure. None of the unchecked items below is a statement that a feature or safeguard is implemented.

- [ ] Confirm the operator's public identity, contact mailbox access and process for support, privacy and security reports.
- [ ] Inventory the actual Discord permissions, intents, invocation methods, message/history access, direct-message behavior, attachments and metadata received. Verify the minimum necessary permissions and accurately describe the scope.
- [ ] Trace a test message through the configured AI processing path. Identify all model/hosting providers and recipients, applicable terms, processing locations and any cross-border transfers. Verify whether providers retain prompts, permit human review or use content for training. Do not assume local-only processing.
- [ ] Inventory stored messages, replies, identifiers, conversation context, diagnostic logs and support records. Verify access by operators and service providers, including debugging and abuse handling.
- [ ] Set and test retention for each category, including logs and backups. Identify legal exceptions. Publish actual periods or clear determination criteria; do not promise zero retention or immediate deletion without evidence.
- [ ] Test a deletion request end to end, identity verification with minimal data, conversation removal, logs and backup expiry. Explain the limits of deleting messages held by Discord, server members or independent providers. Do not promise a response deadline that is not supported.
- [ ] Verify security controls, access restrictions, credential handling and incident response. Review Discord's notification duties and applicable law; publish only accurate security statements.
- [ ] Confirm purposes, sharing, any sale/advertising/training uses, applicable legal bases and user rights. Review the audience and jurisdictions served, minors' requirements and any required notices or consent before processing.
- [ ] Review Terms for the actual operator and jurisdictions. Keep legally required consumer and privacy rights intact. No governing law, arbitration clause or invented legal entity has been assumed in these drafts.
- [x] Replace draft placeholders for the restricted pilot with reviewed practices, a dated pilot applicability statement and a material-change notification method. Retain version history. Re-review before expansion.
- [ ] Verify that the final policy links are publicly reachable over HTTPS and accessible within the bot before use. Populate the Discord Developer Portal with the final Terms and Privacy URLs.
- [ ] Verify private access and actual basic text-chat behavior. Keep public invitation and additional feature claims absent until intentionally approved.

Primary references: [Discord Developer Terms, including User Privacy and Security](https://support-dev.discord.com/hc/en-us/articles/8562894815383-Discord-Developer-Terms-of-Service), [Discord Developer Policy](https://support-dev.discord.com/hc/en-us/articles/8563934450327-Discord-Developer-Policy).
