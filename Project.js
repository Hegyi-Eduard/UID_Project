function contactButtonHover() {
    const contacts = document.querySelector(".contacts");

    contacts.addEventListener("mouseover", (e) => {
        const btn = e.target.closest("button");
        if (btn && contacts.contains(btn)) {
            btn.style.backgroundColor = "#7fb8d0";
        }
    });

    contacts.addEventListener("mouseout", (e) => {
        const btn = e.target.closest("button");
        if (btn && contacts.contains(btn)) {
            btn.style.backgroundColor = "";
        }
    });
}

const chatHistory = {
    Marcel: [
        { from: "them", text: "Hey! How are you?" },
        { from: "me", text: "Good, working on Project 7 😄" }
    ],
    David: [
        { from: "them", text: "Did you finish the listings page?" }
    ],
    Ana: []
};

function createChatHTML(name) {
    const messages = chatHistory[name] || [];

    const messagesHTML = messages.map(msg => {
        const cls = msg.from === "me" ? "sent" : "received";
        return `<div class="message ${cls}">${msg.text}</div>`;
    }).join("");

    return `
        <div class="chat">
            <div class="chat-header">
                <button class="back-btn" id="backBtn">← Back</button>
                <span>Chat with ${name}</span>
            </div>
            <div class="chat-messages" id="chatMessages">
                ${messagesHTML}
            </div>
            <div class="chat-input-area">
                <input type="text" id="chatInput" placeholder="Type a message..." autocomplete="off">
                <button id="sendBtn">Send</button>
            </div>
        </div>
    `;
}

const defaultView = `
    <table class="listings">
        <thead>
            <tr>
                <th>Company name</th>
                <th>Field of Work</th>
                <th>Expected Price</th>
                <th>Location</th>
                <th>Provider</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Logitec SRL</td>
                <td>Web development</td>
                <td>500-800 EUR</td>
                <td>Cluj-Napoca</td>
                <td>Alex Pop</td>
            </tr>
            <tr>
                <td>Good Graphics inc.</td>
                <td>Graphic design</td>
                <td>From 100 EUR</td>
                <td>Remote</td>
                <td>Maria Ionescu</td>
            </tr>
        </tbody>
    </table>
    <button class="contactProvider">Contact Provider</button>
`;

function showListings() {
    const main = document.querySelector("div.main");
    main.innerHTML = defaultView;
    setupRowSelection();
}

function showChat(name) {
    const main = document.querySelector("div.main");
    main.innerHTML = createChatHTML(name);

    // Focus the input
    const input = document.getElementById("chatInput");
    const sendBtn = document.getElementById("sendBtn");
    const messagesContainer = document.getElementById("chatMessages");
    const backBtn = document.getElementById("backBtn");

    backBtn.addEventListener("click", showListings);

    function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        // Add to history
        if (!chatHistory[name]) chatHistory[name] = [];
        chatHistory[name].push({ from: "me", text });

        // Add bubble to UI
        const bubble = document.createElement("div");
        bubble.className = "message sent";
        bubble.textContent = text;
        messagesContainer.appendChild(bubble);

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        input.value = "";
        input.focus();
    }

    sendBtn.addEventListener("click", sendMessage);

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
}

function setupContactClicks() {
    const contactList = document.querySelector("div.contacts > ul");

    contactList.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn || !contactList.contains(btn)) return;

        const name = btn.textContent.trim();
        showChat(name);
    });
}

function setupRowSelection() {
    const tbody = document.querySelector("table.listings tbody");
    const contactBtn = document.querySelector("button.contactProvider");
    const contactList = document.querySelector("div.contacts > ul");

    contactBtn.disabled = true;

    tbody.addEventListener("click", (e) => {
        const row = e.target.closest("tr");
        if (!row || !tbody.contains(row)) return;

        const wasSelected = row.classList.contains("selected");
        tbody.querySelectorAll("tr.selected").forEach((r) => r.classList.remove("selected"));

        if (!wasSelected) {
            row.classList.add("selected");
        }

        contactBtn.disabled = !tbody.querySelector("tr.selected");
    });

    contactBtn.addEventListener("click", () => {
        const row = tbody.querySelector("tr.selected");
        if (!row) return;

        const provider = row.querySelectorAll("td")[4].textContent.trim();

        const alreadyAdded = Array.from(contactList.querySelectorAll("button"))
            .some((b) => b.textContent.trim() === provider);
        if (alreadyAdded) return;

        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.textContent = provider;
        li.appendChild(btn);
        contactList.appendChild(li);
    });
}

contactButtonHover();
setupContactClicks();
setupRowSelection();