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
    # Definindo o caminho para salvar a planilha
    caminho = r'Z:\16 - Inventários Mensais\API\inventario.xlsx'
    # Criar a pasta se não existir
    os.makedirs(os.path.dirname(caminho), exist_ok=True)
    # Salvar em Excel
    df.to_excel(caminho, index=False)
    print(f"Dados salvos em {caminho}")

# Rota para receber dados
@app.route('/api/data', methods=['POST'])
def receber_dados():
    dados = request.json
    dados_coletados.append(dados)
    return jsonify({"message": "Dados recebidos com sucesso!"}), 200

# Função para lidar com o CTRL+C
def encerrar_coleta(sig, frame):
    print("Coleta finalizada. Salvando dados...")
    salvar_dados()
    sys.exit(0)

# Capturando sinal de interrupção
signal.signal(signal.SIGINT, encerrar_coleta)

if __name__ == '__main__':
    app.run(debug=True)
