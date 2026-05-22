const axios = require('axios');

class OpenF1Service {
    constructor() {
        this.baseUrl = 'https://api.openf1.org/v1';
        this.lastLocationData = null;
        this.pollingInterval = null;
    }

    // --- MÉTODO OFICIAL (Pronto para os treinos de amanhã) ---
    async fetchLatestLocation() {
        try {
            const dezSegundosAtras = new Date(Date.now() - 10000).toISOString();
            const url = `${this.baseUrl}/location?session_key=latest&date>${dezSegundosAtras}`;
            
            const response = await axios.get(url);
            
            if (response.data && response.data.length > 0) {
                const ultimasPosicoesMap = {};
                
                response.data.forEach(registro => {
                    // Enviamos apenas o essencial para o App
                    ultimasPosicoesMap[registro.driver_number] = {
                        n: registro.driver_number,
                        x: registro.x,
                        y: registro.y,
                        d: registro.date
                    };
                });
                
                this.lastLocationData = Object.values(ultimasPosicoesMap);
                return this.lastLocationData;
            }
            return this.lastLocationData;
            
        } catch (error) {
            console.error('Erro ao buscar dados reais da OpenF1:', error.message);
            return null;
        }
    }

    // --- MÉTODO DE TESTE (Para rodar hoje à noite com dados leves) ---
    async fetchTestLatestLocation() {
        try {
            // Usando o endpoint de drivers que é leve e não estoura erro 422
            const url = `${this.baseUrl}/drivers?session_key=9159`;
            const response = await axios.get(url);
            
            if (response.data && response.data.length > 0) {
                // Mapeia dados de teste para o mesmo formato resumido
                this.lastLocationData = response.data.map(d => ({
                    n: d.driver_number,
                    name: d.last_name,
                    team: d.team_name,
                    color: `#${d.team_colour}`,
                    d: new Date().toISOString()
                }));
                return this.lastLocationData;
            }
            return this.lastLocationData;
        } catch (error) {
            console.error('Erro no método de teste da OpenF1:', error.message);
            return null;
        }
    }

    // --- CONTROLE DO LOOP ---
    startPolling(callback, ms = 4000) {
        if (this.pollingInterval) return;

        console.log(`Iniciando monitoramento resiliente OpenF1 a cada ${ms}ms...`);
        
        const poll = async () => {
            try {
                // Trocado temporariamente para o método de teste para validar o fluxo
                const data = await this.fetchTestLatestLocation(); 
                
                if (data && callback) {
                    callback(data);
                }
            } catch (err) {
                console.error('Falha no ciclo de polling:', err.message);
            } finally {
                // Agenda a próxima execução apenas após a conclusão desta
                this.pollingInterval = setTimeout(poll, ms);
            }
        };

        poll();
    }

    stopPolling() {
        clearTimeout(this.pollingInterval);
        this.pollingInterval = null;
    }
}

module.exports = new OpenF1Service();