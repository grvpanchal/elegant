---
title: Account
layout: default
identity_scripts: inline   # this page loads the bundle itself, before its own controllers
slug: account
description: Sign in with an email account so your progress follows you, or keep a device profile in this browser and move it with a JSON export.
---

<h1>Account</h1>

<p class="account-status" data-account-status role="status">
  Checking who is signed in…
</p>

<h2 id="your-account">Your account</h2>

<p class="account-lede">
Sign in with an email account and your progress follows you: everything you
mark done is saved to your account and appears in the next browser you sign in
on. That <em>is</em> verified: the password is checked by the provider, never
by this page, and the session it returns is accepted only after its signature
is checked against the provider's published keys. A token this site merely
decoded would prove nothing — the payload of a sign-in token is readable by
anyone, so reading a name out of it is not the same as knowing it.
</p>

<p class="account-lede">
The key this page ships is a <strong>publishable</strong> key. It is meant to be
public and is safe to read, because the database enforces row-level security:
the key alone cannot reach anybody's rows, only a verified sign-in can. If you
are forking this site, that is the setting to check first.
</p>

<div class="account-panel" data-account-supabase hidden>
  <div data-sb-signed-out>
    <div class="account-tabs" role="tablist" aria-label="How to sign in">
      <button type="button" role="tab" id="sb-tab-signin" aria-controls="sb-panel-signin" aria-selected="true" data-sb-tab="signin">Sign in</button>
      <button type="button" role="tab" id="sb-tab-signup" aria-controls="sb-panel-signup" aria-selected="false" tabindex="-1" data-sb-tab="signup">Create account</button>
      <button type="button" role="tab" id="sb-tab-magic" aria-controls="sb-panel-magic" aria-selected="false" tabindex="-1" data-sb-tab="magic">Email me a link</button>
      <button type="button" role="tab" id="sb-tab-reset" aria-controls="sb-panel-reset" aria-selected="false" tabindex="-1" data-sb-tab="reset">Reset password</button>
    </div>

    <form class="account-form" role="tabpanel" id="sb-panel-signin" aria-labelledby="sb-tab-signin" data-sb-form="signin" novalidate>
      <label class="account-form__field">
        <span>Email</span>
        <input type="email" name="email" autocomplete="email" required>
      </label>
      <label class="account-form__field">
        <span>Password</span>
        <input type="password" name="password" autocomplete="current-password" required>
      </label>
      <button type="submit">Sign in</button>
      <p class="account-form__hint">
        <button type="button" class="account-linkbutton" data-sb-goto="reset">Forgot your password?</button>
        · <button type="button" class="account-linkbutton" data-sb-goto="magic">Sign in without a password</button>
      </p>
    </form>

    <form class="account-form" role="tabpanel" id="sb-panel-signup" aria-labelledby="sb-tab-signup" data-sb-form="signup" novalidate hidden>
      <label class="account-form__field">
        <span>Email</span>
        <input type="email" name="email" autocomplete="email" required>
      </label>
      <label class="account-form__field">
        <span>Password</span>
        <input type="password" name="password" autocomplete="new-password" required minlength="8" aria-describedby="sb-signup-hint">
      </label>
      <button type="submit">Create account</button>
      <p class="account-form__hint" id="sb-signup-hint">
        At least 8 characters. We email a link to confirm the address; you are
        signed in once you follow it.
      </p>
    </form>

    <form class="account-form" role="tabpanel" id="sb-panel-magic" aria-labelledby="sb-tab-magic" data-sb-form="magic" novalidate hidden>
      <label class="account-form__field">
        <span>Email</span>
        <input type="email" name="email" autocomplete="email" required aria-describedby="sb-magic-hint">
      </label>
      <button type="submit">Email me a sign-in link</button>
      <p class="account-form__hint" id="sb-magic-hint">
        A one-time link that signs you in on the browser you open it in. A new
        address gets an account when the link is followed.
      </p>
    </form>

    <form class="account-form" role="tabpanel" id="sb-panel-reset" aria-labelledby="sb-tab-reset" data-sb-form="reset" novalidate hidden>
      <label class="account-form__field">
        <span>Email</span>
        <input type="email" name="email" autocomplete="email" required aria-describedby="sb-reset-hint">
      </label>
      <button type="submit">Email me a reset link</button>
      <p class="account-form__hint" id="sb-reset-hint">
        The link brings you back to this page to choose a new password.
      </p>
    </form>

    <p class="account-form__notice" role="status" data-sb-message hidden></p>
    <p class="account-form__error" role="alert" data-sb-error hidden></p>
    <button type="button" class="account-secondary" data-sb-resend hidden>Resend the confirmation email</button>
  </div>

  <form class="account-form" data-sb-recovery novalidate hidden>
    <h3 class="account-form__title">Choose a new password</h3>
    <label class="account-form__field">
      <span>New password</span>
      <input type="password" name="password" autocomplete="new-password" required minlength="8">
    </label>
    <label class="account-form__field">
      <span>Repeat it</span>
      <input type="password" name="confirm" autocomplete="new-password" required minlength="8">
    </label>
    <button type="submit">Save new password</button>
    <p class="account-form__error" role="alert" data-sb-recovery-error hidden></p>
  </form>

  <div class="account-signedin" data-sb-signed-in hidden>
    <h3 class="account-signedin__who">Signed in as <span data-sb-email></span></h3>
    <p class="account-signedin__sync" data-sync-text>Checking your account's progress…</p>
    <button type="button" class="account-secondary" data-sync-retry hidden>Try syncing again</button>
    <div class="account-signedin__import" data-sb-guest-import hidden>
      <p data-sb-guest-import-text></p>
      <button type="button" class="account-secondary" data-sb-guest-import-go>Add it to my account</button>
    </div>
    <details class="account-signedin__password">
      <summary>Change password</summary>
      <form class="account-form" data-sb-password novalidate>
        <label class="account-form__field">
          <span>New password</span>
          <input type="password" name="password" autocomplete="new-password" required minlength="8">
        </label>
        <button type="submit">Change password</button>
        <p class="account-form__notice" role="status" data-sb-password-message hidden></p>
        <p class="account-form__error" role="alert" data-sb-password-error hidden></p>
      </form>
    </details>
    <p class="account-signedin__actions">
      <a class="account-secondary" href="{{ '/dashboard/' | relative_url }}">Open your dashboard</a>
      <button type="button" class="account-secondary" data-sb-signout>Sign out</button>
    </p>
  </div>
