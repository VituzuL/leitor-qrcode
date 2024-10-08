import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import './App.css';
import gmeLogo from './logos/GME-logo.png'; // Caminho correto
import scanIcon from './logos/click-to-scan.png'; // Caminho correto

const App = () => {
  const [data, setData] = useState({ codigo: '', descricao: '', lote: '', quantidade: '' });
  const [list, setList] = useState([]);
  const [type, setType] = useState('embalagem');
  const [countingType, setCountingType] = useState('primeira contagem');
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });

    const onScanSuccess = (qrData) => {
      try {
        const lines = qrData.split('\n');
        const parsedData = {};

        lines.forEach(line => {
          const [key, value] = line.split(': ').map(item => item.trim());
          if (key && value) {
            parsedData[key] = value;
          }
        });

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

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      scanner.clear();
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
      {/* Logo no topo lateral direita */}
      <header>
        <img src={gmeLogo} alt="GME Logo" className="gme-logo" />
      </header>
  
      <h1>Inventário Margarina</h1>
  
      {/* Tipo de Material e Contagem utilizando dropdown */}
      <div>
        <h2>Tipo de Material</h2>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="embalagem">Embalagem</option>
          <option value="insumo">Insumo</option>
        </select>
        
  
        <h2>Contagem</h2>
        <select value={countingType} onChange={(e) => setCountingType(e.target.value)}>
          <option value="primeira contagem">Primeira Contagem</option>
          <option value="segunda contagem">Segunda Contagem</option>
          <option value="terceira contagem">Terceira Contagem</option>
        </select>
        
      </div>
  
      {/* Botão de iniciar e finalizar contagem */}
      <div>
        <h2>Contador</h2>
        <button onClick={startTimer}>Iniciar Contagem</button>
        <button onClick={stopTimer}>Finalizar Contagem</button>
        {elapsedTime !== null && <p>Tempo decorrido: {elapsedTime} minutos</p>}
      </div>
  
      {/* Scanner QR Code */}
      <div id="reader" style={{ width: '100%' }}>
        <img src={scanIcon} alt="Click to Scan" className="scan-icon" />
      </div>
  
      {/* Campos para entrada de dados */}
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
  
      {/* Exportar dados para TXT */}
      <button onClick={exportToTxt}>Exportar para TXT</button>
  
      {/* Lista de Leituras */}
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
    </div>
  );
}
  

export default App;
