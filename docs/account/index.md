---
title: Sign in
layout: default
identity_scripts: inline   # this page loads the bundle itself, before its own controllers
slug: account
description: Sign in to Elegant and your progress follows you to any browser. You don't need an account to learn.
---
{%- comment -%}
Sign in, a sign-in link and a password reset share this card; one form shows at a time and the heading follows it
(account-supabase-page.js). Creating an account is its own page, /account/create/. Email links from either page
come back here (`redirect_to`), and this page also shows the signed-in account and the new-password form a reset
link opens.

Forking the site: the key the pages ship is Supabase's publishable key, safe in client code only while row-level
security is on. That is the setting to check first (supabase/README.md).
{%- endcomment -%}

<section class="auth" aria-labelledby="auth-title">
  <h1 class="auth__title" id="auth-title" data-sb-heading>Sign in to your account</h1>
  <p class="auth__switch" data-sb-switch>Don't have an account? <a href="{{ '/account/create/' | relative_url }}">Create one for free</a></p>
  <p class="auth__lede" data-sb-subhead hidden></p>

  <div class="auth-card" data-account-supabase hidden>
    <p class="auth-note auth-note--ok" role="status" data-sb-message hidden></p>
    <p class="auth-note auth-note--error" role="alert" data-sb-error hidden></p>
    <div data-sb-signed-out>
      <form class="auth-form" data-sb-view="signin" data-sb-form="signin" data-sb-switchable data-sb-title="Sign in to your account" data-sb-lede="" novalidate>
        <label class="auth-form__label" for="sb-signin-email">Email</label>
        <input class="auth-form__input" id="sb-signin-email" type="email" name="email" autocomplete="email" required>
        <label class="auth-form__label" for="sb-signin-password">Password</label>
        <input class="auth-form__input" id="sb-signin-password" type="password" name="password" autocomplete="current-password" required>
        <p class="auth-form__forgot"><button type="button" class="account-linkbutton" data-sb-goto="reset">Forgot your password?</button></p>
        <button type="submit" class="auth-form__submit">Sign in</button>
        <p class="auth-form__back"><button type="button" class="account-linkbutton" data-sb-goto="magic">Email me a sign-in link instead</button></p>
      </form>

      <form class="auth-form" data-sb-view="magic" data-sb-form="magic" data-sb-title="Sign in with a link" data-sb-lede="We'll email you a link that signs you in." novalidate hidden>
        <label class="auth-form__label" for="sb-magic-email">Email</label>
        <input class="auth-form__input" id="sb-magic-email" type="email" name="email" autocomplete="email" required>
        <button type="submit" class="auth-form__submit">Email me a link</button>
        <p class="auth-form__back"><button type="button" class="account-linkbutton" data-sb-goto="signin">Sign in with a password instead</button></p>
      </form>

      <form class="auth-form" data-sb-view="reset" data-sb-form="reset" data-sb-title="Reset your password" data-sb-lede="We'll email you a link to choose a new one." novalidate hidden>
        <label class="auth-form__label" for="sb-reset-email">Email</label>
        <input class="auth-form__input" id="sb-reset-email" type="email" name="email" autocomplete="email" required>
        <button type="submit" class="auth-form__submit">Email me a reset link</button>
        <p class="auth-form__back"><button type="button" class="account-linkbutton" data-sb-goto="signin">Back to sign in</button></p>
      </form>

      <button type="button" class="auth-form__alt" data-sb-resend hidden>Resend the confirmation email</button>
    </div>

    <form class="auth-form" data-sb-recovery data-sb-title="Choose a new password" data-sb-lede="" novalidate hidden>
      <label class="auth-form__label" for="sb-recovery-password">New password</label>
      <input class="auth-form__input" id="sb-recovery-password" type="password" name="password" autocomplete="new-password" required minlength="8" aria-describedby="sb-recovery-hint">
      <p class="auth-form__hint" id="sb-recovery-hint">At least 8 characters.</p>
      <label class="auth-form__label" for="sb-recovery-confirm">Repeat it</label>
      <input class="auth-form__input" id="sb-recovery-confirm" type="password" name="confirm" autocomplete="new-password" required minlength="8">
      <button type="submit" class="auth-form__submit">Save new password</button>
      <p class="auth-note auth-note--error" role="alert" data-sb-recovery-error hidden></p>
    </form>

    <div class="account-signedin" data-sb-signed-in data-sb-title="Your account" data-sb-lede="" hidden>
      <p class="account-signedin__who">Signed in as <strong data-sb-email></strong></p>
      <p class="account-signedin__sync" data-sync-text>Checking your account's progress…</p>
      <button type="button" class="account-secondary" data-sync-retry hidden>Try syncing again</button>
      <div class="account-signedin__import" data-sb-guest-import hidden>
        <p data-sb-guest-import-text></p>
        <button type="button" class="account-secondary" data-sb-guest-import-go>Add it to my account</button>
      </div>
      <p class="account-signedin__actions">
        <a class="auth-form__submit" href="{{ '/dashboard/' | relative_url }}">Open your dashboard</a>
        <button type="button" class="auth-form__alt" data-sb-signout>Sign out</button>
      </p>
      <details class="account-signedin__password">
        <summary>Change password</summary>
        <form class="auth-form" data-sb-password novalidate>
          <label class="auth-form__label" for="sb-new-password">New password</label>
          <input class="auth-form__input" id="sb-new-password" type="password" name="password" autocomplete="new-password" required minlength="8">
          <button type="submit" class="auth-form__submit">Change password</button>
          <p class="auth-note auth-note--ok" role="status" data-sb-password-message hidden></p>
          <p class="auth-note auth-note--error" role="alert" data-sb-password-error hidden></p>
        </form>
      </details>
    </div>
  </div>

  <div class="auth-card" data-account-oidc hidden>
    <button type="button" class="auth-form__submit" data-account-oidc-signin hidden>Sign in with your account</button>
    <p class="auth-note auth-note--error" role="alert" data-account-oidc-error hidden></p>
  </div>

  <p class="auth-card auth__absent" data-account-supabase-absent>
    Accounts aren't set up on this copy of the site. You can still use a device profile below.
  </p>

  <details class="auth-more">
    <summary>Device profiles and backups</summary>

    <p>
      You don't need an account to learn: progress is saved in this browser. A device profile keeps it separate for
      each person on a shared computer. It lives in this browser only and isn't an account: there's no password,
      nothing is verified, and anyone using this browser can switch to it.
    </p>

    <p data-device-paused hidden>
      You're signed in, so your progress is saved to your account. Sign out to use a device profile.
    </p>

    <div class="account-panel" data-account-widget data-device-panel data-signed-in="false">
      <div data-account-signed-out>
        <form class="account-form" data-account-signin-form>
          <label class="account-form__field">
            <span>Profile name</span>
            <input type="text" data-account-signin-name placeholder="Ada" autocomplete="nickname" required>
          </label>
          <button type="submit">Use this profile</button>
          <p class="account-form__error" role="alert" data-account-error hidden></p>
        </form>
        <p class="account-form__hint">A name used before reopens its profile. A new name starts empty.</p>
      </div>

      <div data-account-signed-in hidden>
        <p>Using the device profile <strong data-account-name></strong>, in this browser only.</p>
        <button type="button" class="account-secondary" data-account-signout>Stop using it</button>
      </div>
    </div>

    <h2 class="auth-more__title">Profiles on this device</h2>
    <ul class="account-list" id="account-list"></ul>

    <h2 class="auth-more__title">Move your progress to another browser</h2>
    <p>Export the profile you're using, with its progress, and import the file in the other browser.</p>
    <div class="account-transfer">
      <button type="button" id="account-export">Export this profile</button>
      <label class="account-transfer__import">
        <span>Import a file</span>
        <input type="file" id="account-import" accept="application/json,.json">
      </label>
      <p class="account-transfer__status" role="status" id="account-status"></p>
    </div>

    {% include progress-tracker.html all=true title="Question bank progress" reset=true %}
  </details>
</section>

{% include identity-scripts.html %}
<script type="text/javascript" src="{{ '/assets/js/account-page.js' | relative_url }}"></script>
<script type="text/javascript" src="{{ '/assets/js/account-supabase-page.js' | relative_url }}"></script>
