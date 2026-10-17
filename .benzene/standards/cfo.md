# CFO: how the competition earns and grows

Rules followed: every number below carries an evidence ID `[E#]`, and each ID maps to a URL in `## Evidence`. Every page was fetched on **2026-10-17**. Wayback Machine snapshots keep their own capture date, which is shown next to the number. Derived figures (ratios, fees, growth rates) are marked *derived* and computed only from cited numbers. A claim that could not be fetched, or that conflicts between two fetched pages, sits in `## Unverified` and is not used as a target in `## The bar for our product`.

Product under study: https://elegantfrontend.training. It is a static Jekyll site on GitHub Pages with Supabase accounts. It teaches frontend terminology and AI-harness Agent Skills to frontend developers who lost their jobs to AI. Payments will go through PayPal: a sandbox checkout first, with the JS SDK on the static site and server-side order verification by the CFO office.

---

## Cases

### 1. GreatFrontEnd (Yangshun Tay; Codeney Pte Ltd, Singapore [E6])
- **Pricing.** Interviews Premium, all in USD ("Prices shown are in USD."): **Lifetime $180** paid once (list $500, "60% off"); **Monthly $39**; **Quarterly $85** ($29/mo); **Annual $120** ($10/mo, "RECOMMENDED") [E1]. Monthly does not include certificates or the private Discord. Quarterly, Annual and Lifetime do [E1]. The licence unit is one account: "An account is required to purchase premium" [E1]. GreatFrontEnd Projects is a separate product with separate membership and "no lifetime premium membership" [E1].
- **Regional pricing.** Built into checkout. The page data carries `countryCode`, `conversionFactor` and `withPPP` prices. The template reads "We noticed you're in {countryName}. We support Purchasing Power Parity, so a {discount}% discount has been automatically applied!" [E1]. Our fetch resolved to `countryCode: "US"`, `conversionFactor: 1`, so the prices above are US prices.
- **Discounts.** Student **40%** off Annual, for "currently enrolled students at accredited educational institutions" with a .edu/.ac email. Seasonal **10%** off Annual (code FALL26). Social **20%** off any plan for following social accounts. **100% cashback** on the first order for a public review of at least 1,000 words or 5 minutes, after 20+ solved questions [E2]. Lifetime: "Student accounts are not eligible for this plan" [E1]. **No unemployed discount** appears [E2]. A tip on the page says many users get reimbursed from company learning budgets [E1].
- **Refund.** "GreatFrontEnd Interviews purchases are non-refundable." Cancelling keeps access to the end of the period [E1].
- **Payments.** Stripe: "Manage your subscription status and payment methods on the Stripe billing portal" [E1]. Card-decline FAQ: "This is a common issue faced by customers from India and Indonesia because some card providers block overseas transactions" [E1]. Affiliates are paid by PayPal: "Payment is made directly to your PayPal account" [E1].
- **Disclosed revenue.** None on any fetched page.
- **Cost signals.** 19 people on the team page, several of them interns or contributors employed elsewhere [E3].
- **Growth signals.** "2M+ engineers trust us with their job interviews" (2026-10-17) [E1]. "700k+ engineers already on board" (snapshot 2025-05-22) [E5]. "We sell to users in more than 100 countries" [E1]. "417 online" at fetch time [E1].
- **Free-to-paid.** Free questions and guides. "Purchase premium to unlock official solutions, premium questions, study plans, company tags, and completion certificates" [E1].
- **Price ladder over time.** Snapshot 2024-04-25: Lifetime **$154** (U.P. $300), Monthly **$35**, Quarterly **$70**, Annual **$120** [E4]. Today: $180 / $39 / $85 / $120 [E1]. "Prices will be increased as more content is being added to the website. Subscribe early to lock in this earlybird price." [E1]
- **Unit economics (derived).** Annual is 74% below 12× monthly. Lifetime = 1.5× annual = 4.6× monthly [E1]. Affiliate cost: "15% for all valid first purchases within 7 days of the cookie window" [E1].

### 2. Frontend Masters, now Master.dev (Marc Grabanski)
- **Pricing.** Individual **$39/month** or **$390/year** ("Save 17%"). Teams **$24.50/seat/month** or **$245/seat/year** for 10+ users, with reassignable seats. Enterprise is "Contact Us" (invoice/PO/bank transfer, SSO) [E7]. The licence unit is one person, or one seat on Teams [E7].
- **Regional pricing.** "If available for your area, location-based discounts can be applied at checkout," with local-currency payment [E8].
- **Discounts.** Students get "six months of free access to the entire platform" through the GitHub Student Developer Pack [E8]. **No unemployed discount**. Veterans: no direct discount; the company supports Vets Who Code instead [E7][E8].
- **Refund.** Individual plans, initial period only: 10 days for monthly, 30 days for annual. "Refunds are not available for unused team seats." [E8]
- **Payments.** "We offer the ability to pay by Credit Card (processed through Stripe), PayPal", plus the Apple App Store through the app [E8].
- **Disclosed revenue.** None. A rebrand-post sidebar shows **$966,000**, labelled as donations to open source and non-profits [E9] (see Unverified).
- **Growth signals.** "Loved by 500k+ developers"; "300+ courses and live workshops" (2026-10-17) [E7]. "200+ In-Depth Courses" (snapshots 2024-06-01 and 2025-06-02) [E12]. Renamed 2026-06-15: "Four of our ten most popular courses right now are about AI." [E9]
- **Free-to-paid.** No free trial. A free account unlocks five full courses, and there is a free two-week online bootcamp [E7][E8].
- **Price ladder over time.** 2022-06-02: $39/mo, $390/yr; Teams $195/month or $1,950/year "for 10 people" [E10]. 2024-05-31: $39/$390; Teams $24.50/seat/mo, $245/seat/yr [E11]. Individual price unchanged for 4+ years [E7][E10].
- **Unit economics (derived).** Yearly = 10× monthly. A team seat costs 63% of an individual yearly plan [E7].

### 3. BigFrontEnd.dev (BFE.dev; jser合同会社, Tokyo)
- **Pricing.** Premium **$6 USD/month**, or **$48 USD/year** ($4/mo, "Saves you more than 33%"). Redeem codes are supported [E13]. One account; sign-in is GitHub-only [E13].
- **Regional / student / unemployed.** None stated [E13].
- **Refund.** "As a small team, we don't offer refund. Try monthly plan first before upgrading to yearly plan." [E13] The legal page agrees: no returns, because it is a small monthly subscription [E14].
- **Payments.** "Stripeを通したクレジットカードなど" (credit cards through Stripe) [E14].
- **Revenue / cost.** None disclosed. Seller: jser合同会社, one named representative [E14].
- **Free-to-paid.** Practice is free. Premium sells **Ad-Free**, Crack Mode, full Quick Code 75, one-click React quiz inspection, more than 3 lists, and full submission history [E13]. The page also carries a GreatFrontEnd link with an affiliate parameter, `?fpr=bfe` [E13].

### 4. Frontend Mentor (Matt Studdert, Mike Hayden; London)
- **Pricing.** Pro **$15/month**, or **$120/year** ($10/mo, "save 33% vs monthly"). Individuals and Teams tabs [E15].
- **Credit limits as a business control.** Monthly Pro gets 5 Figma files and 2 premium challenges a month; Yearly is unlimited. The reason: "Otherwise, someone could subscribe for a month, download everything, and immediately cancel." [E15]
- **Regional / discounts.** "We don't offer any discounts on the Pro subscription beyond the regional discounts that we automatically apply." [E15] No student or unemployed discount.
- **Refund.** A "fair use" refund within 14 days of the first subscription. They can refuse after 3 or more premium downloads [E15].
- **Payments.** Visa, MasterCard, Amex, Maestro, PayPal and Google Pay [E15]. Billing runs on Chargebee (`js.chargebee.com/v2/chargebee.js`). Affiliates run on Tolt (`cdn.tolt.io/tolt.js`) [E15]. Chargebee rate-limited them at the 2020 launch [E20].
- **Disclosed revenue.** Feb 2020: "$1,011" in a month (one-off premium challenge sales) [E20]. 2020-08-27: "$1.6k MRR on $12.3k of sales from 284 subscribers" two weeks after PRO launched [E20]. 2021-07-13: "Revenue last month was just over $17K", "break-even" after "expenses, contractors, and salaries" [E21]. 2023-04-30: "hovering around $30k MRR" [E22].
- **Cost signals.** Two founders full-time plus contractors (2021) [E21]. The founder went full-time on 2020-12-09 [E20].
- **Growth signals.** See Growth curves. 1,202,288 people today [E16].
- **Free-to-paid.** Free challenges and "one AI code review a month". Pro adds AI review on every solution, design files, premium challenges, private solutions and custom domains [E15]. Employers can be invoiced [E15].
- **Unit economics (derived).** Launch: $43.31 average first sale; 10 refund requests out of 284 = **3.5%** [E20]. Fewer than 1% of users convert to paid (secondary source) [E23]. ~$0.06 MRR per registered user in 2023 [E22].

