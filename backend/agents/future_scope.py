from __future__ import annotations

from models import FutureScopeResult

_DOMAIN_KEYWORDS = {
    "machine learning": ["model", "training", "neural", "learning", "accuracy"],
    "healthcare": ["patient", "clinical", "medical", "disease", "diagnosis"],
    "nlp": ["language", "text", "corpus", "nlp", "linguistic"],
    "vision": ["image", "vision", "detection", "segmentation", "video"],
    "security": ["security", "attack", "encryption", "privacy", "threat"],
    "systems": ["latency", "throughput", "distributed", "cloud", "scalability"],
}


def _detect_domain(text: str) -> str:
    lower = text.lower()
    scores = {domain: sum(lower.count(k) for k in kws) for domain, kws in _DOMAIN_KEYWORDS.items()}
    best = max(scores, key=scores.get)
    return best if scores[best] > 0 else "general"


def generate_future_scope(full_text: str) -> FutureScopeResult:
    domain = _detect_domain(full_text)

    domain_extensions = {
        "machine learning": "Explore lighter-weight architectures for on-device / edge deployment.",
        "healthcare": "Validate findings on multi-site clinical data with IRB-approved trials.",
        "nlp": "Extend the approach to low-resource and multilingual settings.",
        "vision": "Evaluate robustness under real-world noise, occlusion, and domain shift.",
        "security": "Stress-test against adaptive and adversarial attackers in the wild.",
        "systems": "Benchmark under production-scale, multi-tenant workloads.",
        "general": "Broaden evaluation to a wider range of real-world datasets.",
    }

    return FutureScopeResult(
        short_term=[
            "Ablation studies isolating the contribution of each proposed component.",
            "Broader hyperparameter sweep to confirm result stability.",
            "Release of a minimal reproducible code artifact alongside the paper.",
        ],
        medium_term=[
            domain_extensions[domain],
            "Comparative study against 2-3 additional recent baselines.",
            "User or expert study to validate practical usefulness of the results.",
        ],
        long_term=[
            "Generalise the framework into a reusable toolkit/library for the community.",
            "Investigate theoretical guarantees or bounds behind the empirical results.",
            "Longitudinal study tracking real-world deployment outcomes over time.",
        ],
        industrial_applications=[
            "Package the core method as an internal tool for pilot deployment with an industry partner.",
            "Explore integration into an existing product pipeline as an optional module.",
        ],
        startup_opportunities=[
            "A narrow, well-scoped SaaS wrapper around the core technique for a specific vertical.",
            "Consulting/tooling offering that helps teams adopt the method in their own stack.",
        ],
        patent_ideas=[
            "If the core technique has a genuinely novel mechanism, a provisional patent "
            "on the specific algorithmic step (not the general problem) may be worth exploring "
            "with a patent attorney.",
        ],
        phd_extensions=[
            "Turn the current contribution into Chapter 1 of a thesis, with subsequent chapters "
            "each generalising one assumption made here (data, scale, or domain).",
        ],
        grant_opportunities=[
            "Early-career / seed research grants that fund exactly this kind of exploratory extension.",
            "University-industry collaborative grants if an industrial pilot partner is identified.",
        ],
    )
