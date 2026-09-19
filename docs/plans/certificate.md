---
title: Certificate
layout: default
slug: certificate
description: Print a completion certificate for any finished Frontend AI Harness study plan.
---

<h1>Certificate of completion</h1>

<p class="certificate-lede">
Progress lives in this browser only — there is no account and nothing is sent
anywhere. Pick a plan you have finished and print the card below, or export the
raw JSON if you would rather keep the record yourself.
</p>

<form class="certificate-form" onsubmit="return false;">
  <label class="certificate-form__field">
    <span>Your name</span>
    <input type="text" id="cert-name" placeholder="Ada Lovelace" autocomplete="name">
  </label>
  <label class="certificate-form__field">
    <span>Plan</span>
    <select id="cert-plan">
      {%- for plan in site.data.plans -%}
      <option value="{{ plan.slug }}"
              data-slugs="{{ plan.items | map: 'ref' | join: ' ' }}">{{ plan.title }}</option>
      {%- endfor -%}
    </select>
  </label>
  <button type="button" id="cert-print">Print</button>
  <button type="button" id="cert-export">Export progress JSON</button>
</form>

<section class="certificate" id="certificate" hidden>
  <p class="certificate__kicker">Frontend AI Harness</p>
  <h2 class="certificate__name" id="cert-out-name"></h2>
  <p class="certificate__body">completed <strong id="cert-out-plan"></strong></p>
  <p class="certificate__score" id="cert-out-score"></p>
  <p class="certificate__date" id="cert-out-date"></p>
</section>

<p class="certificate__note" id="cert-note" hidden></p>

<script type="text/javascript" src="{{ '/assets/js/account.js' | relative_url }}"></script>
<script type="text/javascript" src="{{ '/assets/js/progress.js' | relative_url }}"></script>
<script type="text/javascript" src="{{ '/assets/js/certificate.js' | relative_url }}"></script>
