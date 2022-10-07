function navBack() {
    window.history.back();
}

document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".back-btn");
    for(const button of buttons) {
        button.addEventListener("click", navBack);
    }
});