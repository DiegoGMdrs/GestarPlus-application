
// =====================================
// DADOS DO CALENDÁRIO GESTACIONAL
// =====================================

const months = [

    {
        development: "Nas primeiras semanas ocorre a formação inicial do embrião. Começam processos fundamentais para o desenvolvimento dos órgãos e do sistema nervoso.",

        changes: "Podem surgir atraso menstrual, cansaço, sensibilidade nas mamas, náuseas e alterações hormonais.",

        care: "Confirme a gestação e procure uma unidade de saúde para iniciar o pré-natal o quanto antes.",

        tasks: [
            "Procurar uma unidade de saúde e iniciar o pré-natal",
            "Conversar sobre exames iniciais e histórico de saúde",
            "Verificar a caderneta de vacinação",
            "Conversar sobre ácido fólico e outros cuidados",
            "Evitar álcool e automedicação"
        ]
    },

    {
        development: "O embrião continua seu desenvolvimento. Estruturas importantes do cérebro, coração e outros órgãos estão em formação.",

        changes: "Náuseas, sono, cansaço e sensibilidade emocional podem estar presentes.",

        care: "Mantenha as consultas e siga as orientações sobre alimentação, suplementação e exames.",

        tasks: [
            "Realizar ou programar exames solicitados",
            "Verificar tipagem sanguínea e fator Rh",
            "Conversar sobre exames de infecções",
            "Revisar alimentação e hidratação",
            "Comparecer às consultas programadas"
        ]
    },

    {
        development: "Ao final do primeiro trimestre, inicia-se a fase fetal. As estruturas do corpo continuam amadurecendo e o bebê começa a apresentar movimentos.",

        changes: "Alguns desconfortos iniciais podem diminuir, embora isso varie entre as gestantes.",

        care: "Converse com a equipe sobre os resultados dos exames e a continuidade do acompanhamento.",

        tasks: [
            "Revisar os resultados dos exames",
            "Verificar a necessidade de ultrassonografia",
            "Atualizar o acompanhamento pré-natal",
            "Conversar sobre vacinação",
            "Manter alimentação equilibrada"
        ]
    },

    {
        development: "O bebê continua crescendo. O desenvolvimento dos ossos, músculos e estruturas corporais avança.",

        changes: "A barriga pode começar a ficar mais evidente e a disposição pode melhorar.",

        care: "Mantenha as consultas, alimentação variada e atividade física somente conforme orientação profissional.",

        tasks: [
            "Comparecer à consulta de pré-natal",
            "Verificar exames pendentes",
            "Conversar sobre atividade física segura",
            "Manter hidratação",
            "Observar mudanças no próprio corpo"
        ]
    },

    {
        development: "O bebê cresce e seus movimentos podem começar a ser percebidos, embora o momento varie de pessoa para pessoa.",

        changes: "A gestante pode perceber movimentos fetais e mudanças no crescimento abdominal.",

        care: "Converse com a equipe sobre os movimentos do bebê e os exames indicados para esta fase.",

        tasks: [
            "Realizar exames solicitados",
            "Conversar sobre ultrassonografia morfológica, quando indicada",
            "Manter consultas regulares",
            "Revisar vacinação",
            "Cuidar da saúde emocional"
        ]
    },

    {
        development: "O bebê continua desenvolvendo os sentidos, músculos e sistema nervoso.",

        changes: "Podem surgir dores nas costas, azia e maior percepção dos movimentos fetais.",

        care: "O acompanhamento da pressão arterial, crescimento uterino e outros parâmetros deve continuar.",

        tasks: [
            "Comparecer à consulta de pré-natal",
            "Conversar sobre rastreamento de diabetes gestacional",
            "Revisar os exames com a equipe",
            "Conferir o calendário de vacinação",
            "Manter hábitos saudáveis"
        ]
    },

    {
        development: "O bebê ganha peso e continua amadurecendo. Os movimentos podem ficar mais perceptíveis.",

        changes: "Podem ocorrer cansaço, inchaço e dificuldades para dormir.",

        care: "Converse sobre os sinais de alerta e comece a planejar os cuidados para o nascimento.",

        tasks: [
            "Verificar exames do terceiro trimestre",
            "Revisar vacinação indicada",
            "Conversar sobre planejamento do parto",
            "Identificar a maternidade de referência",
            "Conversar sobre amamentação"
        ]
    },

    {
        development: "O bebê continua ganhando peso e amadurecendo. Os órgãos se preparam para funcionar fora do útero.",

        changes: "A gestante pode sentir maior desconforto físico e pressão na região pélvica.",

        care: "Mantenha o acompanhamento na frequência indicada pela equipe e esclareça dúvidas sobre o parto.",

        tasks: [
            "Comparecer às consultas programadas",
            "Revisar o plano de parto",
            "Preparar documentos e itens para maternidade",
            "Conversar sobre sinais de trabalho de parto",
            "Planejar a rede de apoio para o pós-parto"
        ]
    },

    {
        development: "O bebê continua amadurecendo e se preparando para o nascimento. A gestação pode chegar ao termo.",

        changes: "Pode haver maior pressão pélvica, contrações de treinamento e cansaço.",

        care: "Siga as orientações da maternidade e da equipe de pré-natal. Não deixe de comparecer às consultas.",

        tasks: [
            "Manter consultas conforme orientação",
            "Deixar documentos e bolsa da maternidade organizados",
            "Confirmar como chegar à maternidade",
            "Revisar orientações sobre trabalho de parto",
            "Planejar apoio para os primeiros dias após o nascimento"
        ]
    }

];


