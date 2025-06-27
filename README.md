# FastGet Queue Monitor

Sistema para monitorar o número de pessoas na fila do FastGet em tempo real.

## 🚀 Funcionalidades

- Monitoramento automático da fila a cada 15 segundos
- Interface limpa e responsiva
- Atualização manual via botão
- Cache inteligente para otimizar performance
- Deploy pronto para Railway

## 📁 Arquivos do Projeto

- `proxy.js` - Servidor Node.js com Puppeteer
- `queue.html` - Interface web
- `package.json` - Dependências do projeto
- `Procfile` - Configuração para Railway

## 🛠️ Como Deployar no Railway

1. **Faça upload dos arquivos** para o Railway
2. **Configure as variáveis de ambiente** (se necessário)
3. **Deploy automático** - o Railway detectará automaticamente que é um projeto Node.js

## 🔧 Configurações

- **Porta**: 3000 (ou PORT do Railway)
- **Cache**: 5 segundos
- **Atualização automática**: 15 segundos
- **Timeout**: 60 segundos para navegação

## 📊 API Endpoints

- `GET /` - Interface principal
- `GET /api/queue-count` - Contador da fila
- `GET /api/queue-count?force=true` - Força atualização
- `GET /health` - Health check

## 🎯 Como Funciona

1. O servidor acessa a página do FastGet
2. Conta elementos com classe `div.item.font-bold`
3. Retorna o número de pessoas na fila
4. Interface atualiza automaticamente

## ✅ Status

- ✅ Conta corretamente quando há pessoas na fila
- ✅ Mostra 0 quando a fila está vazia
- ✅ Atualização automática funcionando
- ✅ Sem oscilações
- ✅ Código limpo e otimizado 