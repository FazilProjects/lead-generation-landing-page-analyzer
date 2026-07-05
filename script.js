(function () {
  "use strict";

  const form = document.getElementById("auditForm");
  const output = document.getElementById("auditOutput");
  const exportButton = document.getElementById("exportButton");
  const resetButton = document.getElementById("resetButton");
  const demoButton = document.getElementById("demoButton");
  const previewScore = document.getElementById("previewScore");
  const previewRisk = document.getElementById("previewRisk");
  const dashboardGrid = document.querySelector(".dashboard-grid");

  const inputs = {
    brief: document.getElementById("landingBrief"),
    businessType: document.getElementById("businessType"),
    trafficSource: document.getElementById("trafficSource"),
    offer: document.getElementById("offer"),
    audience: document.getElementById("audience"),
    cta: document.getElementById("cta"),
    fields: document.getElementById("formFields"),
    url: document.getElementById("landingUrl")
  };

  const demoData = {
    brief:
      "A local dental clinic landing page focused on teeth cleaning, whitening, emergency dental care, and family dental services.",
    businessType: "Local service business",
    trafficSource: "Google Ads",
    offer: "Free dental consultation + 20% off first teeth cleaning",
    audience: "People in Karachi looking for a trusted dentist or dental clinic",
    cta: "Book Free Consultation",
    fields: "Name, phone number, service needed, preferred appointment time",
    url: ""
  };

  const businessGuidance = {
    "Local service business": {
      service: "local service",
      angle: "clear service area, proof, trust, fast booking, and a specific offer",
      headline: "Get trusted {service} in {location} with a clear next step",
      secondaryCta: "Call or view available appointment times"
    },
    "Ecommerce brand": {
      service: "product offer",
      angle: "product clarity, visual proof, objections, shipping details, and a low-friction buy path",
      headline: "Shop {service} built for {audience}",
      secondaryCta: "View best sellers"
    },
    "Coaching / consulting": {
      service: "consulting offer",
      angle: "clear outcome, credibility, qualification, proof, and a consultative CTA",
      headline: "Book a focused strategy session for {audience}",
      secondaryCta: "See client results"
    },
    "SaaS / software": {
      service: "software solution",
      angle: "problem clarity, product proof, trial/demo fit, feature-benefit flow, and low-risk signup",
      headline: "Start solving {service} with a simpler workflow",
      secondaryCta: "Watch product demo"
    },
    "Agency / B2B service": {
      service: "B2B service",
      angle: "business outcome, authority, case proof, qualification, and a useful sales conversation",
      headline: "Turn {audience} into better qualified pipeline",
      secondaryCta: "Review case studies"
    },
    "Course / education": {
      service: "course offer",
      angle: "learning outcome, instructor credibility, modules, proof, and enrollment clarity",
      headline: "Learn {service} with a practical step-by-step path",
      secondaryCta: "View course outline"
    }
  };

  const trafficGuidance = {
    "Google Ads": {
      focus: "search intent, message match, fast CTA visibility, and keyword-level clarity",
      hero: "Match the searcher's exact intent in the headline and show the CTA above the fold.",
      ctaPlacement: "Place the main CTA in the hero, after the offer block, beside the form, and in the final CTA section.",
      risk: "Paid search traffic can leave quickly if the headline does not match the ad promise."
    },
    "Meta Ads": {
      focus: "hook strength, offer clarity, visual proof, mobile reading flow, and social trust",
      hero: "Lead with a sharp hook, a proof-backed offer, and mobile-first visual context.",
      ctaPlacement: "Place the CTA after the hero hook, after proof, near the form, and in a sticky mobile position.",
      risk: "Social traffic is colder, so weak proof or a vague offer can reduce lead intent."
    },
    "Organic traffic": {
      focus: "SEO clarity, trust depth, content flow, objections, and educational sections",
      hero: "Make the page topic obvious, then support it with trust, FAQs, and useful context.",
      ctaPlacement: "Place the CTA after the hero, after educational sections, near FAQs, and at the bottom.",
      risk: "Organic visitors may compare options, so thin content and weak trust can reduce inquiries."
    },
    "Mixed traffic": {
      focus: "message consistency, segmented CTA paths, proof density, and clear next actions",
      hero: "Keep the core offer consistent while giving visitors more than one relevant path forward.",
      ctaPlacement: "Place the primary CTA in the hero and add secondary CTA paths for visitors with different intent levels.",
      risk: "Mixed traffic needs a flexible message, because every visitor may arrive with a different level of intent."
    }
  };

  const trustItems = [
    {
      title: "Reviews/testimonials",
      terms: ["review", "reviews", "testimonial", "testimonials", "rating", "ratings"],
      why: "Social proof reduces uncertainty and helps visitors believe the promise."
    },
    {
      title: "Case studies or before/after proof",
      terms: ["case study", "case studies", "before/after", "before and after", "client results", "customer results", "transformation"],
      why: "Outcome proof makes the value feel concrete instead of theoretical."
    },
    {
      title: "Credentials/certifications",
      terms: ["certified", "licensed", "credential", "award", "doctor", "expert", "specialist"],
      why: "Authority signals help users trust the business before sharing contact details."
    },
    {
      title: "Real business photos",
      terms: ["photo", "photos", "team", "clinic", "office", "studio", "real"],
      why: "Real visuals make the business feel more legitimate and easier to remember."
    },
    {
      title: "Guarantee/risk reversal",
      terms: ["guarantee", "risk free", "no obligation", "free consultation", "refund"],
      why: "Risk reversal lowers the perceived cost of taking the next step."
    },
    {
      title: "Contact details",
      terms: ["phone", "email", "address", "contact", "whatsapp", "location"],
      why: "Visible contact details reassure visitors that the business is reachable."
    },
    {
      title: "Privacy note near form",
      terms: ["privacy", "secure", "confidential", "spam"],
      why: "A privacy note can reduce form anxiety and increase lead submissions."
    },
    {
      title: "FAQ section",
      terms: ["faq", "questions", "answers", "objection"],
      why: "FAQs handle doubts that would otherwise stop a visitor from converting."
    }
  ];

  const explicitTrustProofTerms = [
    "review",
    "reviews",
    "testimonial",
    "testimonials",
    "google review",
    "google reviews",
    "case study",
    "case studies",
    "before and after",
    "before/after",
    "credential",
    "credentials",
    "certified",
    "certification",
    "certifications",
    "licensed",
    "client results",
    "customer results",
    "results",
    "guarantee",
    "risk free",
    "real business photos",
    "real photos",
    "team photos",
    "clinic photos"
  ];

  let currentAudit = null;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    const audit = buildAudit(readInputs());
    currentAudit = audit;
    renderAudit(audit);
    updatePreview(audit.overallScore, audit.risk.level);
    exportButton.disabled = false;
    output.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  exportButton.addEventListener("click", function () {
    if (!currentAudit) {
      return;
    }

    const blob = new Blob([formatAuditText(currentAudit)], {
      type: "text/plain;charset=utf-8"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "landing-page-audit-report.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  });

  resetButton.addEventListener("click", resetDashboard);

  demoButton.addEventListener("click", function () {
    fillForm(demoData);
    const audit = buildAudit(readInputs());
    currentAudit = audit;
    renderAudit(audit);
    updatePreview(audit.overallScore, audit.risk.level);
    exportButton.disabled = false;
    output.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  function readInputs() {
    return {
      brief: inputs.brief.value.trim(),
      businessType: inputs.businessType.value,
      trafficSource: inputs.trafficSource.value,
      offer: inputs.offer.value.trim(),
      audience: inputs.audience.value.trim(),
      cta: inputs.cta.value.trim(),
      fieldsRaw: inputs.fields.value.trim(),
      url: inputs.url.value.trim(),
      fields: parseFields(inputs.fields.value)
    };
  }

  function fillForm(data) {
    inputs.brief.value = data.brief;
    inputs.businessType.value = data.businessType;
    inputs.trafficSource.value = data.trafficSource;
    inputs.offer.value = data.offer;
    inputs.audience.value = data.audience;
    inputs.cta.value = data.cta;
    inputs.fields.value = data.fields;
    inputs.url.value = data.url;
  }

  function resetDashboard() {
    form.reset();
    currentAudit = null;
    exportButton.disabled = true;
    if (dashboardGrid) {
      dashboardGrid.classList.remove("report-generated");
    }
    updatePreview(84, "Medium risk");
    output.className = "empty-state";
    output.innerHTML = `
      <div class="empty-icon" aria-hidden="true">01</div>
      <h3>Waiting for landing page brief</h3>
      <p>Fill in the short brief and click Generate Landing Page Audit to create a complete local audit report.</p>
    `;
    inputs.brief.focus();
  }

  function buildAudit(data) {
    const scores = calculateScores(data);
    const overallScore = calculateOverallScore(scores, data);
    const risk = getRisk(overallScore);
    const context = {
      business: businessGuidance[data.businessType],
      traffic: trafficGuidance[data.trafficSource],
      service: inferService(data),
      location: extractLocation(data.audience) || "your service area",
      audience: data.audience || "the target audience",
      offer: data.offer || "the core offer",
      cta: data.cta || "the primary CTA"
    };

    return {
      data,
      context,
      scores,
      overallScore,
      risk,
      summary: makeSummary(data, scores, risk, context),
      hero: makeHeroAnalysis(data, scores, context),
      offerAudit: makeOfferAudit(data, scores, context),
      ctaAudit: makeCtaAudit(data, scores, context),
      trustChecklist: makeTrustChecklist(data),
      formAdvice: makeFormAdvice(data, scores),
      mobileChecklist: makeMobileChecklist(data, context),
      priorityFixes: makePriorityFixes(data, scores, context),
      risks: makeRisks(data, scores, context),
      improvements: makeImprovements(data, scores, context),
      structure: makeStructure(data, context),
      plan: makeSevenDayPlan(data, context)
    };
  }

  function calculateScores(data) {
    const offerScore = scoreOffer(data);
    const ctaScore = scoreCta(data);
    const formScore = scoreForm(data);
    const trustScore = scoreTrust(data);
    const heroScore = scoreHero(data, offerScore, ctaScore);
    const audienceMatchScore = scoreAudienceMatch(data);
    const mobileScore = scoreMobile(data, ctaScore, formScore);
    const focusScore = scoreConversionFocus(offerScore, ctaScore, formScore, trustScore, data);

    return {
      offerClarity: {
        label: "Offer clarity",
        score: offerScore,
        status: scoreStatus(offerScore),
        explanation:
          offerScore >= 9
            ? "The offer is clear and specific, but still needs proof and page context to convert well."
            : offerScore >= 8
              ? "The offer is clear enough to support the page, but it should be repeated near the CTA and form."
            : offerScore >= 6
              ? "The offer has a usable direction, but the value and conditions can be sharper."
              : "The offer needs more detail so visitors know what they get."
      },
      heroMessage: {
        label: "Hero message",
        score: heroScore,
        status: scoreStatus(heroScore),
        explanation:
          heroScore >= 8
            ? "The brief gives enough context for a clear hero, but the headline still needs focused editing."
            : heroScore >= 6
              ? "The hero can work, but it should state the service, value, and CTA faster."
              : "The hero needs a clearer promise before paid or organic traffic arrives."
      },
      audienceMatch: {
        label: "Audience-message match",
        score: audienceMatchScore,
        status: scoreStatus(audienceMatchScore),
        explanation:
          audienceMatchScore >= 8
            ? "The audience context can be reflected directly in the page message."
            : audienceMatchScore >= 6
              ? "The audience is named, but the page should echo their intent and objections."
              : "The target visitor needs to be defined more clearly."
      },
      ctaStrength: {
        label: "CTA strength",
        score: ctaScore,
        status: scoreStatus(ctaScore),
        explanation:
          ctaScore >= 8
            ? "The CTA is action-led and easy to understand."
            : ctaScore >= 6
              ? "The CTA is usable, but it could promise a clearer next step."
              : "The CTA is too vague or passive for a lead generation page."
      },
      trustProof: {
        label: "Trust proof",
        score: trustScore,
        status: hasExplicitTrustProof(data) ? scoreStatus(trustScore) : "Needs proof",
        explanation:
          trustScore >= 8
            ? "The brief includes strong trust signals that should be made visible."
            : hasExplicitTrustProof(data)
              ? "Some proof is mentioned, but it should be more specific and closer to the form."
              : "No clear trust proof is mentioned, so add visible proof before asking for contact details."
      },
      formFriction: {
        label: "Lead form friction",
        score: formScore,
        status: scoreStatus(formScore),
        explanation:
          formScore >= 8
            ? "The form is simple enough for a first conversion."
            : formScore >= 6
              ? "The form is acceptable, but a few fields may be optional."
              : "The form asks for too much before trust has been built."
      },
      mobileReadiness: {
        label: "Mobile readiness",
        score: mobileScore,
        status: "Assumption-based",
        explanation:
          mobileScore >= 8
            ? "Estimated from the brief: the CTA and form look mobile-friendly, but the final page still needs manual testing."
            : mobileScore >= 6
              ? "Estimated from the brief: mobile can work if CTA visibility, form spacing, and section length are checked manually."
              : "Estimated from the brief: mobile visitors may struggle unless the form and page sections are simplified."
      },
      conversionFocus: {
        label: "Conversion focus",
        score: focusScore,
        status: scoreStatus(focusScore),
        explanation:
          focusScore >= 8
            ? "The page can stay focused around one conversion action."
            : focusScore >= 6
              ? "The page has a conversion path, but proof and CTA consistency need work."
              : "The page risks scattering attention across too many weak signals."
      }
    };
  }

  function scoreOffer(data) {
    const offer = normalize(data.offer);
    let score = offer ? 4 : 1;

    if (wordCount(offer) >= 4) score += 1;
    if (wordCount(offer) >= 8) score += 1;
    if (includesAny(offer, ["free", "%", "off", "discount", "consultation", "trial", "demo", "quote", "audit", "plan"])) {
      score += 1;
    }
    if (/\d/.test(offer)) score += 1;
    if (includesAny(offer, ["today", "first", "limited", "appointment", "strategy", "cleaning", "diagnostic"])) {
      score += 1;
    }
    if (data.audience) score += 1;
    if (includesAny(offer, ["best service", "great deal", "special offer", "quality service"]) && wordCount(offer) < 6) {
      score -= 2;
    }
    if (!data.brief) score -= 1;

    return clamp(score, 1, 9);
  }

  function scoreCta(data) {
    const cta = normalize(data.cta);
    let score = cta ? 4 : 1;
    const vagueCtas = ["submit", "learn more", "click here", "send", "continue", "more info", "contact us", "contact", "inquire"];

    if (vagueCtas.includes(cta)) score -= 3;
    if (includesAny(cta, ["book", "get", "request", "schedule", "start", "claim", "reserve", "download", "call", "join"])) {
      score += 2;
    }
    if (includesAny(cta, ["free", "quote", "audit", "consultation", "demo", "appointment", "plan"])) {
      score += 2;
    }
    if (wordCount(cta) >= 2 && wordCount(cta) <= 5) score += 1;
    if (wordCount(cta) > 6) score -= 1;
    if (!data.offer) score -= 1;

    return clamp(score, 1, 10);
  }

  function scoreForm(data) {
    const fields = data.fields;
    let score = fields.length ? 7 : 4;
    const highFriction = ["address", "budget", "company size", "income", "cnic", "full address", "website", "message"];
    const highFrictionCount = fields.filter((field) => includesAny(normalize(field), highFriction)).length;

    if (fields.length >= 3 && fields.length <= 4) score += 1;
    if (fields.length === 1 || fields.length === 2) score += 1;
    if (fields.length > 5) score -= (fields.length - 5) + 1;
    if (fields.length > 6) score -= 2;
    if (fields.length > 8) score -= 2;
    score -= highFrictionCount;
    if (fields.some((field) => includesAny(normalize(field), ["phone", "email", "whatsapp"]))) score += 1;
    if (fields.some((field) => includesAny(normalize(field), ["preferred", "appointment", "service needed"]))) score += 1;

    return clamp(score, 1, 10);
  }

  function scoreTrust(data) {
    const combined = normalize(`${data.brief} ${data.offer} ${data.audience}`);
    const proofMatches = explicitTrustProofTerms.filter((term) => combined.includes(normalize(term))).length;

    if (!proofMatches) {
      return wordCount(data.brief) >= 12 && data.offer && data.audience ? 5 : 4;
    }

    let score = 6 + Math.min(proofMatches, 3);
    if (includesAny(combined, ["google reviews", "case studies", "before/after", "client results", "certifications", "real business photos"])) {
      score += 1;
    }
    if (!data.brief || !data.offer || !data.audience) score -= 1;

    return clamp(score, 1, 10);
  }

  function scoreHero(data, offerScore, ctaScore) {
    const brief = normalize(data.brief);
    let score = brief ? 4 : 2;

    if (wordCount(brief) >= 10) score += 1;
    if (wordCount(brief) >= 18) score += 1;
    if (data.offer) score += offerScore >= 7 ? 1 : 0;
    if (data.cta) score += ctaScore >= 7 ? 1 : 0;
    if (data.audience) score += 1;
    if (data.businessType === "Local service business" && includesAny(brief + " " + normalize(data.audience), ["local", "near", "karachi", "clinic", "studio"])) {
      score += 1;
    }

    return clamp(score, 1, 10);
  }

  function scoreAudienceMatch(data) {
    const brief = normalize(data.brief);
    const audience = normalize(data.audience);
    let score = audience ? 4 : 1;
    const audienceTerms = audience
      .split(/\s+/)
      .filter((word) => word.length > 4)
      .slice(0, 8);
    const sharedTerms = audienceTerms.filter((word) => brief.includes(word)).length;

    if (wordCount(audience) >= 5) score += 2;
    if (sharedTerms >= 1) score += 1;
    if (sharedTerms >= 2) score += 1;
    if (includesAny(audience, ["looking for", "need", "want", "struggling", "searching", "ready"])) score += 1;

    return clamp(score, 1, 10);
  }

  function scoreMobile(data, ctaScore, formScore) {
    let score = 6;

    if (ctaScore >= 7) score += 1;
    if (formScore >= 8) score += 1;
    if (data.fields.length <= 5) score += 1;
    if (!data.fields.length) score -= 2;
    if (!data.cta) score -= 1;
    if (data.fields.length > 7) score -= 2;
    if (data.trafficSource === "Meta Ads") score -= data.fields.length > 5 ? 1 : 0;
    if (wordCount(data.brief) > 45) score -= 1;

    return clamp(score, 3, 8);
  }

  function scoreConversionFocus(offerScore, ctaScore, formScore, trustScore, data) {
    let score = Math.round((offerScore + ctaScore + formScore + trustScore) / 4);

    if (data.offer && data.cta && includesAny(normalize(data.cta), normalize(data.offer).split(/\s+/).filter(Boolean).slice(0, 4))) {
      score += 1;
    }
    if (!data.offer || !data.cta) score -= 1;

    return clamp(score, 1, 10);
  }

  function calculateOverallScore(scores, data) {
    const weights = {
      offerClarity: 14,
      heroMessage: 14,
      audienceMatch: 12,
      ctaStrength: 14,
      trustProof: 10,
      formFriction: 14,
      mobileReadiness: 10,
      conversionFocus: 12
    };
    const weightedScore = Object.entries(weights).reduce(
      (total, [key, weight]) => total + scores[key].score * weight,
      0
    );
    let overall = Math.round(weightedScore / 10);
    const missingCount = [
      data.brief,
      data.offer,
      data.audience,
      data.cta,
      data.fieldsRaw
    ].filter((value) => !String(value || "").trim()).length;

    overall -= missingCount * 4;

    const importantScores = [
      scores.offerClarity.score,
      scores.ctaStrength.score,
      scores.trustProof.score,
      scores.formFriction.score,
      scores.mobileReadiness.score,
      scores.audienceMatch.score
    ];

    if (importantScores.some((score) => score < 8)) {
      overall = Math.min(overall, 89);
    }
    if (!hasExplicitTrustProof(data)) {
      overall = Math.min(overall, 84);
    }
    if (scores.formFriction.score < 6 || scores.ctaStrength.score < 6) {
      overall = Math.min(overall, 74);
    }

    return clamp(overall, 10, 100);
  }

  function makeSummary(data, scores, risk, context) {
    const strength =
      scores.ctaStrength.score >= 8 || scores.offerClarity.score >= 8
        ? `The strongest starting point is the connection between "${context.offer}" and "${context.cta}".`
        : `The page has a workable campaign direction, but the offer and CTA need sharper wording.`;
    const weakness =
      !hasExplicitTrustProof(data)
        ? "The biggest gap is trust proof: the brief does not mention reviews, testimonials, credentials, visual proof, or guarantees."
        : scores.trustProof.score < 7
          ? "The main weakness is that trust proof needs to be more specific and more visible before the form."
        : "The trust direction is usable, but it should still be surfaced near every key decision point.";

    return `${strength} ${weakness} For ${data.trafficSource}, the conversion opportunity is to make ${context.audience} understand the offer, trust the business, and take the "${context.cta}" action without extra friction. Overall this is a ${risk.level.toLowerCase()} page concept because the current inputs score ${risk.scoreNote}.`;
  }

  function makeHeroAnalysis(data, scores, context) {
    const localService = data.businessType === "Local service business";
    const headline = localService
      ? `Trusted ${titleCase(context.service)} in ${titleCase(context.location)} - ${context.offer}`
      : interpolate(context.business.headline, context);
    const subheadline = localService
      ? `Book a simple appointment for ${context.audience}. Get the key details, trust proof, and next steps before you submit the form.`
      : `A focused landing page for ${context.audience} that explains the offer, reduces risk, and makes the next action clear.`;

    return {
      issue:
        scores.heroMessage.score >= 8
          ? "The hero has enough raw context, but it should still be edited into one direct promise."
          : "The hero is likely carrying too much general description and not enough immediate conversion clarity.",
      headline,
      subheadline,
      cta: context.cta,
      notes: [
        localService
          ? "Open with the service, location, trust cue, specific offer, and a fast booking CTA."
          : `Open with the main outcome and connect it to ${context.business.angle}.`,
        context.traffic.hero,
        "Keep the first screen focused on one primary action and one supporting proof cue."
      ]
    };
  }

  function makeOfferAudit(data, scores, context) {
    const verdict =
      scores.offerClarity.score >= 8
        ? "Strong: the offer is specific and conversion-ready."
        : scores.offerClarity.score >= 6
          ? "Needs improvement: the offer is understandable but should be more concrete."
          : "Weak: the offer is too vague for a high-performing lead generation page.";

    return {
      verdict,
      betterWording: data.offer
        ? `${context.offer} - available for ${context.audience}. ${context.cta}.`
        : `Add a specific outcome, incentive, or first-step benefit for ${context.audience}.`,
      riskNote:
        scores.offerClarity.score >= 7
          ? "The main offer risk is not the idea itself, but whether it is repeated clearly in the hero, CTA, and form section."
          : "A vague offer can make visitors delay action because they cannot quickly judge value, urgency, or relevance."
    };
  }

  function makeCtaAudit(data, scores, context) {
    const serviceWord = titleCase(context.service);
    const variations =
      data.businessType === "Local service business"
        ? [`Book Free Consultation`, `Schedule My Appointment`, `Claim My ${serviceWord} Offer`]
        : [`Get My Free Audit`, `Request a Quote`, `Start My Free Plan`];

    return {
      score: scores.ctaStrength.score,
      clarityNote:
        scores.ctaStrength.score >= 8
          ? "The CTA is clear and action-oriented. Keep the wording consistent across the page."
          : "The CTA should describe the next step and the visitor benefit, not just the button action.",
      variations,
      placement: context.traffic.ctaPlacement,
      secondary: context.business.secondaryCta
    };
  }

  function makeTrustChecklist(data) {
    const combined = normalize(`${data.brief} ${data.offer} ${data.audience} ${data.fieldsRaw}`);

    return trustItems.map((item) => {
      const present = includesAny(combined, item.terms);
      return {
        title: item.title,
        status: present ? "Mentioned: make this proof visible and specific on the page." : "Recommended: add this proof element before launch.",
        why: item.why
      };
    });
  }

  function makeFormAdvice(data, scores) {
    const keepTerms = ["name", "phone", "email", "whatsapp", "service", "appointment", "preferred", "time"];
    const optionalTerms = ["message", "address", "budget", "company", "website", "income", "notes"];
    const keep = data.fields.filter((field) => includesAny(normalize(field), keepTerms));
    const optional = data.fields.filter((field) => includesAny(normalize(field), optionalTerms));
    const extras = data.fields.length > 5 ? data.fields.slice(5) : [];
    const removeOrOptional = unique(optional.concat(extras));

    return {
      score: scores.formFriction.score,
      keep: keep.length ? keep : data.fields.slice(0, 4),
      removeOrOptional: removeOrOptional.length ? removeOrOptional : ["Long message fields", "Full address", "Budget details"],
      structure:
        data.fields.length <= 4
          ? "Use one compact form with name, phone or email, service need, and preferred time."
          : "Use a short first-step form, then collect extra details after the lead is submitted.",
      followUp:
        "Follow up quickly with a call, WhatsApp message, or email that repeats the offer and confirms the next step."
    };
  }

  function makeMobileChecklist(data, context) {
    return [
      {
        title: "Manual mobile testing note",
        note: "Mobile readiness is estimated from the provided brief. Manually test the final landing page on mobile before launch."
      },
      {
        title: "Mobile hero readability",
        note: `Use one clear headline, one short subheadline, and the "${context.cta}" CTA above the fold.`
      },
      {
        title: "CTA visibility",
        note: "Repeat the primary CTA after every major proof or benefit section."
      },
      {
        title: "Form usability",
        note: data.fields.length > 5 ? "Reduce the mobile form to the essential first-step fields." : "Keep the form compact and label every field clearly."
      },
      {
        title: "Tap-friendly buttons",
        note: "Use full-width buttons on small screens with enough vertical spacing."
      },
      {
        title: "Fast-loading layout",
        note: "Plan for compressed visuals and simple sections. This dashboard does not test live page speed."
      },
      {
        title: "Sticky CTA suggestion",
        note: "Add a sticky mobile CTA once the visitor scrolls past the hero."
      },
      {
        title: "Short sections",
        note: "Break proof, benefits, FAQs, and offer details into scan-friendly blocks."
      },
      {
        title: "No horizontal overflow",
        note: "Use responsive grids and manually test the final page at 540px, 768px, and 1024px widths."
      }
    ];
  }

  function makePriorityFixes(data, scores, context) {
    const candidates = [];

    if (!hasExplicitTrustProof(data) || scores.trustProof.score < 8) {
      candidates.push({
        title: "Add trust proof above the fold",
        why: "Visitors are being asked to submit contact details before the page proves the business is credible.",
        action: "Add Google reviews or testimonials, credentials, real business photos, contact details, and a privacy note near the first CTA.",
        priority: !hasExplicitTrustProof(data) ? "High" : "Medium",
        weight: !hasExplicitTrustProof(data) ? 1 : 4
      });
    }

    if (scores.ctaStrength.score < 8) {
      candidates.push({
        title: "Make the CTA more specific",
        why: "A vague CTA can reduce lead intent because visitors do not know exactly what happens next.",
        action: `Use action-led wording such as "${context.cta}" or one of the improved CTA variations.`,
        priority: scores.ctaStrength.score < 6 ? "High" : "Medium",
        weight: scores.ctaStrength.score < 6 ? 2 : 5
      });
    }

    if (scores.formFriction.score < 8 || data.fields.length > 5) {
      candidates.push({
        title: "Reduce form friction",
        why: "Long forms create hesitation, especially before the visitor has seen enough trust proof.",
        action: "Keep the first-step form to name, phone or email, service need, and preferred time. Move extra fields after submission.",
        priority: data.fields.length > 5 || scores.formFriction.score < 6 ? "High" : "Medium",
        weight: data.fields.length > 5 ? 3 : 6
      });
    }

    if (scores.offerClarity.score < 8) {
      candidates.push({
        title: "Sharpen the offer wording",
        why: "A clear offer gives the visitor a reason to act now instead of comparing other options.",
        action: "State the outcome, incentive, conditions, and next step in one concise offer line.",
        priority: scores.offerClarity.score < 6 ? "High" : "Medium",
        weight: scores.offerClarity.score < 6 ? 2 : 7
      });
    }

    if (scores.heroMessage.score < 8) {
      candidates.push({
        title: "Rewrite the hero section",
        why: "The hero needs to match visitor intent quickly, especially for paid traffic.",
        action: `Use a headline that combines service, audience, offer, and the "${context.cta}" next step.`,
        priority: scores.heroMessage.score < 6 ? "High" : "Medium",
        weight: scores.heroMessage.score < 6 ? 3 : 8
      });
    }

    candidates.push({
      title: "Manually test the mobile experience",
      why: "This dashboard estimates mobile readiness from the brief and does not test a live page.",
      action: "Check the final landing page on real mobile widths for readable hero copy, visible CTA, form usability, and no horizontal overflow.",
      priority: scores.mobileReadiness.score < 7 ? "Medium" : "Low",
      weight: 9
    });

    return candidates
      .sort((a, b) => {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority] || a.weight - b.weight;
      })
      .slice(0, 3);
  }

  function makeRisks(data, scores, context) {
    const risks = [];

    if (scores.offerClarity.score < 8) {
      risks.push({
        title: "Offer may not feel specific enough",
        why: "Visitors need to understand value quickly before they compare alternatives.",
        priority: scores.offerClarity.score < 6 ? "High" : "Medium",
        fix: "Rewrite the offer with a concrete benefit, condition, or first-step incentive."
      });
    }

    if (scores.ctaStrength.score < 8) {
      risks.push({
        title: "CTA may not create confident action",
        why: "Generic button copy can make the next step feel unclear or low value.",
        priority: scores.ctaStrength.score < 6 ? "High" : "Medium",
        fix: `Use a specific action such as "${context.cta}" or one of the improved CTA variations.`
      });
    }

    if (scores.formFriction.score < 8) {
      risks.push({
        title: "Lead form may create friction",
        why: "Each extra field adds hesitation before trust is fully built.",
        priority: data.fields.length > 6 ? "High" : "Medium",
        fix: "Keep only the fields needed for first contact and move optional details later."
      });
    }

    if (scores.trustProof.score < 8) {
      risks.push({
        title: "Trust proof may be too light",
        why: "Lead generation pages need visible reassurance before asking for contact details.",
        priority: scores.trustProof.score < 6 ? "High" : "Medium",
        fix: "Add reviews, real photos, credentials, contact details, FAQs, and a privacy note near the form."
      });
    }

    risks.push({
      title: `${data.trafficSource} message mismatch`,
      why: context.traffic.risk,
      priority: "Medium",
      fix: `Optimize the page around ${context.traffic.focus}.`
    });

    return risks.slice(0, 5);
  }

  function makeImprovements(data, scores, context) {
    return [
      {
        title: "Rewrite the hero headline",
        why: "The first screen decides whether visitors keep reading.",
        priority: scores.heroMessage.score < 7 ? "High" : "Medium",
        action: `Use: ${makeHeroAnalysis(data, scores, context).headline}`
      },
      {
        title: "Make the offer impossible to miss",
        why: "A visible offer gives visitors a reason to act now.",
        priority: scores.offerClarity.score < 7 ? "High" : "Medium",
        action: "Repeat the offer in the hero, offer block, form intro, and final CTA."
      },
      {
        title: "Strengthen CTA consistency",
        why: "Repeated CTA language reduces hesitation and keeps one conversion path clear.",
        priority: scores.ctaStrength.score < 7 ? "High" : "Medium",
        action: `Use "${context.cta}" as the primary CTA across the page.`
      },
      {
        title: "Add proof near the form",
        why: "Visitors often decide whether to submit right beside the form.",
        priority: scores.trustProof.score < 7 ? "High" : "Medium",
        action: "Place testimonials, credentials, privacy reassurance, and contact details beside or above the form."
      },
      {
        title: "Simplify the lead form",
        why: "Lower friction usually increases first-step lead volume.",
        priority: scores.formFriction.score < 7 ? "High" : "Medium",
        action: "Keep name, phone or email, service need, and preferred time; make extra fields optional."
      },
      {
        title: "Build a traffic-specific proof section",
        why: `${data.trafficSource} visitors need proof that matches their intent and awareness level.`,
        priority: "Medium",
        action: `Focus the section on ${context.traffic.focus}.`
      },
      {
        title: "Add objection-handling FAQs",
        why: "FAQs answer doubts without forcing visitors to contact support first.",
        priority: "Medium",
        action: "Answer price, timing, process, location, guarantee, and what happens after submission."
      },
      {
        title: "Create a mobile sticky CTA",
        why: "Mobile visitors should not need to scroll back to convert.",
        priority: "Medium",
        action: `Use a compact sticky button with "${context.cta}".`
      },
      {
        title: "Define conversion tracking notes",
        why: "A launch checklist should clarify what counts as a lead.",
        priority: "Low",
        action: "Document form submit, CTA click, call click, and thank-you page as conversion events."
      }
    ];
  }

  function makeStructure(data, context) {
    return [
      ["Hero section", `Lead with ${context.offer}, ${context.audience}, and "${context.cta}".`],
      ["Problem/audience section", "Name the visitor's situation and show that the page is built for them."],
      ["Offer explanation", "Clarify what is included, why it matters, and how to claim it."],
      ["Benefits section", "Turn services or features into practical visitor outcomes."],
      ["Trust proof", "Show reviews, credentials, photos, proof, contact details, and privacy reassurance."],
      ["How it works", "Explain the next steps after submission in three simple steps."],
      ["Lead form", "Use a short form with a clear CTA and privacy note."],
      ["FAQ", "Handle objections before they block the lead."],
      ["Final CTA", `Repeat "${context.cta}" with one final reason to act.`]
    ];
  }

  function makeSevenDayPlan(data, context) {
    return [
      ["Day 1", "Offer and headline cleanup", `Rewrite the hero around ${context.offer} and the main audience intent.`],
      ["Day 2", "CTA and form simplification", `Standardize the CTA as "${context.cta}" and reduce nonessential fields.`],
      ["Day 3", "Trust proof section", "Add testimonials, credentials, photos, guarantee, contact details, and privacy reassurance."],
      ["Day 4", "Mobile layout review", "Check hero readability, form spacing, tap targets, sticky CTA, and no horizontal overflow."],
      ["Day 5", "FAQ and objection handling", "Answer pricing, timing, process, proof, location, and what happens after the form."],
      ["Day 6", "Tracking and conversion notes", "Document desired conversion events without connecting this local demo to live tools."],
      ["Day 7", "Final review and launch checklist", `Review message match for ${data.trafficSource}, proof density, form flow, and final CTA consistency.`]
    ];
  }

  function renderAudit(audit) {
    if (dashboardGrid) {
      dashboardGrid.classList.add("report-generated");
    }

    const scoreCards = Object.values(audit.scores)
      .map(
        (item) => `
          <article class="score-card">
            <div class="score-card-header">
              <h4>${escapeHtml(item.label)}</h4>
              <span class="score-value">${item.score}/10</span>
            </div>
            <span class="status-label ${statusClass(item.status)}">${escapeHtml(item.status)}</span>
            <div class="score-meter" aria-hidden="true"><span style="--bar-width: ${item.score * 10}%"></span></div>
            <p>${escapeHtml(item.explanation)}</p>
          </article>
        `
      )
      .join("");

    output.className = "audit-report";
    output.innerHTML = `
      <section class="audit-section executive-summary" aria-labelledby="summary-title">
        <span class="report-number">01</span>
        <h3 id="summary-title">Executive Audit Summary</h3>
        <p>${escapeHtml(audit.summary)}</p>
        ${renderDataRows([
          ["Business brief", audit.data.brief],
          ["Business type", audit.data.businessType],
          ["Traffic source", audit.data.trafficSource],
          ["Offer", audit.data.offer || "Not provided"],
          ["Target audience", audit.data.audience || "Not provided"],
          ["Main CTA", audit.data.cta || "Not provided"],
          ["Lead form fields", audit.data.fields.length ? audit.data.fields.join(", ") : "Not provided"],
          ["Landing page URL", audit.data.url || "Not provided"]
        ])}
      </section>

      <section class="audit-hero" aria-labelledby="score-title">
        <div>
          <span class="report-number">02</span>
          <h3 id="score-title">Overall Conversion Score + Risk Level</h3>
          <p>${escapeHtml(audit.risk.explanation)} This score is generated locally from the brief, offer, CTA, form fields, traffic source, and visible proof signals provided by the user.</p>
        </div>
        <aside class="score-block" aria-label="Overall conversion score">
          <span class="metric-label">Overall Conversion Score</span>
          <strong class="score-number">${audit.overallScore}</strong>
          <span class="risk-pill ${riskClass(audit.risk.level)}">${escapeHtml(audit.risk.level)}</span>
          <p class="score-note">${escapeHtml(audit.risk.explanation)}</p>
        </aside>
      </section>

      <section class="audit-section">
        <span class="report-number">03</span>
        <h3>Top 3 Priority Fixes</h3>
        <div class="priority-grid">
          ${audit.priorityFixes
            .map(
              (item, index) => `
                <article class="priority-card">
                  <div class="priority-card-top">
                    <span class="fix-index">${index + 1}</span>
                    <span class="priority ${priorityClass(item.priority)}">${escapeHtml(item.priority)}</span>
                  </div>
                  <h4>${escapeHtml(item.title)}</h4>
                  <p><strong>Why it matters:</strong> ${escapeHtml(item.why)}</p>
                  <p><strong>Recommended action:</strong> ${escapeHtml(item.action)}</p>
                </article>
              `
            )
            .join("")}
        </div>
      </section>

      <section class="audit-section">
        <span class="report-number">04</span>
        <h3>Score Breakdown</h3>
        <div class="score-grid">${scoreCards}</div>
      </section>

      <section class="audit-section">
        <span class="report-number">05</span>
        <h3>Hero Section Fix</h3>
        <div class="callout"><strong>Current issue:</strong> ${escapeHtml(audit.hero.issue)}</div>
        ${renderDataRows([
          ["Revised headline", audit.hero.headline],
          ["Revised subheadline", audit.hero.subheadline],
          ["Above-the-fold CTA", audit.hero.cta]
        ])}
        ${renderList("Hero section improvement notes", audit.hero.notes)}
      </section>

      <section class="audit-section">
        <span class="report-number">06</span>
        <h3>Offer Clarity Audit</h3>
        ${renderDataRows([
          ["Offer clarity verdict", audit.offerAudit.verdict],
          ["Better offer wording", audit.offerAudit.betterWording],
          ["Offer risk note", audit.offerAudit.riskNote]
        ])}
      </section>

      <section class="audit-section">
        <span class="report-number">07</span>
        <h3>CTA Strength Checker</h3>
        ${renderDataRows([
          ["CTA score", `${audit.ctaAudit.score}/10`],
          ["CTA clarity note", audit.ctaAudit.clarityNote],
          ["Button placement", audit.ctaAudit.placement],
          ["Secondary CTA", audit.ctaAudit.secondary]
        ])}
        ${renderList("Improved CTA variations", audit.ctaAudit.variations)}
      </section>

      <section class="audit-section">
        <span class="report-number">08</span>
        <h3>Trust Proof Recommendations</h3>
        <div class="trust-grid">
          ${audit.trustChecklist
            .map(
              (item) => `
                <article class="check-card">
                  <h4>${escapeHtml(item.title)}</h4>
                  <p><strong>Status suggestion:</strong> ${escapeHtml(item.status)}</p>
                  <p><strong>Why it matters:</strong> ${escapeHtml(item.why)}</p>
                </article>
              `
            )
            .join("")}
        </div>
      </section>

      <section class="audit-section">
        <span class="report-number">09</span>
        <h3>Lead Form Friction Review</h3>
        ${renderDataRows([
          ["Form friction score", `${audit.formAdvice.score}/10`],
          ["Fields to keep", audit.formAdvice.keep.join(", ")],
          ["Remove or optional", audit.formAdvice.removeOrOptional.join(", ")],
          ["Recommended form structure", audit.formAdvice.structure],
          ["Follow-up recommendation", audit.formAdvice.followUp]
        ])}
      </section>

      <section class="audit-section">
        <span class="report-number">10</span>
        <h3>Mobile Readiness Checklist</h3>
        <div class="callout"><strong>Manual testing note:</strong> Mobile readiness is estimated from the provided brief. Manually test the final landing page on mobile before launch.</div>
        <div class="trust-grid">
          ${audit.mobileChecklist
            .map(
              (item) => `
                <article class="check-card">
                  <h4>${escapeHtml(item.title)}</h4>
                  <p>${escapeHtml(item.note)}</p>
                </article>
              `
            )
            .join("")}
        </div>
      </section>

      <section class="audit-section">
        <span class="report-number">11</span>
        <h3>Conversion Risk Analysis</h3>
        <div class="risk-grid">
          ${audit.risks
            .map(
              (risk) => `
                <article class="risk-card">
                  <div class="risk-card-header">
                    <h4>${escapeHtml(risk.title)}</h4>
                    <span class="priority ${priorityClass(risk.priority)}">${escapeHtml(risk.priority)}</span>
                  </div>
                  <p><strong>Why it can reduce leads:</strong> ${escapeHtml(risk.why)}</p>
                  <p><strong>Suggested fix:</strong> ${escapeHtml(risk.fix)}</p>
                </article>
              `
            )
            .join("")}
        </div>
      </section>

      <section class="audit-section">
        <span class="report-number">12</span>
        <h3>Suggested Improvements</h3>
        <div class="improvement-grid">
          ${audit.improvements
            .map(
              (item) => `
                <article class="recommendation-card">
                  <h4>${escapeHtml(item.title)}</h4>
                  <span class="priority ${priorityClass(item.priority)}">${escapeHtml(item.priority)}</span>
                  <p><strong>Why it matters:</strong> ${escapeHtml(item.why)}</p>
                  <p><strong>Suggested action:</strong> ${escapeHtml(item.action)}</p>
                </article>
              `
            )
            .join("")}
        </div>
      </section>

      <section class="audit-section">
        <span class="report-number">13</span>
        <h3>Revised Landing Page Structure</h3>
        <div class="structure-grid">
          ${audit.structure
            .map(
              (item, index) => `
                <article class="structure-card">
                  <h4>${index + 1}. ${escapeHtml(item[0])}</h4>
                  <p>${escapeHtml(item[1])}</p>
                </article>
              `
            )
            .join("")}
        </div>
      </section>

      <section class="audit-section">
        <span class="report-number">14</span>
        <h3>7-Day Landing Page Improvement Plan</h3>
        <div class="plan-grid">
          ${audit.plan
            .map(
              (item) => `
                <article class="plan-card">
                  <h4>${escapeHtml(item[0])}: ${escapeHtml(item[1])}</h4>
                  <p>${escapeHtml(item[2])}</p>
                </article>
              `
            )
            .join("")}
        </div>
      </section>

      <section class="audit-section">
        <span class="report-number">15</span>
        <h3>Exportable Audit Report / Disclaimer</h3>
        <p>
          This report can be exported as a local text file. It includes the brief, inputs,
          score breakdown, hero suggestions, CTA suggestions, trust checklist, form advice,
          mobile checklist, improvements, 7-day plan, and portfolio disclaimer.
        </p>
        <div class="callout">
          <strong>Portfolio disclaimer:</strong> This is a local JavaScript planning dashboard.
          It does not fetch live pages, connect to analytics, use ad platform data, or perform real AI analysis.
        </div>
      </section>
    `;
  }

  function renderDataRows(rows) {
    return rows
      .map(
        ([label, value]) => `
          <div class="data-row">
            <span>${escapeHtml(label)}</span>
            <strong>${escapeHtml(value)}</strong>
          </div>
        `
      )
      .join("");
  }

  function renderList(title, items) {
    return `
      <h4>${escapeHtml(title)}</h4>
      <ul>
        ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    `;
  }

  function formatAuditText(audit) {
    const scoreLines = Object.values(audit.scores)
      .map((item) => `- ${item.label}: ${item.score}/10 (${item.status}) - ${item.explanation}`)
      .join("\n");
    const priorityLines = audit.priorityFixes
      .map(
        (item, index) =>
          `${index + 1}. ${item.title} [${item.priority}]\n   Why it matters: ${item.why}\n   Recommended action: ${item.action}`
      )
      .join("\n");
    const trustLines = audit.trustChecklist
      .map((item) => `- ${item.title}: ${item.status} ${item.why}`)
      .join("\n");
    const mobileLines = audit.mobileChecklist.map((item) => `- ${item.title}: ${item.note}`).join("\n");
    const riskLines = audit.risks
      .map((item) => `- ${item.title} [${item.priority}]: ${item.why} Fix: ${item.fix}`)
      .join("\n");
    const improvementLines = audit.improvements
      .map((item) => `- ${item.title} [${item.priority}]: ${item.action}`)
      .join("\n");
    const structureLines = audit.structure.map((item, index) => `${index + 1}. ${item[0]} - ${item[1]}`).join("\n");
    const planLines = audit.plan.map((item) => `${item[0]}: ${item[1]} - ${item[2]}`).join("\n");

    return `Lead Generation Landing Page Analyzer

Project/disclaimer note:
This is a local JavaScript rule-based planning dashboard created for Fazil Waseem's portfolio. It does not fetch live landing pages, connect to APIs, use Google Ads or Meta Ads data, connect to analytics, or perform real AI analysis.

Business brief:
${audit.data.brief}

Business type: ${audit.data.businessType}
Traffic source: ${audit.data.trafficSource}
Offer: ${audit.data.offer || "Not provided"}
Target audience: ${audit.data.audience || "Not provided"}
Main CTA: ${audit.data.cta || "Not provided"}
Lead form fields: ${audit.data.fields.length ? audit.data.fields.join(", ") : "Not provided"}
Landing page URL: ${audit.data.url || "Not provided"}

Overall score: ${audit.overallScore}/100
Risk level: ${audit.risk.level}
Score explanation: ${audit.risk.explanation}

Executive Audit Summary:
${audit.summary}

Top 3 Priority Fixes:
${priorityLines}

Score Breakdown:
${scoreLines}

Hero Section Suggestions:
- Current issue: ${audit.hero.issue}
- Revised headline: ${audit.hero.headline}
- Revised subheadline: ${audit.hero.subheadline}
- Above-the-fold CTA: ${audit.hero.cta}
- Notes: ${audit.hero.notes.join(" ")}

CTA Suggestions:
- CTA score: ${audit.ctaAudit.score}/10
- CTA clarity note: ${audit.ctaAudit.clarityNote}
- Improved variations: ${audit.ctaAudit.variations.join(", ")}
- Button placement: ${audit.ctaAudit.placement}
- Secondary CTA: ${audit.ctaAudit.secondary}

Trust Proof Recommendations:
${trustLines}

Form Friction Advice:
- Form friction score: ${audit.formAdvice.score}/10
- Fields to keep: ${audit.formAdvice.keep.join(", ")}
- Remove or optional: ${audit.formAdvice.removeOrOptional.join(", ")}
- Recommended structure: ${audit.formAdvice.structure}
- Follow-up: ${audit.formAdvice.followUp}

Mobile Readiness Checklist:
Mobile readiness is estimated from the provided brief. Manually test the final landing page on mobile before launch.
${mobileLines}

Conversion Risk Analysis:
${riskLines}

Suggested Improvements:
${improvementLines}

Revised Landing Page Structure:
${structureLines}

7-Day Landing Page Improvement Plan:
${planLines}

Portfolio disclaimer:
This is a local JavaScript planning dashboard created for Fazil Waseem's portfolio. It does not fetch live pages, connect to analytics, use ad platform data, or perform real AI analysis.
`;
  }

  function parseFields(value) {
    return value
      .split(/[\n,;]+/)
      .map((field) => field.trim())
      .filter(Boolean);
  }

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function wordCount(value) {
    const text = normalize(value);
    return text ? text.split(/\s+/).length : 0;
  }

  function includesAny(text, terms) {
    const normalizedText = normalize(text);
    return terms.some((term) => normalizedText.includes(normalize(term)));
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function unique(items) {
    return Array.from(new Set(items.filter(Boolean)));
  }

  function getRisk(score) {
    if (score >= 85) {
      return {
        level: "Low risk",
        explanation: "Strong core inputs with a clear path to lead conversion.",
        scoreNote: "well across most conversion categories"
      };
    }
    if (score >= 65) {
      return {
        level: "Medium risk",
        explanation: "Promising direction, but several conversion elements need tightening.",
        scoreNote: "moderately and needs focused cleanup"
      };
    }
    return {
      level: "High risk",
      explanation: "Important conversion basics are missing or too vague.",
      scoreNote: "low and needs major clarity work"
    };
  }

  function statusLabel(score) {
    if (score >= 8) return "Strong";
    if (score >= 6) return "Needs improvement";
    return "Weak";
  }

  function scoreStatus(score) {
    return statusLabel(score);
  }

  function statusClass(status) {
    return `status-${String(status).toLowerCase().replace(/\s+/g, "-")}`;
  }

  function priorityClass(priority) {
    return `priority-${priority.toLowerCase()}`;
  }

  function riskClass(level) {
    if (level === "Low risk") return "risk-low";
    if (level === "Medium risk") return "risk-medium";
    return "risk-high";
  }

  function hasExplicitTrustProof(data) {
    const combined = normalize(`${data.brief} ${data.offer} ${data.audience}`);
    return explicitTrustProofTerms.some((term) => combined.includes(normalize(term)));
  }

  function inferService(data) {
    const combined = normalize(`${data.brief} ${data.offer}`);
    const serviceHints = [
      "dental",
      "teeth cleaning",
      "whitening",
      "emergency dental care",
      "consulting",
      "coaching",
      "software",
      "course",
      "audit",
      "marketing",
      "lead generation"
    ];
    const found = serviceHints.find((term) => combined.includes(term));
    return found || businessGuidance[data.businessType].service;
  }

  function extractLocation(audience) {
    const match = audience.match(/\bin\s+([a-zA-Z\s]+?)(?:\s+looking|\s+who|\s+ready|\s+for|$)/);
    return match ? match[1].trim() : "";
  }

  function interpolate(template, context) {
    return template
      .replace("{service}", context.service)
      .replace("{location}", context.location)
      .replace("{audience}", context.audience);
  }

  function titleCase(value) {
    return String(value || "")
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function updatePreview(score, riskLevel) {
    previewScore.textContent = String(score);
    previewRisk.textContent = riskLevel;
    previewRisk.className = `risk-pill ${riskClass(riskLevel)}`;
  }
})();
