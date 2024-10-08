from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Habilita CORS

# Lista global para armazenar os dados temporariamente
dados_temporarios = []

@app.route('/api/data', methods=['POST'])
def save_temp_data():
    data = request.json
    print("Dados recebidos:", data)  # Verifique se os dados estão chegando

    # Armazenando os dados temporariamente em uma lista
    try:
        tipo_material = data.get('tipo')
        contagem = data.get('contagem')

        # Adicionando os dados à lista global
        dados_temporarios.append({
            'Código': data.get('codigo'),
            'Descrição': data.get('descricao'),
            'Lote': data.get('lote'),
            'Quantidade': data.get('quantidade'),
            'Tipo': tipo_material,
            'Contagem': contagem
        })
        
        return jsonify({'message': 'Dados temporariamente armazenados!'}), 200
    except Exception as e:
        print("Erro ao armazenar dados temporários:", e)
        return jsonify({'message': 'Erro ao armazenar dados temporários!'}), 500

@app.route('/api/export', methods=['POST'])
def export_data():
    try:
        # Verifica se há dados a serem exportados
        if not dados_temporarios:
            return jsonify({'message': 'Não há dados para exportar!'}), 400

        # Transformando a lista de dados em um DataFrame
        df = pd.DataFrame(dados_temporarios)

        # Caminho do arquivo Excel
        file_path = 'Z:\\16 - Inventários Mensais\\API\\inventario.xlsx'

        # Criação ou atualização da planilha Excel
        with pd.ExcelWriter(file_path, mode='a', if_sheet_exists='overlay') as writer:
            # Adiciona os dados com cabeçalho fixo
            df.to_excel(writer, sheet_name='Sheet1', index=False, header=not writer.sheets)

        # Limpa os dados temporários após a exportação
        dados_temporarios.clear()

        return jsonify({'message': 'Dados exportados com sucesso!'}), 200
    except Exception as e:
        print("Erro ao exportar dados:", e)
        return jsonify({'message': 'Erro ao exportar dados!'}), 500

if __name__ == '__main__':
    app.run(debug=True)