### 5. Scrimba (Per Harald Borgen, Sindre Aarsaether; Oslo; YC S20)
- **Pricing.** Pro, monthly or annual only: "These are the only two plan options currently available" [E30]. Observed checkout: **$49.00/month** list. Annual discount **50%**. A "Halloween 2026" coupon takes **35%** more, giving **$15.92/month billed annually for $191.09** [E24]. Freemium is **$0 forever**. Pro Teams offers bulk licence discounts and invoicing [E24].
- **Regional pricing.** "Yes. Scrimba applies regional pricing (PPP) automatically based on your location" [E24].
- **Discounts.** Student discount by academic email [E28]. GitHub Student Pack: "1 month of Scrimba Pro for free". "We do not offer scholarships at this time." [E29] **No unemployed discount**.
- **Refund.** The pricing page says "Full 7-day guarantee, no questions asked" [E24]. The help centre says "Full refunds are available within 14 days of your initial purchase", with no refunds on renewals [E27]. (The conflict is listed under Unverified.)
- **Price promise.** "The price you pay today will stay, even if we increase prices in the future." [E24]
- **Disclosed revenue.** "The 2022 accounting figures show revenues of NOK 18.7 million and operating results of NOK - 0.3 million." (published 2023-10-09) [E25]
- **Cost signals.** "five employees in Norway and eight abroad" (2023) [E25]. The YC profile lists a team size of 6 [E26].
- **Growth signals.** "over one million unique users ... over ten thousand are paying customers" [E25]. "over 120K monthly active students" [E26].
- **Unit economics (derived).** Operating margin −1.6% (2022). NOK 1.44M revenue per employee. Paying/unique users ≈ 1% [E25].

### 6. Flavio Copes (flaviocopes.com; solo)
- **Pricing.** Paid cohorts: Internet Business Lab (28 Oct–17 Nov, 3 weeks); AI Workshop (2–22 Dec); Ship Factory (5–25 Jan); Bootcamp (10 weeks, next edition March 2027) [E31][E32]. Prices are withheld until enrollment opens: "I'll share the price when enrollment opens, and the waiting list hears it first." [E36]
- **Free.** 2,100+ posts and tutorials, 20+ ebooks [E35]. The download library of books and courses is free in exchange for a newsletter signup [E31].
- **Refund.** Bootcamp: "14-day full refund, no questions asked", with lifetime access [E32].
- **Revenue model.** "The tutorials bring people in. The free books help them go deeper. Courses and workshops give them structure, projects, feedback, and a community." [E34] Sponsorship: site placement plus a newsletter mention, on "around 150,000 unique visitors a month" and a newsletter that "reaches 150,000+ people, with open rates between 22% and 28%" [E33]. Current sponsors are Creem and LiveKit [E31].
- **Cost signals.** "Every project here was bootstrapped. No venture capital. No staff hidden behind a personal brand." [E34]
- **Growth.** "I have taught tens of thousands of students." [E34] The AI Workshop's private Discord has "more than 280 developers" [E37]. A testimonial on the bootcamp page: "I took Flavio's bootcamp in 2021 while I was unemployed" [E32].
- **Revenue disclosed.** None in figures.

### 7. Kent C. Dodds: Epic React, Epic Web, Epic AI
- **Pricing.** One-time purchases. **Epic React Pro US$695** [E39]. **Epic Web Full Stack Vol 1 US$1,200** [E41]. **Epic MCP US$500** [E40]. Each has "Buying for myself or for my team" [E39][E40][E41].
- **Regional pricing.** "We support purchase power parity (PPP), based on IP address ... If you use the PPP discount your purchase will be restricted to the country you purchased it from!" PPP buyers may not get future bonus content [E40]. No student or unemployed discount appears in the fetched FAQ [E40].
- **Team licence unit.** "Team licenses are actually coupon codes that can be redeemed by users. They are owned by the individual who claims the seat" [E40].
- **Refund.** "30-Day Money-Back Guarantee" [E39][E40][E41].
- **Payments.** Stripe only. The checkout forms post to `/api/skill/checkout/stripe` and `/api/coursebuilder/checkout/stripe` [E39][E40][E41]. "Can I pay in installments/PayPal/crypto/etc.? No, the only available options for purchase are those currently on the site." [E40]
- **Disclosed revenue.** "tens of millions in revenue since 2019 via individual and enterprise licenses", at "several-hundred-dollar pricing" [E38].
- **Cost signals.** Kent was the "sole frontend engineer" and "Hired and onboarded a new frontend engineer" [E38].
- **Growth.** "serving 49k+ engineers" [E38]. "Join 40,000+ developers in the Epic Web community" [E42]. One Epic AI cohort had "over 350 students" [E40].

### 8. Josh W. Comeau (CSS for JavaScript Developers, The Joy of React, Whimsical Animations)
- **Pricing.** One-time tiers. **CSS for JS: $149 / $279 / $399** [E44]. **Joy of React: $249 / $399 / $599** [E45]. **Whimsical Animations: $299 / $449 / $649** [E46]. "Price shown in USD, excluding sales tax." [E44] Team licences save "up to 20%" [E44][E46].
- **Regional pricing.** A "regional license", restricted to the buyer's region, for the top ("Ultimate") package only [E45]. "Regional licenses are available exclusively for individuals." [E46]
- **Discounts.** "We can offer a 20% discount for students who can show proof of enrollment." It stacks with regional licences [E46]. **No unemployed discount**.
- **Refund.** "Unconditional 30-day refund policy ... including credit card transaction fees and sales tax. Every cent you paid." [E46]
- **Payments.** Paddle (`paddle.com/paddle/paddle.js` on css-for-js.dev), with PayPal shown as accepted [E44].
- **Disclosed revenue.** 2021-03-17: "the course has made over half a million dollars" from a one-week Early Access presale at "USD$129 + tax" [E43]. 2026-05-03: Whimsical Animations is "on track to sell roughly ⅓ as many copies as a typical course launch ... Sales are down significantly from last year." Among other creators: "Revenue down 50%+." [E47]
- **Cost signals.** "I estimate that my costs are about $450 a month ... At this point it's 99% profit"; "it's just me" (2021) [E43].
- **Growth.** 31k Twitter followers and ~28k email subscribers at launch, up from ~10k and ~1k in January 2020 [E43]. Buyers to date: "21,837 developers" (CSS) [E44] and "15,279 developers" (React) [E45].
- **Why sales fell, in his words.** "Many people are wondering whether developer jobs will even exist in a few months, so they're reluctant to spend time/money learning new dev skills." [E47] This describes our audience directly.

### 9. roadmap.sh (Kamran Ahmed)
- **Pricing.** Free $0. **Pro $10/month**, or **$100/yr** ($8.33/mo, "Save 17%"). **Team $10/seat/month**, billed annually, "Minimum 3", with a 7-day free trial and no credit card [E48]. "Gift a year of Pro" [E48].
- **Free-to-paid.** "The free plan gives you one-time allowances to try everything: 20 AI chats, 2 AI courses (with 5 lessons), 2 guides, 2 roadmaps and 2 quizzes. These don't reset." "Think of free as a taste, Pro as the full experience." [E48] The roadmaps themselves are free and open source [E51].
- **Other revenue.** "Advertise with roadmap.sh" via a contact form [E49]. Employer budgets: "Ask your manager to cover Roadmap Pro for the whole team." [E48]
- **Regional / student / unemployed / refund / provider.** Not stated on the fetched pages [E48].
- **Growth.** 3.2M registered users, adding ~90k a month. 52K Discord. 370K stars; the API shows 369,691 [E49][E51]. "Joined by 18K+ developers" on Pro [E48]. The newsletter has "150,000+ developers" [E50].
- **Infrastructure.** Built with Astro and "deployed on GitHub Pages" [E50]. That is the same static-site constraint we have.

### 10. patterns.dev (Lydia Hallie, Addy Osmani)
- **Pricing.** "Patterns.dev is a free online resource" [E56]. The 435-page "Learning Patterns" book is free on Google Play, Apple Books, Archive.org and SpeakerDeck [E56][E58]. On Leanpub it is "Free!" with a suggested $9.99 pay-what-you-want price ("We pay 80% royalties on purchases of $7.99 or more") [E57].
- **Revenue / cost.** None disclosed. Addy Osmani is an engineering manager on Google Chrome [E56].
- **Growth.** "Join 12,000+ developers getting practical guides, tutorials, weekly AI briefings, and workshop updates." [E56] The book has 29 Apple Books ratings, published 2021-10-18 [E58].
- **Lesson.** This is a pure free funnel with optional pay-what-you-want. It proves reach, not revenue.

---

## Evidence

