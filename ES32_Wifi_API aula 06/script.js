// =====================================================
// CONFIGURAÇÕES
// =====================================================

const OPENWEATHER_API_KEY = "COLE_SUA_CHAVE_AQUI";

const MQTT_BROKER = "ws://broker.hivemq.com:8000/mqtt";

const TOPICOS = {
  temperatura: "esp32/clima/temperatura",
  umidade: "esp32/clima/umidade",
  cidadeAtual: "esp32/clima/cidadeAtual",
  cidade: "esp32/clima/cidade"
};

let dadosAtuais = null;

let historico = carregarLocalStorage(
  "historicoClima",
  []
);


// =====================================================
// ELEMENTOS DA PÁGINA
// =====================================================

const $ = id => document.getElementById(id);

const elementos = {
  form: $("formClima"),
  cidade: $("cidade"),
  pais: $("pais"),
  botaoConsultar: $("botaoConsultar"),
  carregando: $("carregando"),
  mensagem: $("mensagem"),

  temperatura: $("temperatura"),
  umidade: $("umidade"),
  sensacao: $("sensacao"),
  vento: $("vento"),
  direcaoVento: $("direcaoVento"),
  pressao: $("pressao"),
  condicao: $("condicao"),
  minMax: $("minMax"),
  iconeClima: $("iconeClima"),

  cidadeAtual: $("cidadeAtual"),
  ultimaAtualizacao: $("ultimaAtualizacao"),

  mqttStatus: $("mqttStatus"),
  mqttStatus2: $("mqttStatus2"),
  mqttBolinha: $("mqttBolinha"),
  ultimaPublicacao: $("ultimaPublicacao"),

  alertaClimatico: $("alertaClimatico"),

  cidadeFavorita: $("cidadeFavorita"),
  historico: $("historico"),

  botaoTema: $("botaoTema")
};


// =====================================================
// MQTT
// =====================================================

let clienteMQTT;

function iniciarMQTT() {

  clienteMQTT = mqtt.connect(
    MQTT_BROKER,
    {
      reconnectPeriod: 3000,
      connectTimeout: 8000,

      clientId:
        "dashboard_" +
        Math.random()
          .toString(16)
          .slice(2, 10)
    }
  );


  clienteMQTT.on(
    "connect",
    () => {

      atualizarStatusMQTT(
        true,
        "Conectado"
      );

      clienteMQTT.subscribe(
        TOPICOS.temperatura
      );

      clienteMQTT.subscribe(
        TOPICOS.umidade
      );

      clienteMQTT.subscribe(
        TOPICOS.cidadeAtual
      );

      console.log(
        "✅ MQTT conectado"
      );

    }
  );


  clienteMQTT.on(
    "reconnect",
    () => {

      atualizarStatusMQTT(
        false,
        "Reconectando..."
      );

    }
  );


  clienteMQTT.on(
    "close",
    () => {

      atualizarStatusMQTT(
        false,
        "Desconectado"
      );

    }
  );


  clienteMQTT.on(
    "error",
    erro => {

      atualizarStatusMQTT(
        false,
        "Erro"
      );

      console.error(
        "Erro MQTT:",
        erro
      );

    }
  );


  clienteMQTT.on(
    "message",
    (topico, mensagem) => {

      console.log(
        "MQTT recebido:",
        topico,
        mensagem.toString()
      );

    }
  );
}


function atualizarStatusMQTT(
  conectado,
  texto
) {

  elementos.mqttStatus.textContent =
    texto;

  elementos.mqttStatus2.textContent =
    texto;

  elementos.mqttBolinha.classList.toggle(
    "online",
    conectado
  );

}


