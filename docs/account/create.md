---
title: Create your account
layout: default
permalink: /account/create/
identity_scripts: inline   # this page loads the bundle itself, before its own controller
slug: account-create
description: Create a free Elegant account and your progress follows you to any browser.
---
{%- comment -%}
Sign-up only; signing in is /account/. The confirmation email's link goes back to /account/ (`redirect_to`), which
signs the learner in. The controller is the sign-in page's (account-supabase-page.js): it wires the forms a page has.
{%- endcomment -%}

<section class="auth" aria-labelledby="auth-title">
  <h1 class="auth__title" id="auth-title" data-sb-heading>Create your account</h1>
  <p class="auth__switch" data-sb-switch>Already have an account? <a href="{{ '/account/' | relative_url }}">Sign in</a></p>
  <p class="auth__lede" data-sb-subhead hidden></p>

  <div class="auth-card" data-account-supabase hidden>
    <p class="auth-note auth-note--ok" role="status" data-sb-message hidden></p>
    <p class="auth-note auth-note--error" role="alert" data-sb-error hidden></p>
    <div data-sb-signed-out>
      <form class="auth-form" data-sb-view="signup" data-sb-form="signup" data-sb-switchable data-sb-title="Create your account" data-sb-lede="" novalidate>
        <label class="auth-form__label" for="sb-signup-email">Email</label>
        <input class="auth-form__input" id="sb-signup-email" type="email" name="email" autocomplete="email" required>
        <label class="auth-form__label" for="sb-signup-password">Password</label>
        <input class="auth-form__input" id="sb-signup-password" type="password" name="password" autocomplete="new-password" required minlength="8" aria-describedby="sb-signup-hint">
        <p class="auth-form__hint" id="sb-signup-hint">At least 8 characters.</p>
        <button type="submit" class="auth-form__submit">Create account</button>
      </form>

      <div class="auth-sent" data-sb-view="sent" data-sb-title="Check your email" data-sb-lede="" hidden>
        <p>We sent a link to <strong data-sb-sent-to></strong>. Open it to confirm your address, and you're signed in.</p>
        <button type="button" class="auth-form__alt" data-sb-resend hidden>Resend the email</button>
        <p class="auth-form__back"><button type="button" class="account-linkbutton" data-sb-goto="signup">Use a different email</button></p>
      </div>
    </div>

    <div class="account-signedin" data-sb-signed-in data-sb-title="You're signed in" data-sb-lede="" hidden>
      <p class="account-signedin__who">Signed in as <strong data-sb-email></strong></p>
      <p class="account-signedin__actions">
        <a class="auth-form__submit" href="{{ '/dashboard/' | relative_url }}">Open your dashboard</a>
        <a class="auth-form__alt" href="{{ '/account/' | relative_url }}">Your account</a>
      </p>
    </div>
  </div>

  <p class="auth-card auth__absent" data-account-supabase-absent>
    Accounts aren't set up on this copy of the site. Your progress is saved in this browser.
  </p>

</section>

{% include identity-scripts.html %}
<script type="text/javascript" src="{{ '/assets/js/account-supabase-page.js' | relative_url }}"></script>