All fetched 2026-10-17. Methods: **WF** = WebFetch. **HC** = headless Chrome render (`google-chrome --headless --dump-dom`), used where WF or curl returned 403, a Cloudflare challenge or a JS-only shell. **CURL** = curl with a browser user agent. **API** = JSON API. **WB** = Wayback Machine snapshot fetched by curl; its capture date is in the URL.

| ID | URL | Method | What was read |
|---|---|---|---|
| E1 | https://www.greatfrontend.com/pricing | WF+HC | Lifetime $180 (list $500), $39/mo, $85/qtr, $120/yr; USD; PPP template and `countryCode:"US"`; "non-refundable"; Stripe billing portal; India/Indonesia card-decline FAQ; affiliate 15% first order, 7-day cookie, PayPal payouts; ">100 countries"; "2M+ engineers"; "417 online" |
| E2 | https://www.greatfrontend.com/promotions | WF | Student 40% (Annual, .edu/.ac); FALL26 10%; social 20%; review cashback 100% (≥20 questions, ≥1000 words / ≥5 min) |
| E3 | https://www.greatfrontend.com/team | WF | 19 people listed |
| E4 | https://web.archive.org/web/20240425015759/https://www.greatfrontend.com/pricing | WB | 2024-04-25: Lifetime $154 (U.P. $300), $35/mo, $70/qtr, $120/yr |
| E5 | https://web.archive.org/web/20250522190612/https://www.greatfrontend.com/ | WB | 2025-05-22: "700k+ engineers already on board" |
| E6 | https://web.archive.org/web/20240530160349/https://www.greatfrontend.com/ | WB | Footer "2024 Codeney Pte Ltd. All rights reserved." |
| E7 | https://master.dev/join/ (301 from https://frontendmasters.com/join/) | WF | $39/mo, $390/yr; Teams $24.50 and $245/seat for 10+; Enterprise; refund windows; Stripe/PayPal/App Store; "500k+ developers"; "300+ courses"; 5 free courses; GitHub Student Pack |
| E8 | https://master.dev/faq/join/ | WF | Payment methods; refund quotes; location-based discounts; 6-month GitHub Student Pack; 5 free courses |
| E9 | https://blog.master.dev/today-frontend-masters-becomes-master-dev/ | WF | 2026-06-15 rebrand; 300+ courses; 24 learning paths; "Four of our ten most popular courses right now are about AI."; $966,000 sidebar |
| E10 | https://web.archive.org/web/20220602044930/https://frontendmasters.com/join/ | WB | 2022-06-02: $39, $390; team $195/mo and $1,950/yr for 10 people |
| E11 | https://web.archive.org/web/20240531015010/https://frontendmasters.com/join/ | WB | 2024-05-31: $39, $390; $24.50/seat/mo; $245/seat/yr |
| E12 | https://web.archive.org/web/20240601221153/https://frontendmasters.com/ and https://web.archive.org/web/20250602010328/https://frontendmasters.com/ | WB | "over 200 courses" (2024); "200+ In-Depth Courses", 21 Learning Paths (2025) |
| E13 | https://bigfrontend.dev/premium | HC (WF and curl: 403) | $6/mo, $48/yr; no refund; premium feature list; `greatfrontend.com?fpr=bfe` link |
| E14 | https://bigfrontend.dev/static/html/sct.html | HC | jser合同会社; Stripe credit cards; "月に5 USDまたは年間 35 USD"; no returns |
| E15 | https://www.frontendmentor.io/pro | WF+HC | $15/mo, $120/yr; credit limits and reason; regional discounts only; 14-day fair-use refund; card/PayPal/Google Pay; Chargebee and Tolt scripts; employer invoice |
| E16 | https://www.frontendmentor.io/ | HC | "Join 1,202,288 people building portfolio-worthy projects" |
| E17 | https://web.archive.org/web/20230602052235/https://www.frontendmentor.io/pro | WB | 2023-06-02: $12/mo; $96/yr ($8/mo) |
| E18 | https://web.archive.org/web/20210618140534/https://www.frontendmentor.io/ | WB | 2021-06-18: "Join 164,857 developers"; "Join over 50,000 people" (community) |
| E19 | https://web.archive.org/web/20250603185912/https://www.frontendmentor.io/ | WB | 2025-06-03: "Join 1,027,926 people" |
| E20 | https://www.indiehackers.com/product/frontend-mentor | HC | Milestones from 2020-01-28 to 2020-12-09: 7,000 users; 20,000 visits/mo; $1,011 (Feb 2020); 10k Slack; $12.3k / $1.6k MRR / 284 subs; 10 refund requests; 7k+ newsletter; Chargebee block; first sponsors |
| E21 | https://www.failory.com/interview/frontend-mentor | WF | 2021-07-13: "$17K" last month; 150,000 members; break-even; lifetime early-bird for first 500 |
| E22 | https://indiebites.com/86 (301 from indiebites.transistor.fm/86) | WF | 2023-04-30: "over 500,000 users ... around $30k MRR" |
| E23 | https://bootstrappers.com/you-dont-need-to-be-a-design-expert-to-be-a-great-frontend-dev/ | WF | 2023-01-06: "over 2,500 people had signed up ... around $380,000 ARR"; "fewer than one percent have converted" |
| E24 | https://scrimba.com/pricing | HC (WF: title only) | $49.00 list; 50% annual; Halloween 2026 35%; $15.92/mo, $191.09/yr; 7-day guarantee; "Keep your price"; PPP FAQ; Freemium list; Pro Teams; `StripeCoupon` CSS class |
| E25 | https://vend.com/news/schibsted-ventures-invests-in-upskilling-company-scrimba | WF | 2023-10-09: NOK 18.7M revenue, NOK −0.3M operating result (2022); >1M users; >10k paying; 5+8 employees; 4.5% stake |
| E26 | https://www.ycombinator.com/companies/scrimba | WF | Founded 2017; S20; team size 6; "over 120K monthly active students" |
| E27 | https://scrimba.helpscoutdocs.com/article/6-how-do-i-get-a-refund | WF | "Full refunds are available within 14 days of your initial purchase." |
| E28 | https://scrimba.helpscoutdocs.com/article/19-do-you-offer-student-discounts | WF | "Yes, we offer a student discount." (academic email) |
| E29 | https://scrimba.helpscoutdocs.com/article/71-can-i-get-a-scholarship | WF | "We do not offer scholarships at this time."; GitHub Pack 1 month Pro |
| E30 | https://scrimba.helpscoutdocs.com/article/72-how-much-does-scrimba-cost | WF | Only monthly or annual plans |
| E31 | https://flaviocopes.com/ | HC (WF: 403) | Cohort calendar; free download library for newsletter signup; sponsors Creem, LiveKit |
| E32 | https://flaviocopes.com/courses/bootcamp | HC | March 2027, 10 weeks; "14-day full refund, no questions asked"; lifetime access; "while I was unemployed" testimonial |
| E33 | https://flaviocopes.com/sponsor | HC | ~150,000 unique visitors/mo; newsletter 150,000+; 22–28% open rate |
| E34 | https://flaviocopes.com/built/ | HC | Funnel quote; "No venture capital. No staff"; "tens of thousands of students" |
| E35 | https://flaviocopes.com/about | HC | 20+ ebooks, 2,100+ posts, 15+ courses |
| E36 | https://flaviocopes.com/courses/internet-business-lab | HC | Price withheld until enrollment |
| E37 | https://flaviocopes.com/courses/ai-workshop | HC | Private Discord, 280+ developers |
| E38 | https://kentcdodds.com/resume | WF | "tens of millions in revenue since 2019"; "several-hundred-dollar pricing"; "49k+ engineers"; sole frontend engineer |
| E39 | https://www.epicreact.dev/ | HC | Epic React Pro US$695; 30-Day Money-Back; Stripe checkout form; team option |
| E40 | https://www.epicai.pro/ | HC | Epic MCP US$500; FAQ: PPP by IP, country-locked; no PayPal/installments; team seats are coupon codes; Stripe checkout; 350-student cohort |
| E41 | https://www.epicweb.dev/full-stack | HC | Full Stack Vol 1 US$1,200; 30-day guarantee; Stripe checkout |
| E42 | https://www.epicweb.dev/ | WF+CURL | "Join 40,000+ developers in the Epic Web community" |
| E43 | https://www.indiehackers.com/post/launched-my-first-course-earned-over-us-500-000-ama-4382405cd5 | HC (WF: 403) | 2021-03-17: >$500k; $129 Early Access; 380-copy goal; 31k/28k audience; ~$450/mo costs; "99% profit"; "just me" |
| E44 | https://css-for-js.dev/ | HC | $149/$279/$399; 21,837 developers; 30-day refund; Paddle.js; team up to 20% |
| E45 | https://www.joyofreact.com/ | HC | $249/$399/$599; 15,279 developers; regional licence for Ultimate only |
| E46 | https://whimsy.joshwcomeau.com/ | HC | $299/$449/$649; unconditional 30-day refund including fees and tax; regional licence for individuals only; student 20% |
| E47 | https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=at://joshwcomeau.com/app.bsky.feed.post/3mkxyqgrp2d2t (thread at https://bsky.app/profile/joshwcomeau.com/post/3mkxyqgrp2d2t) | API | 2026-05-03: "⅓ as many copies"; "Sales are down significantly"; "Revenue down 50%+" (creators he spoke to); the two AI reasons |
| E48 | https://roadmap.sh/premium | HC | Free; Pro $10/mo or $100/yr; Team $10/seat/mo, min 3; one-time free allowances; "18K+ developers"; "3.2M Active Learners"; gift; "Ask your manager" |
| E49 | https://roadmap.sh/advertise | HC | Ads form; 370K stars; +3.2M registered (+90k/month); 52K Discord (+2k/month); body text "over 1 million registered users" |
| E50 | https://roadmap.sh/about | WF | Astro + Tailwind on GitHub Pages; newsletter 150,000+ |
| E51 | https://api.github.com/repos/kamranahmedse/developer-roadmap | API | 369,691 stars; 45,097 forks; created 2017-03-15 |
| E52 | https://web.archive.org/web/20230531202549/https://roadmap.sh/ | WB | 2023-05-31: 241K stars |
| E53 | https://web.archive.org/web/20240601053143/https://roadmap.sh/ | WB | 2024-06-01: 278K stars; 850k registered (+55k/mo); 21K Discord (+1.5k/mo) |
| E54 | https://web.archive.org/web/20250601214003/https://roadmap.sh/ | WB | 2025-06-01: +2.1M registered (+90k/mo); 37K Discord (+2k/mo); "224K" stars displayed |
| E55 | https://web.archive.org/web/20250723072436/https://roadmap.sh/premium | WB | 2025-07-23: $10/month; "2.1M+ Active Developers" |
| E56 | https://www.patterns.dev/ , /book , /about , /newsletter | HC | "free online resource"; 435-page book on 5 stores; authors; "Join 12,000+ developers" |
| E57 | https://leanpub.com/learningpatterns/ | WF | "Free!"; suggested $9.99; 80% royalties at ≥$7.99 |
| E58 | https://books.apple.com/us/book/learning-patterns/id1591084282 | WF | Published 2021-10-18; 435 pages; 29 ratings, average 4.4 |
| E59 | https://developer.paypal.com/studio/checkout/standard/integrate | CURL | Direct-merchant standard checkout: "Your app calls server endpoints to create the order and capture payment."; server reads `PAYPAL_CLIENT_ID`/`PAYPAL_CLIENT_SECRET` from env; defaults to sandbox; test ID `client-id=test`; sandbox test steps |
| E60 | https://developer.paypal.com/docs/checkout/standard/integrate/ (resolves to /platforms/checkout/standard/integrate) | WF+CURL | Updated 2026-10-14; SDK v5 "remains supported", v6 recommended for new work; `/api/orders` and `/capture` server routes; "Keep this secret safe and don't share it."; sandbox base `https://api-m.sandbox.paypal.com` |
| E61 | https://developer.paypal.com/sdk/js/set-up | WF+CURL | Updated 2026-10-13; v6 core script live and sandbox URLs; "This static client ID value is safe to include in your front-end code."; "Never expose PayPal client secrets in frontend code"; client token via `/v1/oauth2/token` with `response_type=client_token` |
| E62 | https://developer.paypal.com/v5-v6 | WF | Updated 2026-08-24; v5 used `client-id` in the URL; v6 loads core with no URL config and authenticates in `createInstance`; "server-side authentication" |
| E63 | https://developer.paypal.com/sdk/js/v5/configuration/ | WF | Updated 2026-07-08; `https://www.paypal.com/sdk/js?client-id=...`; do not bundle or self-host; `client-id=sb` sandbox shortcut; intent capture/authorize/subscription; buyer-country is sandbox-only |
| E64 | https://developer.paypal.com/sdk/js/v5/reference/ | WF | Updated 2026-09-11; createOrder and onApprove examples call the server Orders API |
| E65 | https://developer.paypal.com/sdk/js/reference/ | WF | Updated 2026-08-18 (v6); onApprove: "This is where you should capture or authorize the payment on your server." |
| E66 | https://developer.paypal.com/api/rest/integration/orders-api/ | WF+CURL | Updated 2026-06-17; "Set up your server to call the Orders v2 API instead of making calls directly from the browser or the client-side." |
| E67 | https://developer.paypal.com/api/orders/v2.md and https://developer.paypal.com/api/orders/v2/schema.json | CURL | Endpoints; statuses CREATED/SAVED/APPROVED/VOIDED/COMPLETED/PAYER_ACTION_REQUIRED; intent CAPTURE/AUTHORIZE; `custom_id`, `invoice_id` (unique per merchant); `PayPal-Request-Id` idempotency header; OAuth2 client credentials |
| E68 | https://developer.paypal.com/platforms/checkout/standard/upgrade-integration | WF | Updated 2026-10-14; "Migrate the `actions.payment.create()` call to a server-side integration pattern with the create order endpoint." |
| E69 | https://developer.paypal.com/api/rest/ | WF | Client ID and secret from Apps & Credentials; `POST /v1/oauth2/token`, `grant_type=client_credentials`; "Keep this secret safe." |
| E70 | https://developer.paypal.com/tools/sandbox/accounts/ | WF | Updated 2026-10-14; default business and personal sandbox accounts (`sb-…@business.example.com`, `sb-…@personal.example.com`); https://www.sandbox.paypal.com |
| E71 | https://developer.paypal.com/api/rest/webhooks/ | WF | Updated 2026-08-03; up to 10 URLs per app; retries up to 25 times over 3 days; two verification methods |
| E72 | https://developer.paypal.com/api/rest/webhooks/rest/ | WF | Updated 2026-06-18; `paypal-transmission-id/-time/-sig`, `paypal-cert-url`; `POST /v1/notifications/verify-webhook-signature`; CRC32 self-verification; simulator events (`WEBHOOK_ID`) cannot be verified by postback |
| E73 | https://developer.paypal.com/api/rest/webhooks/event-names/ | WF | Updated 2026-09-10; CHECKOUT.ORDER.APPROVED/COMPLETED, PAYMENT.CAPTURE.COMPLETED/DENIED/PENDING/REFUNDED/REVERSED, CUSTOMER.DISPUTE.CREATED, BILLING.SUBSCRIPTION.ACTIVATED/CANCELLED, PAYMENT.SALE.COMPLETED |
| E74 | https://www.paypal.com/us/business/paypal-business-fees | WF | Updated 2026-10-01; PayPal Checkout 3.49% + fixed fee; cards 2.99% + fixed fee; international +1.50%; currency conversion 3.00%; fixed fee 0.49 USD |
| E75 | https://stripe.com/pricing | WF | 2.9% + 30¢; +1.5% international cards; +1% conversion; Billing 0.7% |
| E76 | https://www.paddle.com/pricing | WF | 5% + 50¢ per checkout transaction; Merchant of Record with tax handling |
| E77 | https://supabase.com/docs/guides/functions/secrets | WF | `supabase secrets set`; `Deno.env.get`; local secrets in `supabase/functions/.env`; ".env file committed to Git exposes every secret"; secret API keys "never in a browser" |

