# 🌦️ Dashboard Meteorológico — OpenWeatherMap + MQTT

Projeto desenvolvido na atividade **Desafio de Melhoria 05.1**, com o objetivo de transformar a aplicação meteorológica original em um dashboard mais completo, organizado, moderno e fácil de utilizar.

O sistema consulta dados meteorológicos em tempo real utilizando a API do **OpenWeatherMap** e realiza comunicação por **MQTT** através do broker público da HiveMQ.

---

## 🎯 Objetivo

O objetivo do projeto é criar um Dashboard Meteorológico capaz de consultar informações climáticas de diferentes cidades e apresentar os dados de forma clara e organizada.

Além da consulta à API, o projeto trabalha com comunicação MQTT, permitindo a integração da aplicação Web com dispositivos IoT, como o ESP32.

Fluxo principal:

```text
Usuário
   ↓
JavaScript
   ↓
OpenWeatherMap
   ↓
JSON
   ↓
MQTT
   ↓
HiveMQ
   ↓
ESP32
```

---

## 🛠️ Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- OpenWeatherMap API
- API REST
- JSON
- MQTT
- MQTT.js
- HiveMQ
- Chart.js
- LocalStorage
- ESP32

---

## 📁 Organização do projeto

O projeto foi organizado em arquivos separados para facilitar a leitura e manutenção do código.

```text
projeto/
│
├── index.html
└── script.js
```

O arquivo `index.html` contém a estrutura e a interface da aplicação.

O arquivo `script.js` contém a lógica do sistema, como consultas à API, MQTT, gráfico, histórico, favoritos e modo escuro.

---

## 🌐 OpenWeatherMap

O OpenWeatherMap é utilizado para fornecer os dados meteorológicos.

A aplicação consegue obter informações como:

- 🌡️ Temperatura atual
- 💧 Umidade
- 🧍 Sensação térmica
- 💨 Velocidade do vento
- 🧭 Pressão atmosférica
- ☁️ Condição do clima
- 🔽 Temperatura mínima
- 🔼 Temperatura máxima

---

## 🔑 Como configurar a API Key

Para utilizar o projeto, é necessário possuir uma API Key do OpenWeatherMap.

No arquivo `script.js`, localize:

```javascript
const OPENWEATHER_API_KEY = "COLE_SUA_CHAVE_AQUI";
```

Substitua temporariamente pelo valor da sua API Key:

```javascript
const OPENWEATHER_API_KEY = "SUA_API_KEY";
```

### ⚠️ Importante

Nunca publique sua API Key real no GitHub.

Antes de enviar o projeto para um repositório público, deixe novamente:

```javascript
const OPENWEATHER_API_KEY = "COLE_SUA_CHAVE_AQUI";
```

---

## 📡 Como funciona o MQTT

O MQTT é utilizado para realizar a comunicação entre a aplicação Web e dispositivos conectados ao mesmo broker.

O projeto utiliza o broker público:

```text
broker.hivemq.com
```

A conexão pelo navegador é realizada através de WebSocket:

```javascript
const MQTT_BROKER =
  "ws://broker.hivemq.com:8000/mqtt";
```

Quando uma cidade é consultada, a aplicação pode publicar dados meteorológicos no broker MQTT.

Um ESP32 conectado ao mesmo broker pode receber essas informações.

---

## 📋 Tópicos MQTT

| Tópico | Função |
|---|---|
| `esp32/clima/temperatura` | Envia a temperatura |
| `esp32/clima/umidade` | Envia a umidade |
| `esp32/clima/cidadeAtual` | Informa a cidade atualmente consultada |
| `esp32/clima/cidade` | Envia a cidade selecionada |

---

## 📊 Gráfico meteorológico

O projeto utiliza a biblioteca **Chart.js** para representar os dados em um gráfico.

O gráfico apresenta:

- Temperatura
- Sensação térmica
- Umidade

O gráfico é atualizado automaticamente sempre que uma nova cidade é consultada.

Também possui:

- Título
- Legenda
- Identificação dos eixos
- Dados reais recebidos pela API
- Histórico das últimas leituras

---

## ✅ Funcionalidades implementadas

O Dashboard possui as seguintes funcionalidades:

- Pesquisa de cidades
- Seleção de país
- Consulta utilizando OpenWeatherMap
- Exibição da temperatura
- Exibição da umidade
- Sensação térmica
- Velocidade do vento
- Direção do vento
- Pressão atmosférica
- Condição climática
- Temperatura mínima e máxima
- Gráfico meteorológico
- Data e horário da última atualização
- Status da conexão MQTT
- Publicação de dados pelo MQTT
- Pesquisa pressionando Enter
- Indicador de carregamento
- Tratamento de erros
- Histórico de consultas
- Cidade favorita
- Armazenamento utilizando LocalStorage
- Modo claro e escuro
- Interface responsiva
- Alertas climáticos automáticos

