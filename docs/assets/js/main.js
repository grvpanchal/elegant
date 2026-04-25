console.log('=== main.js', window.location.pathname);

function updateBoilerplate(e) {
  console.log('=== e', e.value);
  const boilerPlate = e.value;
  const [uiString, serverString, stateString] = boilerPlate.split('-');
  uiImg.src = `/assets/img/brands/ui/${uiString}.png`;
  serverImg.src = `/assets/img/brands/server/${serverString}.png`;
  stateImg.src = `/assets/img/brands/state/${stateString}.png`;
  codeBox.innerHTML = `npx elegant ${e.value}`;
  demoLink.href = `./demos/${e.value}`;
  storybookLink.href = `./demos/storybooks/${e.value}`;
}

if (window.location.pathname === '/') {
  var textArray = [
    "Context Engineered",
    "SDLC Harnessed",
    "UI UX Oriented",
    "Framework Agnostic",
    "Atomic Design Ready",
    "Modular",
    "Scalable",
    "Fully Test Covered",
    "Development Savvy",
    "Storybook Enabled",
    "Performance Oriented",
    "PWA Ready",
    "Microfrontend Ready",
  ];
  var text = textArray[0];

  var chars = text.split("");
  var container = document.getElementById("container");

  var i = 0;
  var x = 1;

  setInterval(function () {
    if (container) {
      if (i < chars.length) {
        container.innerHTML += chars[i++];
      } else if (i < chars.length + 10) {
        i++;
      } else if (i < chars.length + 20) {
        container.classList.add("type-clear");
        i++;
      } else if (i < chars.length + 25) {
        container.innerHTML = "&nbsp;";
        i++;
      } else {
        container.innerHTML = "&nbsp;";
        if (x >= textArray.length) {
          x = 0;
        }
        text = textArray[x++];
        chars = text.split("");
        container.classList.remove("type-clear");
        i = 0;
      }
    }
  }, 100);

  // Demo Selection component
  var demos = [
    'chota-react-saga',
    'chota-angular-ngrx',
    'chota-react-redux',
    'chota-react-rtk',
    'chota-vue-pinia',
    'chota-wc-saga',
  ];

  const buildOption = (label, value) => `<option value="${value}">${label}</option>`;
  const buildOptions = (options) => options.map(option => buildOption(option, option)).toString();
  const buildselectBoilerplate = () => {
    const optionHtml = buildOptions(demos);
    selectBoilerplate.innerHTML = optionHtml;
  };

  buildselectBoilerplate();
}

const loop = (nodes, callback) => {
  for (let i = 0; i < nodes.length; ++i) {
    callback(nodes[i], i);
  }
};

const onTabSelect = (parentNode, node, i) => {
  node.addEventListener("click", (e) => {
    e.target.classList.add("selected");
    loop(parentNode, (node, j) => i !== j ? node.classList.remove('selected') : null);
  });
};

tabsNodes = document.querySelectorAll(".code-tabs");

loop(tabsNodes, (tabsNode) => {
  nodes = tabsNode.querySelectorAll("p");
  if (nodes.length) {
    nodes[0].classList.add("selected");
  }
  loop(nodes, (node, i) => onTabSelect(nodes, node, i));
});

// Scroll behaviour: non-home pages only — hide title, enlarge logo on scroll
if (window.location.pathname !== '/') {
  const siteNav = document.querySelector('.site-nav');
  let ticking = false;

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 10) {
          siteNav.classList.add('scrolled');
        } else {
          siteNav.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

// Add copy buttons to code blocks
document.querySelectorAll('.highlight > .highlight').forEach((block) => {
  // Skip if already has a copy button
  if (block.querySelector('.copy-btn')) return;
  
  const copyBtn = document.createElement('button');
  copyBtn.className = 'copy-btn';
  copyBtn.textContent = 'Copy';
  
  copyBtn.addEventListener('click', () => {
    const code = block.querySelector('code');
    const text = code ? code.textContent : block.querySelector('pre').textContent;
    
    navigator.clipboard.writeText(text).then(() => {
      copyBtn.textContent = 'Copied!';
      copyBtn.classList.add('copied');
      
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
        copyBtn.classList.remove('copied');
      }, 2000);
    }).catch((err) => {
      console.error('Failed to copy:', err);
    });
  });
  
  block.appendChild(copyBtn);
});
// MCQ quiz: on submit, mark the chosen option, reveal the correct answer + explanation.
document.querySelectorAll('.quiz-mcq').forEach((form) => {
  const result = form.querySelector('.quiz-mcq__result');
  const verdict = form.querySelector('.quiz-mcq__verdict');
  const submitBtn = form.querySelector('.quiz-mcq__submit');
  const resetBtn = form.querySelector('.quiz-mcq__reset');
  const correct = (form.dataset.correct || '').trim().toUpperCase();

  const clearState = () => {
    form.classList.remove('quiz-mcq--correct', 'quiz-mcq--incorrect');
    form.removeAttribute('data-answered');
    form.querySelectorAll('.quiz-mcq__option').forEach((o) => o.removeAttribute('data-state'));
    if (result) result.hidden = true;
    if (resetBtn) resetBtn.hidden = true;
    if (submitBtn) submitBtn.hidden = false;
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const chosen = form.querySelector('input[type="radio"]:checked');
    if (!chosen) {
      if (verdict) verdict.textContent = 'Please select an answer first.';
      if (result) result.hidden = false;
      return;
    }
    const picked = chosen.value.toUpperCase();
    const isRight = picked === correct;
    form.dataset.answered = 'true';
    form.classList.toggle('quiz-mcq--correct', isRight);
    form.classList.toggle('quiz-mcq--incorrect', !isRight);
    form.querySelectorAll('.quiz-mcq__option').forEach((label) => {
      const input = label.querySelector('input[type="radio"]');
      if (!input) return;
      const value = input.value.toUpperCase();
      if (value === picked) label.dataset.state = 'selected';
      if (!isRight && value === correct) label.dataset.state = 'answer';
    });
    if (verdict) verdict.textContent = isRight ? 'Correct!' : 'Not quite.';
    if (result) result.hidden = false;
    if (resetBtn) resetBtn.hidden = false;
  });

  form.addEventListener('reset', () => {
    // allow the native reset to clear the radio selection first, then wipe state
    setTimeout(clearState, 0);
  });
});