---

## Pricing table

USD unless noted. "—" means the fetched page states nothing. A blank refund cell is not an assumption of "none".

| Competitor | Product / tier | Price | Billing | Licence unit | Regional / PPP | Student | Unemployed | Refund | Provider | Ev. |
|---|---|---|---|---|---|---|---|---|---|---|
| GreatFrontEnd | Interviews Monthly | $39 | monthly | 1 account | Auto PPP by country | 40% off Annual (.edu/.ac) | none | Non-refundable | Stripe | E1 E2 |
| GreatFrontEnd | Interviews Quarterly | $85 ($29/mo) | quarterly | 1 account | Auto PPP | — | none | Non-refundable | Stripe | E1 |
| GreatFrontEnd | Interviews Annual | $120 ($10/mo) | yearly | 1 account | Auto PPP | 40% | none | Non-refundable | Stripe | E1 E2 |
| GreatFrontEnd | Interviews Lifetime | $180 (list $500) | once | 1 account | Auto PPP | Not eligible | none | Non-refundable | Stripe | E1 |
| Master.dev (FEM) | Individual | $39 / $390 | monthly / yearly | 1 person | Location-based discounts + local currency | 6 mo free (GitHub Pack) | none | 10 d (mo), 30 d (yr), first period | Stripe, PayPal, App Store | E7 E8 |
| Master.dev (FEM) | Teams (10+) | $24.50 / $245 | per seat mo / yr | Seat (reassignable) | — | — | — | 10 d; unused seats non-refundable | Stripe, PayPal | E7 E8 |
| Master.dev (FEM) | Enterprise | Contact | yearly | Org | — | — | — | — | Invoice, PO, bank transfer | E7 |
| BigFrontEnd.dev | Premium | $6 / $48 | monthly / yearly | 1 account | — | — | — | No refund | Stripe | E13 E14 |
| Frontend Mentor | Pro | $15 / $120 | monthly / yearly | 1 person; Teams tab | Auto regional discount | none | none | 14 d fair use | Chargebee; card, PayPal, Google Pay | E15 |
| Scrimba | Pro | $49 list; annual −50%; seasonal coupon −35% → $191.09/yr | monthly / yearly | 1 person; Pro Teams bulk | Auto PPP | Academic email; GitHub Pack 1 mo | none; no scholarships | 7 d (pricing page) vs 14 d (help centre) | Stripe (inferred from DOM) | E24 E27–E30 |
| Flavio Copes | Cohorts / Bootcamp | Withheld until enrollment | once | 1 person | — | — | — | 14 d full (Bootcamp) | — | E32 E36 |
| Kent C. Dodds | Epic React Pro | $695 | once | Person; team seats as coupon codes | PPP by IP, country-locked | — | — | 30 d | Stripe only; no PayPal | E39 E40 |
| Kent C. Dodds | Epic Web Full Stack Vol 1 | $1,200 | once | same | same | — | — | 30 d | Stripe | E41 |
| Kent C. Dodds | Epic MCP | $500 | once | same | same | — | — | 30 d | Stripe | E40 |
| Josh W. Comeau | CSS for JS (3 tiers) | $149 / $279 / $399 | once | Person; team ≤20% off | Regional licence (Ultimate only, individuals only) | 20% (stacks) | none | 30 d unconditional, incl. fees and tax | Paddle; PayPal accepted | E44 E46 |
| Josh W. Comeau | Joy of React (3 tiers) | $249 / $399 / $599 | once | same | same | 20% | none | 30 d | Paddle / PayPal | E45 E46 |
| Josh W. Comeau | Whimsical Animations (3 tiers) | $299 / $449 / $649 | once | same | same | 20% | none | 30 d | — | E46 |
| roadmap.sh | Pro | $10 / $100 | monthly / yearly | 1 person | — | — | — | — | — | E48 |
| roadmap.sh | Team | $10 | per seat / mo, billed yearly, min 3 | Seat | — | — | — | — | — | E48 |
| patterns.dev | Book / site | Free; Leanpub suggests $9.99 | once (optional) | — | — | — | — | — | Leanpub, Google Play, Apple Books | E56 E57 |

