# Vehicle Manual Knowledge Base

This directory defines the authoring contract for research-backed vehicle service knowledge.

## Purpose

The knowledge base is the structured authoring layer behind the vehicle manual. Research performed in ChatGPT can be converted into versioned repository changes and reviewed through GitHub before reaching `main`.

## Knowledge rules

1. Every technical claim must identify its applicable vehicle variant.
2. Every specification, procedure, diagnostic rule, or safety-critical statement must have a source reference.
3. Primary manufacturer documentation has precedence over secondary sources.
4. Facts must be separated from engineering interpretation and unverified information.
5. Missing information must remain explicitly unverified rather than being guessed.
6. External media must record its source and licensing status; copyrighted service-manual media must not be republished without permission.
7. Knowledge changes should be made on a dedicated branch and reviewed before merge to `main`.

## Source hierarchy

- `primary`: manufacturer service documentation
- `manufacturer-owner`: manufacturer owner documentation
- `secondary`: reputable repair/service references
- `community`: forums, community repair reports, and user experience
- `inference`: engineering interpretation derived from documented facts

## Recommended authoring flow

```text
research -> verify -> structure -> validate -> commit -> pull request -> review -> merge
```

The existing TypeScript domain models in `../domain/` remain the runtime contract. Knowledge content should be converted into those models rather than embedded directly in Vue components.
