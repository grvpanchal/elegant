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

<h2>Sign in with an account</h2>

<p class="account-lede">
If this deployment is configured with an identity provider, you can sign in with
a real credential instead. That <em>is</em> verified: the password is checked by
the provider, never by this page, and the session it returns is accepted only
after its signature is checked against the provider's published keys. A token
this site merely decoded would prove nothing — the payload of a sign-in token is
readable by anyone, so reading a name out of it is not the same as knowing it.
</p>

<p class="account-lede">
The key this page ships is a <strong>publishable</strong> key. It is meant to be
public and is safe to read, because the database enforces row-level security:
the key alone cannot reach anybody's rows, only a verified sign-in can. If you
are forking this site, that is the setting to check first.
</p>

<div class="account-panel" data-account-supabase hidden>
  <form class="account-form" data-account-supabase-form>
    <label class="account-form__field">
      <span>Email</span>
      <input type="email" data-account-supabase-email autocomplete="email" required>
    </label>
    <label class="account-form__field">
      <span>Password</span>
      <input type="password" data-account-supabase-password autocomplete="current-password" required minlength="8">
    </label>
    <button type="submit" data-account-supabase-signin>Sign in</button>
    <button type="button" data-account-supabase-signup>Create an account</button>
    <p class="account-form__error" role="alert" data-account-supabase-error hidden></p>
  </form>
</div>

<p class="account-lede" data-account-supabase-absent>
This deployment has no identity provider configured, so only device profiles are
available here.
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

{% include identity-scripts.html %}
<script type="text/javascript" src="{{ '/assets/js/account-page.js' | relative_url }}"></script>
<script type="text/javascript" src="{{ '/assets/js/account-supabase-page.js' | relative_url }}"></script>
