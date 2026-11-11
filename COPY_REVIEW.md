# purpleDrop: plain-language copy review

DRAFT ONLY. Proposed website wording for owner review. Nothing in this review is approval to merge or publish.

## Recommended tier names

| Option | One-line definition | Launch price |
| --- | --- | --- |
| AI Visibility Review | We check agreed buyer questions, your website and public listings, then give you a report showing what needs attention. | $1,200 |
| Review + Planning Day | The review plus a day with you to go through the findings, choose priorities and agree the next work. | $2,500 |
| Planning Day + 30-Day Support | The review and planning day, plus 30 days of monitoring and agreed adjustments. | $4,500 |

The day is a day meeting with the owner. Fixes may take longer. Written scope confirms the included changes, who does them and completion dates. No unlimited fixes or one-day completion promise.

Why these names: "Review" tells an owner what they receive; "Planning Day" describes the time together; "30-Day Support" explains the extra help. Avoid "Fix Day" and unexplained "consulting day". The middle name is a recommendation for review, not a final branding decision.

## What the copy should keep saying

- If a buyer cannot find the business, they may contact someone else. That is a risk worth checking, not a measured lost-sales number.
- Check first, explain the gaps, then agree the work. Missing from one test answer is not proof of being absent from every answer.
- Free call, paid detailed review. Do not give away the paid report in a sentence describing the free call.
- Keep prices off the homepage. Website redesigns are quoted separately from $5,000. Security configuration reviews need separate scope and price; no invented package price.
- No guaranteed AI mentions, indexing, rankings, enquiries or sales. No unsupported market percentages. No security certification or penetration-test claim.

## Scope and decisions before publication

This draft is stacked on the SOC2/naming cleanup in PR #7. It leaves the design drafts alone. SOC2 stays out of navigation, footer and sitemap, with the legacy route noindex/nofollow. The legacy questionnaire remains for existing access, not as a promoted offer.

The existing scorecard performs public security checks, not AI visibility or website-age checks. The homepage's AI and dated-site choices now lead to a conversation rather than a tool that cannot deliver their labels. Building the proposed two free AI/dated-site checks is separate product work, not pretended to be complete here.

Security is paid-only as a review. The existing automated public-basics scorecard remains clearly labelled and is not called a free security review. Decide separately whether to retire or narrow that tool to match the paid-only offer rule.

Privacy is a marked draft: the old page named Formspree and made unverified 30-day deletion, six-year retention and processor-contract claims. The proposed page names the services used by the repository and does not invent those policies. Confirm actual production processors, retention, provider contracts and legal wording before publishing. Terms changes clarify the meeting day only; liability/IP wording is not legal advice or a legal review.

The nine guide URLs are retained, but the unsupported claims about universal AI ranking rules have been rewritten. Existing article month labels are retained, not asserted as newly verified publication dates. No new customer result or experience claim is added.

## Verification

- Production build passes (TypeScript, browser bundle, server rendering, static routes).
- All 23 route templates/pages checked at 390px and 1440px: 46 route/width checks, no horizontal overflow or page errors.
- Homepage paid-tier prices and telephone links absent. Tier names and prices share one source for visible content and structured data.
- A pre-existing homepage lazy-render hydration error was fixed by loading its animation only after mount. This is not a redesign and does not import either design draft.
- Forms were not submitted, emails were not sent and paid tools were not exercised. No deployment or merge was performed.

## Page-by-page before / after

These are exact rendered text blocks changed from the main-branch snapshot below to this proposed draft. Unchanged blocks are omitted so the review stays usable. Shared header/footer changes are shown separately at the end. The source diff contains every edit.

Baseline main commit: `c865faf652386d3726c43f3afbf79014e65f3f82`. Comparison includes the pending PR #7 cleanup.


- [Before / after, part 1](COPY_REVIEW_1.md)
- [Before / after, part 2](COPY_REVIEW_2.md)
- [Before / after, part 3](COPY_REVIEW_3.md)
- [Before / after, part 4](COPY_REVIEW_4.md)
- [Before / after, part 5](COPY_REVIEW_5.md)