**Patterns across the table:**
- **Monthly entry prices cluster at $6–$15.** BFE $6, roadmap.sh $10, Frontend Mentor $15. The outliers are $39 (GreatFrontEnd, Master.dev) and $49 list (Scrimba) [E1][E7][E13][E15][E24][E48].
- **Annual plans cluster at $100–$120.** roadmap.sh $100; GreatFrontEnd and Frontend Mentor $120 [E1][E15][E48].
- **One-time course tiers run from $149 to $1,200** [E39][E41][E44].
- **No fetched competitor offers an unemployed or between-jobs discount.** Six of ten offer PPP or regional pricing; five offer student pricing.
- **Refunds:** 30 days (Josh, Epic) is the generous end; 14 days (Frontend Mentor, Scrimba help centre, Flavio) is the floor among those that offer refunds. Two say no (GreatFrontEnd, BFE).

---

## Growth curves

Each value is the one the source showed on that date. The ×/year column is *derived*.

**Frontend Mentor: users and revenue** [E16][E18][E19][E20][E21][E22]

| Date | Users | Revenue | Source |
|---|---|---|---|
| 2020-01-28 | 7,000 registered; 20,000 visits/mo | First profitable month | E20 |
| 2020-03-02 | 10,000 registered | $1,011 (Feb, one-off sales) | E20 |
| 2020-08-27 | — | $1.6k MRR; $12.3k sales; 284 subscribers | E20 |
| 2021-06-18 | 164,857 developers | — | E18 |
| 2021-07-13 | 150,000 registered members | "just over $17K" last month; break-even | E21 |
| 2023-04-30 | 500,000 users | ~$30k MRR | E22 |
| 2025-06-03 | 1,027,926 people | — | E19 |
| 2026-10-17 | 1,202,288 people | — | E16 |

*Derived:* users grew about 45%/yr from 2021-06 to 2026-10, but only about 12%/yr from 2025-06 to 2026-10. MRR grew 18.75× from 2020-08 to 2023-04.

**roadmap.sh: free audience** [E49][E51][E52][E53][E54][E55]

| Date | Registered users (monthly add) | Discord (monthly add) | GitHub stars |
|---|---|---|---|
| 2023-05-31 | — | — | 241K |
| 2024-06-01 | 850k (+55k) | 21K (+1.5k) | 278K |
| 2025-06-01 | 2.1M (+90k) | 37K (+2k) | "224K" displayed (see Unverified) |
| 2025-07-23 | "2.1M+ Active Developers" | — | — |
| 2026-10-17 | 3.2M (+90k) | 52K (+2k) | 370K displayed; 369,691 via API |

*Derived:* registered users grew 2.47× in the year to 2025-06, then 36%/yr to 2026-10. The Pro price held at $10/month across 2025-07 and 2026-10 [E48][E55].

**GreatFrontEnd: users and price** [E1][E4][E5]

| Date | Users claim | Lifetime | Monthly | Quarterly | Annual |
|---|---|---|---|---|---|
| 2024-04-25 | — | $154 | $35 | $70 | $120 |
| 2025-05-22 | 700k+ engineers | — | — | — | — |
| 2026-10-17 | 2M+ engineers | $180 | $39 | $85 | $120 |

*Derived:* the users claim grew 2.86× in about 17 months. Lifetime rose 17%, monthly 11%, quarterly 21%; annual was held at $120.

**Master.dev (Frontend Masters): catalog and price** [E7][E10][E11][E12]

| Date | Courses | Individual | Teams |
|---|---|---|---|
| 2022-06-02 | — | $39 / $390 | $195/mo or $1,950/yr for 10 people |
| 2024-05-31 / 06-01 | "over 200" | $39 / $390 | $24.50/seat/mo; $245/seat/yr |
| 2025-06-02 | 200+ | — | — |
| 2026-10-17 | 300+; "500k+ developers" | $39 / $390 | $24.50 / $245 |

**Josh W. Comeau: audience to revenue, and the 2026 turn** [E43][E44][E45][E47]

| Date | Signal |
|---|---|
| 2020-01 | ~10k Twitter followers, ~1k email subscribers |
| 2021-03-17 | 31k Twitter, ~28k email; presale "over half a million dollars" in one week at $129; goal was 380 copies / ~$50k |
| 2026-10-17 | 21,837 CSS buyers; 15,279 React buyers |
| 2026-05-03 | Third course selling "roughly ⅓" of a typical launch; other creators report "Revenue down 50%+" |

**Scrimba** [E25][E26]: >1M unique users and >10k paying customers; 2022 revenue NOK 18.7M at an operating loss of NOK 0.3M; 13 employees (article dated 2023-10-09). The YC profile shows 120K monthly active students (undated).

**Frontend Mentor price** [E15][E17]: $12/mo and $96/yr on 2023-06-02; $15/mo and $120/yr on 2026-10-17 (+25% on both).

**What the curves say.** Free audiences still compound: roadmap.sh, GreatFrontEnd, Frontend Mentor. Paid course revenue is falling in 2026 [E47]. Subscription prices are drifting up, with annual plans held flat at about $120 [E1][E15]. The free audience comes before revenue in every case: Frontend Mentor had 7,000 users and a 7k+ newsletter before PRO [E20], and Josh had ~28k email subscribers before his $500k week [E43].

---

## Payments

### What the competition uses

| Competitor | Processor / billing | PayPal for buyers? | Notes | Ev. |
|---|---|---|---|---|
| GreatFrontEnd | Stripe (billing portal, Stripe product IDs) | — (affiliates are paid by PayPal) | Card declines common in India and Indonesia | E1 |
| Master.dev | Stripe (cards), PayPal, Apple App Store | Yes | Enterprise: invoice, PO, bank transfer | E7 E8 |
| BigFrontEnd.dev | Stripe (credit cards) | — | No refunds | E14 |
| Frontend Mentor | Chargebee; Visa, MC, Amex, Maestro, PayPal, Google Pay | Yes | Tolt affiliates; Chargebee rate-limited the launch | E15 E20 |
| Scrimba | Stripe (DOM classes `StripeCoupon`, `stripeprice`) | — | Inferred, see Unverified | E24 |
| Kent C. Dodds | Stripe | **No**: "No, the only available options for purchase are those currently on the site." | Team seats are coupon codes | E39–E41 |
| Josh W. Comeau | Paddle (Merchant of Record) | Yes (logo shown) | Prices exclude sales tax; refund includes tax | E44 E46 |
| patterns.dev | Leanpub, Apple Books, Google Play | — | Pay what you want | E56 E57 |