function publicarMQTT(dados) {

  if (
    !clienteMQTT ||
    !clienteMQTT.connected
  ) {
    return;
  }


  clienteMQTT.publish(
    TOPICOS.temperatura,
    String(dados.main.temp)
  );


  clienteMQTT.publish(
    TOPICOS.umidade,
    String(dados.main.humidity)
  );


  clienteMQTT.publish(
    TOPICOS.cidadeAtual,
    `${dados.name}, ${dados.sys.country}`
  );


  clienteMQTT.publish(
    TOPICOS.cidade,
    `${dados.name},${dados.sys.country}`
  );


  elementos.ultimaPublicacao.textContent =
    new Date()
      .toLocaleTimeString("pt-BR");

}


// =====================================================
// GRÁFICO
// =====================================================

const grafico = new Chart(
  $("grafico"),
  {

    type: "line",

    data: {

      labels: [],

      datasets: [

        {
          label: "Temperatura (°C)",
          data: [],
          borderColor: "#e53935",
          backgroundColor: "rgba(229,57,53,0.10)",
          tension: 0.3,
          yAxisID: "temperatura"
        },

        {
          label: "Sensação térmica (°C)",
          data: [],
          borderColor: "#fb8c00",
          backgroundColor: "rgba(251,140,0,0.10)",
          tension: 0.3,
          yAxisID: "temperatura"
        },

        {
          label: "Umidade (%)",
          data: [],
          borderColor: "#1e88e5",
          backgroundColor: "rgba(30,136,229,0.10)",
          tension: 0.3,
          yAxisID: "umidade"
        }

      ]
    },


    options: {

      responsive: true,
      maintainAspectRatio: false,

      plugins: {

        title: {
          display: true,
          text:
            "Temperatura, sensação térmica e umidade"
        },

        legend: {
          display: true,
          position: "top"
        }

      },


      scales: {

        x: {

          title: {
            display: true,
            text:
              "Horário da consulta"
          }

        },


        temperatura: {

          type: "linear",
          position: "left",

          title: {
            display: true,
            text:
              "Temperatura (°C)"
          }

        },


        umidade: {

          type: "linear",
          position: "right",

          min: 0,
          max: 100,

          grid: {
            drawOnChartArea: false
          },

          title: {
            display: true,
            text:
              "Umidade (%)"
          }

        }

      }

    }

  }
);


function atualizarGrafico(dados) {

  const horario =
    new Date()
      .toLocaleTimeString("pt-BR");


  grafico.data.labels.push(
    horario
  );


  grafico.data.datasets[0]
    .data.push(
      dados.main.temp
    );


  grafico.data.datasets[1]
    .data.push(
      dados.main.feels_like
    );


  grafico.data.datasets[2]
    .data.push(
      dados.main.humidity
    );


  while (
    grafico.data.labels.length > 12
  ) {

    grafico.data.labels.shift();

    grafico.data.datasets
      .forEach(
        dataset =>
          dataset.data.shift()
      );

  }


  grafico.update();

}


// =====================================================
// CONSULTA OPENWEATHERMAP
// =====================================================

