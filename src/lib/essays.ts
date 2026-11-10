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
    slug: 'your-buyers-ask-ai-before-they-ask-you',
    title: 'Your buyers are asking AI before they ask you.',
    date: 'August 2026',
    tag: 'The New Search',
    blurb:
      'The first conversation about your company now happens in a box you can\'t see. Most companies find out about it years too late.',
    body: [
      { type: 'p', content: 'Think of the last serious decision you made — a hire, a supplier, a professional you trusted with something important. Did you ask a tool first? Did the tool\'s answer shape which names you even considered?' },
      { type: 'p', content: 'That is now the norm for your buyers. Before anyone calls your office, an AI has already decided which names belong in the conversation. Your company is either in that first answer or it isn\'t.' },
      { type: 'p', content: 'And this is the part most companies get wrong: the answer is not a ranking. It is a description. The AI names the company it understood best — the one whose services, fees, and results it could confirm without guessing.' },
      { type: 'p', content: 'You can\'t buy your way into that answer with more advertising. You have to be the company the AI can describe accurately.' },
      { type: 'p', content: 'That is the work. If you want to know where you stand right now, ask us what the answer says about you.' },
    ],
  },
  {
    slug: 'the-report-your-web-agency-sends-you',
    title: 'The report your web agency sends you, decoded.',
    date: 'July 2026',
    tag: 'The New Search',
    blurb:
      'Impressions are up. Enquiries are flat. The report doesn\'t explain why — because the report was never designed to.',
    body: [
      { type: 'p', content: 'Your agency\'s monthly report shows a rising line, and the line is true. Impressions grew. Rankings held. You paid for it, and you got it.' },
      { type: 'p', content: 'Here is the question the report never answers: how many of your buyers started their search with a typed question to an AI assistant — and got an answer that never mentioned your company?' },
      { type: 'p', content: 'That number exists. It just isn\'t in the report. The tools that made the report were built to measure a world where buyers browse and click. That world has not disappeared. But an increasing share of decisions now happen before anyone visits a website at all.' },
      { type: 'p', content: 'The uncomfortable part: your competitors are in those answers, and you are not — and neither of you knows it. The answer simply names whoever was easiest to understand.' },
      { type: 'p', content: 'If you\'d like to see what the answer says about your company today, that is exactly what we do. Thirty minutes, no obligation, you keep the findings.' },
    ],
  },
  {
    slug: 'the-quiet-cost-of-a-beautiful-website',
    title: 'The quiet cost of a beautiful website.',
    date: 'June 2026',
    tag: 'The Method',
    blurb:
      'Your website can win every design award and still lose every AI recommendation. Beauty and clarity are different things.',
    body: [
      { type: 'p', content: 'Your website is beautiful. It took months, cost a fortune, and won compliments. Nobody is suggesting you tear it down.' },
      { type: 'p', content: 'But the people who built it built it for human eyes. Humans scroll. Humans absorb imagery. Humans enjoy a good story told slowly.' },
      { type: 'p', content: 'AI assistants do not scroll. They extract. When a buyer asks who to hire, the AI describes the company it could read most easily — regardless of how the website looks.' },
      { type: 'p', content: 'So the real question is not "does my website look expensive?" It\'s "when an AI describes my company, does it describe the company I built — or a guess?"' },
      { type: 'p', content: 'We find out what that description is — it takes time, but we make sure it\'s done right.' },
    ],
  },
  {
    slug: 'who-does-ai-recommend',
    title: 'Who does AI actually recommend — and why?',
    date: 'June 2026',
    tag: 'The New Search',
    blurb:
      'When a buyer asks an AI assistant for a recommendation, it doesn\'t pick the best company. It picks the one it can understand most easily. That\'s a different list — and it can be changed.',
    body: [
      { type: 'p', content: 'Ask any owner about their competitors and you\'ll get a story about quality, price, or longevity. Ask the same owner what an AI assistant says when a buyer asks who to call, and you\'ll usually get a shrug. The gap between those two answers is the whole market.' },
      { type: 'p', content: 'Here\'s what the people building these systems will tell you, if you press: a model doesn\'t rank businesses by who is best. It has no ground truth. It reads everything available about a company and produces the answer that is most consistent, most specific, and most supported by the sources it trusts.' },
      { type: 'pull', content: 'The AI doesn\'t recommend the best company. It recommends the company it can understand with zero effort.' },
      { type: 'h2', content: 'Three inputs decide the answer' },
      { type: 'p', content: 'First, clarity. If your website, reviews, and listings say the same thing in plain language, the model can confidently describe you. If your copy is vague — "premium solutions," "best-in-class service" — the model has nothing to quote and moves on to someone more concrete.' },
      { type: 'p', content: 'Second, consistency. Models weigh sources that agree with each other. When your Google profile, your site, your LinkedIn, and your reviews all tell the same story, that story becomes the truth. When they contradict each other, the model hedges — and hedged answers don\'t include you by name.' },
      { type: 'p', content: 'Third, proof. A claim with evidence is a fact. A claim without it is a guess. Reviews, case studies, dates, named clients, measurable outcomes — these are the things a model can verify and therefore repeat. The more of them it finds, the more confidently it recommends you.' },
      { type: 'h2', content: 'Why this is good news' },
      { type: 'p', content: 'If the answer were based on being genuinely best, you couldn\'t do anything about it quickly. But it\'s based on being understood, consistent, and provable — which is work you can actually do. Every source you clean up, every claim you back with evidence, moves the answer in your direction.' },
      { type: 'p', content: 'The first step isn\'t guesswork either. Run the search yourself: ask three assistants the question a buyer would ask, and look at who appears and who doesn\'t. That\'s your starting line. We run that review for clients during a consulting day — and most are surprised by how much they were missing.' },
    ],
  },
  {
    slug: 'you-are-not-in-the-answer',
    title: 'You\'re not in the answer. Nobody told you.',
    date: 'May 2026',
    tag: 'Visibility',
    blurb:
      'The most expensive sentence your competitors will never see: when a buyer asks AI who to call, and your company simply isn\'t there. You didn\'t lose the sale. You never knew the question was asked.',
    body: [
      { type: 'p', content: 'A company can spend years building a reputation and still be invisible in the place where decisions are now being made. Not wrong, not disliked — absent. When a buyer asks an AI assistant "who\'s the best X for a company like ours," a list appears, and it doesn\'t include you. Nobody emails you about it. You never find out the question was asked.' },
      { type: 'pull', content: 'Being absent from the answer is not the same as losing a sale. It\'s worse — you never knew the question was asked.' },
      { type: 'h2', content: 'The silence is the expensive part' },
      { type: 'p', content: 'In a normal sales situation, losing a deal costs you time, but it costs you nothing else. You know it happened. You can learn from it. Being absent from an AI answer is the opposite: the cost is invisible, recurring, and compounding. Every week, some number of buyers ask about your category, get a list, and move on. There\'s no feedback loop, so there\'s no urgency — until you run the search and see it yourself.' },
      { type: 'p', content: 'The first time most companies see the actual answer, the reaction is the same. It\'s not anger at the AI. It\'s confusion that the gap between their reputation and their digital footprint got this wide without anyone noticing.' },
      { type: 'h2', content: 'Why it happens to good companies' },
      { type: 'p', content: 'It\'s almost never because the business is bad. It\'s because the materials AI reads — website, profiles, listings, reviews — were written for a human visitor, and they reward different things than a model does. Vague slogans, missing service pages, no dates, no named clients, thin local listings. A human reads between the lines; a model quotes what\'s there.' },
      { type: 'p', content: 'The fix is not to chase the AI. It\'s to make the materials you already own accurate enough that any careful reader — human or model — describes you the way your best customers would. That\'s the entire job, and it\'s a lot more predictable than it sounds.' },
    ],
  },
  {
    slug: 'owned-vs-rented-visibility',
    title: 'Owned visibility, or rented visibility?',
    date: 'April 2026',
    tag: 'Strategy',
    blurb:
      'Paid search was rented visibility: it worked until it got more expensive. Social reach was rented too. The visibility that lasts is the kind you earn in the places you control — which is exactly the kind AI trusts.',
    body: [
      { type: 'p', content: 'Businesses have been renting visibility for decades. Paid search worked — until everyone bid, and the cost of staying visible quietly consumed the margin it created. Social reach worked — until the algorithm changed and the reach disappeared overnight. Each time, companies rebuilt what they thought they owned, on land someone else controlled.' },
      { type: 'pull', content: 'Visibility you rent can be taken away. Visibility you own has to be earned — which is exactly why it lasts.' },
      { type: 'h2', content: 'What you actually own' },
      { type: 'p', content: 'You own your website, your service pages, your case studies, your reviews, and the way you describe yourself in listings. That\'s a short list, and it\'s the exact list AI assistants read first. A model doesn\'t cite an ad; it cites a page, a review, a profile. The places it relies on are the places you control — the places nobody can take from you.' },
      { type: 'p', content: 'This is why AI visibility behaves differently from the platforms that came before it. It rewards accuracy, consistency, and proof in your own materials, rather than spending against an auction. Improve the materials and the answer improves; the effect compounds, and it doesn\'t vanish when you stop paying.' },
      { type: 'h2', content: 'The practical test' },
      { type: 'p', content: 'Ask one question about every piece of visibility you currently invest in: if the platform changed its rules tomorrow, would you still be visible? For ads and algorithm-dependent reach, the answer is no. For a website that accurately describes you, with evidence a model can verify, the answer is yes — and it will still be yes next year.' },
    ],
  },
  {
    slug: 'good-better-best',
    title: 'Good, Better, Best — and the list AI gives buyers',
    date: 'March 2026',
    tag: 'Positioning',
    blurb:
      'Most companies are lost in a category of dozens of lookalikes. AI assistants were built to collapse that problem into three names. Being distinctive is no longer a marketing preference. It\'s the highest-priority factor in who gets named.',
    body: [
      { type: 'p', content: 'When buyers search the old way, they browse. They compare tab by tab, weigh reviews, and keep their options open. When they ask an AI assistant, they delegate the filtering. The assistant\'s whole job is to compress a category into a short list — three names, sometimes five, rarely more. And once a name is on that list, it stays in the buyer\'s mind even when they verify it themselves.' },
      { type: 'h2', content: 'The undifferentiated business has a problem' },
      { type: 'p', content: 'A model asked for a recommendation in a category of dozens of near-identical companies has a hard task. If every option looks the same to it — same services, same claims, same tone — there\'s no basis for a confident answer, so it does one of two things. It names the companies with the strongest, most consistent footprint, or it answers generically with no one\'s name at all. Both outcomes are bad news if you\'re in the pack.' },
      { type: 'pull', content: 'Distinctiveness is the highest-priority ranking factor — because without it, the AI has no reason to name you.' },
      { type: 'h2', content: 'Distinctive doesn\'t mean different for its own sake' },
      { type: 'p', content: 'It means the AI — and the buyer — can state in one sentence what you do, for whom, and why that matters. Real customer language, a specific audience, and proof. The companies that get named are rarely the biggest. They\'re the ones the model can describe without blurring into the rest of the category.' },
      { type: 'p', content: 'This is work you can see in the answer. Run the question, watch the list, and ask what the AI could say about you that it can\'t say about the company next to you. If the answer is "not much," you\'ve found the problem — and the fix.' },
    ],
  },
  {
    slug: 'what-ai-is-skeptical-of',
    title: 'What AI is skeptical of — and what it trusts',
    date: 'February 2026',
    tag: 'The Method',
    blurb:
      'Models are professionally suspicious. They\'ve been trained on a web full of claims, so they look for the same evidence a careful buyer would: real customer language, verifiable proof, and plain English.',
    body: [
      { type: 'p', content: 'There\'s a misconception that AI assistants believe what they read. They don\'t. They were trained on the whole web — including the parts that exaggerate — and they learned to be cautious. When a model describes a company, it\'s effectively running a credibility check: does this claim have support, and does the source material agree?' },
      { type: 'pull', content: 'A model doesn\'t trust confidence. It trusts evidence — the same evidence a careful buyer would.' },
      { type: 'h2', content: 'Three things AI is skeptical of' },
      { type: 'p', content: 'Unsupported claims. "Best-in-class," "trusted by thousands," "industry leading" — a model hears these constantly and weighs them at zero. There\'s no date, no number, no name behind them. They make you harder to recommend, not easier.' },
      { type: 'p', content: 'Generic language. Copy that could belong to any company in the category tells a model nothing it can use to distinguish you — and a model needs a reason to name one company over another. If it can\'t find one, it leaves you out.' },
      { type: 'p', content: 'Stale content. AI systems weigh currency. A website that hasn\'t changed in years, an abandoned blog, a LinkedIn profile that stops after 2019 — these quietly lower the confidence a model has in everything else about you.' },
      { type: 'h2', content: 'What it trusts instead' },
      { type: 'p', content: 'The same things a careful human buyer trusts. Real customer language — how actual clients describe the problem you solve, not how marketers do. Verifiable proof — dates, numbers, named work, measurable outcomes. And plain English, because the more directly your materials state who you are and what you do, the less room there is for a model to describe you wrong.' },
      { type: 'p', content: 'This is the whole method, and it\'s why it works: you don\'t have to trick the AI. You have to make the sources it reads say the true thing about you — out loud, in plain language, with the proof to back it.' },
    ],
  },
  {
    slug: 'the-blue-check-moment',
    title: 'The blue check moment: when buying becomes a verdict',
    date: 'January 2026',
    tag: 'The Purchase',
    blurb:
      'The moment that decides most B2B sales happens before a buyer talks to you: when they delegate the shortlist to an AI and the recommendation turns into a verdict. We call it the purple drop.',
    body: [
      { type: 'p', content: 'A B2B purchase used to have a shape. Research, shortlist, demos, negotiation, decision. Companies spent their effort on the later stages — the demos, the proposal, the final push — because they believed that\'s where deals were won.' },
      { type: 'h2', content: 'The shape has changed' },
      { type: 'p', content: 'Today the narrowing happens first, in a single step that the buyer delegates. They ask an AI assistant to name who to consider, and the assistant returns a short list. From that moment, the purchase has a verdict: you\'re on the list or you\'re not. Everything after is mostly confirmation — buyers verify the recommendation, then buy from it.' },
      { type: 'pull', content: 'The sale isn\'t lost at the demo. It\'s lost in the moment the recommendation becomes a verdict.' },
      { type: 'h2', content: 'Why we call it the purple drop' },
      { type: 'p', content: 'We call that moment the purple drop — the point where a recommendation turns into a decision, and a decision turns into a shortlist. It\'s a tiny slice of time, and it has outsize consequences. Miss it and the most persuasive sales team on earth is fighting a battle that already ended. Win it, and buyers walk into the first conversation already expecting to choose you.' },
      { type: 'h2', content: 'What that means for how you sell' },
      { type: 'p', content: 'It doesn\'t mean the later stages don\'t matter. It means the earlier one now decides who gets the chance to matter. The companies we work with make the purple drop their own — so that when the buyer\'s verdict arrives, it already has their name in it.' },
    ],
  },
];