**Fee math for our candidate prices** (*derived* from E74, E75, E76; domestic / international):

| Gross | PayPal 3.49% + $0.49 | PayPal intl (+1.5%) | Stripe 2.9% + $0.30 | Paddle 5% + $0.50 (MoR, tax included) |
|---|---|---|---|---|
| $6 | $0.70 (11.7%) | $0.79 (13.2%) | $0.47 (7.9%) | $0.80 (13.3%) |
| $10 | $0.84 (8.4%) | $0.99 (9.9%) | $0.59 (5.9%) | $1.00 (10.0%) |
| $15 | $1.01 (6.8%) | $1.24 (8.3%) | $0.73 (4.9%) | $1.25 (8.3%) |
| $120 | $4.68 (3.9%) | $6.48 (5.4%) | $3.78 (3.1%) | $6.50 (5.4%) |
| $180 | $6.77 (3.8%) | $9.47 (5.3%) | $5.52 (3.1%) | $9.50 (5.3%) |

Two things follow. First, PayPal's $0.49 fixed fee punishes micro-prices, so the annual and lifetime tiers carry the economics. Second, a PPP discount on a $10 monthly plan pushes fees past 10%. Josh and Epic both limit regional pricing to the full package [E40][E45]. PayPal also covers the GreatFrontEnd failure mode: "some card providers block overseas transactions" in India and Indonesia [E1].

### The PayPal integration standard for a static site

**1. Two SDK generations, both documented.**
- **v5:** `<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID">`. Load it from that URL; do not bundle or self-host it. `client-id=sb` works as a sandbox shortcut. `buyer-country` is sandbox-only: "Don't pass this query parameter in production." [E63] PayPal's own page says v5 "remains supported", with v6 recommended for new integrations [E60].
- **v6:** a core script with no configuration in the URL. Live is `https://www.paypal.com/web-sdk/v6/core`; sandbox is `https://www.sandbox.paypal.com/web-sdk/v6/core`. You authenticate in `createInstance` [E61][E62].

**2. What is public.** The client ID: "This static client ID value is safe to include in your front-end code." [E61] The optional v6 client token is "browser-safe". It is minted on the server from `/v1/oauth2/token` with `response_type=client_token` [E61].

**3. What must stay server-side.** "Never expose PayPal client secrets in frontend code" [E61], and "Keep this secret safe and don't share it." [E60][E69] The server-only list:
- the client secret;
- the OAuth access token (`POST /v1/oauth2/token`, `grant_type=client_credentials`) [E69];
- order creation, including the amount;
- capture;
- webhook verification and the `webhook_id`;
- any write that grants access.

PayPal's integration page says: "Set up your server to call the Orders v2 API instead of making calls directly from the browser or the client-side." [E66] The direct-merchant guide puts it as "Your app calls server endpoints to create the order and capture payment." Its server reads `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` from environment variables [E59]. The old browser calls `actions.payment.create()` and `actions.payment.execute()` are to be migrated to server-side `/v2/checkout/orders` and `/v2/checkout/orders/:id/capture` [E68].

**4. Client-side order creation vs server-side Orders v2.**
- **Client-side:** the browser builds the order, so the browser chooses the price. No fetched page documents a browser-only order-creation method as current (see Unverified), and the guidance above rules it out for us.
- **Server-side (the standard):** `createOrder` calls our endpoint, which calls `POST /v2/checkout/orders` with `intent: "CAPTURE"` and returns the order ID. `onApprove` calls our endpoint, which calls `POST /v2/checkout/orders/{id}/capture`. v6 says the same: onApprove "is where you should capture or authorize the payment on your server." [E64][E65][E67]
- **One trap in PayPal's sample:** the platform variant of the sample puts an `"Authorization": "Bearer ACCESS-TOKEN"` header in browser `fetch` calls to `/api/orders` [E60]. That is a platform-partner pattern. We authenticate the browser to our own endpoint with the Supabase user session, never with a PayPal token.

**5. Orders v2 fields we rely on** [E67]:
- **Statuses:** `CREATED`, `SAVED`, `APPROVED`, `VOIDED`, `COMPLETED`, `PAYER_ACTION_REQUIRED`.
- **Intent:** `CAPTURE` or `AUTHORIZE`.
- **`custom_id`:** "Used to reconcile client transactions with PayPal transactions ... not visible to the payer". This holds the Supabase user ID.
- **`invoice_id`:** shown to the payer, and unique per merchant by default. This is the receipt number.
- **`PayPal-Request-Id`:** "A unique ID identifying the request header for idempotency purposes." Use it on create and capture.
- **Sandbox base URL:** `https://api-m.sandbox.paypal.com`.

**6. Sandbox accounts** [E70][E59]:
- Registering as a developer creates one sandbox **business** account (the merchant, with API credentials) and one **personal** account (the buyer). Their addresses look like `sb-…@business.example.com` and `sb-…@personal.example.com`.
- You can create more under Dashboard > Sandbox > Accounts, choosing type and country.
- Testing: buy with a personal sandbox account at https://www.sandbox.paypal.com, then confirm under Recent Activity that the business account received the money minus fees. Card tests use the card generator.

**7. Webhooks** [E71][E72][E73]:
- **Subscribe:** up to 10 listener URLs per app.
- **Retries:** any non-2xx response is retried "up to 25 times over the course of 3 days".
- **Verify every message:** "If you do not verify a message, you will not have a way to validate that its sender was in fact PayPal." Either POST to `/v1/notifications/verify-webhook-signature` with `transmission_id`, `transmission_time`, `cert_url`, `auth_algo`, `transmission_sig`, `webhook_id` and the unmodified `webhook_event`, or self-verify: CRC32 of the raw body, then check the `paypal-transmission-sig` signature with the cert at `paypal-cert-url`.
- **Simulator caveat:** simulator events carry `WEBHOOK_ID` and cannot be verified by postback.
- **Events we need:**
  - `PAYMENT.CAPTURE.COMPLETED` (grant / reconcile)
  - `PAYMENT.CAPTURE.PENDING`, `PAYMENT.CAPTURE.DENIED`
  - `PAYMENT.CAPTURE.REFUNDED`, `PAYMENT.CAPTURE.REVERSED` (revoke)
  - `CUSTOMER.DISPUTE.CREATED` (flag)
  - later, for recurring billing: `BILLING.SUBSCRIPTION.ACTIVATED`, `BILLING.SUBSCRIPTION.CANCELLED`, `PAYMENT.SALE.COMPLETED`

**8. Where the server lives for us.** GitHub Pages cannot hold a secret, so the CFO office runs as Supabase Edge Functions:
- Set production secrets with `supabase secrets set`.
- Read them with `Deno.env.get(...)`.
- Keep local secrets in `supabase/functions/.env`, never committed: "A `.env` file committed to Git exposes every secret in it".
- Supabase's own secret keys "bypass Row Level Security, so use them in Edge Functions never in a browser." [E77]

roadmap.sh shows a GitHub Pages site can still sell Pro [E50][E48].

**Reference flow for elegantfrontend.training (sandbox):**
1. `docs/checkout/` loads the sandbox SDK with the public client ID.
2. `createOrder` POSTs `{sku}` with the Supabase session to `supabase/functions/paypal-orders`. The function looks up the price **server-side** and creates the order with `custom_id = user.id`, a unique `invoice_id`, and a `PayPal-Request-Id`.
3. `onApprove` POSTs the order ID to the same function, which captures. It asserts `status == COMPLETED`, an exact amount and currency match for the SKU, and `custom_id == caller`. Only then does it write the entitlement and a ledger row.
4. `supabase/functions/paypal-webhook` verifies each event and reconciles completions, refunds, reversals and disputes idempotently.

Start with one-time Orders v2 SKUs (an annual pass and a lifetime). The v5 SDK lists `intent=subscription` with `vault=true` [E63] for later recurring billing.

---

## The bar for our product

Every target below can be measured on the repository by a small script. Paths are relative to the repo root `elegant/`. `finance/pricing.md` carries YAML front matter (`tiers`, `discounts`, `ppp`, `refund_days`), and `docs/_data/pricing.yml` is generated from it. Each item names the competitors that set the standard.

1. **A four-tier ladder.**
   - Target: `finance/pricing.md` front matter has exactly the individual tier IDs `free`, `monthly`, `annual`, `lifetime`. `team` is optional. Each tier has `price_usd`, `billing`, `licence`.
   - Set by: GreatFrontEnd (Monthly/Quarterly/Annual/Lifetime) [E1]; roadmap.sh (Free/Pro/Team) [E48]; Frontend Mentor (Free/Monthly/Yearly/Teams) [E15].
   - Verify: `python3 -c "import yaml,sys;f=open('finance/pricing.md').read().split('---')[1];d=yaml.safe_load(f);ids={t['id'] for t in d['tiers'] if t['id']!='team'};sys.exit(ids!={'free','monthly','annual','lifetime'})"`

