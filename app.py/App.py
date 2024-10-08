from flask import Flask, request, jsonify
import pandas as pd
import os
import signal
import sys

app = Flask(__name__)

# Lista para armazenar os dados
dados_coletados = []

# Função para salvar dados em Excel
def salvar_dados():
    df = pd.DataFrame(dados_coletados)
    caminho = r'Z:\16 - Inventários Mensais\API\inventario.xlsx'
    os.makedirs(os.path.dirname(caminho), exist_ok=True)
    df.to_excel(caminho, index=False)
    print(f"Dados salvos em {caminho}")

# Rota para receber dados
@app.route('/api/data', methods=['POST'])
def receber_dados():
    dados = request.json
    # Aqui você pode adicionar lógica para diferenciar Insumos e Embalagens
    dados_coletados.append(dados)
    print(f'Dados recebidos: {dados}')  # Para depuração
    return jsonify({"message": "Dados recebidos com sucesso!"}), 200

# Função para lidar com o CTRL+C
def encerrar_coleta(sig, frame):
    print("Coleta finalizada. Salvando dados...")
    salvar_dados()
    sys.exit(0)

# Capturando sinal de interrupção
signal.signal(signal.SIGINT, encerrar_coleta)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)  # Altere para permitir conexões externas