</div>

<div class="account-panel" data-account-oidc hidden>
  <p class="account-lede">
    Sign in with an OpenID Connect issuer. This is a real Authorization Code +
    PKCE flow: the page redirects to the issuer, exchanges the code it gets back,
    and verifies the returned ID token's signature before it means anything.
  </p>
  <button type="button" class="account-oidc__signin" data-account-oidc-signin hidden>
    Sign in with your account
  </button>
  <p class="account-form__error" role="alert" data-account-oidc-error hidden></p>
</div>

<p class="account-lede" data-account-supabase-absent>
This deployment has no identity provider configured, so only device profiles are
available here.
</p>

<h2 id="device-profiles">Device profiles</h2>

<p class="account-lede">
A device profile is the other way to be someone here, and it is a smaller
promise. It lives <strong>in this browser</strong>, not on a server. It is not
authentication: there is no password, nothing is verified, and anyone using this
browser can switch to any profile on it.
</p>

<p class="account-lede">
What it does buy you is real. Two people sharing a laptop stop overwriting each
other's progress, and an export moves everything you have done to another
device.
</p>

<p class="account-lede" data-device-paused hidden>
You are signed in with an account, so everything you mark done is recorded
against it. Sign out of the account to use a device profile.
</p>

<div class="account-panel" data-account-widget data-device-panel data-signed-in="false">
  <div data-account-signed-out>
    <h3>Use a device profile</h3>
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
    <h3>Using the device profile <span data-account-name></span></h3>
    <p>Everything you mark done is recorded against this profile, in this browser only.</p>
    <button type="button" data-account-signout>Sign out</button>
  </div>
</div>

<h2>Move this profile to another device</h2>

<p>
Export writes a JSON file holding the profile and its progress. Import it in
the other browser and you carry on where you stopped. With an email account you
do not need this — signing in is enough — but it still works as a backup.
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

{% include progress-tracker.html all=true title="Question bank, for whoever is signed in" reset=true %}

{% include identity-scripts.html %}
<script type="text/javascript" src="{{ '/assets/js/account-page.js' | relative_url }}"></script>
<script type="text/javascript" src="{{ '/assets/js/account-supabase-page.js' | relative_url }}"></script>
