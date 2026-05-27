const checkBtn = document.getElementById("checkBtn");
const clearBtn = document.getElementById("clearBtn");
const linksInput = document.getElementById("linksInput");
const result = document.getElementById("result");
const loading = document.getElementById("loading");
const themeToggle = document.getElementById("themeToggle");
const langToggle = document.getElementById("langToggle");

const linksCount = document.getElementById("linksCount");
const successCount = document.getElementById("successCount");
const errorCount = document.getElementById("errorCount");

const errorContainer = document.getElementById("errorContainer");
const errorList = document.getElementById("errorList");

const progressText = document.getElementById("progressText");

const title = document.getElementById("title");
const subtitle = document.getElementById("subtitle");
const linksLabel = document.getElementById("linksLabel");
const successLabel = document.getElementById("successLabel");
const errorLabel = document.getElementById("errorLabel");
const resultLabel = document.getElementById("resultLabel");
const errorTitle = document.getElementById("errorTitle");

let currentLang = "fa";


// Theme
themeToggle.addEventListener("click", () => {

  document.body.classList.toggle("dark");

  if(document.body.classList.contains("dark")){
    themeToggle.innerHTML = "☀️";
    localStorage.setItem("theme","dark");
  }else{
    themeToggle.innerHTML = "🌙";
    localStorage.setItem("theme","light");
  }

});


// Save Theme
window.addEventListener("load", () => {

  const savedTheme = localStorage.getItem("theme");

  if(savedTheme === "dark"){
    document.body.classList.add("dark");
    themeToggle.innerHTML = "☀️";
  }

});


// Language Toggle
langToggle.addEventListener("click", () => {

  if(currentLang === "fa"){

    currentLang = "en";

    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";

    title.innerText = "Link Size Calculator";
    subtitle.innerText = "Enter each link on a new line";

    checkBtn.innerText = "Calculate";
    clearBtn.innerText = "Clear";

    linksLabel.innerText = "Total Links";
    successLabel.innerText = "Success";
    errorLabel.innerText = "Errors";

    resultLabel.innerText = "Total File Size";
    errorTitle.innerText = "Failed Links";

    progressText.innerText = "Checking...";

    langToggle.innerText = "FA";

  }else{

    currentLang = "fa";

    document.documentElement.lang = "fa";
    document.documentElement.dir = "rtl";

    title.innerText = "محاسبه حجم لینک‌ها";
    subtitle.innerText = "هر لینک را در یک خط وارد کن";

    checkBtn.innerText = "محاسبه حجم";
    clearBtn.innerText = "پاک کردن";

    linksLabel.innerText = "تعداد لینک‌ها";
    successLabel.innerText = "موفق";
    errorLabel.innerText = "خطادار";

    resultLabel.innerText = "مجموع حجم فایل‌ها";
    errorTitle.innerText = "لینک‌های خطادار";

    progressText.innerText = "در حال بررسی";

    langToggle.innerText = "EN";

  }

});


// Format Size
function formatSize(bytes){

  const kb = 1024;
  const mb = kb * 1024;
  const gb = mb * 1024;
  const tb = gb * 1024;

  if(bytes >= tb){
    return (bytes / tb).toFixed(2) + " TB";
  }

  if(bytes >= gb){
    return (bytes / gb).toFixed(2) + " GB";
  }

  if(bytes >= mb){
    return (bytes / mb).toFixed(2) + " MB";
  }

  return (bytes / kb).toFixed(2) + " KB";
}


// Calculate
checkBtn.addEventListener("click", async () => {

  const links = linksInput.value
    .split("\n")
    .map(link => link.trim())
    .filter(link => link !== "");

  if(links.length === 0){

    alert(
      currentLang === "fa"
      ? "حداقل یک لینک وارد کن"
      : "Enter at least one link"
    );

    return;
  }

  linksCount.innerText = links.length;

  loading.classList.remove("hidden");
  progressText.classList.remove("hidden");

  errorContainer.classList.add("hidden");
  errorList.innerHTML = "";

  let totalSize = 0;
  let success = 0;
  let errors = [];

  for(let i = 0; i < links.length; i++){

    const link = links[i];

    progressText.innerText =
      currentLang === "fa"
      ? `در حال بررسی ${i + 1} از ${links.length}`
      : `Checking ${i + 1} of ${links.length}`;

    try{

      const response = await fetch(link,{
        method:"HEAD"
      });

      if(!response.ok){
        throw new Error();
      }

      const size = response.headers.get("content-length");

      if(size){

        totalSize += parseInt(size);
        success++;

      }else{

        errors.push(
          currentLang === "fa"
          ? `${link} ← حجم مشخص نیست`
          : `${link} ← Unknown file size`
        );

      }

    }catch{

      errors.push(
        currentLang === "fa"
        ? `${link} ← خطا در دریافت`
        : `${link} ← Request failed`
      );

    }

  }

  loading.classList.add("hidden");

  progressText.innerText =
    currentLang === "fa"
    ? "بررسی کامل شد ✅"
    : "Completed ✅";

  setTimeout(() => {
    progressText.classList.add("hidden");
  },2000);

  result.innerText = formatSize(totalSize);

  successCount.innerText = success;
  errorCount.innerText = errors.length;

  if(errors.length > 0){

    errorContainer.classList.remove("hidden");

    errors.forEach(item => {

      const li = document.createElement("li");

      li.innerHTML = `❌ ${item}`;

      errorList.appendChild(li);

    });

  }

});


// Clear
clearBtn.addEventListener("click", () => {

  linksInput.value = "";

  result.innerText = "0 MB";

  linksCount.innerText = "0";
  successCount.innerText = "0";
  errorCount.innerText = "0";

  errorContainer.classList.add("hidden");
  errorList.innerHTML = "";

  progressText.classList.add("hidden");

});