async function consultarClima() {

  const cidade =
    elementos.cidade.value.trim();

  const pais =
    elementos.pais.value;


  esconderMensagem();


  if (!cidade) {

    mostrarMensagem(
      "Informe uma cidade antes de realizar a consulta.",
      "erro"
    );

    elementos.cidade.focus();

    return;
  }


  if (
    !OPENWEATHER_API_KEY ||
    OPENWEATHER_API_KEY ===
    "COLE_SUA_CHAVE_AQUI"
  ) {

    mostrarMensagem(
      "Configure sua API Key do OpenWeatherMap antes de consultar.",
      "erro"
    );

    return;
  }


  setCarregando(true);


  try {

    const parametros =
      new URLSearchParams({
        q: `${cidade},${pais}`,
        appid: OPENWEATHER_API_KEY,
        units: "metric",
        lang: "pt_br"
      });


    const resposta =
      await fetch(
        "https://api.openweathermap.org/data/2.5/weather?" +
        parametros
      );


    if (!resposta.ok) {

      const erroAPI =
        await lerJsonSeguro(
          resposta
        );


      if (
        resposta.status === 404
      ) {

        throw new Error(
          "Cidade não encontrada. Verifique o nome informado."
        );

      }


      if (
        resposta.status === 401
      ) {

        throw new Error(
          "API Key inválida ou ainda não ativada."
        );

      }


      if (
        resposta.status === 429
      ) {

        throw new Error(
          "Limite de consultas atingido. Aguarde e tente novamente."
        );

      }


      throw new Error(
        erroAPI.message ||
        `Erro ${resposta.status} ao consultar o clima.`
      );

    }


    const dados =
      await resposta.json();


    dadosAtuais = dados;


    exibirClima(dados);

    atualizarGrafico(dados);

    publicarMQTT(dados);

    adicionarHistorico(dados);

    criarAlerta(dados);

    aplicarTemaClima(dados);


    mostrarMensagem(
      `Clima de ${dados.name} atualizado com sucesso!`,
      "sucesso"
    );


  } catch (erro) {

    console.error(
      erro
    );


    if (
      !navigator.onLine ||
      erro instanceof TypeError
    ) {

      mostrarMensagem(
        "Não foi possível consultar os dados. Verifique sua internet.",
        "erro"
      );

    } else {

      mostrarMensagem(
        erro.message,
        "erro"
      );

    }


  } finally {

    setCarregando(false);

  }

}


async function lerJsonSeguro(
  resposta
) {

  try {
    return await resposta.json();
  }

  catch {
    return {};
  }

}


// =====================================================
// EXIBIR DADOS
// =====================================================

function exibirClima(dados) {

  const ventoKmh =
    (
      dados.wind?.speed || 0
    ) * 3.6;


  const graus =
    dados.wind?.deg;


  const descricao =
    dados.weather?.[0]
      ?.description ||
    "Não informado";


  elementos.temperatura.textContent =
    `${dados.main.temp.toFixed(1)} °C`;


  elementos.umidade.textContent =
    `${dados.main.humidity} %`;


  elementos.sensacao.textContent =
    `${dados.main.feels_like.toFixed(1)} °C`;


  elementos.vento.textContent =
    `${ventoKmh.toFixed(1)} km/h`;


  elementos.pressao.textContent =
    `${dados.main.pressure} hPa`;


  elementos.condicao.textContent =
    primeiraMaiuscula(
      descricao
    );


  elementos.minMax.textContent =
    `Mín.: ${dados.main.temp_min.toFixed(1)} °C | Máx.: ${dados.main.temp_max.toFixed(1)} °C`;


  elementos.direcaoVento.textContent =
    graus === undefined
      ? "Direção não informada"
      : `Direção: ${graus}° (${direcaoCardeal(graus)})`;


  elementos.cidadeAtual.textContent =
    `${dados.name}, ${dados.sys.country}`;


  elementos.ultimaAtualizacao.textContent =
    formatarDataHora(
      new Date()
    );

}


// =====================================================
// ALERTA CLIMÁTICO
// =====================================================

function criarAlerta(dados) {

  const temperatura =
    dados.main.temp;

  const umidade =
    dados.main.humidity;

  const vento =
    (
      dados.wind?.speed || 0
    ) * 3.6;


  let alerta =
    "✅ Condições sem alertas importantes.";


  if (
    temperatura >= 35
  ) {

    alerta =
      "🔥 Alerta: temperatura muito elevada!";

  }

  else if (
    temperatura <= 10
  ) {

    alerta =
      "❄️ Alerta: temperatura baixa!";

  }

  else if (
    vento >= 40
  ) {

    alerta =
      "💨 Alerta: vento forte!";

  }

  else if (
    umidade <= 30
  ) {

    alerta =
      "🏜️ Alerta: umidade do ar muito baixa!";

  }

  else if (
    umidade >= 90
  ) {

    alerta =
      "💧 Atenção: umidade do ar muito elevada.";

  }


  elementos.alertaClimatico.textContent =
    alerta;

}


// =====================================================
// TEMA AUTOMÁTICO PELO CLIMA
// =====================================================

