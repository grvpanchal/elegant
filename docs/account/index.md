---
title: Account
layout: default
slug: account
description: Name a profile so your progress is yours, move it between devices, or export it as JSON.
---

<h1>Account</h1>

<p class="account-lede">
This site is static — it is served as files, with no server behind it and no
database to keep an account in. So a profile here lives <strong>in this
browser</strong>. It is not authentication: there is no password, nothing is
verified, and anyone using this browser can switch to any profile on it.
</p>

<p class="account-lede">
What it does buy you is real. Two people sharing a laptop stop overwriting each
other's progress, and an export moves everything you have done to another
device.
</p>

<div class="account-panel" data-account-widget data-signed-in="false">
  <div data-account-signed-out>
    <h2>Sign in</h2>
    <form class="account-form" data-account-signin-form>
      <label class="account-form__field">
        <span>Profile name</span>
        <input type="text" data-account-signin-name placeholder="Ada" autocomplete="nickname" required>
      </label>
      <button type="submit">Continue</button>
      <p class="account-form__error" role="alert" data-account-error hidden></p>
    </form>
    <p class="account-form__hint">
      A name you have used before reopens that profile. A new one starts empty.
    </p>
  </div>

  <div data-account-signed-in hidden>
    <h2>Signed in as <span data-account-name></span></h2>
    <p>Everything you mark done is recorded against this profile.</p>
    <button type="button" data-account-signout>Sign out</button>
  </div>
</div>

<h2>Move this profile to another device</h2>

<p>
Export writes a JSON file holding the profile and its progress. Import it in
the other browser and you carry on where you stopped. This is the honest
version of "your account follows you" on a site with nowhere to sync to.
</p>

<div class="account-transfer">
  <button type="button" id="account-export">Export profile JSON</button>
  <label class="account-transfer__import">
    <span>Import a profile</span>
    <input type="file" id="account-import" accept="application/json,.json">
  </label>
  <p class="account-transfer__status" role="status" id="account-status"></p>
</div>

<h2>Profiles on this device</h2>

<ul class="account-list" id="account-list"></ul>

{% include progress-tracker.html all=true title="This profile" reset=true %}

<script type="text/javascript" src="{{ '/assets/js/account.js' | relative_url }}"></script>
<script type="text/javascript" src="{{ '/assets/js/progress.js' | relative_url }}"></script>
<script type="text/javascript" src="{{ '/assets/js/account-page.js' | relative_url }}"></script>
