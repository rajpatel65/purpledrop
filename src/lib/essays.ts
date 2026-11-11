export interface EssayBlock {
  type: 'p' | 'h2' | 'pull';
  content: string;
}

export interface Essay {
  slug: string;
  title: string;
  date: string;
  tag: string;
  blurb: string;
  body: EssayBlock[];
}

export const ESSAYS: Essay[] = [
  {
    "slug": "your-buyers-ask-ai-before-they-ask-you",
    "title": "Your buyers may ask AI before they ask you.",
    "date": "August 2026",
    "tag": "Practical guide",
    "blurb": "An AI answer can put another business in front of a buyer before yours. Start by checking, not guessing.",
    "body": [
      {
        "type": "p",
        "content": "A buyer looking for your service may ask an AI assistant who to contact. If your business is missing or the details are wrong, you may not get a chance to explain what you offer."
      },
      {
        "type": "h2",
        "content": "Check the questions that matter to your business"
      },
      {
        "type": "p",
        "content": "Write down the service, location and type of customer you want to reach. Test a small set of realistic questions. Keep the date, tool, wording, answer and any source links."
      },
      {
        "type": "p",
        "content": "A mention is not the same as a recommendation. One missing answer is not proof that every buyer misses you. Treat the checks as a starting point, not a count of lost sales."
      },
      {
        "type": "h2",
        "content": "Choose the work from the findings"
      },
      {
        "type": "p",
        "content": "Check whether your website and public listings describe your services clearly and consistently. The AI Visibility Review records the gaps. Add a Planning Day if you want a day together to decide what to do next."
      }
    ]
  },
  {
    "slug": "the-report-your-web-agency-sends-you",
    "title": "Your website report may not answer this question.",
    "date": "July 2026",
    "tag": "Practical guide",
    "blurb": "More impressions do not tell you whether AI names your business or whether those mentions bring enquiries.",
    "body": [
      {
        "type": "p",
        "content": "A website report can show visits, search impressions and form submissions. Those are useful measures, but they do not answer every question about how a buyer found you."
      },
      {
        "type": "h2",
        "content": "Separate three questions"
      },
      {
        "type": "p",
        "content": "Does an AI answer mention your business? Does it link to your website? Did someone who saw it become a customer? Each needs different evidence."
      },
      {
        "type": "p",
        "content": "Record test questions and answers for visibility. Ask new customers how they found you, then compare their answers with the analytics and sales records you have. Do not label every unexplained visit an AI lead."
      },
      {
        "type": "h2",
        "content": "What a review adds"
      },
      {
        "type": "p",
        "content": "Our paid review records a sample of agreed questions and checks the public information behind them. It can show missing or incorrect details. It cannot recreate every buyer journey or calculate invisible lost sales."
      }
    ]
  },
  {
    "slug": "the-quiet-cost-of-a-beautiful-website",
    "title": "A good-looking website still needs clear information.",
    "date": "June 2026",
    "tag": "Practical guide",
    "blurb": "Design helps people judge your business. Clear pages help them understand the service and take the next step.",
    "body": [
      {
        "type": "p",
        "content": "A website can look polished while leaving basic questions unanswered: what do you do, where do you work and how can someone contact you? A buyer who cannot answer those questions may leave."
      },
      {
        "type": "h2",
        "content": "Review the essentials"
      },
      {
        "type": "p",
        "content": "Check service descriptions, locations, contact details and how the site works on a phone. Keep important information as readable text rather than hiding it only in images."
      },
      {
        "type": "p",
        "content": "Clear information is useful to visitors and can be read by search tools. It does not guarantee an AI recommendation. A redesign is also not always the first fix needed."
      },
      {
        "type": "h2",
        "content": "Agree the right project"
      },
      {
        "type": "p",
        "content": "We explain the gaps first. If a redesign makes sense, it is quoted separately from $5,000, based on page count and features. The Planning Day is a day together to make decisions, not a one-day website rebuild."
      }
    ]
  },
  {
    "slug": "who-does-ai-recommend",
    "title": "Who does AI recommend? Check the answer.",
    "date": "June 2026",
    "tag": "Practical guide",
    "blurb": "There is no single public rule that decides every AI recommendation. Start with evidence you can inspect.",
    "body": [
      {
        "type": "p",
        "content": "Different tools and questions can produce different business recommendations. A confident-sounding answer is not proof that the businesses named are the best, or that yours was checked and rejected."
      },
      {
        "type": "h2",
        "content": "Record the answer before explaining it"
      },
      {
        "type": "p",
        "content": "Keep the question, location, tool, date, answer and linked sources. Check whether your name appears, whether the facts are right and which other businesses are mentioned."
      },
      {
        "type": "h2",
        "content": "Improve what you can control"
      },
      {
        "type": "p",
        "content": "Your service pages and business details should be accurate and specific. Check for conflicting hours, locations or contact details. Back claims with evidence you can publish with permission."
      },
      {
        "type": "pull",
        "content": "Clearer information is work you can control. A place in an AI answer is not."
      },
      {
        "type": "p",
        "content": "The AI Visibility Review turns these observations into a report. Review + Planning Day adds a day with you to agree priorities and the work that follows."
      }
    ]
  },
  {
    "slug": "you-are-not-in-the-answer",
    "title": "Missing from an answer can mean missing an enquiry.",
    "date": "May 2026",
    "tag": "Practical guide",
    "blurb": "The risk is real enough to check. The size of the loss is not something a scan can tell you.",
    "body": [
      {
        "type": "p",
        "content": "When a buyer sees other businesses and not yours, they may contact someone else. That is a reason to investigate your visibility, not permission to invent a monthly loss figure."
      },
      {
        "type": "h2",
        "content": "Find the gap"
      },
      {
        "type": "p",
        "content": "Test questions relevant to your services and location. Check whether your business is named and whether the contact details and description are correct. Keep the evidence so a later check can be compared."
      },
      {
        "type": "h2",
        "content": "Do not confuse a gap with a lost sale"
      },
      {
        "type": "p",
        "content": "An omitted name in a test does not prove a buyer saw that answer, would have chosen you or would have paid a particular amount. Sales records and customer feedback are needed to investigate leads."
      },
      {
        "type": "p",
        "content": "Use the lead value calculator with your own numbers if you want to explore a scenario. Use the paid review to decide what needs attention. Neither guarantees more enquiries."
      }
    ]
  },
  {
    "slug": "owned-vs-rented-visibility",
    "title": "Keep your business information under your control.",
    "date": "April 2026",
    "tag": "Practical guide",
    "blurb": "Your website is yours to improve. AI answers and third-party listings still depend on systems you do not control.",
    "body": [
      {
        "type": "p",
        "content": "Your own service pages can explain your business in detail. Ads, directories, social platforms and AI assistants can help people find you, but you do not control every rule or display."
      },
      {
        "type": "h2",
        "content": "Keep the essentials consistent"
      },
      {
        "type": "p",
        "content": "Review your services, locations, hours and contact details across the pages and profiles you manage. Correct conflicts and remove claims you cannot support."
      },
      {
        "type": "p",
        "content": "You can ask for a listing update without assuming it will be accepted or shown immediately. You do not own independent reviews, directory rules or AI recommendations."
      },
      {
        "type": "pull",
        "content": "Improve your information. Do not promise control over someone else's platform."
      },
      {
        "type": "h2",
        "content": "Make the next step useful"
      },
      {
        "type": "p",
        "content": "Our review shows observed gaps and the limits of each check. A Planning Day gives you time with us to decide what to change and who will do it. Fixes can take longer than that meeting day."
      }
    ]
  },
  {
    "slug": "good-better-best",
    "title": "Make your business easy to compare.",
    "date": "March 2026",
    "tag": "Practical guide",
    "blurb": "Buyers need to understand what you offer, who it is for and what happens next.",
    "body": [
      {
        "type": "p",
        "content": "A vague promise such as \"complete solutions\" leaves a buyer to guess what they will get. Specific service descriptions give them something they can compare."
      },
      {
        "type": "h2",
        "content": "Explain the choice in one sentence"
      },
      {
        "type": "p",
        "content": "State what the customer gets, what they need to provide and what is not included. Separate a review from implementation, and a meeting day from the time needed to finish fixes."
      },
      {
        "type": "h2",
        "content": "Our three options"
      },
      {
        "type": "p",
        "content": "AI Visibility Review gives you the findings report. Review + Planning Day adds a day with you to set priorities and agree next steps. Planning Day + 30-Day Support adds 30 days of monitoring and agreed adjustments."
      },
      {
        "type": "p",
        "content": "These names describe the support you buy. They are not ranking factors or promises that an AI tool will choose your business. The written scope sets the work, price and dates."
      }
    ]
  },
  {
    "slug": "what-ai-is-skeptical-of",
    "title": "Use proof you can check, not claims you cannot.",
    "date": "February 2026",
    "tag": "Practical guide",
    "blurb": "Clear facts help a buyer evaluate your business. They do not let us promise what an AI tool will believe.",
    "body": [
      {
        "type": "p",
        "content": "\"Best in the market\" is a claim. A dated case study explaining a real problem, the work and the measured result gives a buyer more to evaluate. Publish only details you can support and have permission to share."
      },
      {
        "type": "h2",
        "content": "Check your own claims"
      },
      {
        "type": "p",
        "content": "Look for numbers without sources, outdated details and customer names used without permission. Remove unsupported claims instead of dressing them up with stronger language."
      },
      {
        "type": "h2",
        "content": "Be clear about limits"
      },
      {
        "type": "p",
        "content": "Do not call a public security check a certification. Do not call a brand mention a sale. Do not treat an AI answer as verified just because it sounds confident."
      },
      {
        "type": "p",
        "content": "Our review separates observations, uncertainties and next steps. The aim is useful decisions about your website and listings, not a story about knowing every tool's hidden rules."
      }
    ]
  },
  {
    "slug": "the-blue-check-moment",
    "title": "The shortlist can form before the first call.",
    "date": "January 2026",
    "tag": "Practical guide",
    "blurb": "If another business gets considered first, you may miss the chance to speak. Check how yours appears.",
    "body": [
      {
        "type": "p",
        "content": "A buyer can form a list from search results, reviews, referrals or an AI answer before contacting anyone. Being absent from one of those places can limit your chance to be considered."
      },
      {
        "type": "h2",
        "content": "A recommendation is not a verdict"
      },
      {
        "type": "p",
        "content": "Buyers may still compare prices, check reviews and talk to several businesses. We do not claim that one AI answer decides most sales or that every buyer follows the same path."
      },
      {
        "type": "h2",
        "content": "Check where you stand"
      },
      {
        "type": "p",
        "content": "Start with agreed questions about your services and area. Record the answers and public sources. Identify missing or confusing details before spending on changes."
      },
      {
        "type": "p",
        "content": "A free 30-minute call helps you decide whether the paid AI Visibility Review is useful. Choose a report, add a day together, or add 30 days of support. The scope explains the work; no option guarantees a place on a buyer's list."
      }
    ]
  }
];