2. **Prices inside the market band.**
   - Target: monthly ≤ $15; annual ≤ $120; lifetime ≤ 1.5× annual; free = $0.
   - Set by: Frontend Mentor $15/$120 [E15]; roadmap.sh $10/$100 [E48]; BFE $6/$48 [E13]; GreatFrontEnd annual $120 and lifetime $180 = 1.5× [E1]. Josh's 2026 sales collapse shows the cost of pricing high into an anxious market [E47].
   - Verify: the same parser asserts the four inequalities.

3. **The annual plan is at least "2 months free".**
   - Target: annual ≤ 10 × monthly.
   - Set by: Master.dev 10× [E7]; roadmap.sh 10× [E48]; Frontend Mentor and BFE 8× [E15][E13].
   - Verify: `annual.price_usd <= 10 * monthly.price_usd`.

4. **No SKU below the fee floor.**
   - Target: every payable price is ≥ $10, after every discount combination (PPP band × between-jobs × coupon). Under PayPal's international rate, fee/gross must be ≤ 10%: `(0.0499*p + 0.49)/p <= 0.10`.
   - Set by: PayPal 3.49% + $0.49 plus 1.50% international [E74]. BFE's $6 would lose 11.7% (*derived*).
   - Verify: enumerate the tiers × `discounts` × `ppp` bands and assert each net price satisfies the inequality.

5. **Regional pricing exists, but only where the fees allow it.**
   - Target: `ppp.bands` holds ≥ 1 band with `percent` and ≥ 20 ISO-3166 country codes. `ppp.applies_to` ⊆ {`annual`, `lifetime`}. `ppp.region_locked: true`.
   - Set by: GreatFrontEnd auto PPP [E1]; Scrimba auto PPP [E24]; Frontend Mentor regional [E15]; Master.dev location-based [E8]; Josh regional licence (top tier only) [E45]; Epic country-locked PPP [E40].
   - Verify: a YAML check on counts and the subset; it reuses bar #4 for the floor.

6. **A between-jobs discount that no competitor offers.**
   - Target: `discounts.between_jobs.percent >= 40`, and `applies_to` includes `annual`.
   - Set by: the level comes from GreatFrontEnd's 40% student discount [E2]. Josh's 20% student discount stacks with regional pricing [E46]. Master.dev gives 6 free months to GitHub-Pack students [E8]. The gap: GreatFrontEnd, Master.dev, Frontend Mentor, Scrimba, Epic and Josh show none [E2][E8][E15][E29][E40][E46]. Our audience is defined by job loss [E47].
   - Verify: a YAML check.

7. **Free and gated are both spelled out.**
   - Target: `tiers[free].includes` has ≥ 3 items. Every paid tier has `gates` with ≥ 3 items. The rendered pricing page shows both lists.
   - Set by: roadmap.sh's exact one-time allowances ("These don't reset") [E48]; Scrimba's Freemium list [E24]; Frontend Mentor ("one AI code review a month") [E15]; BFE's premium list [E13].
   - Verify: YAML counts, plus `grep -c 'data-gate' docs/pricing/index.html` ≥ the number of gated items.

8. **The refund promise is generous, and the refund rate stays low.**
   - Target: `refund_days: 30` on the first purchase, unconditional, stated on `docs/pricing/`. Trailing 90-day refunds/captures in `finance/ledger.jsonl` ≤ 5%.
   - Set by: Josh 30 days including fees and tax [E46]; Epic 30 days [E39][E41]. The floor is 14 days (Frontend Mentor, Scrimba help centre, Flavio) [E15][E27][E32]. The anti-examples are GreatFrontEnd "non-refundable" [E1] and BFE "we don't offer refund" [E13]. Frontend Mentor's launch saw 3.5% refund requests (*derived*, E20).
   - Verify: a YAML check, `grep -q '30-day' docs/pricing/index.*`, and a jq ratio over the ledger.

9. **The checkout page loads the PayPal SDK with a sandbox client ID.**
   - Target: `docs/checkout/index.html` (or `.md`) includes `https://www.sandbox.paypal.com/web-sdk/v6/core`, or `https://www.paypal.com/sdk/js?client-id=` followed by the value of `paypal.client_id` in `docs/_config.yml`. `_config.yml` has `paypal.env: sandbox`. The SDK must not be vendored or bundled.
   - Set by: PayPal setup and v5 configuration [E61][E63]. Master.dev and Frontend Mentor both accept PayPal [E8][E15].
   - Verify: `grep -Eq 'sandbox\.paypal\.com/web-sdk/v6/core|paypal\.com/sdk/js\?client-id=' docs/checkout/index.*`, plus a yq lookup of `paypal.env`, plus `! find docs -name '*paypal*sdk*.js'`.

10. **No PayPal secret anywhere under `docs/`, the built site, or git history.**
    - Target: zero matches.
    - Set by: "Never expose PayPal client secrets in frontend code" [E61]; Supabase ".env committed to Git exposes every secret" [E77].
    - Verify:
      - `grep -rIEn 'client[_-]?secret|PAYPAL_CLIENT_SECRET|oauth2/token|grant_type=client_credentials|Authorization:\s*Basic|sb_secret_|service_role' docs/ docs/_site/ 2>/dev/null` prints nothing. The last two patterns also enforce the repo rule "Never add a service-role key anywhere under `docs/`" (CLAUDE.md) and Supabase's "never in a browser" [E77].
      - `git log -p --all | grep -E 'PAYPAL_CLIENT_SECRET\s*[=:]\s*\S{8,}'` prints nothing.
      - `grep -qx 'supabase/functions/.env' .gitignore` succeeds.

11. **The server owns price, create and capture.**
    - Target: `supabase/functions/paypal-orders/index.ts` contains `/v2/checkout/orders`, `/capture`, `Deno.env.get("PAYPAL_CLIENT_SECRET")`, `PayPal-Request-Id`, `custom_id` and `invoice_id`. No file under `docs/` contains `/v2/checkout/orders`, `purchase_units` or `actions.order.create`.
    - Set by: PayPal Orders integration [E66]; the direct-merchant guide [E59]; the v5 → server migration [E68]; Orders v2 fields [E67].
    - Verify: a grep for each required string in the function, and `! grep -rIE 'v2/checkout/orders|purchase_units|actions\.order\.create' docs/`.

12. **A capture is trusted only after verification.**
    - Target: the capture path asserts `status === "COMPLETED"`, an exact `amount.value` and `currency_code` match against the SKU price from `finance/pricing.md`, and `custom_id === user.id`, before any entitlement insert. A test file covers ≥ 3 tamper cases: wrong amount, wrong currency, another user's order. No browser code writes entitlements.
    - Set by: Orders v2 statuses [E67]; v6 "capture ... on your server" [E65].
    - Verify: `deno test supabase/functions/paypal-orders/` passes with ≥ 3 tests named `tamper*`, and `! grep -rIE "from\(['\"]entitlements['\"]\)\.(insert|upsert|update)" docs/`.

13. **Webhooks are verified and cover the money events.**
    - Target: `supabase/functions/paypal-webhook/index.ts` references `verify-webhook-signature` (or CRC32 self-verify), `paypal-transmission-sig` and `paypal-cert-url`. It handles `PAYMENT.CAPTURE.COMPLETED`, `PAYMENT.CAPTURE.REFUNDED`, `PAYMENT.CAPTURE.REVERSED` and `CUSTOMER.DISPUTE.CREATED`, and de-duplicates on the event `id`.
    - Set by: PayPal webhooks [E71][E72][E73].
    - Verify: a grep for all 7 strings, plus a unit test that replays the same event twice and asserts one ledger row.

14. **Sandbox until a signed go-live gate.**
    - Target: the repo contains no live host `api-m.paypal.com` and no `www.paypal.com/web-sdk/v6/core` until `finance/go-live.md` exists. That file must hold dated sandbox evidence: ≥ 1 PayPal-wallet purchase from a `sb-…@personal.example.com` buyer, ≥ 1 card purchase, and ≥ 1 refund that shows up in the ledger.
    - Set by: PayPal sandbox accounts [E70] and the pre-go-live test steps [E59].
    - Verify: `[ -f finance/go-live.md ] || ! grep -rIE 'api-m\.paypal\.com|www\.paypal\.com/web-sdk' .`, plus a grep for `personal.example.com`, `card` and `refund` in go-live.md.