---

## 🚨 Tratamento de erros

Foram adicionadas mensagens para ajudar o usuário quando ocorrer algum problema.

Exemplos:

```text
Cidade não encontrada.
```

```text
Informe uma cidade antes de realizar a consulta.
```

```text
API Key inválida ou ainda não ativada.
```

```text
Verifique sua conexão com a internet.
```

---

## ⏳ Indicador de carregamento

Enquanto a aplicação aguarda a resposta da API, é apresentada uma mensagem:

```text
Consultando dados meteorológicos...
```

Após receber os dados, o indicador desaparece automaticamente.

---

## 🕘 Histórico de consultas

O sistema mantém um histórico das cidades pesquisadas.

Cada registro apresenta informações como:

- Cidade
- País
- Temperatura
- Umidade
- Horário da consulta

Também é possível consultar novamente uma cidade diretamente pelo histórico.

---

## ⭐ Cidade favorita

O usuário pode salvar uma cidade como favorita.

A informação é armazenada utilizando:

```javascript
localStorage
```

Dessa forma, a cidade continua salva mesmo depois de atualizar ou fechar a página.

O usuário pode:

- Salvar a cidade atual
- Consultar novamente a favorita
- Remover a cidade favorita

---

## 🌙 Modo claro e escuro

O Dashboard possui dois temas:

- ☀️ Modo claro
- 🌙 Modo escuro

A preferência do usuário também é armazenada utilizando `localStorage`.

---

## 🚨 Alerta climático

Como funcionalidade adicional do projeto, foi desenvolvido um sistema de **alertas climáticos automáticos**.

Dependendo dos dados recebidos, o sistema pode informar situações como:

```text
🔥 Alerta: temperatura muito elevada!
```

```text
❄️ Alerta: temperatura baixa!
```

```text
💨 Alerta: vento forte!
```

```text
🏜️ Alerta: umidade do ar muito baixa!
```

Quando nenhuma condição preocupante é identificada:

```text
✅ Condições sem alertas importantes.
```

---

## 📱 Responsividade

A interface foi preparada para funcionar em diferentes tamanhos de tela.

O Dashboard pode ser utilizado em:

- Computador
- Notebook
- Tablet
- Celular

Os cards meteorológicos se reorganizam automaticamente dependendo do tamanho da tela.

---

## ♿ Acessibilidade

Foram utilizadas melhorias de acessibilidade, como:

- Labels nos campos de entrada
- Navegação utilizando teclado
- Mensagens claras de erro
- Botões semânticos
- Contraste entre texto e fundo
- Uso de textos junto com cores e ícones

---

## 🔄 Melhorias realizadas

A versão original mostrava apenas informações básicas e possuía uma interface simples.

Nesta nova versão foram realizadas as seguintes melhorias:

- Novo design
- Interface em formato de Dashboard
- Organização das informações em cards
- Novos dados meteorológicos
- Gráfico aprimorado
- Separação da lógica JavaScript em `script.js`
- Melhor organização do código
- Indicador de carregamento
- Tratamento de erros
- Status MQTT
- Data e horário de atualização
- Histórico de consultas
- Cidade favorita
- LocalStorage
- Modo claro e escuro
- Responsividade
- Recursos de acessibilidade
- Alertas climáticos automáticos

---

## 🚀 Como executar

### 1. Baixar o projeto

Clone o repositório:

```bash
git clone URL_DO_REPOSITORIO
```

Depois entre na pasta:

```bash
cd nome-do-projeto
```

---

### 2. Configurar a API Key

Abra:

```text
script.js
```

Localize:

```javascript
const OPENWEATHER_API_KEY = "COLE_SUA_CHAVE_AQUI";
```

Coloque sua API Key do OpenWeatherMap.

---

### 3. Executar

Abra o arquivo:

```text
index.html
```

Também é possível utilizar a extensão **Live Server** no Visual Studio Code.

---

### 4. Realizar uma consulta

Digite uma cidade, por exemplo:

```text
Brotas
```

Selecione:

```text
Brasil
```

Depois clique em:

```text
Consultar clima
```

Também é possível pressionar **Enter** para realizar a pesquisa.

---

## 📚 Aprendizados

Durante o desenvolvimento do projeto foram utilizados conceitos relacionados a:

- APIs REST
- JSON
- JavaScript
- Requisições HTTP
- `fetch()`
- `async/await`
- MQTT
- Publish/Subscribe
- Manipulação do DOM
- LocalStorage
- Responsividade
- Tratamento de erros
- Visualização de dados
- Internet das Coisas

---

## 👨‍💻 Autor

**Nome do aluno:** SEU NOME

**Instituição:** SENAI São Paulo

**Atividade:** Desafio de Melhoria 05.1 — Dashboard Meteorológico