function aplicarTemaClima(dados) {

  const clima =
    (
      dados.weather?.[0]?.main || ""
    ).toLowerCase();


  document.body.classList.remove(
    "clima-chuva",
    "clima-nublado",
    "clima-limpo",
    "clima-noite"
  );


  const horaLocal =
    new Date(
      (
        Date.now() / 1000 +
        (dados.timezone || 0)
      ) * 1000
    )
      .getUTCHours();


  const noite =
    horaLocal < 6 ||
    horaLocal >= 18;


  if (noite) {

    document.body.classList.add(
      "clima-noite"
    );

    elementos.iconeClima.textContent =
      "🌙";

    return;
  }


  if (
    clima.includes("rain") ||
    clima.includes("drizzle") ||
    clima.includes("thunderstorm")
  ) {

    document.body.classList.add(
      "clima-chuva"
    );

    elementos.iconeClima.textContent =
      "🌧️";

  }

  else if (
    clima.includes("cloud")
  ) {

    document.body.classList.add(
      "clima-nublado"
    );

    elementos.iconeClima.textContent =
      "☁️";

  }

  else {

    document.body.classList.add(
      "clima-limpo"
    );

    elementos.iconeClima.textContent =
      "☀️";

  }

}


// =====================================================
// HISTÓRICO
// =====================================================

function adicionarHistorico(dados) {

  historico.unshift({

    cidade:
      dados.name,

    pais:
      dados.sys.country,

    temperatura:
      dados.main.temp,

    umidade:
      dados.main.humidity,

    horario:
      formatarDataHora(
        new Date()
      )

  });


  historico =
    historico.slice(
      0,
      6
    );


  salvarLocalStorage(
    "historicoClima",
    historico
  );


  mostrarHistorico();

}


function mostrarHistorico() {

  elementos.historico.innerHTML =
    "";


  if (
    historico.length === 0
  ) {

    elementos.historico.textContent =
      "Nenhuma consulta realizada.";

    return;
  }


  historico.forEach(item => {

    const linha =
      document.createElement(
        "div"
      );

    linha.className =
      "historico-item";


    const texto =
      document.createElement(
        "div"
      );


    const titulo =
      document.createElement(
        "strong"
      );

    titulo.textContent =
      `${item.cidade}, ${item.pais}`;


    const detalhes =
      document.createElement(
        "small"
      );

    detalhes.textContent =
      `${Number(item.temperatura).toFixed(1)} °C • ${item.umidade}% • ${item.horario}`;


    texto.append(
      titulo,
      detalhes
    );


    const botao =
      document.createElement(
        "button"
      );

    botao.type =
      "button";

    botao.textContent =
      "Consultar";


    botao.addEventListener(
      "click",
      () => {

        elementos.cidade.value =
          item.cidade;

        elementos.pais.value =
          item.pais;

        consultarClima();

      }
    );


    linha.append(
      texto,
      botao
    );


    elementos.historico.appendChild(
      linha
    );

  });

}


// =====================================================
// CIDADE FAVORITA
// =====================================================

function salvarFavorita() {

  if (!dadosAtuais) {

    mostrarMensagem(
      "Consulte uma cidade antes de salvar como favorita.",
      "erro"
    );

    return;
  }


  const favorita = {

    cidade:
      dadosAtuais.name,

    pais:
      dadosAtuais.sys.country

  };


  salvarLocalStorage(
    "cidadeFavorita",
    favorita
  );


  carregarFavorita();


  mostrarMensagem(
    `${favorita.cidade} foi salva como favorita.`,
    "sucesso"
  );

}


function carregarFavorita() {

  const favorita =
    carregarLocalStorage(
      "cidadeFavorita",
      null
    );


  elementos.cidadeFavorita.textContent =
    favorita
      ? `${favorita.cidade}, ${favorita.pais}`
      : "Nenhuma cidade favorita salva.";

}


