import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import './App.css';

const App = () => {
  const [data, setData] = useState({ codigo: '', descricao: '', lote: '', quantidade: '' });
  const [list, setList] = useState([]);
  const [type, setType] = useState('embalagem'); // Escolha entre embalagem ou insumo
  const [countingType, setCountingType] = useState('primeira contagem'); // Escolha entre contagem
  const [startTime, setStartTime] = useState(null); // Guarda o tempo de início
  const [elapsedTime, setElapsedTime] = useState(null); // Guarda o tempo decorrido

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });

    const onScanSuccess = (qrData) => {
      try {
        // Divide os dados em linhas
        const lines = qrData.split('\n');
        const parsedData = {};

        // Itera sobre cada linha e extrai as informações
        lines.forEach(line => {
          const [key, value] = line.split(': ').map(item => item.trim());
          if (key && value) {
            parsedData[key] = value;
          }
        });

        // Atualiza o estado com os dados extraídos
        setData({
          codigo: parsedData['Código'] || '',
          descricao: parsedData['Descrição'] || '',
          lote: parsedData['Lote'] || '',
          quantidade: parsedData['Quantidade'] || '',
        });
      } catch (error) {
        console.error("Erro ao analisar os dados do QR Code:", error);
        alert("Erro ao ler os dados do QR Code. Verifique o formato.");
      }
    };

    const onScanFailure = (error) => {
      console.warn(`Erro ao ler QR Code: ${error}`);
    };

    // Inicializa o scanner
    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      scanner.clear(); // Limpa o scanner ao desmontar o componente
    };
  }, []);

  const saveData = () => {
    if (data.codigo) {
      setList([...list, data]);
      setData({ codigo: '', descricao: '', lote: '', quantidade: '' });
      alert("Leitura salva com sucesso!");
    } else {
      alert("Por favor, leia um QR Code antes de salvar.");
    }
  };

  const exportToTxt = () => {
    const jsonData = JSON.stringify({ list, elapsedTime: `${elapsedTime} minutos` }, null, 2);
    const blob = new Blob([jsonData], { type: 'text/plain' });
    const fileName = `${countingType}_${type}.txt`;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert(`Dados exportados para ${fileName} com sucesso!`);
  };

  const startTimer = () => {
    setStartTime(Date.now());
  };

  const stopTimer = () => {
    if (startTime) {
      const endTime = Date.now();
      const minutes = Math.floor((endTime - startTime) / 60000);
      setElapsedTime(minutes);
      alert(`Tempo total: ${minutes} minutos`);
    }
  };

  return (
    <div className="App">
      <h1>QR Code Scanner com HTML5</h1>
      <div id="reader" style={{ width: '500px' }}></div>

      <div>
        <h2>Tipo de Material</h2>
        <button onClick={() => setType('embalagem')}>Embalagem</button>
        <button onClick={() => setType('insumo')}>Insumo</button>
        <p>Selecionado: {type}</p>
      </div>

      <div>
        <h2>Contagem</h2>
        <button onClick={() => setCountingType('primeira contagem')}>Primeira Contagem</button>
        <button onClick={() => setCountingType('segunda contagem')}>Segunda Contagem</button>
        <button onClick={() => setCountingType('terceira contagem')}>Terceira Contagem</button>
        <p>Contagem selecionada: {countingType}</p>
      </div>

      <div>
        <h2>Dados Lidos</h2>
        <label>Código: </label>
        <input type="text" value={data.codigo} onChange={(e) => setData({ ...data, codigo: e.target.value })} />
        <br />
        <label>Descrição: </label>
        <input type="text" value={data.descricao} onChange={(e) => setData({ ...data, descricao: e.target.value })} />
        <br />
        <label>Lote: </label>
        <input type="text" value={data.lote} onChange={(e) => setData({ ...data, lote: e.target.value })} />
        <br />
        <label>Quantidade: </label>
        <input type="text" value={data.quantidade} onChange={(e) => setData({ ...data, quantidade: e.target.value })} />
        <br />
        <button onClick={saveData}>Salvar Leitura</button>
      </div>

      <div>
        <h2>Lista de Leituras</h2>
        <ul>
          {list.map((item, index) => (
            <li key={index}>
              Código: {item.codigo}, Descrição: {item.descricao}, Lote: {item.lote}, Quantidade: {item.quantidade}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Contador</h2>
        <button onClick={startTimer}>Iniciar Contagem</button>
        <button onClick={stopTimer}>Finalizar Contagem</button>
        {elapsedTime !== null && <p>Tempo decorrido: {elapsedTime} minutos</p>}
      </div>

      <button onClick={exportToTxt}>Exportar para TXT</button>
    </div>
  );
};

export default App;
