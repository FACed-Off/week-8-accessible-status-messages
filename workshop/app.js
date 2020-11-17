import h from "./create-element.js";
import { getDogs, deleteDog } from "./api.js";

const dogsGridEl = h("div", { className: "grid" });
const dogsStatusEl = h("div", {"aria-live":"polite"})
dogsGridEl.append(dogsStatusEl)

// render the initial UI to the page
const app = document.querySelector("#app");
app.append(dogsGridEl);

getDogs().then((dogs) => {
  const dogEls = dogs.map(Dog);
  dogsGridEl.append(...dogEls);
});

// show loading message
dogsStatusEl.append("Loading dogs...");
getDogs().then((dogs) => {
  // remove loading message
  dogsStatusEl.remove();
  const dogEls = dogs.map(Dog);
  dogsGridEl.append(...dogEls);
});

// takes a dog object as its argument
function Dog({ id, name, image }) {
  const status = h("div", {"aria-live":"assertive"})
  return h(
    "div",
    { className: "dog" },
    h("h3", {}, name, DeleteButton({ id, name }), status),
    h("img", { src: image, alt: "", width: 400, height: 400 })
  );
}

function notify(message){
  notificationEl.classList.add("active")
  notificationEl.textContent = message
  window.setTimeout(() => {
    notificationEl.classList.remove("active")
  }, 5000);
}

function DeleteButton({ id, name }) {
  return h(
    "button",
    {
      "aria-label": `Delete ${name}`,
      onclick: (event) => {
        const button = event.currentTarget;
        deleteDog(id).then(() => button.parentElement.parentElement.remove())
        .catch((error) => {
          console.log(error);
          notify(`Something went wrong deleting ${name}`)
        })
      },
    },
    h("img", { src: "trash.svg", width: 24, height: 24, alt: "" })
  );
}

const notificationEl = h("div", {"aria-live": "assertive", className: "notify"
}, "Some fake error message");

app.append(dogsGridEl, notificationEl)