// =====================================
// VARIÁVEIS E ARMAZENAMENTO
// =====================================

let selectedMonth = 0;

let completedTasks = JSON.parse(
    localStorage.getItem("gestarTasks") || "{}"
);

let reminders = JSON.parse(
    localStorage.getItem("gestarReminders") || "[]"
);


// =====================================
// SELETOR DE MESES
// =====================================

const selector = document.getElementById("month-selector");

for (let i = 0; i < 9; i++) {

    const button = document.createElement("button");

    button.className = "month-btn";
    button.textContent = `${i + 1}º mês`;

    button.addEventListener("click", () => {

        selectedMonth = i;

        showMonth();

    });

    selector.appendChild(button);

}


// =====================================
// EXIBIR INFORMAÇÕES DO MÊS
// =====================================

function showMonth() {

    const data = months[selectedMonth];

    document.querySelectorAll(".month-btn").forEach((btn, i) => {

        btn.classList.toggle(
            "active",
            i === selectedMonth
        );

    });

    document.getElementById("current-month").textContent =
        `${selectedMonth + 1}º`;

    document.getElementById("development").textContent =
        data.development;

    document.getElementById("mother-changes").textContent =
        data.changes;

    document.getElementById("care").textContent =
        data.care;


    const taskContainer = document.getElementById("tasks");

    taskContainer.innerHTML = "";


    data.tasks.forEach((task, index) => {

        const key = `${selectedMonth}-${index}`;

        const checked = completedTasks[key] || false;

        const div = document.createElement("label");

        div.className = "task" + (checked ? " done" : "");


        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.checked = checked;


        checkbox.addEventListener("change", () => {

            completedTasks[key] = checkbox.checked;

            localStorage.setItem(
                "gestarTasks",
                JSON.stringify(completedTasks)
            );

            showMonth();

            updateStats();

        });


        const span = document.createElement("span");

        span.textContent = task;

        div.appendChild(checkbox);

        div.appendChild(span);

        taskContainer.appendChild(div);

    });


    const total = data.tasks.length;

    const completed = data.tasks.filter(
        (_, index) => completedTasks[`${selectedMonth}-${index}`]
    ).length;

    const percent = (completed / total) * 100;


    document.getElementById("progress-bar").style.width =
        percent + "%";

    document.getElementById("progress-text").textContent =
        `${completed} de ${total} atividades concluídas`;

}


// =====================================
// CADASTRAR LEMBRETES
// =====================================

const reminderForm = document.getElementById("reminder-form");

reminderForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("reminder-name").value;

    const type = document.getElementById("reminder-type").value;

    const date = document.getElementById("reminder-date").value;


    if (!name || !date) return;


    reminders.push({

        id: Date.now(),

        name: name,

        type: type,

        date: date

    });


    localStorage.setItem(
        "gestarReminders",
        JSON.stringify(reminders)
    );


    reminderForm.reset();

    showReminders();

    updateStats();

});


// =====================================
// EXIBIR LEMBRETES
// =====================================

function showReminders() {

    const list = document.getElementById("reminder-list");

    list.innerHTML = "";


    const sorted = [...reminders].sort(
        (a, b) => a.date.localeCompare(b.date)
    );


    if (sorted.length === 0) {

        list.textContent =
            "Você ainda não possui lembretes cadastrados.";

    }


    sorted.forEach(item => {

        const div = document.createElement("div");

        div.className = "reminder-item";


        const info = document.createElement("div");

        const title = document.createElement("strong");

        title.textContent =
            `${item.type}: ${item.name}`;


        const date = document.createElement("br");

        const small = document.createElement("small");


        const [year, month, day] = item.date.split("-");

        small.textContent =
            `${day}/${month}/${year}`;


        info.appendChild(title);

        info.appendChild(date);

        info.appendChild(small);


        const remove = document.createElement("button");

        remove.className = "delete-btn";

        remove.textContent = "Excluir";


        remove.addEventListener("click", () => {

            reminders = reminders.filter(
                reminder => reminder.id !== item.id
            );


            localStorage.setItem(
                "gestarReminders",
                JSON.stringify(reminders)
            );


            showReminders();

            updateStats();

        });


        div.appendChild(info);

        div.appendChild(remove);

        list.appendChild(div);

    });

}


// =====================================
// ATUALIZAR INDICADORES
// =====================================

function updateStats() {

    document.getElementById("pending-count").textContent =
        reminders.length;


    document.getElementById("completed-count").textContent =
        Object.values(completedTasks).filter(Boolean).length;

}


// =====================================
// INICIALIZAR O SISTEMA
// =====================================

showMonth();

showReminders();

updateStats();
