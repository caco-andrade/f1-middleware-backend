require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const openf1Service = require('./services/openf1Service');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" } // Ajustar para o IP do app React Native em produção
});

const PORT = process.env.PORT || 3000;

// Inicia o loop de busca de dados da OpenF1
// O callback envia os dados para todos os clientes conectados via WebSocket
openf1Service.startPolling((data) => {
    io.emit('telemetria_atualizacao', data);
    console.log(`Broadcast de telemetria enviado: ${new Date().toISOString()}`);
}, 4000); // 4 segundos respeita o limite de 30req/min com folga

io.on('connection', (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);
    
    // Envia o último dado disponível imediatamente ao conectar
    if (openf1Service.lastLocationData) {
        socket.emit('telemetria_atualizacao', openf1Service.lastLocationData);
    }

    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);
    });
});

server.listen(PORT, () => {
    console.log(`Middleware F1 rodando na porta ${PORT}`);
});