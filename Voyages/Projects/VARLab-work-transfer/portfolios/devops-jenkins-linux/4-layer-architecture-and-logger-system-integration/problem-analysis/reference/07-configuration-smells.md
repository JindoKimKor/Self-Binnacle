[← Overview](README.md)

# Configuration Smells

* **Source:** Sharma's Taxonomy

**Context:** Issues in IaC, XML, JSON, YAML files regarding security and fragility.

**References:**
* [Configuration Smells: Taxonomy (T. Sharma)](https://www.tusharma.in/preprints/ConfigurationSmells_preprint.pdf)
* [Configuration Smell Detection (NSF/Par)](https://par.nsf.gov/servlets/purl/10343038)

| Type | Description |
| :--- | :--- |
| **Security/Consistency** | Hardcoded Password/Secret, Missing Configuration, Environment Dependent Configuration, Duplicate Configuration Keys, Unencrypted Sensitive Data, Inconsistent Configuration Naming, Overridden Configuration. |

## Detailed Descriptions

* **Hardcoded Password/Secret:** Storing credentials in plain text.
* **Missing Configuration:** Required configuration keys are absent.
* **Environment Dependent Configuration:** Configs that differ unpredictably between Dev/Prod.
* **Duplicate Configuration Keys:** Defining the same key multiple times.
* **Unencrypted Sensitive Data:** Sensitive values stored without encryption.
* **Inconsistent Configuration Naming:** Naming conventions vary across files/environments.
* **Overridden Configuration:** Excessive layering of config files making the final value hard to trace.

---
[← Overview](README.md)