function consultarFavorita() {

  const favorita =
    carregarLocalStorage(
      "cidadeFavorita",
      null
    );


  if (!favorita) {

    mostrarMensagem(
      "Nenhuma cidade favorita foi salva.",
      "erro"
    );

    return;
  }


  elementos.cidade.value =
    favorita.cidade;

  elementos.pais.value =
    favorita.pais;


  consultarClima();

}


function removerFavorita() {

  localStorage.removeItem(
    "cidadeFavorita"
  );


  carregarFavorita();


  mostrarMensagem(
    "Cidade favorita removida.",
    "info"
  );

}


// =====================================================
// MODO CLARO / ESCURO
// =====================================================

function carregarTema() {

  const tema =
    localStorage.getItem(
      "temaDashboard"
    );


  document.body.classList.toggle(
    "dark",
    tema === "escuro"
  );


  atualizarBotaoTema();

}


function alternarTema() {

  const escuro =
    document.body.classList.toggle(
      "dark"
    );


  localStorage.setItem(
    "temaDashboard",
    escuro
      ? "escuro"
      : "claro"
  );


  atualizarBotaoTema();

}


function atualizarBotaoTema() {

  elementos.botaoTema.textContent =
    document.body.classList.contains(
      "dark"
    )
      ? "☀️ Modo claro"
      : "🌙 Modo escuro";

}


// =====================================================
// MENSAGENS E CARREGAMENTO
// =====================================================

function setCarregando(ativo) {

  elementos.carregando.classList.toggle(
    "mostrar",
    ativo
  );


  elementos.botaoConsultar.disabled =
    ativo;


  elementos.botaoConsultar.textContent =
    ativo
      ? "Consultando..."
      : "Consultar clima";

}


function mostrarMensagem(
  texto,
  tipo = "info"
) {

  elementos.mensagem.textContent =
    texto;


  elementos.mensagem.className =
    `mensagem mostrar ${tipo}`;

}


function esconderMensagem() {

  elementos.mensagem.textContent =
    "";


  elementos.mensagem.className =
    "mensagem";

}


// =====================================================
// FUNÇÕES AUXILIARES
// =====================================================

function primeiraMaiuscula(texto) {

  if (!texto) {
    return "—";
  }


  return (
    texto.charAt(0)
      .toUpperCase() +
    texto.slice(1)
  );

}


function formatarDataHora(data) {

  return data.toLocaleString(
    "pt-BR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }
  );

}


function direcaoCardeal(graus) {

  const direcoes = [
    "N",
    "NE",
    "L",
    "SE",
    "S",
    "SO",
    "O",
    "NO"
  ];


  return direcoes[
    Math.round(
      graus / 45
    ) % 8
  ];

}


function carregarLocalStorage(
  chave,
  padrao
) {

  try {

    const valor =
      localStorage.getItem(
        chave
      );


    return valor
      ? JSON.parse(valor)
      : padrao;

  }

  catch {

    return padrao;

  }

}


function salvarLocalStorage(
  chave,
  valor
) {

  try {

    localStorage.setItem(
      chave,
      JSON.stringify(valor)
    );

  }

  catch (erro) {

    console.warn(
      "Erro ao salvar:",
      erro
    );

  }

}


// =====================================================
// EVENTOS
// =====================================================

elementos.form.addEventListener(
  "submit",
  evento => {

    evento.preventDefault();

    consultarClima();

  }
);


$("salvarFavorita")
  .addEventListener(
    "click",
    salvarFavorita
  );


$("consultarFavorita")
  .addEventListener(
    "click",
    consultarFavorita
  );


$("removerFavorita")
  .addEventListener(
    "click",
    removerFavorita
  );


elementos.botaoTema
  .addEventListener(
    "click",
    alternarTema
  );


// =====================================================
// INICIALIZAÇÃO
// =====================================================

function iniciar() {

  carregarTema();

  carregarFavorita();

  mostrarHistorico();

  iniciarMQTT();

}


iniciar();