15. **A ledger and metrics that report unit economics.**
    - Target:
      - `finance/ledger.jsonl` has one row per capture, refund or dispute: `{date, order_id, capture_id, sku, gross, fee, net, currency, country, event}`.
      - `finance/metrics.jsonl` has one row per month: `{date, registered, paying, mrr, gross, refunds, fees}`, with the newest row ≤ 35 days old.
      - Trailing fees/gross ≤ 6%.
      - paying/registered ≥ 1% from month 6.
    - Set by: Frontend Mentor's dated revenue milestones [E20][E21][E22] and "fewer than one percent" conversion [E23]; Scrimba's ≈1% paying share [E25]; PayPal's fee curve (3.9% at $120, 8.4% at $10) [E74].
    - Verify: a jq or Python script over both files.

16. **Price changes are dated and grandfathered.**
    - Target: `finance/pricing-history.md` has one row per change, with an ISO date, old price, new price and `grandfathered: true`. The pricing page promises that existing buyers keep their price.
    - Set by: Scrimba "The price you pay today will stay" [E24]; GreatFrontEnd "lock in this earlybird price" [E1]. Observed increases: GreatFrontEnd lifetime $154 → $180 [E4][E1]; Frontend Mentor $12 → $15 [E17][E15].
    - Verify: a regex on each row for `\d{4}-\d{2}-\d{2}` and `grandfathered: true`, plus `grep -qi 'keep your price' docs/pricing/index.*`.

17. **Receipts that can be reimbursed.**
    - Target: every order sets a unique `invoice_id`, and the ledger holds no duplicate `invoice_id`. The pricing page has a reimbursement line, for example for employer training budgets or reskilling grants.
    - Set by: GreatFrontEnd's reimbursement tip [E1]; Frontend Mentor's employer invoice [E15]; roadmap.sh "Ask your manager" [E48]; Epic's customizable invoice [E40]; Orders v2 `invoice_id` [E67].
    - Verify: `jq -r .invoice_id finance/ledger.jsonl | sort | uniq -d | wc -l` = 0, and `grep -qi 'reimburs' docs/pricing/index.*`.

---

## Channels

How the competitors bring in money and growth, with what each channel produced on fetched pages:

| Channel | Who | Fetched result | Fit for us |
|---|---|---|---|
| **Free content funnel** | roadmap.sh, Flavio, patterns.dev, GreatFrontEnd | 3.2M registered, 369,691 stars [E49][E51]; "The tutorials bring people in..." [E34]; free book on 5 stores [E56] | **High.** The terminology pages are our free tier |
| **Newsletter before launch** | Josh, Frontend Mentor, Flavio, roadmap.sh, patterns.dev | ~28k list → >$500k week [E43]; 7k+ list → $12.3k in 2 weeks [E20]; 150,000+ at 22–28% opens [E33]; 150,000+ [E50]; 12,000+ [E56] | **High.** It is the precondition for any launch |
| **Early access / presale** | Josh | $129 Early Access vs $349 planned; 10× the goal [E43] | High once the list exists |
| **Count-limited early bird** | Frontend Mentor | First 500 split 250 / 250; lifetime early bird for the first 500 [E20][E21] | Medium; it creates urgency without a deadline |
| **Lifetime deal** | GreatFrontEnd | $180, "limited time offering" [E1] | High for job-seekers who fear another recurring bill (bar #1) |
| **Seasonal coupons** | GreatFrontEnd, Scrimba | FALL26 10% [E2]; "Halloween 2026" 35% [E24] | Medium; it must respect the fee floor (bar #4) |
| **Social-task discount** | GreatFrontEnd | 20% off any plan for following socials [E2] | Medium; cheap reach |
| **Review cashback** | GreatFrontEnd | 100% cashback for ≥1,000 words or ≥5 min video [E2] | Medium; it buys independent reviews |
| **Affiliates** | GreatFrontEnd, Frontend Mentor, BFE | 15% of first order, 7-day cookie, PayPal monthly payouts [E1]; Tolt [E15]; BFE earns through `?fpr=bfe` [E13] | **High.** It pays only on conversion, and PayPal payouts match our provider |
| **Sponsorships / ads** | Flavio, roadmap.sh, BFE, Frontend Mentor | 150k visitors/mo placements [E33]; ads form [E49]; ad-free sold as Premium [E13]; first sponsors on 2020-02-01 [E20] | Low until there is audience |
| **Team / employer** | Master.dev, roadmap.sh, Josh, Epic, Frontend Mentor | $24.50/seat [E7]; $10/seat, min 3 [E48]; ≤20% off [E44]; seats as coupons [E40]; invoices [E15] | Low for the unemployed; medium for reskilling programs (bar #17) |
| **Student programs** | Master.dev, Scrimba, GreatFrontEnd, Josh | GitHub Pack 6 months [E8] and 1 month [E29]; 40% [E2]; 20% [E46] | Re-aimed at **between-jobs** (bar #6) |
| **PPP / regional** | GreatFrontEnd, Scrimba, Frontend Mentor, Master.dev, Josh, Epic | Automatic or IP-based; region-locked at Josh and Epic [E1][E24][E15][E8][E45][E40] | **High**, on annual and lifetime only (bar #5) |
| **Cohorts** | Flavio, Kent | 3-week and 10-week cohorts [E31]; 350-student cohort [E40] | Medium; cohort revenue fits a live "harness" workshop |
| **App stores** | Master.dev, patterns.dev | Apple App Store purchases [E8]; Apple/Google Books [E56] | Low (static site) |
| **Product Hunt** | Frontend Mentor | Launched 2020-03-26 [E20] | Low to medium; one-off |

---

## Unverified

These items were seen only in search snippets, inside images, or as conflicting values between fetched pages. None of them is used as a target above.

- **Frontend Masters revenue and headcount.** A search snippet attributed to Prospeo gave an estimated $7,871,060 revenue, 51–100 employees and a $25.2M valuation. Not fetched; a modeled estimate.
- **Scrimba third-party revenue and funding.** Search snippets: GetLatka ~$1.5M for 2023; CB Insights $1.91M for 2022 and $1.01M raised; Seedtable $690K; The Company Check $1.45M for 2021. Not fetched. Only the Schibsted figure (NOK 18.7M, 2022) is verified [E25].
- **Scrimba payment processor.** Inferred from DOM class names (`StripeCoupon`, `stripeprice`) [E24]; not stated in text.
- **Scrimba refund window.** The pricing page says 7 days [E24]; the help centre says 14 days [E27].
- **Scrimba checkout price and PPP.** The $49 list price was seen from this machine's location. Whether a PPP adjustment was already applied is not visible on the page.
- **BFE price.** The premium page shows $6/$48 [E13]; the legal page shows "5 USD / 35 USD" [E14]. The legal page is probably stale.
- **GreatFrontEnd users.** "2M+ engineers" is the headline [E1], but the same page bundle also contains "We've over 500,000 active users over our lifetime" [E1], probably a stale string.
- **roadmap.sh counts.** The 2025-06-01 snapshot displays "224K" stars, below the 2024 value [E54]; probably a hard-coded fallback. The /advertise body text says "over 1 million registered users" while its counter says "+3.2M" [E49].
- **roadmap.sh business facts.** Search snippets (Starter Story, Nov 2024) say "Founders 1", "Profitable Yes" and "700K monthly users". Not fetched. The New Stack logo in the roadmap.sh footer has no fetched explanation [E50].
- **Josh Comeau order count.** The $577k and 4,773-order figures appear only in a Paddle dashboard screenshot on the AMA [E43]. The text says only "over half a million dollars". "Revenue down 50%+" describes the course creators Josh spoke to, not his own books [E47].
- **Kent C. Dodds per-product revenue.** Only the self-reported portfolio total ("tens of millions since 2019") is fetched [E38]. No per-product split.
- **Frontend Mentor $380,000 ARR / 2,500.** From a secondary interview write-up [E23]. It is unclear whether 2,500 counts paying members or sign-ups.
- **Master.dev $966,000.** A sidebar figure labelled as donations to open source and non-profits [E9]; no definition or date.
- **Flavio Copes prices and processor.** Cohort and Bootcamp prices are withheld [E36]. Creem is a sponsor [E31]; that is not evidence it is his payment processor.
- **PPP percentages by country.** None of GreatFrontEnd, Scrimba, Frontend Mentor, Master.dev, Josh or Epic publishes its band table. Every fetch resolved to a US price [E1].
- **Unemployed discounts.** None was found on any fetched pricing page or FAQ. That shows absence on those pages, not proof that no private arrangement exists.
- **PayPal v5 `actions.order.create` (browser-only order creation).** Not mentioned on any fetched PayPal page [E63][E64][E65]. Do not rely on it; bar #11 forbids it.
- **PayPal live REST host.** `api-m.paypal.com` appears on [E69] only inside scope strings. The live base URL is not stated on a fetched page.
- **Epic React free tier, Josh's free email courses, Scrimba learner totals on the homepage.** Not captured on fetched pages.
