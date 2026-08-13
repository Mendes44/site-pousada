/* ==========================================================
   INTERAÇÕES GERAIS DO SITE
   O código usa somente recursos nativos do navegador para manter o projeto leve.
   ========================================================== */

// Busca os elementos uma única vez e evita erros em páginas que não tenham menu.
const menuButton = document.querySelector("[data-menu-button]");
const menu = document.querySelector("[data-menu]");
const header = document.querySelector("[data-header]");

// Abre e fecha o menu sanduíche, mantendo leitores de tela informados do estado.
function setMenuState(isOpen) {
    if (!menuButton || !menu) return;
    menu.classList.toggle("open", isOpen);
    menuButton.classList.toggle("active", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
}

menuButton?.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    setMenuState(!isOpen);
});

// Fecha o menu depois que um link é escolhido, facilitando a navegação móvel.
menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenuState(false)));

// Fecha o menu com Escape e devolve o foco ao botão.
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu?.classList.contains("open")) {
        setMenuState(false);
        menuButton?.focus();
    }
});

// Adiciona uma sombra discreta ao cabeçalho quando a página é rolada.
function updateHeader() { header?.classList.toggle("scrolled", window.scrollY > 12); }
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

// Mantém o ano do rodapé atualizado sem exigir manutenção manual.
document.querySelectorAll("[data-current-year]").forEach((element) => { element.textContent = new Date().getFullYear(); });

/* ==========================================================
   FORMULÁRIO DE RESERVA
   Hoje ele simula o envio. A função sendReservationToBackend concentra o ponto
   que futuramente chamará uma API/Edge Function segura conectada ao Supabase.
   ========================================================== */
const reservationForm = document.querySelector("[data-reservation-form]");
const checkInInput = document.querySelector("#checkin");
const checkOutInput = document.querySelector("#checkout");

// Se o visitante veio de um quarto específico, pré-seleciona a opção no formulário.
const roomSelect = document.querySelector("#quarto");
const requestedRoom = new URLSearchParams(window.location.search).get("quarto");
if (roomSelect && requestedRoom && [...roomSelect.options].some((option) => option.value === requestedRoom)) {
    roomSelect.value = requestedRoom;
}

// Formata a data localmente para o padrão aceito por campos do tipo date.
function toDateInputValue(date) {
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - offset * 60000).toISOString().split("T")[0];
}

// Impede datas no passado e exige que a saída seja posterior à entrada.
if (checkInInput && checkOutInput) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    checkInInput.min = toDateInputValue(today);
    checkOutInput.min = toDateInputValue(tomorrow);

    checkInInput.addEventListener("change", () => {
        if (!checkInInput.value) return;
        const nextDay = new Date(`${checkInInput.value}T12:00:00`);
        nextDay.setDate(nextDay.getDate() + 1);
        checkOutInput.min = toDateInputValue(nextDay);
        if (checkOutInput.value && checkOutInput.value < checkOutInput.min) checkOutInput.value = "";
    });
}

// Ponto único de integração futura. Nunca coloque a chave secreta do Supabase aqui.
async function sendReservationToBackend(payload) {
    // Exemplo futuro: return fetch("/api/reservas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    await new Promise((resolve) => setTimeout(resolve, 450));
    return { ok: true };
}

reservationForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const feedback = reservationForm.querySelector("[data-form-feedback]");
    const submitButton = reservationForm.querySelector("button[type='submit']");

    // A validação nativa cobre campos obrigatórios, formatos e limites definidos no HTML.
    if (!reservationForm.checkValidity()) {
        reservationForm.reportValidity();
        return;
    }

    // FormData evita buscar cada campo manualmente; apenas campos com "name" são coletados.
    const formData = new FormData(reservationForm);
    const payload = Object.fromEntries(formData.entries());
    submitButton.disabled = true;
    submitButton.textContent = "Enviando…";

    try {
        const result = await sendReservationToBackend(payload);
        if (!result.ok) throw new Error("Falha no envio");
        feedback.textContent = "Solicitação registrada nesta demonstração. Na versão com Supabase, ela será enviada à equipe da pousada.";
        feedback.classList.add("visible");
        reservationForm.reset();
        feedback.focus();
    } catch (error) {
        feedback.textContent = "Não foi possível enviar agora. Tente novamente em alguns instantes.";
        feedback.classList.add("visible");
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Enviar solicitação";
    }
});
