var textArray = [
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
}, 100);



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
    nodes[0].classList.add("hide");
    nodes[1].classList.add("selected");
  }
  loop(nodes, (node, i) => onTabSelect(nodes, node, i));
})

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

const updateBoilerplate = (e) => {
  console.log('=== e', e.value);
  codeBox.innerHTML = `nxp elegant ${e.value}`;
  demoLink.href = `./demos/${e.value}`;
  storybookLink.href = `./demos/storybooks/${e.value}`;
};

buildselectBoilerplate();
