f1-middleware-backend/
├── node_modules/
├── src/
│   ├── config/          # Configurações de conexões (Banco de dados, instâncias globais)
│   │   └── database.js
│   │
│   ├── controllers/     # Recebe as requisições HTTP e envia as respostas
│   │   └── telemetriaController.js
│   │
│   ├── services/        # Regras de negócio e comunicação com APIs externas (OpenF1)
│   │   └── openf1Service.js
│   │
│   ├── sockets/         # Gerenciamento dos eventos e broadcasts do Socket.io
│   │   └── telemetriaSocket.js
│   │
│   ├── routes/          # Definição das rotas HTTP do Express
│   │   └── apiRoutes.js
│   │
│   └── server.js        # Inicialização do Express, do Socket.io e escuta da porta
│
├── .env                 # Variáveis de ambiente (Portas, chaves, URLs)
├── .gitignore           # Arquivos que não vão para o GitHub (ex: node_modules, .env)
├── package-lock.json
└── package.json