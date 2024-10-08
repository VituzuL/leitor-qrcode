from flask import Flask, request, jsonify
import pandas as pd
import os

app = Flask(__name__)

@app.route('/api/data', methods=['POST'])
def save_data():
    data = request.json
    print("Dados recebidos:", data)  # Verifique se os dados estão chegando
    
    # Verifique se a chave 'list' está presente nos dados
    if 'list' not in data:
        return jsonify({'message': 'Dados inválidos!'}), 400
    
    # Extrair a lista de dados recebida
    items = data['list']

    # Criar um DataFrame a partir da lista de itens
    try:
        df = pd.DataFrame(items)

        # Verifique se o arquivo Excel já existe
        excel_file_path = 'Z:\\16 - Inventários Mensais\\API\\inventario.xlsx'
        if not os.path.exists(excel_file_path):
            # Se o arquivo não existir, crie um novo DataFrame com cabeçalho
            df.to_excel(excel_file_path, index=False, header=True)  # Cria um novo arquivo com cabeçalho
        else:
            # Se o arquivo já existir, anexe os dados sem sobrescrever o cabeçalho
            with pd.ExcelWriter(excel_file_path, mode='a', if_sheet_exists='overlay') as writer:
                df.to_excel(writer, sheet_name='Sheet1', index=False, header=False)  # Anexa os dados

        return jsonify({'message': 'Dados salvos com sucesso!'}), 200
    except Exception as e:
        print("Erro ao salvar dados:", e)
        return jsonify({'message': 'Erro ao salvar dados!'}), 500

if __name__ == '__main__':
    app.run(debug=True)
