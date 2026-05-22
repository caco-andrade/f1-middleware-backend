# Contexto do Projeto: Middleware F1 (OpenF1)

## Objetivo
Criar um middleware/cache em Node.js para consumir a API OpenF1 e repassar os dados em tempo real para um aplicativo React Native, evitando estourar os limites da API externa.

## Regras de Negócio e Limitações
- A API gratuita da OpenF1 possui um limite de 3 requisições por segundo (30/minuto).
- O middleware deve rodar um loop (setInterval) a cada 3 ou 4 segundos para buscar dados de localização em lote (`/v1/location?session_key=latest`).
- Os dados recebidos devem ser transmitidos via WebSocket para os celulares conectados.
- Segurança de Copyright: O app não deve usar fotos oficiais dos pilotos (usar abreviações como VER, LEC e as cores das escuderias).
- O app também terá um agregador de notícias semanais via Web Scraping para manter engajamento fora dos dias de corrida.

## Estrutura do Projeto
f1-middleware-backend/
├── src/
│   ├── config/          # Banco de dados (Futuro MongoDB)
│   ├── controllers/     # Logica das rotas HTTP (Notícias/Scraping)
│   ├── services/        # Comunicação com a API OpenF1 (openf1Service.js)
│   ├── sockets/         # Gerenciamento do Socket.io (telemetriaSocket.js)
│   ├── routes/          # Rotas do Express
│   └── server.js        # Arquivo inicializador do servidor